
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useWindowSize } from "react-use";
import { useProfile } from "@/hooks/use-profile";
import { Sidebar } from "@/app/editor-de-video/components/sidebar";
import { PreviewCanva } from "@/app/editor-de-video/components/preview-canva";
import { MobileToolbar } from "@/app/editor-de-video/components/mobile-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "@/components/ui/resizable";
import type { EditorState, EstiloFundo } from "@/app/editor-de-video/tipos";
import { useToast } from "@/hooks/use-toast";
import { useTemplates, type Template } from "@/hooks/use-templates";
import html2canvas from 'html2canvas';
import { getAllQuotes } from "@/lib/dados";
import { useSearchParams } from "next/navigation";
import type { EditorControlState } from "./contexts/editor-context";


function ProporcaoSkeleton() {
    return (
        <div className="flex flex-col w-full bg-background font-body text-foreground h-full">
            <PanelGroup direction="horizontal" className="flex-1 min-h-0">
                <Panel defaultSize={30} minSize={25} maxSize={40} className="hidden md:flex flex-col">
                     <Skeleton className="h-16 w-full border-b" />
                     <div className="flex-1 p-4 space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-full w-full" />
                     </div>
                </Panel>
                <PanelResizeHandle />
                <Panel>
                    <main className="flex-1 w-full h-full overflow-auto p-4 flex items-center justify-center">
                        <Skeleton className="w-full h-full max-w-md aspect-[9/16]" />
                    </main>
                </Panel>
            </PanelGroup>
             <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t p-2">
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    )
}

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


export default function AspectWeaver({ setControls }: { setControls: (controls: Partial<EditorControlState>) => void }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { profile, isLoaded: isProfileLoaded } = useProfile();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { templates: allTemplates, isLoaded: areTemplatesLoaded, addTemplate } = useTemplates();

  // Histórico de estados
  const [history, setHistory] = useState<EditorState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const [scale, setScale] = useState(1);
  
  const currentState = history[currentStateIndex] || {};

  const updateState = (newState: Partial<EditorState>) => {
    const nextState = { ...currentState, ...newState };
    const newHistory = history.slice(0, currentStateIndex + 1);
    setHistory([...newHistory, nextState]);
    setCurrentStateIndex(newHistory.length);
  };
  
  // Funções de Desfazer e Refazer
  const undo = useCallback(() => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [currentStateIndex]);

  const redo = useCallback(() => {
    if (currentStateIndex < history.length - 1) {
      setCurrentStateIndex(currentStateIndex + 1);
    }
  }, [currentStateIndex, history.length]);

  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;
  

  // Lógica de Salvamento e Exportação
  const handleSaveAsTemplate = useCallback(async () => {
        const templateName = prompt("Digite um nome para o novo modelo:");
        if (!templateName) return;
        const previewElement = document.getElementById('editor-preview-content');
        if (previewElement) {
            try {
                const canvas = await html2canvas(previewElement, {
                    scale: 0.5,
                    useCORS: true,
                    backgroundColor: null, 
                });
                const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                
                addTemplate(templateName, currentState, thumbnail);

                toast({
                    title: "Modelo Salvo!",
                    description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
                });
            } catch (error) {
                console.error("Erro ao criar thumbnail:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao Salvar",
                    description: "Não foi possível gerar a pré-visualização do modelo.",
                });
            }
        }
    }, [addTemplate, currentState, toast]);

    const captureCanvas = useCallback(async (format: 'jpeg' | 'png') => {
        const previewElement = document.getElementById('editor-preview-content');
        if (!previewElement) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível encontrar a área de visualização.' });
            return;
        }

        toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}.` });
        
        try {
            const canvas = await html2canvas(previewElement, {
                useCORS: true,
                backgroundColor: null, 
                scale: 4, // Aumenta a resolução para melhor qualidade
            });

            const image = canvas.toDataURL(`image/${format}`, format === 'png' ? 1.0 : 0.9);
            
            const link = document.createElement('a');
            link.href = image;
            link.download = `inspire-me-export.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({ title: 'Sucesso!', description: `A imagem foi baixada como ${link.download}.` });

        } catch (error) {
            console.error('Erro ao exportar imagem:', error);
            toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        }
    }, [toast]);
    
    const onExportJPG = useCallback(() => captureCanvas('jpeg'), [captureCanvas]);
    const onExportPNG = useCallback(() => captureCanvas('png'), [captureCanvas]);

    const onExportMP4 = useCallback(() => {
        toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
    }, [toast]);
    
    // Efeito para atualizar o contexto do editor
    useEffect(() => {
        if (setControls) {
            setControls({
                canUndo,
                undo,
                canRedo,
                redo,
                onSaveAsTemplate: handleSaveAsTemplate,
                onExportJPG,
                onExportPNG,
                onExportMP4,
            });
        }
    }, [canUndo, undo, canRedo, redo, handleSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4]);

  // Efeito de inicialização
  useEffect(() => {
    if (!isProfileLoaded || !areTemplatesLoaded) return;

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
        
        setHistory([initialState]);
        setCurrentStateIndex(0);
        setIsReady(true);
    }

    initialize(allTemplates);
  }, [searchParams, isProfileLoaded, areTemplatesLoaded]);


  useEffect(() => {
    if (isDesktop) {
        setScale(1);
    } else {
        if (currentState.aspectRatio === "9 / 16") {
            setScale(0.8);
        } else {
            setScale(1);
        }
    }
  }, [currentState.aspectRatio, isDesktop]);
  
  const textStyle = useMemo(() => {
    const createTextStrokeShadow = (width: number, color: string): string => {
        if (width === 0) return "none";
        const shadows = [];
        const numPoints = 12;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const x = Math.cos(angle) * (width * 0.1);
            const y = Math.sin(angle) * (width * 0.1);
            shadows.push(`${x.toFixed(2)}cqw ${y.toFixed(2)}cqw 0 ${color}`);
        }
        return shadows.join(', ');
    };
    const createMainShadow = (blur: number): string => {
        if (blur === 0) return "none";
        return `0 0 ${blur * 0.1}cqw rgba(0,0,0,0.5)`;
    };
    const textStrokeShadow = createTextStrokeShadow(currentState.textStrokeWidth || 0, currentState.textStrokeColor || '#000');
    const mainTextShadow = createMainShadow(currentState.textShadowBlur || 0);

    return {
        fontFamily: currentState.fontFamily,
        fontSize: `${currentState.fontSize}cqw`,
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
    currentState.fontFamily, currentState.fontSize, currentState.fontWeight, 
    currentState.fontStyle, currentState.textColor, currentState.textAlign, 
    currentState.textShadowBlur, currentState.textStrokeColor, currentState.textStrokeWidth, 
    currentState.letterSpacing, currentState.lineHeight, currentState.wordSpacing
  ]);


  if (!isReady || !isProfileLoaded) {
    return <ProporcaoSkeleton />;
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
    aspectRatio: currentState.aspectRatio,
    backgroundStyle: currentState.backgroundStyle,
    filmColor: currentState.filmColor,
    filmOpacity: currentState.filmOpacity,
    text: currentState.text,
    textStyle: textStyle,
    textVerticalPosition: currentState.textVerticalPosition,
    profile,
    showProfileSignature: currentState.showProfileSignature,
    signaturePositionX: currentState.signaturePositionX,
    signaturePositionY: currentState.signaturePositionY,
    signatureScale: currentState.signatureScale,
    showSignaturePhoto: currentState.showSignaturePhoto,
    showSignatureUsername: currentState.showSignatureUsername,
    showSignatureSocial: currentState.showSignatureSocial,
    showSignatureBackground: currentState.showSignatureBackground,
    signatureBgColor: currentState.signatureBgColor,
    signatureBgOpacity: currentState.signatureBgOpacity,
    showLogo: currentState.showLogo,
    logoPositionX: currentState.logoPositionX,
    logoPositionY: currentState.logoPositionY,
    logoScale: currentState.logoScale,
    logoOpacity: currentState.logoOpacity,
    activeTemplateId: currentState.activeTemplateId,
    profileVerticalPosition: currentState.profileVerticalPosition,
    scale,
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
