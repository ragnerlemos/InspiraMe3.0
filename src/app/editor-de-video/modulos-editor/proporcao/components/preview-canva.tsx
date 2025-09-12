
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
  text: string;
}

export function PreviewCanva({
  aspectRatio,
  bgColor,
  fgColor,
  scale,
  text,
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
        <div className="flex items-center justify-center h-full p-8">
            <p
              className="font-semibold text-3xl text-center break-words"
              style={{ color: fgColor, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {text}
            </p>
        </div>
      </div>
    </main>
  );
}
