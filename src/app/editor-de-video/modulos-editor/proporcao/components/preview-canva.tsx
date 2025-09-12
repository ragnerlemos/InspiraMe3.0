
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/hooks/use-profile";
import { AssinaturaPerfil } from "../../assinatura-perfil";


interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  filmColor: string;
  filmOpacity: number;
  scale: number;
  text: string;
  profile: ProfileData;
  showProfileSignature: boolean;
  signaturePositionX: number;
  signaturePositionY: number;
  signatureScale: number;
  showSignaturePhoto: boolean;
  showSignatureUsername: boolean;
  showSignatureSocial: boolean;
  showLogo: boolean;
  logoPositionX: number;
  logoPositionY: number;
  logoScale: number;
  logoOpacity: number;
}

export function PreviewCanva({
  aspectRatio,
  bgColor,
  fgColor,
  filmColor,
  filmOpacity,
  scale,
  text,
  profile,
  showProfileSignature,
  signaturePositionX,
  signaturePositionY,
  signatureScale,
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
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

  return (
    <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
      <div
        style={{
          aspectRatio,
          backgroundColor: bgColor,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        className={cn(
          "transition-all duration-300 ease-in-out shadow-2xl rounded-xl w-full md:h-[83.5vh] md:w-auto relative overflow-hidden @container"
        )}
      >
        <div className="absolute inset-0 z-20" style={{ backgroundColor: filmBackgroundColor }} />
        <div className="relative z-30 flex items-center justify-center h-full p-8">
            <p
              className="font-semibold text-3xl text-center break-words"
              style={{ color: fgColor, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {text}
            </p>
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
