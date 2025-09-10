// src/app/editor-de-video/modulos-editor/proporcao/components/preview-canva.tsx
"use client";

import { useEffect, useState } from "react";
import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
}

export function PreviewCanva({ aspectRatio, bgColor, fgColor, scale }: PreviewCanvaProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");

    // handler compatível com addEventListener/addListener
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      // MediaQueryListEvent (new) tem .matches, MediaQueryList (old) também
      // usamos checagem segura
      // @ts-ignore
      setIsMobile(typeof e.matches === "boolean" ? e.matches : mq.matches);
    };

    // inicializa
    setIsMobile(mq.matches);

    if (mq.addEventListener) {
      mq.addEventListener("change", handler as EventListener);
    } else {
      // suporte a navegadores antigos
      // @ts-ignore
      mq.addListener(handler);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler as EventListener);
      } else {
        // @ts-ignore
        mq.removeListener(handler);
      }
    };
  }, []);

  // estilos comuns
  const baseStyle: React.CSSProperties = {
    aspectRatio: aspectRatio,
    backgroundColor: bgColor,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };

  // comportamento DESKTOP (mantido igual ao seu original)
  const desktopStyle: React.CSSProperties = {
    ...baseStyle,
    height: "80vh",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  // comportamento MOBILE (apenas aqui mudamos)
  const mobileStyle: React.CSSProperties = {
    ...baseStyle,
    width: "100%",   // ocupa largura disponível
    height: "auto",  // altura ajusta conforme aspect-ratio
    maxWidth: "100%",
    maxHeight: "80vh", // não estoura a tela
  };

  return (
    <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
      <div
        className={cn("relative transition-all duration-300 ease-in-out shadow-2xl rounded-xl")}
        style={isMobile ? mobileStyle : desktopStyle}
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center space-y-2">
            <Ratio className="mx-auto h-12 w-12 opacity-50" style={{ color: fgColor }} />
            <p className="font-semibold text-xl font-mono" style={{ color: fgColor }}>
              {aspectRatio.replace(/\s\/\s/g, ":")}
            </p>
            <p className="text-sm opacity-75" style={{ color: fgColor }}>
              Seu conteúdo aqui
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}