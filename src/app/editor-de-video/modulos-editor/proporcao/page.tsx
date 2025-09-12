
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
  const [scale, setScale] = useState(1);
  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const [text, setText] = useState("A única maneira de fazer um ótimo trabalho é amar o que você faz.");

  const setAspectRatio = (ratio: string) => {
    setAspectRatioState(ratio);
  };
  
  useEffect(() => {
    if (aspectRatio === "9 / 16" && !isDesktop) {
      setScale(0.80);
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
          activeControl={activeControl}
          setActiveControl={setActiveControl}
          text={text}
          setText={setText}
        />

        <main className="flex-1 w-full overflow-auto">
            <PreviewCanva
                aspectRatio={aspectRatio}
                bgColor={bgColor}
                fgColor={fgColor}
                scale={scale}
                text={text}
            />
        </main>
      </div>

      <MobileToolbar
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        scale={scale}
        setScale={setScale}
        bgColor={bgColor}
        setBgColor={setBgColor}
        fgColor={fgColor}
        setFgColor={setFgColor}
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        text={text}
        setText={setText}
      />
    </div>
  );
}
