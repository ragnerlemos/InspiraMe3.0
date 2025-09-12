

"use client";

import { useState, useRef, ComponentType } from "react";
import Link from 'next/link';
import { Wand2, RectangleHorizontal, RectangleVertical, Square, LayoutTemplate, UserCheck, ImageUp, Paintbrush, Type, CaseSensitive, Pipette, AlignLeft, Bold, MoveVertical, Baseline, Upload, Image as ImageIcon, Palette, Layers, Check, Edit, User, MoveHorizontal, ZoomIn, AtSign, BadgePercent, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BotaoRecurso } from "../../botao-recurso";
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/hooks/use-profile";

const aspectRatios = [
    { label: "Story", value: "9 / 16", icon: RectangleVertical },
    { label: "Quadrado", value: "1 / 1", icon: Square },
    { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

type TipoFundoAtivo = 'media' | 'solid' | 'gradient';

interface ControleAssinaturaProps {
  showProfileSignature: boolean;
  onShowProfileSignatureChange: (show: boolean) => void;
  signaturePositionX: number;
  onSignaturePositionXChange: (x: number) => void;
  signaturePositionY: number;
  onSignaturePositionYChange: (y: number) => void;
  signatureScale: number;
  onSignatureScaleChange: (scale: number) => void;
  showSignaturePhoto: boolean;
  onShowSignaturePhotoChange: (show: boolean) => void;
  showSignatureUsername: boolean;
  onShowSignatureUsernameChange: (show: boolean) => void;
  showSignatureSocial: boolean;
  onShowSignatureSocialChange: (show: boolean) => void;
  profile: ProfileData;
}

interface ControleLogoProps {
    showLogo: boolean;
    onShowLogoChange: (show: boolean) => void;
    logoPositionX: number;
    onLogoPositionXChange: (x: number) => void;
    logoPositionY: number;
    onLogoPositionYChange: (y: number) => void;
    logoScale: number;
    onLogoScaleChange: (scale: number) => void;
    logoOpacity: number;
    onLogoOpacityChange: (opacity: number) => void;
    profile: ProfileData;
}

function ControleTipoFundo({ setBaseBgColor }: { setBaseBgColor: (color: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<TipoFundoAtivo>('solid');
    
    const [gradient, setGradient] = useState({
        type: 'linear' as 'linear' | 'radial',
        colors: ['#A06CD5', '#45B8AC'],
        direction: 'to right'
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({ variant: "destructive", title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem ou vídeo." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            toast({ title: "Carregado!", description: "Mídia carregada (efeito visual não aplicado nesta tela)." });
        };
        reader.readAsDataURL(file);
    };

    const handleSolidColorChange = (color: string) => {
        setBaseBgColor(color);
    };
    
    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors];
        newColors[index] = color;
        setGradient(g => ({...g, colors: newColors as [string, string]}));
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <Button variant={activeTab === 'media' ? "secondary" : "ghost"} onClick={() => setActiveTab('media')}><ImageIcon className="mr-2 h-4 w-4" /> Mídia</Button>
                <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => setActiveTab('solid')}><Palette className="mr-2 h-4 w-4" /> Cor</Button>
                <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => setActiveTab('gradient')}><Layers className="mr-2 h-4 w-4" /> Gradiente</Button>
            </div>
            
            <Separator />

            {activeTab === 'media' && (
                <div className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" /> Carregar do Dispositivo</Button>
                     <Link href="/galeria?fromEditor=true" passHref>
                        <Button className="w-full" variant="outline">
                            <ImageIcon className="mr-2 h-4 w-4" /> Carregar da Galeria
                        </Button>
                    </Link>
                </div>
            )}

            {activeTab === 'solid' && (
                <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <div className="flex items-center gap-2">
                        <Input type="text" value={"#ffffff"} onChange={(e) => handleSolidColorChange(e.target.value)} className="w-full h-10"/>
                         <div className="relative h-10 w-10">
                            <Input type="color" value={"#ffffff"} onChange={e => handleSolidColorChange(e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'gradient' && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => setGradient(g => ({...g, type: 'linear'}))}>Linear</Button>
                            <Button variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => setGradient(g => ({...g, type: 'radial'}))}>Radial</Button>
                        </div>
                    </div>

                    {gradient.type === 'linear' && (
                        <div className="space-y-2">
                            <Label htmlFor="gradient-direction">Direção</Label>
                            <Select value={gradient.direction} onValueChange={(dir) => setGradient(g => ({...g, direction: dir}))}>
                                <SelectTrigger id="gradient-direction">
                                    <SelectValue placeholder="Selecione a direção" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="to right">Para Direita</SelectItem>
                                    <SelectItem value="to left">Para Esquerda</SelectItem>
                                    <SelectItem value="to bottom">Para Baixo</SelectItem>
                                    <SelectItem value="to top">Para Cima</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Cores do Gradiente</Label>
                        <div className="grid grid-cols-1 gap-2">
                            {[0, 1].map((index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input type="text" value={gradient.colors[index as 0 | 1]} onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)} className="w-full h-10"/>
                                    <div className="relative h-10 w-10">
                                        <Input type="color" value={gradient.colors[index as 0 | 1]} onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ControleAssinatura(props: ControleAssinaturaProps) {
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

function ControleLogo(props: ControleLogoProps) {
    const {
        showLogo, onShowLogoChange,
        logoPositionX, onLogoPositionXChange,
        logoPositionY, onLogoPositionYChange,
        logoScale, onLogoScaleChange,
        logoOpacity, onLogoOpacityChange,
        profile,
    } = props;
    
    const isLogoConfigured = !!profile.logo;

    return (
        <div className="space-y-4">
            <Button
                variant={showLogo ? 'secondary' : 'outline'}
                onClick={() => onShowLogoChange(!showLogo)}
                className="w-full"
                disabled={!isLogoConfigured}
            >
                {showLogo ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showLogo ? 'Logomarca Ativada' : 'Ativar Logomarca'}
            </Button>
            
             {!isLogoConfigured && (
                <Link href="/perfil" passHref>
                    <Button variant="link" className="w-full text-center">
                        <ImageUp className="mr-2 h-4 w-4" />
                        Adicionar Logomarca no Perfil
                    </Button>
                </Link>
            )}

            {showLogo && isLogoConfigured && (
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

interface SidebarProps extends ControleAssinaturaProps, ControleLogoProps {
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    scale: number;
    setScale: (scale: number) => void;
    baseBgColor: string;
    setBaseBgColor: (color: string) => void;
    fgColor: string;
    setFgColor: (color: string) => void;
    filmColor: string;
    setFilmColor: (color: string) => void;
    filmOpacity: number;
    setFilmOpacity: (opacity: number) => void;
    activeControl: string | null;
    setActiveControl: (control: string | null) => void;
    text: string;
    setText: (text: string) => void;
    profile: ProfileData;
}

export function Sidebar({
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    baseBgColor,
    setBaseBgColor,
    fgColor,
    setFgColor,
    filmColor,
    setFilmColor,
    filmOpacity,
    setFilmOpacity,
    activeControl,
    setActiveControl,
    text,
    setText,
    ...props
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
                    <div className="p-2 flex-1 flex flex-col">
                        <Label htmlFor="text-input" className="sr-only">Texto da Frase</Label>
                        <TextareaAutosize
                            id="text-input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            minRows={6}
                            placeholder="Digite sua frase aqui..."
                            className={cn(
                                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                            )}
                        />
                    </div>
                );
            case 'canvas':
                return (
                    <div className="space-y-4 p-4">
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
                        <Separator />
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
                    </div>
                );
            case 'cores':
                 return (
                     <div className="space-y-4 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bg-color">Fundo</Label>
                                <Input id="bg-color" type="text" value={baseBgColor} onChange={(e) => setBaseBgColor(e.target.value)} className="h-10" />
                                <Input type="color" value={baseBgColor} onChange={e => setBaseBgColor(e.target.value)} className="h-10 w-full p-0 border-none cursor-pointer" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="fg-color">Primeiro Plano</Label>
                                <Input id="fg-color" type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10" />
                                <Input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-10 w-full p-0 border-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                 );
            case 'estilo':
                 return (
                     <div className="w-full flex-1 flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            {!activeSubControl && <p className="text-center text-muted-foreground text-sm">Selecione um controle de estilo abaixo.</p>}
                            {activeSubControl && <p className="text-center text-muted-foreground text-sm">Controles para '{activeSubControl}' aqui.</p>}
                        </div>
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
                return <div className="p-4"><ControleTipoFundo setBaseBgColor={setBaseBgColor} /></div>;
            case 'assinatura':
                return <div className="p-4"><ControleAssinatura {...props} /></div>;
            case 'logo':
                return <div className="p-4"><ControleLogo {...props} /></div>;
            default:
                return null;
        }
    }

    const mainToolbar = (
         <div className="flex h-16 items-center justify-around px-2 border-b">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handleSetControleAtivo('texto')} isActive={activeControl === 'texto'}/>
            <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => handleSetControleAtivo('canvas')} isActive={activeControl === 'canvas'}/>
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

            <div className="flex-1 overflow-y-auto flex flex-col">
                {renderActiveControl()}
            </div>

            {activeControl !== 'estilo' && elementsToolbar}

        </aside>
    );
}
