// Componente para a aba "Cores", que centraliza todos os controles de cor.

import { useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Film, Layers, Palette } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PainelCoresProps } from '../tipos';

export function PainelCores(props: PainelCoresProps & { onClose: () => void }) {
    // Desestrutura as propriedades para acessar facilmente os valores e as funções de atualização.
    const { 
        textColor, onTextColorChange,
        backgroundStyle, onBackgroundStyleChange,
        filmColor, onFilmColorChange,
        filmOpacity, onFilmOpacityChange,
    } = props;
    
    // --- Lógica do Fundo ---
    // Determina qual aba de fundo está ativa (sólida, gradiente) e extrai as propriedades do gradiente.
    const { activeTab, gradient } = useMemo(() => {
        const type = backgroundStyle.type;
        // Padrão do gradiente caso não exista
        let grad = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };
        
        // Se o fundo for um gradiente, extrai suas propriedades
        if (type === 'gradient' && backgroundStyle.value) {
            try {
                const gradType = backgroundStyle.value.startsWith('linear') ? 'linear' : 'radial';
                const colorParts = backgroundStyle.value.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgb\([^)]+\)/g);
                
                if (colorParts && colorParts.length >= 2) {
                    const colors = [colorParts[0], colorParts[1]] as [string, string];
                    let direction = 'to right';
                    if (gradType === 'linear') {
                        const directionMatch = backgroundStyle.value.match(/to (right|left|bottom|top)/);
                        if (directionMatch) direction = `to ${directionMatch[1]}`;
                    }
                    grad = { type: gradType, colors, direction };
                }
            } catch {
                // Mantém o gradiente padrão em caso de erro
            }
        }
        return { activeTab: type === 'media' ? 'solid' : type, gradient: grad };
    }, [backgroundStyle]);

    // Altera o tipo de fundo (sólido ou gradiente)
    const handleTabChange = (tab: 'solid' | 'gradient') => {
        if (tab === 'solid') {
            onBackgroundStyleChange({ type: 'solid', value: '#333333' });
        } else { // gradient
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : `circle at center, `}${gradient.colors[0]}, ${gradient.colors[1]})`;
            onBackgroundStyleChange({ type: 'gradient', value: gradValue });
        }
    };
    
    // Atualiza a cor de fundo sólida
    const handleSolidColorChange = (color: string) => {
        onBackgroundStyleChange({ type: 'solid', value: color });
    }

    // Função genérica para construir e atualizar o valor do gradiente
    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : `circle at center, `}${grad.colors[0]}, ${grad.colors[1]})`;
        onBackgroundStyleChange({ type: 'gradient', value: gradValue });
    };

    // Altera uma das cores do gradiente
    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors] as [string, string];
        newColors[index] = color;
        handleGradientChange({ ...gradient, colors: newColors });
    };
    
    // Altera a direção do gradiente linear
    const handleGradientDirectionChange = (direction: string) => {
        handleGradientChange({ ...gradient, direction });
    };
    
    // Altera o tipo do gradiente (linear ou radial)
    const handleGradientTypeChange = (type: 'linear' | 'radial') => {
        handleGradientChange({ ...gradient, type });
    }

    const backgroundColor = backgroundStyle.type === 'solid' ? backgroundStyle.value : '#000000';

    return (
        <div className="p-4 space-y-4">
            {/* Seção para Cor do Texto */}
             <div className="space-y-2">
                <Label htmlFor="text-color">Cor do Texto</Label>
                <div className="relative h-10 w-full rounded-md border overflow-hidden">
                    <Input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                    />
                    <div className="w-full h-full" style={{ backgroundColor: textColor }} />
                </div>
            </div>

            <Separator />

            {/* Seção para Cor de Fundo */}
            <div className="space-y-4">
                <Label>Cor do Fundo</Label>
                {/* Abas para escolher entre Cor Sólida e Gradiente */}
                <div className="grid grid-cols-2 gap-2">
                    <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => handleTabChange('solid')}><Palette className="mr-2 h-4 w-4" /> Cor Sólida</Button>
                    <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => handleTabChange('gradient')}><Layers className="mr-2 h-4 w-4" /> Gradiente</Button>
                </div>
                
                {/* Controles para Cor Sólida */}
                {activeTab === 'solid' && (
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="bg-color" className="sr-only">Cor Sólida do Fundo</Label>
                        <div className="relative h-10 w-full rounded-md border overflow-hidden">
                            <Input
                                id="bg-color"
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => handleSolidColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: backgroundColor }} />
                        </div>
                    </div>
                )}
                
                {/* Controles para Gradiente */}
                {activeTab === 'gradient' && (
                     <div className="space-y-4 pt-2">
                        <div className="flex items-end gap-2">
                             <div className="space-y-2">
                                <Label>Tipo</Label>
                                <div className="flex gap-1">
                                    <Button size="sm" variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('linear')}>Linear</Button>
                                    <Button size="sm" variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('radial')}>Radial</Button>
                                </div>
                            </div>
                            {/* Seletor de Direção (apenas para gradiente linear) */}
                            {gradient.type === 'linear' && (
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="gradient-direction">Direção</Label>
                                    <Select value={gradient.direction} onValueChange={handleGradientDirectionChange}>
                                        <SelectTrigger id="gradient-direction" className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="to right">Direita</SelectItem>
                                            <SelectItem value="to left">Esquerda</SelectItem>
                                            <SelectItem value="to bottom">Abaixo</SelectItem>
                                            <SelectItem value="to top">Acima</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                       </div>
                       {/* Seletores de Cor para o Gradiente */}
                       <div className="space-y-2">
                           <Label>Cores</Label>
                           <div className="flex items-center gap-4">
                               {[0, 1].map((index) => (
                                   <div key={index} className="flex-1 space-y-1">
                                       <Label className="text-xs text-muted-foreground">Cor {index + 1}</Label>
                                       <div className="relative h-9 w-full rounded-md border overflow-hidden">
                                           <Input type="color" value={gradient.colors[index]} onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer" />
                                            <div className="w-full h-full" style={{ backgroundColor: gradient.colors[index] }} />
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                     </div>
                )}
            </div>
            
            <Separator />
            
            {/* Seção para os controles da Película de Cor (filtro). */}
             <div className="space-y-4">
                <Label className="flex items-center"><Film className="mr-2 h-4 w-4" /> Película de Cor</Label>
                {/* Controle para a Cor da Película. */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="film-color" className="text-xs text-muted-foreground">Cor da Película</Label>
                         <div className="relative h-7 w-10 rounded-md border overflow-hidden">
                            <Input
                                id="film-color"
                                type="color"
                                value={filmColor}
                                onChange={(e) => onFilmColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                            />
                             <div className="w-full h-full" style={{ backgroundColor: filmColor }} />
                        </div>
                    </div>
                </div>
                {/* Controle para a Opacidade da Película. */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="film-opacity" className="text-xs text-muted-foreground">Opacidade da Película</Label>
                        <span className="text-xs text-muted-foreground">{filmOpacity}%</span>
                    </div>
                    <Slider id="film-opacity" min={0} max={100} step={1} value={[filmOpacity]} onValueChange={(v) => onFilmOpacityChange(v[0])} />
                </div>
            </div>
        </div>
    );
}
