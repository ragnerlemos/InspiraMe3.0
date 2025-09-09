// src/app/editor-de-video/modulos-editor/proporcao/page.tsx
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
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
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

        <PreviewCanva 
            aspectRatio={aspectRatio}
            bgColor={bgColor}
            fgColor={fgColor}
            scale={scale}
        />

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
  );
}
