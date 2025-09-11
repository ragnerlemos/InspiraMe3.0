
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RectangleHorizontal,
  Scaling,
  Paintbrush,
  X,
  RectangleVertical,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BotaoRecurso } from "../../botao-recurso";

const aspectRatios = [
  { label: "Story", value: "9 / 16", icon: RectangleVertical },
  { label: "Quadrado", value: "1 / 1", icon: Square },
  { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

interface MobileToolbarProps {
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  fgColor: string;
  setFgColor: (color: string) => void;
  onClose?: () => void;
}

type ActivePanel = "ratio" | "scale" | "colors" | null;

export function MobileToolbar({
  aspectRatio,
  setAspectRatio,
  scale,
  setScale,
  bgColor,
  setBgColor,
  fgColor,
  setFgColor,
}: MobileToolbarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const renderPanelContent = () => {
    switch (activePanel) {
      case "ratio":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              PROPORÇÃO
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <Button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  variant={aspectRatio === ratio.value ? "secondary" : "outline"}
                  className="flex flex-col h-16 gap-1"
                >
                  <ratio.icon className="h-5 w-5" />
                  <span className="text-xs">{ratio.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-muted-foreground">
                ESCALA
              </h3>
              <span className="text-sm font-mono text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={(values) => setScale(values[0])}
              min={0.5}
              max={2}
              step={0.01}
            />
          </div>
        );
      case "colors":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">CORES</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color-mobile">Fundo</Label>
                <div className="relative h-10 w-full overflow-hidden rounded-md border">
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: bgColor }}
                  />
                  <input
                    id="bg-color-mobile"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Seletor de cor do fundo"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fg-color-mobile">Primeiro Plano</Label>
                <div className="relative h-10 w-full overflow-hidden rounded-md border">
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: fgColor }}
                  />
                  <input
                    id="fg-color-mobile"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Seletor de cor do primeiro plano"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Sheet open={!!activePanel} onOpenChange={(open) => !open && setActivePanel(null)}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader className="mb-4">
             <SheetTitle className="capitalize">{activePanel}</SheetTitle>
          </SheetHeader>
          <div className="p-4">{renderPanelContent()}</div>
        </SheetContent>
      </Sheet>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t">
        <div className="flex justify-around items-center h-16">
          <BotaoRecurso
            icon={RectangleHorizontal}
            label="Proporção"
            onClick={() => setActivePanel("ratio")}
            isActive={activePanel === "ratio"}
          />
          <BotaoRecurso
            icon={Scaling}
            label="Escala"
            onClick={() => setActivePanel("scale")}
            isActive={activePanel === "scale"}
          />
          <BotaoRecurso
            icon={Paintbrush}
            label="Cores"
            onClick={() => setActivePanel("colors")}
            isActive={activePanel === "colors"}
          />
        </div>
      </div>
    </>
  );
}
