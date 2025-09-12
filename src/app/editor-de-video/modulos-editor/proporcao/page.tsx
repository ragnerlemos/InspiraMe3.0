
"use client";

import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import { useProfile } from "@/hooks/use-profile";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Skeleton } from "@/components/ui/skeleton";

function ProporcaoSkeleton() {
    return (
        <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
            <div className="flex-1 flex md:grid md:grid-cols-[288px_1fr] min-h-0">
                <div className="hidden shrink-0 bg-card md:flex md:flex-col md:border-r p-4">
                     <Skeleton className="h-10 w-48 mb-4" />
                     <Skeleton className="h-16 w-full mb-4" />
                     <Skeleton className="h-full w-full" />
                </div>
                 <main className="flex-1 w-full overflow-auto p-4 flex items-center justify-center">
                    <Skeleton className="w-full h-full max-w-md aspect-[9/16]" />
                </main>
            </div>
             <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t p-2">
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    )
}

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [baseBgColor, setBaseBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [filmColor, setFilmColor] = useState("#000000");
  const [filmOpacity, setFilmOpacity] = useState(0);
  const [scale, setScale] = useState(1);
  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const [text, setText] = useState("A única maneira de fazer um ótimo trabalho é amar o que você faz.");
  const { profile, isLoaded: isProfileLoaded } = useProfile();

  // Signature State
  const [showProfileSignature, setShowProfileSignature] = useState(false);
  const [signaturePositionX, setSignaturePositionX] = useState(50);
  const [signaturePositionY, setSignaturePositionY] = useState(90);
  const [signatureScale, setSignatureScale] = useState(63);
  const [showSignaturePhoto, setShowSignaturePhoto] = useState(false);
  const [showSignatureUsername, setShowSignatureUsername] = useState(true);
  const [showSignatureSocial, setShowSignatureSocial] = useState(true);

  // Logo State
  const [showLogo, setShowLogo] = useState(false);
  const [logoPositionX, setLogoPositionX] = useState(85);
  const [logoPositionY, setLogoPositionY] = useState(10);
  const [logoScale, setLogoScale] = useState(40);
  const [logoOpacity, setLogoOpacity] = useState(100);

  useEffect(() => {
    if (aspectRatio === "9 / 16" && !isDesktop) {
      setScale(0.80);
    } else if (scale !== 1 && (aspectRatio !== "9 / 16" || isDesktop)) {
      setScale(1);
    }
  }, [aspectRatio, isDesktop]);

  if (!isProfileLoaded) {
    return <ProporcaoSkeleton />;
  }

  const commonProps = {
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    baseBgColor,
    setBaseBgColor,
    fgColor,
    setFgColor,
    activeControl,
    setActiveControl,
    text,
    setText,
    profile,
    showProfileSignature,
    onShowProfileSignatureChange: setShowProfileSignature,
    signaturePositionX,
    onSignaturePositionXChange: setSignaturePositionX,
    signaturePositionY,
    onSignaturePositionYChange: setSignaturePositionY,
    signatureScale,
    onSignatureScaleChange: setSignatureScale,
    showSignaturePhoto,
    onShowSignaturePhotoChange: setShowSignaturePhoto,
    showSignatureUsername,
    onShowSignatureUsernameChange: setShowSignatureUsername,
    showSignatureSocial,
    onShowSignatureSocialChange: setShowSignatureSocial,
    showLogo,
    onShowLogoChange: setShowLogo,
    logoPositionX,
    onLogoPositionXChange: setLogoPositionX,
    logoPositionY,
    onLogoPositionYChange: setLogoPositionY,
    logoScale,
    onLogoScaleChange: setLogoScale,
    logoOpacity,
    onLogoOpacityChange: setLogoOpacity,
  };

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
      <div className="flex-1 flex md:grid md:grid-cols-[288px_1fr] min-h-0">
        <Sidebar {...commonProps} />

        <main className="flex-1 w-full overflow-auto">
            <PreviewCanva
                aspectRatio={aspectRatio}
                bgColor={baseBgColor}
                fgColor={fgColor}
                filmColor={filmColor}
                filmOpacity={filmOpacity}
                scale={scale}
                text={text}
                profile={profile}
                showProfileSignature={showProfileSignature}
                signaturePositionX={signaturePositionX}
                signaturePositionY={signaturePositionY}
                signatureScale={signatureScale}
                showSignaturePhoto={showSignaturePhoto}
                showSignatureUsername={showSignatureUsername}
                showSignatureSocial={showSignatureSocial}
                showLogo={showLogo}
                logoPositionX={logoPositionX}
                logoPositionY={logoPositionY}
                logoScale={logoScale}
                logoOpacity={logoOpacity}
            />
        </main>
      </div>

      <MobileToolbar {...commonProps} />
    </div>
  );
}
