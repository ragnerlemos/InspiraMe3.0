

// Componente para a aba "Fundo", permitindo o upload de imagem/vídeo ou seleção de cores/gradientes.

import { useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Palette, Layers, Redo, RectangleHorizontal, UserCheck, MoveVertical, MoveHorizontal, Image as UserImage, CaseSensitive, AtSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PainelFundoProps, TipoFundo, ProporcaoTela } from './tipos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { templates } from '@/lib/dados';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

const proporcoes: ProporcaoTela[] = ["9:16", "1:1", "16:9"];

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

// Função para extrair dados de um gradiente a partir da string CSS
const parseGradient = (value: string) => {
    try {
        const type = value.startsWith('linear') ? 'linear' : 'radial';
        const parts = value.match(/\((.*)\)/)?.[1].split(', ');
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
            colors = [parts[0], parts[1]] as [string, string];
        }
        return { type, colors, direction };
    } catch {
        // Retorna um valor padrão seguro em caso de erro no parsing
        return { type: 'linear' as 'linear' | 'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };
    }
};

// Componente principal do Painel de Fundo
export function PainelFundo({ 
    backgroundStyle, onBackgroundStyleChange, 
    aspectRatio, onAspectRatioChange,
    showProfileSignature, onShowProfileSignatureChange,
    signaturePositionX, onSignaturePositionXChange,
    signaturePositionY, onSignaturePositionYChange,
    showSignaturePhoto, onShowSignaturePhotoChange,
    showSignatureUsername, onShowSignatureUsernameChange,
    showSignatureSocial, onShowSignatureSocialChange,
}: PainelFundoProps) {
    
    // Determina a aba ativa e os valores com base no estilo de fundo atual
    const { activeTab, solidColor, gradient } = useMemo(() => {
        const activeTab = backgroundStyle.type;
        let solidColor = '#A06CD5';
        let gradient = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string,string], direction: 'to right' };

        if (activeTab === 'solid') {
            solidColor = backgroundStyle.value;
        } else if (activeTab === 'gradient') {
            gradient = parseGradient(backgroundStyle.value);
        }
        return { activeTab, solidColor, gradient };
    }, [backgroundStyle]);

    // Função para mudar o TIPO de fundo (mídia, cor, gradiente)
    const handleTabChange = (tab: TipoFundo) => {
         let newStyle;
        if (tab === 'solid') {
            newStyle = { type: 'solid' as const, value: solidColor };
        } else if (tab === 'gradient') {
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : ''}${gradient.colors[0]}, ${gradient.colors[1]})`;
            newStyle = { type: 'gradient' as const, value: gradValue };
        } else {
            // Volta para a ultima midia selecionada ou para um padrão.
            const mediaValue = backgroundStyle.type === 'media' ? backgroundStyle.value : templates[0].imageUrl;
            newStyle = { type: 'media' as const, value: mediaValue };
        }
        onBackgroundStyleChange(newStyle);
    };

    // Funções que propagam as MUDANÇAS de valor para o componente pai
    const handleSolidColorChange = (color: string) => {
        onBackgroundStyleChange({ type: 'solid', value: color });
    };

    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction?: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' && grad.direction ? `${grad.direction}, ` : ''}${grad.colors[0]}, ${grad.colors[1]})`;
        onBackgroundStyleChange({ type: 'gradient', value: gradValue });
    };

    const handleMediaUpload = (src: string) => {
        onBackgroundStyleChange({ type: 'media', value: src });
    }

    return (
        <div className="space-y-4">
             {/* Controles de Proporção da Tela */}
            <div className="space-y-2">
                <Label className="flex items-center"><RectangleHorizontal className="mr-2 h-4 w-4" />Proporção da Tela</Label>
                <div className="grid grid-cols-3 gap-2">
                    {proporcoes.map((ar) => (
                        <Button
                            key={ar}
                            variant={aspectRatio === ar ? "secondary" : "ghost"}
                            onClick={() => onAspectRatioChange(ar)}
                        >
                            {ar}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator />
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

             <Separator />

             {/* Controle da Assinatura do Perfil */}
              <div className="space-y-4 rounded-lg border p-4">
                <Label className="flex items-center"><UserCheck className="mr-2 h-4 w-4" />Assinatura de Perfil</Label>
                 <Button 
                    variant={showProfileSignature ? 'secondary' : 'outline'} 
                    onClick={() => onShowProfileSignatureChange(!showProfileSignature)}
                    className="w-full"
                >
                    {showProfileSignature ? 'Ocultar' : 'Mostrar'} Assinatura
                </Button>
                
                {showProfileSignature && (
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-3 gap-2">
                             <Button size="sm" variant={showSignaturePhoto ? 'secondary' : 'outline'} onClick={() => onShowSignaturePhotoChange(!showSignaturePhoto)}>
                                 <UserImage className="mr-2 h-4 w-4" /> Foto
                            </Button>
                             <Button size="sm" variant={showSignatureUsername ? 'secondary' : 'outline'} onClick={() => onShowSignatureUsernameChange(!showSignatureUsername)}>
                                <CaseSensitive className="mr-2 h-4 w-4" /> Nome
                            </Button>
                             <Button size="sm" variant={showSignatureSocial ? 'secondary' : 'outline'} onClick={() => onShowSignatureSocialChange(!showSignatureSocial)}>
                                <AtSign className="mr-2 h-4 w-4" /> Social
                            </Button>
                        </div>
                         <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="signature-position-x" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                                <span className="text-xs text-muted-foreground">{signaturePositionX}%</span>
                            </div>
                            <Slider
                                id="signature-position-x"
                                min={0} max={100} step={1}
                                value={[signaturePositionX]}
                                onValueChange={(value) => onSignaturePositionXChange(value[0])}
                            />
                        </div>
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="signature-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                                <span className="text-xs text-muted-foreground">{signaturePositionY}%</span>
                            </div>
                            <Slider
                                id="signature-position-y"
                                min={0} max={100} step={1}
                                value={[signaturePositionY]}
                                onValueChange={(value) => onSignaturePositionYChange(value[0])}
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
