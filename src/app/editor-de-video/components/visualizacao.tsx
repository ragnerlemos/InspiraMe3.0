
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { VisualizacaoEditorProps, ProporcaoTela } from "./tipos";
import { AssinaturaPerfil } from "./assinatura-perfil";
import { VisualizacaoPerfil } from "./visualizacao-perfil";

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

// Dimensões base por proporção (em px).
function getBaseDims(ratio: ProporcaoTela) {
  switch (ratio) {
    case "9:16":  return { width: 900,  height: 1600 };
    case "16:9":  return { width: 1600, height: 900  };
    case "1:1":   return { width: 1200, height: 1200 };
    default:      return { width: 900,  height: 1600 };
  }
}

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
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
  activeTemplateId,
  profileVerticalPosition,
}: VisualizacaoEditorProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const base = getBaseDims(aspectRatio);

  // Escala o canvas para SEMPRE caber no viewport (contain)
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      if (!vw || !vh) return;
      const s = Math.min(vw / base.width, vh / base.height);
      setScale(s > 0 ? s : 1);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [base.width, base.height]);

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
    return null;
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

        {showProfileSignature && (
          <div
            className="absolute"
            style={{
              top: `${signaturePositionY}%`,
              left: `${signaturePositionX}%`,
              transform: "translate(-50%, -50%)",
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
      </div>
    );
  };

  return (
    // Viewport que mede o espaço disponível
    <div
      ref={viewportRef}
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8 min-w-0 min-h-0 overflow-hidden"
    >
      {/* Canvas com tamanho base, escalado para caber */}
      <div
        className="relative rounded-lg overflow-hidden shadow-2xl"
        style={{
          width: `${base.width}px`,
          height: `${base.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          background: "#000",
          willChange: "transform",
        }}
      >
        {renderBackground()}
        {renderContent()}
      </div>
    </div>
  );
}
