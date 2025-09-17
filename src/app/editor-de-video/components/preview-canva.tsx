
"use client";

import Image from 'next/image';
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/hooks/use-profile";
import { AssinaturaPerfil } from "../modelos/assinatura-perfil";
import type { EstiloFundo } from '../tipos';


interface PreviewCanvaProps {
  aspectRatio: string;
  backgroundStyle: EstiloFundo;
  filmColor: string;
  filmOpacity: number;
  scale: number;
  text: string;
  textStyle: React.CSSProperties;
  textVerticalPosition: number;
  profile: ProfileData;
  showProfileSignature: boolean;
  signaturePositionX: number;
  signaturePositionY: number;
  signatureScale: number;
  showSignaturePhoto: boolean;
  showSignatureUsername: boolean;
  showSignatureSocial: boolean;
  showSignatureBackground: boolean;
  signatureBgColor: string;
  signatureBgOpacity: number;
  showLogo: boolean;
  logoPositionX: number;
  logoPositionY: number;
  logoScale: number;
  logoOpacity: number;
}

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


export function PreviewCanva({
  aspectRatio,
  backgroundStyle,
  filmColor,
  filmOpacity,
  scale,
  text,
  textStyle,
  textVerticalPosition,
  profile,
  showProfileSignature,
  signaturePositionX,
  signaturePositionY,
  signatureScale,
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
  showSignatureBackground,
  signatureBgColor,
  signatureBgOpacity,
  showLogo,
  logoPositionX,
  logoPositionY,
  logoScale,
  logoOpacity,
}: PreviewCanvaProps) {
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
  
  const filmRgb = hexToRgb(filmColor);
  const filmBackgroundColor = filmRgb ? `rgba(${filmRgb.r}, ${filmRgb.g}, ${filmRgb.b}, ${filmOpacity / 100})` : `rgba(0, 0, 0, ${filmOpacity / 100})`;

  const renderBackground = () => {
    const { type, value } = backgroundStyle;
    if (type === "media" && value) {
      const mediaType = getMediaType(value);
      if (mediaType === "image") {
        return <Image src={value} alt="Background" fill className="object-cover" key={value} priority />;
      }
      if (mediaType === "video") {
        return <video src={value} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" key={value} />;
      }
    } else if (type === "solid") {
      return <div className="absolute inset-0" style={{ backgroundColor: backgroundStyle.value }} />;
    } else if (type === "gradient") {
      return <div className="absolute inset-0" style={{ background: backgroundStyle.value }} />;
    }
    return <div className="absolute inset-0 bg-black" />;
  };

  return (
    <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
      <div
        style={{
          aspectRatio,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          backgroundColor: backgroundStyle.type === 'solid' ? backgroundStyle.value : undefined,
          backgroundImage: backgroundStyle.type === 'gradient' ? backgroundStyle.value : undefined,
        }}
        className={cn(
          "transition-all duration-300 ease-in-out shadow-2xl rounded-xl w-full md:h-[83.5vh] md:w-auto relative overflow-hidden @container"
        )}
      >
        {renderBackground()}

        <div className="absolute inset-0 z-20" style={{ backgroundColor: filmBackgroundColor }} />
        <div className="relative z-30 flex h-full p-8"
            style={{
                alignItems: 'flex-start',
                justifyContent: 'center'
            }}
        >
            <div
                className="break-words max-w-full transition-all duration-200"
                style={{
                    ...textStyle,
                    position: 'relative',
                    top: `${textVerticalPosition}%`,
                    transform: "translateY(-50%)",
                }}
            >
                {text}
            </div>
        </div>
        
        {showProfileSignature && (
            <div
              className="absolute z-30"
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
                bgColor={signatureBgColor}
                bgOpacity={signatureBgOpacity}
              />
            </div>
        )}

        {showLogo && profile.logo && (
            <div
              className="absolute z-30"
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
      </div>
    </main>
  );
}
