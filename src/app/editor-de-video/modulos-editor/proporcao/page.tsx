
"use client";

import { useMemo, useState } from "react";
import { Ratio, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-screen overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] md:divide-x min-h-0">
        <aside className="hidden shrink-0 bg-card p-6 md:flex md:flex-col md:border-r">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Wand2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline">Aspect Weaver</h1>
            </div>

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

        <main className="grid flex-1 grid-rows-[auto_1fr] bg-muted/50 md:grid-rows-1 min-h-0">
          <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm md:hidden">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="ml-2 text-xl font-bold font-headline">Aspect Weaver</h1>
          </header>
          {/* Main visualization area */}
          <div className="overflow-hidden grid place-items-center p-4">
            {/* Canvas for aspect ratio preview */}
            <div
              className="relative transition-all duration-300 ease-in-out shadow-2xl rounded-xl w-full max-w-full max-h-full"
              style={{
                aspectRatio: aspectRatio,
                backgroundColor: bgColor,
              }}
            >
              <div className="flex items-center justify-center h-full p-4">
                <div className="text-center space-y-2">
                  <Ratio
                    className="mx-auto h-12 w-12 opacity-50"
                    style={{ color: fgColor }}
                  />
                  <p
                    className="font-semibold text-xl font-mono"
                    style={{ color: fgColor }}
                  >
                    {aspectRatio.replace(/\s\/\s/g, ":")}
                  </p>
                  <p className="text-sm opacity-75" style={{ color: fgColor }}>
                    Seu conteúdo aqui
                  </p>
                </div>
              </div>
            </div>
          </div>
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
        </main>
      </div>
    </div>
  );
}
