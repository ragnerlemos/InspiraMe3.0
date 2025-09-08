
"use client";

import { useState } from "react";
import { Ratio, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const aspectRatios = [
  { label: "16:9", value: "16 / 9" },
  { label: "1:1", value: "1 / 1" },
  { label: "4:3", value: "4 / 3" },
  { label: "3:2", value: "3 / 2" },
  { label: "9:16", value: "9 / 16" },
  { label: "21:9", value: "21 / 9" },
];

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // escala inicial 100%

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        <aside className="hidden shrink-0 bg-card p-6 md:flex md:flex-col md:border-r">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Wand2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline">Aspect Weaver</h1>
            </div>

            {/* Proporção */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                PROPORÇÃO DA TELA
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    variant={
                      aspectRatio === ratio.value ? "default" : "outline"
                    }
                    className="shrink-0"
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Escala */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    ESCALA DO CANVAS
                  </h2>
                  <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 1.1, 1.2].map((value) => (
                  <Button
                    key={value}
                    onClick={() => setScale(value)}
                    variant={scale === value ? "default" : "outline"}
                  >
                    {Math.round(value * 100)}%
                  </Button>
                ))}
              </div>
              <Slider
                value={[scale]}
                onValueChange={(values) => setScale(values[0])}
                min={0.5}
                max={2}
                step={0.01}
              />
            </div>

            {/* Cores */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                CORES
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Fundo</Label>
                  <div className="relative h-10 w-full overflow-hidden rounded-md border">
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: bgColor }}
                    />
                    <input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Seletor de cor do fundo"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Primeiro Plano</Label>
                  <div className="relative h-10 w-full overflow-hidden rounded-md border">
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: fgColor }}
                    />
                    <input
                      id="fg-color"
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
          </div>
        </aside>

        <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
          <div className="flex items-start justify-center w-full h-full max-w-full max-h-full">
            <div
              className="relative shadow-2xl rounded-xl"
              style={{
                aspectRatio: aspectRatio,
                backgroundColor: bgColor,
                maxWidth: "100%",   // nunca ultrapassa a largura
                maxHeight: "100%",  // nunca ultrapassa a altura
                width: "auto",      // largura ajusta automaticamente
                height: "100%",     // altura limitada pelo wrapper
              }}
            >
              {/* Conteúdo interno */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
                style={{ color: fgColor }}
              >
                <Ratio className="h-16 w-16" />
                <p className="text-3xl font-bold font-mono tracking-tighter">
                  {aspectRatio.replace(' / ', ':')}
                </p>
                <p className="text-muted-foreground" style={{ color: fgColor, opacity: 0.7 }}>
                  Your content here
                </p>
              </div>
            </div>
          </div>
        </main>

        <div className="shrink-0 border-t bg-card p-4 md:hidden">
            <div className="mx-auto max-w-sm space-y-8 md:max-w-none">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  PROPORÇÃO DA TELA
                </h2>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {aspectRatios.map((ratio) => (
                    <Button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      variant={
                        aspectRatio === ratio.value ? "default" : "outline"
                      }
                      className="shrink-0"
                    >
                      {ratio.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Escala (MOBILE) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      ESCALA DO CANVAS
                    </h2>
                    <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {[1, 1.1, 1.2].map((value) => (
                    <Button
                      key={value}
                      onClick={() => setScale(value)}
                      variant={scale === value ? "default" : "outline"}
                      className="shrink-0"
                    >
                      {Math.round(value * 100)}%
                    </Button>
                  ))}
                </div>
                <Slider
                  value={[scale]}
                  onValueChange={(values) => setScale(values[0])}
                  min={0.5}
                  max={2}
                  step={0.01}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  CORES
                </h2>
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
            </div>
          </div>
      </div>
    </div>
  );
}
