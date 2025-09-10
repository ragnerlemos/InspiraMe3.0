"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        
        <div className="hidden md:block h-full">
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

        <main className="w-full h-full flex flex-col items-center justify-center overflow-auto">
          <PreviewCanva 
            aspectRatio={aspectRatio}
            bgColor={bgColor}
            fgColor={fgColor}
            scale={scale}
          />
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {showMobileMenu && (
          <div className="fixed inset-x-0 bottom-12 bg-background border-t border-border shadow-lg z-50 p-4">
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
        )}
      </div>
    </div>
  );
}
