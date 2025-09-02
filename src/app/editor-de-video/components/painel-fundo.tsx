
// Componente para a aba "Fundo", permitindo o upload de imagem/vídeo ou seleção de cores/gradientes.

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Check, Palette, Layers, Redo } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PainelFundoProps, TipoFundo, EstiloFundo } from './tipos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Componente para a aba de Mídia (upload)
function PainelMidia({ onMediaUpload }: { onMediaUpload: (src: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({
                variant: "destructive",
                title: "Arquivo Inválido",
                description: "Por favor, selecione um arquivo de imagem ou vídeo.",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) onMediaUpload(result);
        };
        reader.onerror = () => {
             toast({
                variant: "destructive",
                title: "Erro ao Carregar",
                description: "Houve um problema ao ler o arquivo selecionado.",
            });
        }
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Carregar Imagem ou Vídeo
            </Button>
            <p className="text-xs text-muted-foreground text-center">
                Use uma mídia do seu dispositivo.
            </p>
        </div>
    );
}

// Componente para a aba de Cor Sólida
function PainelCorSolida({ color, onColorChange }: { color: string, onColorChange: (color: string) => void }) {
    return (
        <div className="space-y-2">
            <Label>Cor de Fundo</Label>
            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    value={color}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-full h-10"
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" style={{ backgroundColor: color }} className="h-10 w-10 border-2" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none">
                        <input type="color" value={color} onChange={e => onColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

// Componente para a aba de Gradiente
function PainelGradiente({
    gradient, 
    onGradientChange 
}: { 
    gradient: { type: 'linear' | 'radial', colors: [string, string], direction?: string }, 
    onGradientChange: (grad: { type: 'linear' | 'radial', colors: [string, string], direction?: string }) => void 
}) {
    
    const handleColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors] as [string, string];
        newColors[index] = color;
        onGradientChange({ ...gradient, colors: newColors });
    };

    const handleTypeChange = (type: 'linear' | 'radial') => {
        onGradientChange({ ...gradient, type });
    };

    const handleDirectionChange = (direction: string) => {
        onGradientChange({ ...gradient, direction });
    };

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-2">
                <Button variant={gradient.type === 'linear' ? 'secondary' : 'ghost'} onClick={() => handleTypeChange('linear')}>Linear</Button>
                <Button variant={gradient.type === 'radial' ? 'secondary' : 'ghost'} onClick={() => handleTypeChange('radial')}>Radial</Button>
            </div>
            <div className="space-y-2">
                <Label>Cores do Gradiente</Label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" style={{ backgroundColor: gradient.colors[0] }} className="h-8 w-8 border-2" />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none">
                                <input type="color" value={gradient.colors[0]} onChange={e => handleColorChange(0, e.target.value)} className="w-16 h-16 cursor-pointer" />
                            </PopoverContent>
                        </Popover>
                         <Input
                            type="text"
                            value={gradient.colors[0]}
                            onChange={(e) => handleColorChange(0, e.target.value)}
                            className="w-24 h-9"
                        />
                    </div>
                    <Redo className="text-muted-foreground" />
                     <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" style={{ backgroundColor: gradient.colors[1] }} className="h-8 w-8 border-2" />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none">
                                <input type="color" value={gradient.colors[1]} onChange={e => handleColorChange(1, e.target.value)} className="w-16 h-16 cursor-pointer" />
                            </PopoverContent>
                        </Popover>
                        <Input
                            type="text"
                            value={gradient.colors[1]}
                            onChange={(e) => handleColorChange(1, e.target.value)}
                            className="w-24 h-9"
                        />
                    </div>
                </div>
            </div>
           
            {gradient.type === 'linear' && (
                <div className="space-y-2">
                    <Label>Direção</Label>
                    <Select value={gradient.direction || 'to right'} onValueChange={handleDirectionChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="to right">Direita</SelectItem>
                            <SelectItem value="to left">Esquerda</SelectItem>
                            <SelectItem value="to top">Cima</SelectItem>
                            <SelectItem value="to bottom">Baixo</SelectItem>
                            <SelectItem value="to top right">Diagonal (Cima, Direita)</SelectItem>
                            <SelectItem value="to bottom left">Diagonal (Baixo, Esquerda)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}

// Componente principal do Painel de Fundo
export function PainelFundo({ backgroundStyle, onBackgroundStyleChange }: PainelFundoProps) {
    
    // Estados locais para os painéis de cor e gradiente
    const [solidColor, setSolidColor] = useState('#A06CD5');
    const [gradient, setGradient] = useState({
        type: 'linear' as 'linear' | 'radial',
        colors: ['#A06CD5', '#45B8AC'] as [string, string],
        direction: 'to right',
    });
     // Determina a aba ativa com base no estilo de fundo atual
    const activeTab = backgroundStyle.type;

    const handleTabChange = (tab: TipoFundo) => {
        if (tab === 'solid') {
             onBackgroundStyleChange({ type: 'solid', value: solidColor });
        } else if (tab === 'gradient') {
             const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : ''}${gradient.colors[0]}, ${gradient.colors[1]})`;
             onBackgroundStyleChange({ type: 'gradient', value: gradValue });
        }
        // Para 'media', a mudança é tratada diretamente no upload
    };

    const handleSolidColorChange = (color: string) => {
        setSolidColor(color);
        onBackgroundStyleChange({ type: 'solid', value: color });
    };

    const handleGradientChange = (grad: any) => {
        setGradient(grad);
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : ''}${grad.colors[0]}, ${grad.colors[1]})`;
        onBackgroundStyleChange({ type: 'gradient', value: gradValue });
    };

    const handleMediaUpload = (src: string) => {
        onBackgroundStyleChange({ type: 'media', value: src });
    }

    return (
        <div className="space-y-4">
             {/* Painel de seleção de tipo de fundo, estilizado como botões. */}
            <div className="grid grid-cols-3 gap-2">
                 <Button variant={activeTab === 'media' ? "secondary" : "ghost"} onClick={() => handleTabChange('media')}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Mídia
                </Button>
                <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => handleTabChange('solid')}>
                    <Palette className="mr-2 h-4 w-4" /> Cor
                </Button>
                <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => handleTabChange('gradient')}>
                    <Layers className="mr-2 h-4 w-4" /> Gradiente
                </Button>
            </div>
             {/* Renderiza o conteúdo correspondente à aba ativa. */}
            <div className='pt-4'>
                {activeTab === 'media' && <PainelMidia onMediaUpload={handleMediaUpload} />}
                {activeTab === 'solid' && <PainelCorSolida color={solidColor} onColorChange={handleSolidColorChange} />}
                {activeTab === 'gradient' && <PainelGradiente gradient={gradient} onGradientChange={handleGradientChange} />}
            </div>
        </div>
    );
}
