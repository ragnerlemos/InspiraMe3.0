
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // escala inicial 100%

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        
        {/* Sidebar só aparece no desktop */}
        <div className="hidden md:block">
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
        </div>

        {/* Área de preview que respeita o espaço do menu */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4 md:p-8">
           <PreviewCanva 
            aspectRatio={aspectRatio}
            bgColor={bgColor}
            fgColor={fgColor}
            scale={scale}
          />
        </div>

        {/* Botão e painel flutuante para mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Configurações</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh]">
               <div className="p-4 overflow-y-auto">
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
    </div>
  );
}
