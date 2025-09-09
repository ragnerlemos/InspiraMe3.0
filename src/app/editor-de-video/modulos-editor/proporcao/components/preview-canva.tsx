// src/app/editor-de-video/modulos-editor/proporcao/components/preview-canva.tsx
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
}

export function PreviewCanva({ aspectRatio, bgColor, fgColor, scale }: PreviewCanvaProps) {
  // Estilos base para o canvas
  const baseStyle: React.CSSProperties = {
    aspectRatio: aspectRatio,
    backgroundColor: bgColor,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };

  return (
    <main className="w-full h-full p-4 flex items-center justify-center overflow-hidden">
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out shadow-2xl rounded-xl",
          // No desktop, permitimos que a altura seja grande
          "md:h-auto md:w-auto md:max-h-[80vh]",
          // No mobile, forçamos a se ajustar à largura e altura do contêiner
          "w-full h-auto max-w-full max-h-full"
        )}
        style={baseStyle}
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