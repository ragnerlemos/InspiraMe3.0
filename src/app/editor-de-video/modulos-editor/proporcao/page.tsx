
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatioState] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(0.85); // Começa com a escala reduzida para 9:16
  
  const setAspectRatio = (ratio: string) => {
    setAspectRatioState(ratio);
    // Se for 9:16 (Story), aplica uma escala menor para caber na tela.
    // Para outros, usa a escala completa.
    if (ratio === "9 / 16") {
      setScale(0.85);
    } else {
      setScale(1);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
      <div className="flex-1 flex md:grid md:grid-cols-[288px_1fr] min-h-0">
        <Sidebar
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          scale={scale}
          setScale={setScale}
          bgColor={bgColor}
          setBgColor={setBgColor}
          fgColor={fgColor}
          setFgColor={setFgColor}
        />

        <main className="flex-1 w-full overflow-auto">
            <PreviewCanva
                aspectRatio={aspectRatio}
                bgColor={bgColor}
                fgColor={fgColor}
                scale={scale}
            />
        </main>
      </div>

       {/* Barra de Ferramentas Mobile */}
      <MobileToolbar
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        scale={scale}
        setScale={setScale}
        bgColor={bgColor}
        setBgColor={setBgColor}
        fgColor={fgColor}
        setFgColor={setFgColor}
      />
    </div>
  );
}
