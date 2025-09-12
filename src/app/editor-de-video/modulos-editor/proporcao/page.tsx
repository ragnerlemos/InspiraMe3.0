
"use client";

import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatioState] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // Começa com escala normal
  const { width } = useWindowSize();
  const isDesktop = width >= 768; // Tailwind's md breakpoint

  const setAspectRatio = (ratio: string) => {
    setAspectRatioState(ratio);
  };
  
  // Efeito para ajustar a escala baseado na proporção e no tamanho da tela
  useEffect(() => {
    if (aspectRatio === "9 / 16" && !isDesktop) {
      setScale(0.75);
    } else {
      setScale(1);
    }
  }, [aspectRatio, isDesktop]);


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
