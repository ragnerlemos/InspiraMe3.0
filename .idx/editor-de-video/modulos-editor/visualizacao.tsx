
"use client";

import Image from "next/image";
import type { VisualizacaoEditorProps } from "./tipos";
import { AssinaturaPerfil } from "./assinatura-perfil";
import { VisualizacaoPerfil } from "./visualizacao-perfil";
import { cn } from "@/lib/utils";

// Detecta tipo de mídia
const getMediaType = (src: string): "image" | "video" | "unknown" => {
  if (!src) return "unknown";
  if (src.startsWith("data:")) {
    if (src.startsWith("data:image")) return "image";
    if (src.startsWith("data:video")) return "video";
  }
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  if (imageExtensions.some((ext) => src.toLowerCase().includes(ext))) return "image";
  if (videoExtensions.some((ext) => src.toLowerCase().includes(ext))) return "video";
  if (src.includes("picsum.photos")) return "image";
  return "unknown";
};

export function VisualizacaoEditor({
  aspectRatio,
  backgroundStyle,
  text,
  textStyle,
  textVerticalPosition,
  showProfileSignature,
  profile,
  signaturePositionX,
  signaturePositionY,
  signatureScale,
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
  activeTemplateId,
  profileVerticalPosition,
  showLogo,
  logoPositionX,
  logoPositionY,
  logoScale,
  logoOpacity,
}: VisualizacaoEditorProps) {
  
  const renderBackground = () => {
    const { type, value } = backgroundStyle;
    if (type === "media" && value) {
      const mediaType = getMediaType(value);
      if (mediaType === "image") {
        return (
          <Image
            src={value}
            alt="Background"
            fill
            className="object-cover"
            key={value}
            priority
          />
        );
      }
      if (mediaType === "video") {
        return (
          <video
            src={value}
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
            key={value}
          />
        );
      }
    } else if (type === "solid") {
      return <div className="absolute inset-0" style={{ backgroundColor: backgroundStyle.value }} />;
    } else if (type === "gradient") {
      return <div className="absolute inset-0" style={{ background: backgroundStyle.value }} />;
    }
    return <div className="absolute inset-0 bg-black" />;
  };

  const renderContent = () => {
    if (activeTemplateId === -2) {
      // Visual de perfil (tipo "Twitter")
      return (
        <VisualizacaoPerfil
          profile={profile}
          text={text}
          textStyle={textStyle}
          textVerticalPosition={textVerticalPosition}
          profileVerticalPosition={profileVerticalPosition}
        />
      );
    }

    // Padrão
    return (
      <>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <div
              style={{
                ...textStyle,
                top: `${textVerticalPosition}%`,
                transform: "translateY(-50%)",
              }}
              className="break-words w-full absolute transition-all duration-200"
            >
              {text}
            </div>
          </div>
        </div>
        {showProfileSignature && (
            <div
              className="absolute"
              style={{
                top: `${signaturePositionY}%`,
                left: `${signaturePositionX}%`,
                transform: `translate(-50%, -50%) scale(${signatureScale / 100})`,
              }}
            >
              <AssinaturaPerfil
                profile={profile}
                showPhoto={showSignaturePhoto}
                showUsername={showSignatureUsername}
                showSocial={showSignatureSocial}
              />
            </div>
          )}
           {showLogo && profile.logo && (
            <div
              className="absolute"
              style={{
                top: `${logoPositionY}%`,
                left: `${logoPositionX}%`,
                transform: `translate(-50%, -50%) scale(${logoScale / 100})`,
                opacity: logoOpacity / 100,
              }}
            >
                <img src={profile.logo} alt="Logomarca" className="max-w-[150px] max-h-[150px]" />
            </div>
          )}
      </>
    );
  };
  
  return (
    <div
      id="editor-preview-content"
      className={cn(
        "relative transition-all duration-300 ease-in-out shadow-2xl rounded-lg @container overflow-hidden w-full h-full",
        {
          "aspect-square": aspectRatio.replace(/\s/g, "") === "1/1",
          "aspect-[9/16]": aspectRatio.replace(/\s/g, "") === "9/16",
          "aspect-[16/9]": aspectRatio.replace(/\s/g, "") === "16/9",
        }
      )}
      style={{
        backgroundColor: backgroundStyle.type === 'solid' ? backgroundStyle.value : undefined,
        backgroundImage: backgroundStyle.type === 'gradient' ? backgroundStyle.value : undefined,
      }}
    >
        {renderBackground()}
        {renderContent()}
    </div>
  );
}
