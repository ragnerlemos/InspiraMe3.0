
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/hooks/use-profile";
import { AssinaturaPerfil } from "./assinatura-perfil";
import type { EstiloFundo } from './tipos';
import { ModeloTwitter } from "./modelos/modelo-twitter";
import { ModeloPadrao } from "./modelos/modelo-padrao";
import type { EstiloTexto, ProporcaoTela, VisualizacaoEditorProps } from "./tipos";


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
    signatureBgColor,
    signatureBgOpacity,
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
            <ModeloTwitter
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
           <ModeloPadrao
            text={text}
            textStyle={textStyle}
            textVerticalPosition={textVerticalPosition}
            showProfileSignature={showProfileSignature}
            profile={profile}
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
            logo={profile.logo}
            logoPositionX={logoPositionX}
            logoPositionY={logoPositionY}
            logoScale={logoScale}
            logoOpacity={logoOpacity}
          />
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
