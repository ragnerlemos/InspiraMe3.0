
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  
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

        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden min-h-0">
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
