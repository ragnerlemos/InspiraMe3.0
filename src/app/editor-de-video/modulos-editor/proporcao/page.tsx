
// src/app/editor-de-video/modulos-editor/proporcao/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Settings } from "lucide-react";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // escala inicial 100%

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
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
        <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
            <PreviewCanva 
                aspectRatio={aspectRatio}
                bgColor={bgColor}
                fgColor={fgColor}
                scale={scale}
            />
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col h-full md:hidden">
         <div className="flex-1 w-full h-full p-4 flex items-start justify-center overflow-hidden">
            <PreviewCanva 
                aspectRatio={aspectRatio}
                bgColor={bgColor}
                fgColor={fgColor}
                scale={scale}
            />
        </div>
        <Sheet>
            <SheetTrigger asChild>
                <div className="p-2 border-t bg-background">
                    <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações de Proporção
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[60vh] flex flex-col">
                 <SheetHeader>
                    <SheetTitle>Editar Proporção</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto">
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
            </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
