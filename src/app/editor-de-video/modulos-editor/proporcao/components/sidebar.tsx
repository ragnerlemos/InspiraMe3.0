
"use client";

import { Wand2, RectangleHorizontal, RectangleVertical, Square, LayoutTemplate, UserCheck, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BotaoRecurso } from "../../botao-recurso";

const aspectRatios = [
    { label: "Story", value: "9 / 16", icon: RectangleVertical },
    { label: "Quadrado", value: "1 / 1", icon: Square },
    { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

interface SidebarProps {
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    scale: number;
    setScale: (scale: number) => void;
    bgColor: string;
    setBgColor: (color: string) => void;
    fgColor: string;
    setFgColor: (color: string) => void;
}

export function Sidebar({
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
}: SidebarProps) {
    return (
        <aside className="hidden shrink-0 bg-card p-6 md:flex md:flex-col md:border-r">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold font-headline">Aspect Weaver</h1>
                </div>

                {/* Proporção */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        PROPORÇÃO DA TELA
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {aspectRatios.map((ratio) => (
                            <Button
                                key={ratio.value}
                                onClick={() => setAspectRatio(ratio.value)}
                                variant={
                                    aspectRatio === ratio.value ? "default" : "outline"
                                }
                                className="flex flex-col h-20 gap-1"
                            >
                                <ratio.icon className="h-6 w-6" />
                                <span className="text-xs">{ratio.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Escala */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            ESCALA DO CANVAS
                        </h2>
                        <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        {[1, 1.1, 1.2].map((value) => (
                            <Button
                                key={value}
                                onClick={() => setScale(value)}
                                variant={scale === value ? "default" : "outline"}
                                size="sm"
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
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        CORES
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
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
                        <div className="space-y-1">
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

                 {/* Elementos */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        ELEMENTOS
                    </h2>
                     <div className="flex h-14 items-center justify-around flex-wrap bg-background/90 backdrop-blur-sm px-2 rounded-lg border">
                        <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => {}} isActive={false}/>
                        <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => {}} isActive={false}/>
                        <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => {}} isActive={false}/>
                    </div>
                </div>
            </div>
        </aside>
    );
}
