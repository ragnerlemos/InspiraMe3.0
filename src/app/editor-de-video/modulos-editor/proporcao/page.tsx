"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // escala inicial 100%

  return (
    <div className="flex h-screen w-full flex-col bg-background font-body text-foreground">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] min-h-0">
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
        <div className="flex flex-1 flex-col min-h-0">
          <main className="flex-1 flex items-center justify-center overflow-hidden p-4">
            <PreviewCanva
              aspectRatio={aspectRatio}
              bgColor={bgColor}
              fgColor={fgColor}
              scale={scale}
            />
          </main>
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
      </div>
    </div>
  );
}
