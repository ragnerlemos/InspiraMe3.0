

// Componente para a aba "Cores", que agrupa todos os controles de cor.

import { useMemo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { PainelCoresProps } from '../tipos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BotaoRecurso } from '../botao-recurso';
import { Baseline, CaseSensitive, Film, ImageIcon, Layers, Paintbrush, Pipette } from 'lucide-react';
import { IconeGradiente } from '../icone-gradiente';

export function PainelCores(props: PainelCoresProps & { onClose: () => void }) {
    const { 
        textColor, onTextColorChange,
        textStrokeColor, onTextStrokeColorChange,
        textStrokeWidth, onTextStrokeWidthChange,
        backgroundStyle, onBackgroundStyleChange,
        filmColor, onFilmColorChange,
        filmOpacity, onFilmOpacityChange,
    } = props;
    
    const [activeTab, setActiveTab] = useState<'text' | 'background'>('text');

    const { gradient } = useMemo(() => {
        let grad = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };
        if (backgroundStyle.type === 'gradient' && backgroundStyle.value) {
             try {
                const type = backgroundStyle.value.startsWith('linear') ? 'linear' : 'radial';
                const parts = backgroundStyle.value.match(/\((.*)\)/)?.[1].split(', ');
                if (!parts) throw new Error("Invalid gradient string");
                let direction = 'to right';
                let colors: [string, string] = ['#A06CD5', '#45B8AC'];
                if (type === 'linear') {
                    if (parts[0].startsWith('to ')) {
                        direction = parts[0];
                        colors = [parts[1], parts[2]] as [string, string];
                    } else {
                        colors = [parts[0], parts[1]] as [string, string];
                    }
                } else {
                    const colorParts = backgroundStyle.value.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgb\([^)]+\)/g);
                     if (colorParts && colorParts.length >= 2) {
                        colors = [colorParts[0], colorParts[1]] as [string, string];
                    }
                }
                grad = { type, colors, direction };
            } catch {}
        }
        return { gradient: grad };
    }, [backgroundStyle]);

    const handleBackgroundTypeChange = (type: 'solid' | 'gradient') => {
        if (type === 'solid') {
            onBackgroundStyleChange({ type: 'solid', value: backgroundStyle.type === 'solid' ? backgroundStyle.value : '#000000' });
        } else if (type === 'gradient') {
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : `circle at center, `}${gradient.colors[0]}, ${gradient.colors[1]})`;
            onBackgroundStyleChange({ type: 'gradient', value: gradValue });
        }
    };
    
    const handleSolidColorChange = (color: string) => {
        onBackgroundStyleChange({ type: 'solid', value: color });
    };

    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : `circle at center, `}${grad.colors[0]}, ${grad.colors[1]})`;
        onBackgroundStyleChange({ type: 'gradient', value: gradValue });
    };

    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors] as [string, string];
        newColors[index] = color;
        handleGradientChange({ ...gradient, colors: newColors });
    };

    const handleGradientDirectionChange = (direction: string) => {
        handleGradientChange({ ...gradient, direction });
    };

    const handleGradientTypeChange = (type: 'linear' | 'radial') => {
        handleGradientChange({ ...gradient, type });
    }

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-2">
                <Button variant={activeTab === 'text' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('text')}>Texto</Button>
                <Button variant={activeTab === 'background' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('background')}>Fundo</Button>
            </div>
            
            <Separator />
            
            {activeTab === 'text' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="text-color" className="flex items-center"><Pipette className="mr-2 h-4 w-4" />Cor Principal</Label>
                        <div className="relative h-10 w-full rounded-md overflow-hidden">
                            <Input
                                type="color"
                                id="text-color"
                                value={textColor}
                                onChange={(e) => onTextColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                            />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="stroke-color" className="flex items-center"><Baseline className="mr-2 h-4 w-4" />Cor do Contorno</Label>
                            <div className="relative h-8 w-12 rounded-md overflow-hidden">
                                <Input
                                    type="color"
                                    id="stroke-color"
                                    value={textStrokeColor}
                                    onChange={(e) => onTextStrokeColorChange(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="stroke-width">Espessura do Contorno</Label>
                                <span className="text-sm text-muted-foreground">{textStrokeWidth.toFixed(1)} pt</span>
                            </div>
                            <Slider id="stroke-width" min={0} max={10} step={0.1} value={[textStrokeWidth]} onValueChange={(v) => onTextStrokeWidthChange(v[0])} />
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'background' && (
                <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-2">
                        <BotaoRecurso icon={Paintbrush} label="Cor" onClick={() => handleBackgroundTypeChange('solid')} isActive={backgroundStyle.type === 'solid'}/>
                        <BotaoRecurso icon={IconeGradiente} label="Gradiente" onClick={() => handleBackgroundTypeChange('gradient')} isActive={backgroundStyle.type === 'gradient'}/>
                        <BotaoRecurso icon={Film} label="Película" onClick={() => { /* This button just activates the section below */ }} isActive={true}/>
                    </div>

                    {backgroundStyle.type === 'solid' && (
                        <div className="space-y-2 pt-4 border-t">
                            <Label>Cor de Fundo</Label>
                            <div className="relative h-10 w-full rounded-md overflow-hidden">
                                <Input
                                    type="color"
                                    value={backgroundStyle.value}
                                    onChange={(e) => handleSolidColorChange(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                    
                     {backgroundStyle.type === 'gradient' && (
                         <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-end gap-2">
                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <div className="flex gap-1">
                                        <Button size="sm" variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('linear')}>Linear</Button>
                                        <Button size="sm" variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('radial')}>Radial</Button>
                                    </div>
                                </div>

                                {gradient.type === 'linear' && (
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="gradient-direction">Direção</Label>
                                        <Select value={gradient.direction} onValueChange={handleGradientDirectionChange}>
                                            <SelectTrigger id="gradient-direction" className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="to right">Direita</SelectItem>
                                                <SelectItem value="to left">Esquerda</SelectItem>
                                                <SelectItem value="to bottom">Abaixo</SelectItem>
                                                <SelectItem value="to top">Acima</SelectItem>
                                                <SelectItem value="to bottom right">Diag. (↓→)</SelectItem>
                                                <SelectItem value="to top left">Diag. (↑←)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Cores do Gradiente</Label>
                                <div className="flex items-center gap-4">
                                    {[0, 1].map((index) => (
                                        <div key={index} className="flex-1 space-y-1">
                                            <Label className="text-xs text-muted-foreground">Cor {index + 1}</Label>
                                            <div className="relative h-9 w-full rounded-md overflow-hidden">
                                                <Input
                                                    type="color"
                                                    value={gradient.colors[index as 0 | 1]}
                                                    onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)}
                                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="flex items-center"><Film className="mr-2 h-4 w-4" />Película de Cor</Label>
                        <div className="space-y-2">
                            <Label>Cor da Película</Label>
                            <div className="relative h-10 w-full rounded-md overflow-hidden">
                                <Input
                                    type="color"
                                    value={filmColor}
                                    onChange={(e) => onFilmColorChange(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="film-opacity">Opacidade da Película</Label>
                                <span className="text-sm text-muted-foreground">{filmOpacity}%</span>
                            </div>
                            <Slider id="film-opacity" min={0} max={100} step={1} value={[filmOpacity]} onValueChange={(v) => onFilmOpacityChange(v[0])} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
