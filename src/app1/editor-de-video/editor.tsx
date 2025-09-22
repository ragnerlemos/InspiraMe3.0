
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import { useProfile } from "@/hooks/use-profile";
import { Sidebar } from "@/app/editor-de-video/components/sidebar";
import { PreviewCanva } from "@/app/editor-de-video/components/preview-canva";
import { MobileToolbar } from "@/app/editor-de-video/components/mobile-toolbar";
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable";
import type { EditorState, EstiloFundo } from "@/app/editor-de-video/tipos";
import { getAllQuotes } from "@/lib/dados";
import { useSearchParams } from "next/navigation";
import { useTemplates, type Template } from "@/hooks/use-templates";
import { useEditor } from "./contexts/editor-context";
import Loading from './loading';

const getInitialState = (): Omit<EditorState, 'activeTemplateId' | 'text'> => ({
    fontFamily: "Poppins",
    fontSize: 5,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0.2,
    letterSpacing: 0,
    lineHeight: 1.3,
    wordSpacing: 0,
    backgroundStyle: { type: 'solid', value: '#000000' },
    filmColor: "#000000",
    filmOpacity: 0,
    aspectRatio: "9 / 16",
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    showSignatureBackground: false,
    signatureBgColor: "#000000",
    signatureBgOpacity: 30,
    profileVerticalPosition: 25,
    showLogo: false,
    logoPositionX: 50,
    logoPositionY: 72,
    logoScale: 40,
    logoOpacity: 100,
});


export default function Editor() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { profile, isLoaded: isProfileLoaded } = useProfile();
  const searchParams = useSearchParams();
  const { templates: allTemplates, isLoaded: areTemplatesLoaded } = useTemplates();
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const {
    isReady,
    currentState,
    updateState,
    setInitialState,
  } = useEditor();

  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const [scale, setScale] = useState(1);

  // Efeito de inicialização
  useEffect(() => {
    if (isReady || !isProfileLoaded || !areTemplatesLoaded) return;

    const initialize = async (templates: Template[]) => {
        const quoteParam = searchParams.get("quote");
        const templateIdParam = searchParams.get("templateId");
        
        let initialState: EditorState;
        const baseState = getInitialState();

        const allQuotes = await getAllQuotes();
        const text = quoteParam 
            ? decodeURIComponent(quoteParam) 
            : allQuotes.length > 0 
                ? allQuotes[Math.floor(Math.random() * allQuotes.length)].quote
                : "A inspiração está a caminho...";
        
        if (templateIdParam) {
          const template = templates.find(t => t.id === templateIdParam);
          if (template) {
            initialState = { ...baseState, ...template.editorState, text, activeTemplateId: template.id };
          } else {
            initialState = { ...baseState, text, activeTemplateId: null };
          }
        } else {
            initialState = { ...baseState, text, activeTemplateId: null };
        }
        
        setInitialState(initialState);
    }

    initialize(allTemplates);
  }, [searchParams, isProfileLoaded, areTemplatesLoaded, isReady, setInitialState, allTemplates]);


  useEffect(() => {
    if (!currentState) return;
    if (isDesktop) {
        setScale(1);
    } else {
        if (currentState.aspectRatio === "9 / 16") {
            setScale(0.8);
        } else {
            setScale(1);
        }
    }
  }, [currentState?.aspectRatio, isDesktop, currentState]);
  
  const textStyle = useMemo(() => {
    if (!currentState || !previewContainerRef.current) return {};

    const containerWidth = previewContainerRef.current.offsetWidth;
    const calculatedFontSize = (currentState.fontSize / 100) * containerWidth;
    
    const createTextStrokeShadow = (width: number, color: string): string => {
        if (width === 0) return "none";
        // Convertendo a largura do traço, que está em 'pt', para pixels relativos ao tamanho da fonte
        const strokeWidthPx = (width / 100) * calculatedFontSize * 0.2; 
        if (strokeWidthPx === 0) return "none";

        const shadows = [];
        const numPoints = 12;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const x = Math.cos(angle) * strokeWidthPx;
            const y = Math.sin(angle) * strokeWidthPx;
            shadows.push(`${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${color}`);
        }
        return shadows.join(', ');
    };
    
    const createMainShadow = (blur: number): string => {
        if (blur === 0) return "none";
        // Convertendo o desfoque para pixels relativos ao tamanho da fonte
        const shadowBlurPx = (blur / 100) * calculatedFontSize;
        return `0 0 ${shadowBlurPx}px rgba(0,0,0,0.5)`;
    };
    const textStrokeShadow = createTextStrokeShadow(currentState.textStrokeWidth || 0, currentState.textStrokeColor || '#000');
    const mainTextShadow = createMainShadow(currentState.textShadowBlur || 0);

    return {
        fontFamily: currentState.fontFamily,
        fontSize: `${calculatedFontSize}px`,
        fontWeight: currentState.fontWeight,
        fontStyle: currentState.fontStyle,
        color: currentState.textColor,
        textAlign: currentState.textAlign,
        lineHeight: currentState.lineHeight,
        letterSpacing: `${(currentState.letterSpacing || 0) / 100}em`,
        wordSpacing: `${(currentState.wordSpacing || 0) / 100}em`,
        textShadow: textStrokeShadow !== "none" && mainTextShadow !== "none" ? `${textStrokeShadow}, ${mainTextShadow}` : textStrokeShadow !== "none" ? textStrokeShadow : mainTextShadow,
    }
  }, [
    currentState,
    previewContainerRef.current, // Adiciona a ref como dependência
    width // Recalcula com a largura da janela para responsividade
  ]);


  if (!isReady || !isProfileLoaded || !currentState) {
    return <Loading />;
  }

  const commonProps = {
    // Canvas
    aspectRatio: currentState.aspectRatio, setAspectRatio: (val: string) => updateState({ aspectRatio: val as any }),
    scale, setScale,
    // Fundo
    backgroundStyle: currentState.backgroundStyle, setBackgroundStyle: (val: EstiloFundo) => updateState({ backgroundStyle: val }),
    // Película
    filmColor: currentState.filmColor, setFilmColor: (val: string) => updateState({ filmColor: val }),
    filmOpacity: currentState.filmOpacity, setFilmOpacity: (val: number) => updateState({ filmOpacity: val }),
    // Texto
    text: currentState.text, setText: (val: string) => updateState({ text: val }),
    fgColor: currentState.textColor, setFgColor: (val: string) => updateState({ textColor: val }),
    // Estilo Texto
    fontFamily: currentState.fontFamily, onFontFamilyChange: (val: string) => updateState({ fontFamily: val }),
    fontSize: currentState.fontSize, onFontSizeChange: (val: number) => updateState({ fontSize: val }),
    fontWeight: currentState.fontWeight, onFontWeightChange: (val: "normal" | "bold") => updateState({ fontWeight: val }),
    fontStyle: currentState.fontStyle, onFontStyleChange: (val: "normal" | "italic") => updateState({ fontStyle: val }),
    textAlign: currentState.textAlign, onTextAlignChange: (val: "left" | "center" | "right") => updateState({ textAlign: val }),
    textVerticalPosition: currentState.textVerticalPosition, onTextVerticalPositionChange: (val: number) => updateState({ textVerticalPosition: val }),
    textShadowBlur: currentState.textShadowBlur, onTextShadowBlurChange: (val: number) => updateState({ textShadowBlur: val }),
    textStrokeColor: currentState.textStrokeColor, onTextStrokeColorChange: (val: string) => updateState({ textStrokeColor: val }),
    textStrokeWidth: currentState.textStrokeWidth, onTextStrokeWidthChange: (val: number) => updateState({ textStrokeWidth: val }),
    letterSpacing: currentState.letterSpacing, onLetterSpacingChange: (val: number) => updateState({ letterSpacing: val }),
    lineHeight: currentState.lineHeight, onLineHeightChange: (val: number) => updateState({ lineHeight: val }),
    wordSpacing: currentState.wordSpacing, onWordSpacingChange: (val: number) => updateState({ wordSpacing: val }),
    // Assinatura
    profile,
    showProfileSignature: currentState.showProfileSignature, onShowProfileSignatureChange: (val: boolean) => updateState({ showProfileSignature: val }),
    signaturePositionX: currentState.signaturePositionX, onSignaturePositionXChange: (val: number) => updateState({ signaturePositionX: val }),
    signaturePositionY: currentState.signaturePositionY, onSignaturePositionYChange: (val: number) => updateState({ signaturePositionY: val }),
    signatureScale: currentState.signatureScale, onSignatureScaleChange: (val: number) => updateState({ signatureScale: val }),
    showSignaturePhoto: currentState.showSignaturePhoto, onShowSignaturePhotoChange: (val: boolean) => updateState({ showSignaturePhoto: val }),
    showSignatureUsername: currentState.showSignatureUsername, onShowSignatureUsernameChange: (val: boolean) => updateState({ showSignatureUsername: val }),
    showSignatureSocial: currentState.showSignatureSocial, onShowSignatureSocialChange: (val: boolean) => updateState({ showSignatureSocial: val }),
    showSignatureBackground: currentState.showSignatureBackground, onShowSignatureBackgroundChange: (val: boolean) => updateState({ showSignatureBackground: val }),
    signatureBgColor: currentState.signatureBgColor, onSignatureBgColorChange: (val: string) => updateState({ signatureBgColor: val }),
    signatureBgOpacity: currentState.signatureBgOpacity, onSignatureBgOpacityChange: (val: number) => updateState({ signatureBgOpacity: val }),
    // Logo
    showLogo: currentState.showLogo, onShowLogoChange: (val: boolean) => updateState({ showLogo: val }),
    logoPositionX: currentState.logoPositionX, onLogoPositionXChange: (val: number) => updateState({ logoPositionX: val }),
    logoPositionY: currentState.logoPositionY, onLogoPositionYChange: (val: number) => updateState({ logoPositionY: val }),
    logoScale: currentState.logoScale, onLogoScaleChange: (val: number) => updateState({ logoScale: val }),
    logoOpacity: currentState.logoOpacity, onLogoOpacityChange: (val: number) => updateState({ logoOpacity: val }),
    // Controle
    activeControl, setActiveControl,
  };

  const previewProps = {
    ...currentState,
    profile,
    textStyle,
    scale,
    containerRef: previewContainerRef,
  };

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-full">
      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
         <Panel defaultSize={30} minSize={25} maxSize={40} className="hidden md:flex flex-col">
            <Sidebar {...commonProps} />
        </Panel>
        {isDesktop && <PanelResizeHandle />}
        <Panel>
            <main className="flex-1 w-full h-full overflow-auto">
                <PreviewCanva {...previewProps} />
            </main>
        </Panel>
      </PanelGroup>

      <MobileToolbar {...commonProps} />
    </div>
  );
}
