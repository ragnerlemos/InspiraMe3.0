
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
import { getAllQuotes } from "@/lib/dados";
import { useSearchParams } from "next/navigation";


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
    const {
        currentState,
        setInitialState,
        updateState,
        isReady,
        activeControl,
        setActiveControl,
        scale,
        setScale
    } = useEditor();


    // Efeito de inicialização
    useEffect(() => {
        if (!isProfileLoaded || !areTemplatesLoaded || isReady) return;

        const initialize = async () => {
            const quoteParam = searchParams.get("quote");
            const templateIdParam = searchParams.get("templateId");
            const allQuotes = await getAllQuotes();

            let text = "A inspiração está a caminho...";
            if (quoteParam) {
                text = decodeURIComponent(quoteParam);
            } else if (allQuotes.length > 0) {
                text = allQuotes[Math.floor(Math.random() * allQuotes.length)].quote;
            }
            
            let initialState: EditorState;
            if (templateIdParam) {
                const template = allTemplates.find(t => t.id === templateIdParam);
                if (template) {
                    initialState = { ...(template.editorState as EditorState), text, activeTemplateId: template.id };
                } else {
                     initialState = { text, activeTemplateId: null } as EditorState;
                }
            } else {
                 initialState = { text, activeTemplateId: null } as EditorState;
            }

            setInitialState(initialState);
        }

        initialize();
    }, [searchParams, isProfileLoaded, areTemplatesLoaded, isReady, setInitialState, allTemplates]);


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
    }, [currentState.aspectRatio, isDesktop, setScale]);
  
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


export default function AspectWeaver() {
    return (
        <Suspense fallback={<ProporcaoSkeleton />}>
            <EditorCore />
        </Suspense>
    )
}

    