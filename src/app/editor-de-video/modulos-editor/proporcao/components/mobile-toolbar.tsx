
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
} from "@/components/ui/sheet";
import {
  RectangleHorizontal,
  Scaling,
  Paintbrush,
  RectangleVertical,
  Square,
  LayoutTemplate,
  UserCheck,
  ImageUp,
  ArrowLeft,
  Wand2,
  Type,
  CaseSensitive,
  Pipette,
  AlignLeft,
  Bold,
  MoveVertical,
  Baseline,
} from "lucide-react";
import { BotaoRecurso } from "../../botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
}

type ActivePanel = "proporcao" | "escala" | "cores" | "fundo" | "assinatura" | "logo" | "estilo" | null;

export function MobileToolbar({
  aspectRatio,
  setAspectRatio,
  scale,
  setScale,
  bgColor,
  setBgColor,
  fgColor,
  setFgColor,
  activeControl,
  setActiveControl
}: MobileToolbarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [activeSubControl, setActiveSubControl] = useState<string | null>(null);

  const handlePanelChange = (panel: ActivePanel) => {
    setActivePanel(panel);
    setActiveControl(panel);
    setActiveSubControl(null); // Reset sub-controls when main panel changes
  };

  const renderPanelContent = () => {
    if (!activePanel) return null;

    const panels: Record<string, JSX.Element | null> = {
      proporcao: (
        <div className="space-y-2">
          <Label>Proporção da Tela</Label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatios.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={aspectRatio === value ? "secondary" : "outline"}
                onClick={() => setAspectRatio(value)}
                className="flex flex-col h-16 gap-1"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      ),
      escala: (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Escala do Canvas</Label>
            <span className="text-sm font-mono">{Math.round(scale * 100)}%</span>
          </div>
          <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={0.5} max={2} step={0.01} />
        </div>
      ),
      cores: (
        <div className="space-y-4">
          <Label>Cores</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bg-color-mobile">Fundo</Label>
              <input id="bg-color-mobile" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fg-color-mobile">Primeiro Plano</Label>
              <input id="fg-color-mobile" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" />
            </div>
          </div>
        </div>
      ),
      estilo: (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {!activeSubControl && <p className="text-muted-foreground text-center p-4">Selecione uma opção abaixo para editar.</p>}
            </div>
             <div className="w-full whitespace-nowrap border-t">
                <div className="flex h-14 items-center justify-around flex-wrap bg-background/90 backdrop-blur-sm px-2">
                    <BotaoRecurso icon={Type} label="Fonte" onClick={() => setActiveSubControl('fonte')} isActive={activeSubControl === 'fonte'}/>
                    <BotaoRecurso icon={CaseSensitive} label="Tamanho" onClick={() => setActiveSubControl('tamanho')} isActive={activeSubControl === 'tamanho'}/>
                    <BotaoRecurso icon={Pipette} label="Cor" onClick={() => setActiveSubControl('cor')} isActive={activeSubControl === 'cor'}/>
                    <BotaoRecurso icon={AlignLeft} label="Alinhar" onClick={() => setActiveSubControl('alinhamento')} isActive={activeSubControl === 'alinhamento'}/>
                    <BotaoRecurso icon={Bold} label="Estilo" onClick={() => setActiveSubControl('estilo')} isActive={activeSubControl === 'estilo'}/>
                    <BotaoRecurso icon={MoveVertical} label="Posição" onClick={() => setActiveSubControl('posicao')} isActive={activeSubControl === 'posicao'}/>
                    <BotaoRecurso icon={Baseline} label="Contorno" onClick={() => setActiveSubControl('contorno')} isActive={activeSubControl === 'contorno'}/>
                    <BotaoRecurso icon={Paintbrush} label="Sombra" onClick={() => setActiveSubControl('sombra')} isActive={activeSubControl === 'sombra'}/>
                </div>
            </div>
       </div>
      ),
      fundo: <p className="text-center text-muted-foreground">Controles de Fundo aqui.</p>,
      assinatura: <p className="text-center text-muted-foreground">Controles de Assinatura aqui.</p>,
      logo: <p className="text-center text-muted-foreground">Controles de Logo aqui.</p>,
    };

    return panels[activePanel];
  };

  const getPanelTitle = () => {
    const titles: Record<string, string> = {
      proporcao: "Editar Proporção",
      escala: "Editar Escala",
      cores: "Editar Cores",
      estilo: "Editar Estilo",
      fundo: "Editar Fundo",
      assinatura: "Editar Assinatura",
      logo: "Editar Logo",
    };
    return titles[activePanel || ''] || '';
  };

  const mainToolbar = (
     <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex h-16 items-center justify-start gap-1 px-2 border-t bg-background">
            <BotaoRecurso icon={RectangleHorizontal} label="Proporção" onClick={() => handlePanelChange("proporcao")} isActive={activePanel === "proporcao"} />
            <BotaoRecurso icon={Scaling} label="Escala" onClick={() => handlePanelChange("escala")} isActive={activePanel === "escala"} />
            <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handlePanelChange("cores")} isActive={activePanel === "cores"} />
            <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handlePanelChange("estilo")} isActive={activePanel === "estilo"} />
            <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handlePanelChange("fundo")} isActive={activePanel === "fundo"} />
            <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handlePanelChange("assinatura")} isActive={activePanel === "assinatura"} />
            <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handlePanelChange("logo")} isActive={activePanel === "logo"} />
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t">
        {mainToolbar}
      </div>

      <Sheet open={!!activePanel} onOpenChange={(open) => { if (!open) { setActivePanel(null); setActiveControl(null); }}}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col">
          <SheetHeader className="mb-2">
            <SheetTitle className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => { setActivePanel(null); setActiveControl(null); }}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {getPanelTitle()}
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto flex-1 p-4">
            {renderPanelContent()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
