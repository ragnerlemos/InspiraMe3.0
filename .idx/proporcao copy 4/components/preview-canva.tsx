
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
}

export function PreviewCanva({
  aspectRatio,
  bgColor,
  fgColor,
  scale,
}: PreviewCanvaProps) {
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
          "transition-all duration-300 ease-in-out shadow-2xl rounded-xl w-full md:h-[83.5vh] md:w-auto"
        )}
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center space-y-2">
            <Ratio
              className="mx-auto h-12 w-12 opacity-50"
              style={{ color: fgColor }}
            />
            <p
              className="font-semibold text-xl font-mono"
              style={{ color: fgColor }}
            >
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
