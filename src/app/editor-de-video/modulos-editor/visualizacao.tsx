
"use client";

import Image from "next/image";
import type { VisualizacaoEditorProps } from "./tipos";
import { VisualizacaoPerfil } from "./visualizacao-perfil";
import { AssinaturaPerfil } from "./assinatura-perfil";
import { cn } from "@/lib/utils";

// Função para converter cor hexadecimal para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

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
  filmColor,
  filmOpacity,
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
  showSignatureBackground,
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
                showBackground={showSignatureBackground}
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
  
    const filmRgb = hexToRgb(filmColor);
    const filmBackgroundColor = filmRgb ? `rgba(${filmRgb.r}, ${filmRgb.g}, ${filmRgb.b}, ${filmOpacity / 100})` : `rgba(0, 0, 0, ${filmOpacity / 100})`;

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
        backgroundColor: backgroundStyle.type === 'solid' && filmOpacity === 0 ? backgroundStyle.value : undefined,
        backgroundImage: backgroundStyle.type === 'gradient' && filmOpacity === 0 ? backgroundStyle.value : undefined,
      }}
    >
        {renderBackground()}
        {filmOpacity > 0 && (
            <div 
                className="absolute inset-0 z-10"
                style={{ backgroundColor: filmBackgroundColor }}
            />
        )}
        <div className="relative z-20 h-full w-full">
            {renderContent()}
        </div>
    </div>
  );
}
