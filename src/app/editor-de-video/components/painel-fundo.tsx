

// Componente para a aba "Fundo", permitindo o upload de imagem/vídeo ou seleção de cores/gradientes.

import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Palette, Layers, Redo, UserCheck, MoveVertical, MoveHorizontal, CaseSensitive, AtSign, RectangleHorizontal, Check, Edit, Edit2, LayoutTemplate, RectangleVertical, Square, ZoomIn, ImageUp, BadgePercent, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PainelFundoProps, ProporcaoTela } from './tipos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { templates } from '@/lib/dados';
import { Slider } from '@/components/ui/slider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BotaoRecurso } from './botao-recurso';
import { Separator } from '@/components/ui/separator';

const proporcoes: { ratio: ProporcaoTela; icon: React.ElementType }[] = [
    { ratio: "9:16", icon: RectangleVertical },
    { ratio: "1:1", icon: Square },
    { ratio: "16:9", icon: RectangleHorizontal },
];

type ControleAtivo = 'proporcao' | 'tipo' | 'assinatura' | 'logo' | null;
type TipoFundoAtivo = 'media' | 'solid' | 'gradient';


function ControleProporcao({ aspectRatio, onAspectRatioChange }: { aspectRatio: ProporcaoTela, onAspectRatioChange: (ratio: ProporcaoTela) => void }) {
    return (
        <div className="space-y-2">
            <Label>Proporção da Tela</Label>
            <div className="grid grid-cols-3 gap-2">
                {proporcoes.map(({ ratio, icon: Icon }) => (
                    <Button
                        key={ratio}
                        variant={aspectRatio === ratio ? "secondary" : "ghost"}
                        onClick={() => onAspectRatioChange(ratio)}
                        className="flex flex-col h-16"
                    >
                        <Icon className="h-6 w-6 mb-1"/>
                        <span className="text-xs">{ratio}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}


function ControleTipoFundo(props: {
    backgroundStyle: PainelFundoProps['backgroundStyle'],
    onBackgroundStyleChange: PainelFundoProps['onBackgroundStyleChange']
}) {
    const { backgroundStyle, onBackgroundStyleChange } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

     const { activeTab, solidColor, gradient } = useMemo(() => {
        const activeTab: TipoFundoAtivo = backgroundStyle.type === 'media' ? 'media' : backgroundStyle.type === 'solid' ? 'solid' : 'gradient';
        let solidColor = '#A06CD5';
        let gradient = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };

        if (activeTab === 'solid') {
            solidColor = backgroundStyle.value;
        } else if (activeTab === 'gradient' && backgroundStyle.value) {
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
                    colors = [parts[0], parts[1]] as [string, string];
                }
                gradient = { type, colors, direction };
            } catch {
                // fallback
            }
        }
        return { activeTab, solidColor, gradient };
    }, [backgroundStyle]);

    const handleTabChange = (tab: TipoFundoAtivo) => {
         let newStyle;
        if (tab === 'solid') {
            newStyle = { type: 'solid' as const, value: solidColor };
        } else if (tab === 'gradient') {
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : 'circle, '}${gradient.colors[0]}, ${gradient.colors[1]})`;
            newStyle = { type: 'gradient' as const, value: gradValue };
        } else {
            const mediaValue = templates.find(t => t.id === 1)?.imageUrl ?? '';
            newStyle = { type: 'media' as const, value: mediaValue };
        }
        onBackgroundStyleChange(newStyle);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({ variant: "destructive", title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem ou vídeo." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => onBackgroundStyleChange({ type: 'media', value: e.target?.result as string });
        reader.onerror = () => toast({ variant: "destructive", title: "Erro ao Carregar", description: "Houve um problema ao ler o arquivo selecionado."});
        reader.readAsDataURL(file);
    };
    
    const handleSolidColorChange = (color: string) => onBackgroundStyleChange({ type: 'solid', value: color });
    
    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : 'circle, '}${grad.colors[0]}, ${grad.colors[1]})`;
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
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <Button variant={activeTab === 'media' ? "secondary" : "ghost"} onClick={() => handleTabChange('media')}><ImageIcon className="mr-2 h-4 w-4" /> Mídia</Button>
                <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => handleTabChange('solid')}><Palette className="mr-2 h-4 w-4" /> Cor</Button>
                <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => handleTabChange('gradient')}><Layers className="mr-2 h-4 w-4" /> Gradiente</Button>
            </div>
            
            <Separator />

            {activeTab === 'media' && (
                <div className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" /> Carregar do Dispositivo</Button>
                </div>
            )}

            {activeTab === 'solid' && (
                <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <div className="flex items-center gap-2">
                        <Input type="text" value={solidColor} onChange={(e) => handleSolidColorChange(e.target.value)} className="w-full h-10"/>
                        <Popover><PopoverTrigger asChild><Button variant="outline" size="icon" style={{ backgroundColor: solidColor }} className="h-10 w-10 border-2" /></PopoverTrigger><PopoverContent className="w-auto p-0 border-none"><input type="color" value={solidColor} onChange={e => handleSolidColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" /></PopoverContent></Popover>
                    </div>
                </div>
            )}
            
            {activeTab === 'gradient' && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('linear')}>
                                Linear
                            </Button>
                            <Button variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('radial')}>
                                Radial
                            </Button>
                        </div>
                    </div>

                    {gradient.type === 'linear' && (
                        <div className="space-y-2">
                            <Label htmlFor="gradient-direction">Direção</Label>
                            <Select value={gradient.direction} onValueChange={handleGradientDirectionChange}>
                                <SelectTrigger id="gradient-direction">
                                    <SelectValue placeholder="Selecione a direção" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="to right">Para Direita</SelectItem>
                                    <SelectItem value="to left">Para Esquerda</SelectItem>
                                    <SelectItem value="to bottom">Para Baixo</SelectItem>
                                    <SelectItem value="to top">Para Cima</SelectItem>
                                    <SelectItem value="to bottom right">Diagonal (↓→)</SelectItem>
                                    <SelectItem value="to top left">Diagonal (↑←)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Cores do Gradiente</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {[0, 1].map((index) => (
                                <Popover key={index}>
                                    <PopoverTrigger asChild>
                                        <div className="w-full h-10 rounded-md border-2" style={{ backgroundColor: gradient.colors[index as 0 | 1] }} />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-none">
                                        <input
                                            type="color"
                                            value={gradient.colors[index as 0 | 1]}
                                            onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)}
                                            className="w-16 h-16 cursor-pointer"
                                        />
                                    </PopoverContent>
                                </Popover>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


function ControleAssinatura(props: Omit<PainelFundoProps, 'backgroundStyle' | 'onBackgroundStyleChange' | 'aspectRatio' | 'onAspectRatioChange' | 'showLogo' | 'onShowLogoChange' | 'logoPositionX' | 'onLogoPositionXChange' | 'logoPositionY' | 'onLogoPositionYChange' | 'logoScale' | 'onLogoScaleChange' | 'logoOpacity' | 'onLogoOpacityChange' >) {
    const { 
        showProfileSignature, onShowProfileSignatureChange,
        signaturePositionX, onSignaturePositionXChange,
        signaturePositionY, onSignaturePositionYChange,
        signatureScale, onSignatureScaleChange,
        showSignaturePhoto, onShowSignaturePhotoChange,
        showSignatureUsername, onShowSignatureUsernameChange,
        showSignatureSocial, onShowSignatureSocialChange,
        profile,
    } = props;
    
    const isProfileConfigured = profile.username && profile.username !== 'Seu Nome' && profile.social && profile.social !== '@seuusario';

     return (
        <div className="space-y-4">
            <Button 
                variant={showProfileSignature ? 'secondary' : 'outline'} 
                onClick={() => onShowProfileSignatureChange(!showProfileSignature)}
                className="w-full"
            >
                {showProfileSignature ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showProfileSignature ? 'Assinatura Ativada' : 'Ativar Assinatura'}
            </Button>
            
            {!isProfileConfigured && !showProfileSignature && (
                <Link href="/perfil" passHref>
                    <Button variant="link" className="w-full text-center">
                        <User className="mr-2 h-4 w-4" />
                        Configurar Assinatura no Perfil
                    </Button>
                </Link>
            )}

            {showProfileSignature && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <Label>Elementos Visíveis</Label>
                    <div className="grid grid-cols-3 gap-2">
                         <Button size="sm" variant={showSignaturePhoto ? 'secondary' : 'outline'} onClick={() => onShowSignaturePhotoChange(!showSignaturePhoto)}>
                             <ImageIcon className="mr-2 h-4 w-4" /> Foto
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
                        <Slider id="signature-position-x" min={0} max={100} step={1} value={[signaturePositionX]} onValueChange={(value) => onSignaturePositionXChange(value[0])}/>
                    </div>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionY}%</span>
                        </div>
                        <Slider id="signature-position-y" min={0} max={100} step={1} value={[signaturePositionY]} onValueChange={(value) => onSignaturePositionYChange(value[0])}/>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-scale" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{signatureScale}%</span>
                        </div>
                        <Slider id="signature-scale" min={50} max={150} step={1} value={[signatureScale]} onValueChange={(value) => onSignatureScaleChange(value[0])}/>
                    </div>
                </div>
            )}
        </div>
     )
}

function ControleLogo(props: Pick<PainelFundoProps, 'showLogo' | 'onShowLogoChange' | 'logoPositionX' | 'onLogoPositionXChange' | 'logoPositionY' | 'onLogoPositionYChange' | 'logoScale' | 'onLogoScaleChange' | 'logoOpacity' | 'onLogoOpacityChange' | 'profile'>) {
    const {
        showLogo, onShowLogoChange,
        logoPositionX, onLogoPositionXChange,
        logoPositionY, onLogoPositionYChange,
        logoScale, onLogoScaleChange,
        logoOpacity, onLogoOpacityChange,
        profile
    } = props;
    
    const isLogoConfigured = !!profile.logo;

    return (
        <div className="space-y-4">
            <Button
                variant={showLogo ? 'secondary' : 'outline'}
                onClick={() => onShowLogoChange(!showLogo)}
                className="w-full"
            >
                {showLogo ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showLogo ? 'Logomarca Ativada' : 'Ativar Logomarca'}
            </Button>
            
             {!isLogoConfigured && !showLogo && (
                <Link href="/perfil" passHref>
                    <Button variant="link" className="w-full text-center">
                        <ImageUp className="mr-2 h-4 w-4" />
                        Adicionar Logomarca no Perfil
                    </Button>
                </Link>
            )}

            {showLogo && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-x" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionX}%</span>
                        </div>
                        <Slider id="logo-position-x" min={0} max={100} step={1} value={[logoPositionX]} onValueChange={(v) => onLogoPositionXChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionY}%</span>
                        </div>
                        <Slider id="logo-position-y" min={0} max={100} step={1} value={[logoPositionY]} onValueChange={(v) => onLogoPositionYChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-scale" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{logoScale}%</span>
                        </div>
                        <Slider id="logo-scale" min={10} max={200} step={1} value={[logoScale]} onValueChange={(v) => onLogoScaleChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-opacity" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade</Label>
                            <span className="text-xs text-muted-foreground">{logoOpacity}%</span>
                        </div>
                        <Slider id="logo-opacity" min={0} max={100} step={1} value={[logoOpacity]} onValueChange={(v) => onLogoOpacityChange(v[0])} />
                    </div>
                </div>
            )}
        </div>
    )
}


export function PainelFundo(props: PainelFundoProps & { onClose: () => void }) {
    const [controleAtivo, setControleAtivo] = useState<ControleAtivo>(null);

    const renderControle = () => {
        if (!controleAtivo) return null;

        switch(controleAtivo) {
            case 'proporcao':
                return <ControleProporcao aspectRatio={props.aspectRatio} onAspectRatioChange={props.onAspectRatioChange} />
            case 'tipo':
                return <ControleTipoFundo backgroundStyle={props.backgroundStyle} onBackgroundStyleChange={props.onBackgroundStyleChange} />
            case 'assinatura':
                return <ControleAssinatura {...props} />
             case 'logo':
                return <ControleLogo {...props} />
            default:
                return null;
        }
    }

    const subMenu = (
        <ScrollArea className="w-full whitespace-nowrap border-t">
            <div className="flex h-16 items-center justify-center">
                <BotaoRecurso icon={RectangleHorizontal} label="Proporção" onClick={() => setControleAtivo('proporcao')} isActive={controleAtivo === 'proporcao'}/>
                <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => setControleAtivo('tipo')} isActive={controleAtivo === 'tipo'}/>
                <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => setControleAtivo('assinatura')} isActive={controleAtivo === 'assinatura'}/>
                 <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => setControleAtivo('logo')} isActive={controleAtivo === 'logo'}/>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
                {renderControle()}
                {!controleAtivo && <p className="text-muted-foreground text-center pt-8">Selecione uma opção abaixo para editar.</p>}
            </div>
            {subMenu}
        </div>
    );
}
