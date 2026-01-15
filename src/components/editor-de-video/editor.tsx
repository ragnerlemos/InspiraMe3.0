
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import { useProfile } from "@/hooks/use-profile";
import { Sidebar } from "@/components/editor-de-video/components/sidebar";
import { PreviewCanva } from "@/components/editor-de-video/components/preview-canva";
import { MobileToolbar } from "@/components/editor-de-video/components/mobile-toolbar";
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable";
import type { EditorState, EstiloFundo } from "@/components/editor-de-video/tipos";
import { useSearchParams } from "next/navigation";
import { useTemplates } from "@/hooks/use-templates";
import { useEditor } from "./contexts/editor-context";
import Loading from './loading';

const getInitialState = (): Omit<EditorState, 'text'> => ({
    activeTemplateId: "template-twitter",
    fontFamily: "Poppins",
    fontSize: 0.9,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 0,
    textShadowOpacity: 0,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0,
    textStrokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
    applyTextColorToSignature: false,
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
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
  } = useEditor();

  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isReady || !isProfileLoaded || !areTemplatesLoaded) return;

    const initialize = () => {
        const quoteParam = searchParams.get("quote");
        const templateIdParam = searchParams.get("templateId");
        const categoryParam = searchParams.get("category");
        const subCategoryParam = searchParams.get("subCategory");
        
        let initialState: EditorState;
        const baseState = getInitialState();

        const text = quoteParam 
            ? decodeURIComponent(quoteParam) 
            : "A inspiração está a caminho...";
        
        if (templateIdParam) {
          const template = allTemplates.find(t => t.id === templateIdParam);
          if (template) {
            initialState = { 
              ...baseState, 
              ...template.editorState, 
              text, 
              activeTemplateId: template.id,
              category: categoryParam || undefined,
              subCategory: subCategoryParam || undefined,
            };
          } else {
            initialState = { 
              ...baseState, 
              text,
              category: categoryParam || undefined,
              subCategory: subCategoryParam || undefined,
            };
          }
        } else {
            initialState = { 
              ...baseState, 
              text,
              category: categoryParam || undefined,
              subCategory: subCategoryParam || undefined,
            };
        }
        
        setInitialState(initialState);
    }

    initialize();
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
  
  if (!isReady || !isProfileLoaded || !currentState) {
    return <Loading />;
  }
  
  const handleInvertColors = () => {
    if (!currentState) return;
    const currentBgColor = currentState.backgroundStyle.type === 'solid' ? currentState.backgroundStyle.value : '#000000';
    const currentTextColor = currentState.textColor;
    updateState({
        textColor: currentBgColor,
        backgroundStyle: { type: 'solid', value: currentTextColor }
    });
  };

  const handleRestoreDefaultColors = () => {
      updateState({
          textColor: '#FFFFFF',
          backgroundStyle: { type: 'solid', value: '#000000' }
      });
  };

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
    textShadowOpacity: currentState.textShadowOpacity, onTextShadowOpacityChange: (val: number) => updateState({ textShadowOpacity: val }),
    textStrokeColor: currentState.textStrokeColor, onTextStrokeColorChange: (val: string) => updateState({ textStrokeColor: val }),
    textStrokeWidth: currentState.textStrokeWidth, onTextStrokeWidthChange: (val: number) => updateState({ textStrokeWidth: val }),
    textStrokeCornerStyle: currentState.textStrokeCornerStyle, onTextStrokeCornerStyleChange: (val: 'rounded' | 'square') => updateState({ textStrokeCornerStyle: val }),
    applyEffectsToEmojis: currentState.applyEffectsToEmojis, onApplyEffectsToEmojisChange: (val: boolean) => updateState({ applyEffectsToEmojis: val }),
    applyTextColorToSignature: currentState.applyTextColorToSignature, onApplyTextColorToSignatureChange: (val: boolean) => updateState({ applyTextColorToSignature: val }),
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
    // Funções de Cor
    onInvertColors: handleInvertColors,
    onRestoreDefaultColors: handleRestoreDefaultColors,
  };

  const previewProps = {
    editorState: currentState,
    profile,
    baseTextStyle: baseTextStyle,
    textEffectsStyle: textEffectsStyle,
    dropShadowStyle: dropShadowStyle,
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
        <Panel className="flex flex-col">
          <div className="flex-1 overflow-auto">
            <PreviewCanva {...previewProps} />
          </div>
          <div className="md:hidden">
            <MobileToolbar {...commonProps} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
