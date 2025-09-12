
"use client";

import { useState } from "react";
import { Wand2, RectangleHorizontal, RectangleVertical, Square, LayoutTemplate, UserCheck, ImageUp, Scaling, Paintbrush, Type, CaseSensitive, Pipette, AlignLeft, Bold, MoveVertical, Baseline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BotaoRecurso } from "../../botao-recurso";
import { Textarea } from "@/components/ui/textarea";

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
    activeControl: string | null;
    setActiveControl: (control: string | null) => void;
    text: string;
    setText: (text: string) => void;
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
    activeControl,
    setActiveControl,
    text,
    setText,
}: SidebarProps) {

    const [activeSubControl, setActiveSubControl] = useState<string | null>(null);

    const handleSetControleAtivo = (controle: string) => {
        setActiveControl(prev => {
            if (prev === controle) {
                return null;
            }
            setActiveSubControl(null); // Reseta sub-controle ao trocar de principal
            return controle;
        });
    }

    const renderActiveControl = () => {
        if (!activeControl) {
            return <p className="text-sm text-muted-foreground text-center p-4">Selecione uma ferramenta para editar.</p>;
        }
        switch (activeControl) {
            case 'texto':
                return (
                    <div className="p-4">
                        <Label htmlFor="text-input" className="sr-only">Texto da Frase</Label>
                        <Textarea
                            id="text-input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={5}
                            placeholder="Digite sua frase aqui..."
                            className="text-base"
                        />
                    </div>
                );
            case 'proporcao':
                return (
                    <div className="space-y-2">
                        <Label>Proporção da Tela</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {aspectRatios.map((ratio) => (
                                <Button
                                    key={ratio.value}
                                    onClick={() => setAspectRatio(ratio.value)}
                                    variant={aspectRatio === ratio.value ? "secondary" : "outline"}
                                    className="flex flex-col h-20 gap-1"
                                >
                                    <ratio.icon className="h-6 w-6" />
                                    <span className="text-xs">{ratio.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                );
            case 'escala':
                return (
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label>Escala do Canvas</Label>
                            <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
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
            case 'cores':
                 return (
                     <div className="space-y-4">
                        <Label>Cores</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="bg-color">Fundo</Label>
                                <input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" aria-label="Seletor de cor do fundo" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="fg-color">Primeiro Plano</Label>
                                <input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" aria-label="Seletor de cor do primeiro plano" />
                            </div>
                        </div>
                    </div>
                 );
            case 'estilo':
                 return (
                     <div className="w-full flex-1 flex flex-col">
                        <div className="p-4">{!activeSubControl && <p className="text-center text-muted-foreground text-sm">Selecione um controle de estilo abaixo.</p>}</div>
                        <div className="w-full whitespace-nowrap border-t mt-auto">
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
                 );
            case 'fundo':
                return <p className="text-center text-muted-foreground p-4">Controles de Fundo aqui.</p>;
            case 'assinatura':
                return <p className="text-center text-muted-foreground p-4">Controles de Assinatura aqui.</p>;
            case 'logo':
                return <p className="text-center text-muted-foreground p-4">Controles de Logo aqui.</p>;
            default:
                return null;
        }
    }


    const mainToolbar = (
         <div className="flex h-16 items-center justify-around px-2 border-b">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handleSetControleAtivo('texto')} isActive={activeControl === 'texto'}/>
            <BotaoRecurso icon={RectangleHorizontal} label="Proporção" onClick={() => handleSetControleAtivo('proporcao')} isActive={activeControl === 'proporcao'}/>
            <BotaoRecurso icon={Scaling} label="Escala" onClick={() => handleSetControleAtivo('escala')} isActive={activeControl === 'escala'}/>
            <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handleSetControleAtivo('cores')} isActive={activeControl === 'cores'}/>
            <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handleSetControleAtivo('estilo')} isActive={activeControl === 'estilo'}/>
        </div>
    );
     const elementsToolbar = (
        <div className="w-full whitespace-nowrap border-t">
            <div className="flex h-14 items-center justify-around flex-wrap bg-background/90 backdrop-blur-sm px-2">
                <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handleSetControleAtivo('fundo')} isActive={activeControl === 'fundo'}/>
                <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handleSetControleAtivo('assinatura')} isActive={activeControl === 'assinatura'}/>
                <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handleSetControleAtivo('logo')} isActive={activeControl === 'logo'}/>
            </div>
        </div>
    );

    return (
        <aside className="hidden shrink-0 bg-card md:flex md:flex-col md:border-r">
            <div className="flex items-center gap-3 p-6 border-b">
                <Wand2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline">Aspect Weaver</h1>
            </div>
            
            {mainToolbar}

            <div className="flex-1 overflow-y-auto p-2 flex flex-col">
                {renderActiveControl()}
            </div>

            {activeControl !== 'estilo' && elementsToolbar}

        </aside>
    );
}
