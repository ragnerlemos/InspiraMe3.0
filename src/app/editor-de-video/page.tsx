
"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
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
import { useEditor } from "./contexts/editor-context";
import { useTemplates } from "@/hooks/use-templates";
import html2canvas from 'html2canvas';
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


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

function EditorCore() {
    const { width } = useWindowSize();
    const isDesktop = width >= 768;
    const { profile, isLoaded: isProfileLoaded } = useProfile();
    const searchParams = useSearchParams();
    const { templates: allTemplates, isLoaded: areTemplatesLoaded } = useTemplates();
    const { addTemplate } = useTemplates();
    const { toast } = useToast();

    const [isReady, setIsReady] = useState(false);
    const [currentState, setCurrentState] = useState<EditorState>({
        text: "A inspiração está a caminho...",
        fontFamily: "Poppins",
        fontSize: 7,
        fontWeight: "600",
        fontStyle: "normal",
        textColor: "#FFFFFF",
        textAlign: "center",
        textShadowBlur: 2,
        textVerticalPosition: 50,
        textStrokeColor: "#000000",
        textStrokeWidth: 0,
        letterSpacing: 0,
        lineHeight: 1.2,
        wordSpacing: 0,
        backgroundStyle: { type: 'solid', value: '#1a1a1a' },
        filmColor: "#000000",
        filmOpacity: 20,
        aspectRatio: "9 / 16",
        activeTemplateId: null,
        showProfileSignature: false,
        signaturePositionX: 50,
        signaturePositionY: 90,
        signatureScale: 100,
        showSignaturePhoto: true,
        showSignatureUsername: true,
        showSignatureSocial: true,
        showSignatureBackground: false,
        signatureBgColor: "#000000",
        signatureBgOpacity: 50,
        profileVerticalPosition: 50,
        showLogo: false,
        logoPositionX: 90,
        logoPositionY: 10,
        logoScale: 100,
        logoOpacity: 80,
    });
    const [history, setHistory] = useState<EditorState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [activeControl, setActiveControl] = useState<string | null>('texto');
    const [scale, setScale] = useState(1);

    const updateState = useCallback((newState: Partial<EditorState>) => {
        setCurrentState(prevState => {
            const updatedState = { ...prevState, ...newState };
            
            setHistory(prevHistory => {
                 // Using functional update for historyIndex to get the latest value
                 let newHistory: EditorState[] = [];
                 setHistoryIndex(prevIndex => {
                    newHistory = [...prevHistory.slice(0, prevIndex + 1), updatedState];
                    return newHistory.length - 1;
                 });
                 return newHistory;
            });

            return updatedState;
        });
    }, []);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const undo = useCallback(() => {
        if (!canUndo) return;
        setHistoryIndex(prevIndex => {
            const newIndex = prevIndex - 1;
            setCurrentState(history[newIndex]);
            return newIndex;
        });
    }, [canUndo, history]);

    const redo = useCallback(() => {
        if (!canRedo) return;
        setHistoryIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            setCurrentState(history[newIndex]);
            return newIndex;
        });
    }, [canRedo, history]);


    const captureScreenshot = async (): Promise<string | null> => {
        const element = document.getElementById('editor-preview-content');
        if (!element) return null;
        try {
            const canvas = await html2canvas(element, { 
                allowTaint: true, 
                useCORS: true,
                scale: 1, // Captura em resolução 1x para performance
            });
            return canvas.toDataURL('image/jpeg', 0.8); // Qualidade de 80%
        } catch (error) {
            console.error("Erro ao capturar screenshot:", error);
            toast({ variant: 'destructive', title: "Erro ao Salvar", description: "Não foi possível gerar la imagen do modelo." });
            return null;
        }
    };

    const onSaveAsTemplate = useCallback(async () => {
        const thumbnail = await captureScreenshot();
        if (thumbnail) {
            const templateName = prompt("Digite um nome para o seu modelo:", "Meu Modelo");
            if (templateName) {
                addTemplate(templateName, currentState, thumbnail);
                toast({ title: "Modelo Salvo!", description: "Seu novo modelo foi adicionado à galeria de modelos." });
            }
        }
    }, [addTemplate, currentState, toast]);
    
    const downloadImage = useCallback(async (format: 'png' | 'jpeg') => {
        const element = document.getElementById('editor-preview-content');
        if (!element) return;
        
        toast({ title: "Exportando...", description: "Aguarde enquanto sua imagem está sendo gerada." });

        try {
             const canvas = await html2canvas(element, { 
                allowTaint: true, 
                useCORS: true,
                scale: 2, // Aumenta a resolução da captura para melhor qualidade
            });

            const link = document.createElement('a');
            link.download = `quotevid-export.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
            link.click();
            toast({ title: "Download Iniciado!", description: `Sua imagem foi exportada como ${format.toUpperCase()}.` });
        } catch (error) {
             console.error("Erro ao exportar imagem:", error);
            toast({ variant: 'destructive', title: "Erro na Exportação", description: "Ocorreu um problema ao gerar sua imagem." });
        }
    }, [toast]);

    const onExportJPG = useCallback(() => downloadImage('jpeg'), [downloadImage]);
    const onExportPNG = useCallback(() => downloadImage('png'), [downloadImage]);
    
    const onExportMP4 = useCallback(() => {
        toast({
            variant: "default",
            title: "Em Breve!",
            description: "A exportação de vídeo (MP4) ainda não está disponível, mas estamos trabalhando nisso!"
        });
    }, [toast]);

    const { setUndoState, setSaveActions } = useEditor();

    useEffect(() => {
        setUndoState({ canUndo, undo, canRedo, redo });
        setSaveActions({ onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4 });
    }, [canUndo, canRedo, undo, redo, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4, setUndoState, setSaveActions]);


    // Efeito de inicialização
    useEffect(() => {
        if (!isProfileLoaded || !areTemplatesLoaded || isReady) return;

        const defaultState: EditorState = {
            text: "A inspiração está a caminho...",
            fontFamily: "Poppins",
            fontSize: 7,
            fontWeight: "600",
            fontStyle: "normal",
            textColor: "#FFFFFF",
            textAlign: "center",
            textShadowBlur: 2,
            textVerticalPosition: 50,
            textStrokeColor: "#000000",
            textStrokeWidth: 0,
            letterSpacing: 0,
            lineHeight: 1.2,
            wordSpacing: 0,
            backgroundStyle: { type: 'solid', value: '#1a1a1a' },
            filmColor: "#000000",
            filmOpacity: 20,
            aspectRatio: "9 / 16",
            activeTemplateId: null,
            showProfileSignature: false,
            signaturePositionX: 50,
            signaturePositionY: 90,
            signatureScale: 100,
            showSignaturePhoto: true,
            showSignatureUsername: true,
            showSignatureSocial: true,
            showSignatureBackground: false,
            signatureBgColor: "#000000",
            signatureBgOpacity: 50,
            profileVerticalPosition: 50,
            showLogo: false,
            logoPositionX: 90,
            logoPositionY: 10,
            logoScale: 100,
            logoOpacity: 80,
        };
        
        const quoteParam = searchParams.get("quote");
        const templateIdParam = searchParams.get("templateId");
        
        let text = quoteParam ? decodeURIComponent(quoteParam) : "A única maneira de fazer um ótimo trabalho é amar o que você faz.";
        
        let initialState: EditorState;
        if (templateIdParam) {
            const template = allTemplates.find(t => t.id === templateIdParam);
            if (template) {
                initialState = { ...defaultState, ...(template.editorState as EditorState), text, activeTemplateId: template.id };
            } else {
                 initialState = { ...defaultState, text, activeTemplateId: null };
            }
        } else {
             initialState = { ...defaultState, text, activeTemplateId: null };
        }

        setCurrentState(initialState);
        setHistory([initialState]);
        setHistoryIndex(0);
        setIsReady(true);
        
    }, [searchParams, isProfileLoaded, areTemplatesLoaded, isReady, allTemplates]);


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

    const bgColor = useMemo(() => {
        if (currentState.backgroundStyle.type === 'solid') {
            return currentState.backgroundStyle.value;
        }
        return '#000000'; // Cor padrão se não for sólida
    }, [currentState.backgroundStyle]);
    
    const setBgColor = useCallback((color: string) => {
        updateState({ backgroundStyle: { type: 'solid', value: color } });
    }, [updateState]);

    if (!isReady || !isProfileLoaded) {
        return <ProporcaoSkeleton />;
    }

    const commonProps = {
        // Canvas
        aspectRatio: currentState.aspectRatio, setAspectRatio: (val: string) => updateState({ aspectRatio: val as any }),
        scale, setScale,
        // Fundo
        backgroundStyle: currentState.backgroundStyle, setBackgroundStyle: (val: EstiloFundo) => updateState({ backgroundStyle: val }),
        bgColor, setBgColor,
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
        activeControl, 
        setActiveControl,
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


export default function AspectWeaver() {
    return (
        <Suspense fallback={<ProporcaoSkeleton />}>
            <EditorCore />
        </Suspense>
    )
}

    