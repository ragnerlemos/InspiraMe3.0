// Componente para a aba "Cores", que centraliza todos os controles de cor.

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BotaoRecurso } from '../botao-recurso';
import { Baseline, CaseSensitive, Film, ImageIcon, Layers, Paintbrush, Pipette } from 'lucide-react';
import { IconeGradiente } from '../icone-gradiente';
import type { PainelCoresProps } from '../tipos';

export function PainelCores(props: PainelCoresProps & { onClose: () => void }) {
    const { 
        textColor, onTextColorChange,
        backgroundStyle, onBackgroundStyleChange,
        filmColor, onFilmColorChange,
        filmOpacity, onFilmOpacityChange,
    } = props;
    
    const handleBackgroundColorChange = (color: string) => {
        onBackgroundStyleChange({ type: 'solid', value: color });
    }

    const backgroundColor = backgroundStyle.type === 'solid' ? backgroundStyle.value : '#000000';

    return (
        <div className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bg-color">Cor do Fundo</Label>
                    <div className="relative h-10 w-full">
                        <Input
                            id="bg-color"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="text-color">Cor do Texto</Label>
                    <div className="relative h-10 w-full">
                       <Input
                            id="text-color"
                            type="color"
                            value={textColor}
                            onChange={(e) => onTextColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            
            <Separator />
            
             <div className="space-y-4">
                <Label className="flex items-center"><Film className="mr-2 h-4 w-4" /> Película de Cor</Label>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="film-color" className="text-xs text-muted-foreground">Cor</Label>
                         <div className="relative h-7 w-10">
                            <Input
                                id="film-color"
                                type="color"
                                value={filmColor}
                                onChange={(e) => onFilmColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="film-opacity" className="text-xs text-muted-foreground">Opacidade</Label>
                        <span className="text-xs text-muted-foreground">{filmOpacity}%</span>
                    </div>
                    <Slider id="film-opacity" min={0} max={100} step={1} value={[filmOpacity]} onValueChange={(v) => onFilmOpacityChange(v[0])} />
                </div>
            </div>
        </div>
    );
}
