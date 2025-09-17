

"use client";

import { useState, useEffect, useMemo } from "react";
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
import type { EstiloFundo } from "@/app/editor-de-video/tipos";

function ProporcaoSkeleton() {
    return (
        <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
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

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [scale, setScale] = useState(1);
  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { profile, isLoaded: isProfileLoaded } = useProfile();

  // Text state
  const [text, setText] = useState("A única maneira de fazer um ótimo trabalho é amar o que você faz.");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontSize, setFontSize] = useState(5);
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("bold");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textVerticalPosition, setTextVerticalPosition] = useState(50);
  
  // Color State
  const [fgColor, setFgColor] = useState("#ffffff");

  // Background state
  const [backgroundStyle, setBackgroundStyle] = useState<EstiloFundo>({ type: 'solid', value: '#333333' });


  // Filter State
  const [filmColor, setFilmColor] = useState("#000000");
  const [filmOpacity, setFilmOpacity] = useState(0);

  // Advanced Style State
  const [textShadowBlur, setTextShadowBlur] = useState(1);
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [textStrokeWidth, setTextStrokeWidth] = useState(0.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.3);
  const [wordSpacing, setWordSpacing] = useState(0);


  // Signature State
  const [showProfileSignature, setShowProfileSignature] = useState(false);
  const [signaturePositionX, setSignaturePositionX] = useState(50);
  const [signaturePositionY, setSignaturePositionY] = useState(90);
  const [signatureScale, setSignatureScale] = useState(63);
  const [showSignaturePhoto, setShowSignaturePhoto] = useState(false);
  const [showSignatureUsername, setShowSignatureUsername] = useState(true);
  const [showSignatureSocial, setShowSignatureSocial] = useState(true);
  const [showSignatureBackground, setShowSignatureBackground] = useState(false);
  const [signatureBgColor, setSignatureBgColor] = useState("#000000");
  const [signatureBgOpacity, setSignatureBgOpacity] = useState(30);

  // Logo State
  const [showLogo, setShowLogo] = useState(false);
  const [logoPositionX, setLogoPositionX] = useState(50);
  const [logoPositionY, setLogoPositionY] = useState(72);
  const [logoScale, setLogoScale] = useState(40);
  const [logoOpacity, setLogoOpacity] = useState(100);

  useEffect(() => {
    if (isDesktop) {
        setScale(1);
    } else {
        if (aspectRatio === "9 / 16") {
            setScale(0.8);
        } else {
            setScale(1);
        }
    }
  }, [aspectRatio, isDesktop]);
  
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
    const textStrokeShadow = createTextStrokeShadow(textStrokeWidth, textStrokeColor);
    const mainTextShadow = createMainShadow(textShadowBlur);

    return {
        fontFamily,
        fontSize: `${fontSize}cqw`,
        fontWeight,
        fontStyle,
        color: fgColor,
        textAlign,
        lineHeight,
        letterSpacing: `${letterSpacing / 100}em`,
        wordSpacing: `${wordSpacing / 100}em`,
        textShadow: textStrokeShadow !== "none" && mainTextShadow !== "none" ? `${textStrokeShadow}, ${mainTextShadow}` : textStrokeShadow !== "none" ? textStrokeShadow : mainTextShadow,
    }
  }, [fontFamily, fontSize, fontWeight, fontStyle, fgColor, textAlign, textShadowBlur, textStrokeColor, textStrokeWidth, letterSpacing, lineHeight, wordSpacing]);


  if (!isProfileLoaded) {
    return <ProporcaoSkeleton />;
  }

  const commonProps = {
    aspectRatio, setAspectRatio,
    scale, setScale,
    backgroundStyle, setBackgroundStyle,
    filmColor, setFilmColor,
    filmOpacity, setFilmOpacity,
    fgColor, setFgColor,
    activeControl, setActiveControl,
    text, setText,
    profile,
    showProfileSignature, onShowProfileSignatureChange: setShowProfileSignature,
    signaturePositionX, onSignaturePositionXChange: setSignaturePositionX,
    signaturePositionY, onSignaturePositionYChange: setSignaturePositionY,
    signatureScale, onSignatureScaleChange: setSignatureScale,
    showSignaturePhoto, onShowSignaturePhotoChange: setShowSignaturePhoto,
    showSignatureUsername, onShowSignatureUsernameChange: setShowSignatureUsername,
    showSignatureSocial, onShowSignatureSocialChange: setShowSignatureSocial,
    showSignatureBackground, onShowSignatureBackgroundChange: setShowSignatureBackground,
    signatureBgColor, onSignatureBgColorChange: setSignatureBgColor,
    signatureBgOpacity, onSignatureBgOpacityChange: setSignatureBgOpacity,
    showLogo, onShowLogoChange: setShowLogo,
    logoPositionX, onLogoPositionXChange: setLogoPositionX,
    logoPositionY, onLogoPositionYChange: setLogoPositionY,
    logoScale, onLogoScaleChange: setLogoScale,
    logoOpacity, onLogoOpacityChange: setLogoOpacity,
    // Estilo do texto
    fontFamily, onFontFamilyChange: setFontFamily,
    fontSize, onFontSizeChange: setFontSize,
    fontWeight, onFontWeightChange: setFontWeight,
    fontStyle, onFontStyleChange: setFontStyle,
    textAlign, onTextAlignChange: setTextAlign,
    textVerticalPosition, onTextVerticalPositionChange: setTextVerticalPosition,
    textShadowBlur, onTextShadowBlurChange: setTextShadowBlur,
    textStrokeColor, onTextStrokeColorChange: setTextStrokeColor,
    textStrokeWidth, onTextStrokeWidthChange: setTextStrokeWidth,
    letterSpacing, onLetterSpacingChange: setLetterSpacing,
    lineHeight, onLineHeightChange: setLineHeight,
    wordSpacing, onWordSpacingChange: setWordSpacing,
  };

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
         <Panel defaultSize={30} minSize={25} maxSize={40} className="hidden md:flex flex-col">
            <Sidebar {...commonProps} />
        </Panel>
        {isDesktop && <PanelResizeHandle />}
        <Panel>
            <main className="flex-1 w-full h-full overflow-auto">
                <PreviewCanva
                    aspectRatio={aspectRatio}
                    backgroundStyle={backgroundStyle}
                    filmColor={filmColor}
                    filmOpacity={filmOpacity}
                    scale={scale}
                    text={text}
                    textStyle={textStyle}
                    textVerticalPosition={textVerticalPosition}
                    profile={profile}
                    showProfileSignature={showProfileSignature}
                    signaturePositionX={signaturePositionX}
                    signaturePositionY={signaturePositionY}
                    signatureScale={signatureScale}
                    showSignaturePhoto={showSignaturePhoto}
                    showSignatureUsername={showSignatureUsername}
                    showSignatureSocial={showSignatureSocial}
                    showSignatureBackground={showSignatureBackground}
                    signatureBgColor={signatureBgColor}
                    signatureBgOpacity={signatureBgOpacity}
                    showLogo={showLogo}
                    logoPositionX={logoPositionX}
                    logoPositionY={logoPositionY}
                    logoScale={logoScale}
                    logoOpacity={logoOpacity}
                />
            </main>
        </Panel>
      </PanelGroup>

      <MobileToolbar {...commonProps} />
    </div>
  );
}
