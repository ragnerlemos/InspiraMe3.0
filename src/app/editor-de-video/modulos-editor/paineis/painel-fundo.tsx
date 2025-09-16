// Componente para a aba "Fundo", permitindo o upload de imagem/vídeo ou seleção de cores/gradientes.

import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Palette, Layers, Redo, UserCheck, MoveVertical, MoveHorizontal, CaseSensitive, AtSign, RectangleHorizontal, Check, Edit, Edit2, LayoutTemplate, RectangleVertical, Square, ZoomIn, ImageUp, BadgePercent, User, X, Film, Box, Pipette, Pilcrow } from 'lucide-react';
import type { PainelFundoProps, ProporcaoTela } from '../tipos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { templates } from '@/lib/dados';
import { Slider } from '@/components/ui/slider';
import { BotaoRecurso } from '../botao-recurso';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IconeGradiente } from '../icone-gradiente';

function ControleProporcao({ aspectRatio, onAspectRatioChange }: { aspectRatio: ProporcaoTela, onAspectRatioChange: (ratio: ProporcaoTela) => void }) {
    const proportions: { ratio: ProporcaoTela; icon: React.ElementType; label: string }[] = [
        { ratio: '9 / 16', icon: RectangleVertical, label: 'Story' },
        { ratio: '1 / 1', icon: Square, label: 'Quadrado' },
        { ratio: '16 / 9', icon: RectangleHorizontal, label: 'Vídeo' },
    ];
    return (
        <div className="space-y-2">
            <Label>Proporção da Tela</Label>
            <div className="grid grid-cols-3 gap-2">
                {proportions.map(({ ratio, icon: Icon, label }) => (
                     <Button
                        key={ratio}
                        variant={aspectRatio === ratio ? 'secondary' : 'outline'}
                        onClick={() => onAspectRatioChange(ratio)}
                        className="flex flex-col h-16 gap-1"
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{label} ({ratio.replace(/ /g, '')})</span>
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

    return (
        <div className="space-y-4">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
             <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" /> Carregar do Dispositivo</Button>
              <Link href="/galeria?fromEditor=true" passHref>
                 <Button className="w-full" variant="outline">
                     <ImageIcon className="mr-2 h-4 w-4" />
                     Carregar da Galeria
                 </Button>
             </Link>
        </div>
    )
}

type ControleAtivo = 'proporcao' | 'tipo' | 'assinatura' | 'logo' | null;

function ControleAssinatura(props: Omit<PainelFundoProps, 'backgroundStyle' | 'onBackgroundStyleChange' | 'aspectRatio' | 'onAspectRatioChange' | 'showLogo' | 'onShowLogoChange' | 'logoPositionX' | 'onLogoPositionXChange' | 'logoPositionY' | 'onLogoPositionYChange' | 'logoScale' | 'onLogoScaleChange' | 'logoOpacity' | 'onLogoOpacityChange' | 'filmColor' | 'onFilmColorChange' | 'filmOpacity' | 'onFilmOpacityChange' > & { onClose: () => void }) {
    const { 
        showProfileSignature, onShowProfileSignatureChange,
        signaturePositionX, onSignaturePositionXChange,
        signaturePositionY, onSignaturePositionYChange,
        signatureScale, onSignatureScaleChange,
        showSignaturePhoto, onShowSignaturePhotoChange,
        showSignatureUsername, onShowSignatureUsernameChange,
        showSignatureSocial, onShowSignatureSocialChange,
        showSignatureBackground, onShowSignatureBackgroundChange,
        signatureBgColor, onSignatureBgColorChange,
        signatureBgOpacity, onSignatureBgOpacityChange,
        profile,
        onClose,
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
                    <Button variant="link" className="w-full text-center" onClick={onClose}>
                        <User className="mr-2 h-4 w-4" />
                        Configurar Assinatura no Perfil
                    </Button>
                </Link>
            )}

            {showProfileSignature && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <Label>Elementos Visíveis</Label>
                    <div className="grid grid-cols-4 gap-2">
                         <Button size="sm" variant={showSignaturePhoto ? 'secondary' : 'outline'} onClick={() => onShowSignaturePhotoChange(!showSignaturePhoto)}>
                             <ImageIcon className="mr-2 h-4 w-4" /> Foto
                        </Button>
                         <Button size="sm" variant={showSignatureUsername ? 'secondary' : 'outline'} onClick={() => onShowSignatureUsernameChange(!showSignatureUsername)}>
                            <CaseSensitive className="mr-2 h-4 w-4" /> Nome
                        </Button>
                         <Button size="sm" variant={showSignatureSocial ? 'secondary' : 'outline'} onClick={() => onShowSignatureSocialChange(!showSignatureSocial)}>
                            <AtSign className="mr-2 h-4 w-4" /> Social
                        </Button>
                        <Button size="sm" variant={showSignatureBackground ? 'secondary' : 'outline'} onClick={() => onShowSignatureBackgroundChange(!showSignatureBackground)}>
                            <Box className="mr-2 h-4 w-4" /> Fundo
                        </Button>
                    </div>

                    {showSignatureBackground && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs flex items-center"><Pipette className="mr-2 h-3 w-3" />Cor do Fundo</Label>
                                    <Input
                                        type="color"
                                        value={signatureBgColor}
                                        onChange={(e) => onSignatureBgColorChange(e.target.value)}
                                        className="h-6 w-10 p-0 border-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="signature-bg-opacity" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade do Fundo</Label>
                                    <span className="text-xs text-muted-foreground">{signatureBgOpacity}%</span>
                                </div>
                                <Slider id="signature-bg-opacity" min={0} max={100} step={1} value={[signatureBgOpacity]} onValueChange={(v) => onSignatureBgOpacityChange(v[0])}/>
                            </div>
                        </div>
                    )}


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

function ControleLogo(props: Pick<PainelFundoProps, 'showLogo' | 'onShowLogoChange' | 'logoPositionX' | 'onLogoPositionXChange' | 'logoPositionY' | 'onLogoPositionYChange' | 'logoScale' | 'onLogoScaleChange' | 'logoOpacity' | 'onLogoOpacityChange' | 'profile'> & { onClose: () => void }) {
    const {
        showLogo, onShowLogoChange,
        logoPositionX, onLogoPositionXChange,
        logoPositionY, onLogoPositionYChange,
        logoScale, onLogoScaleChange,
        logoOpacity, onLogoOpacityChange,
        profile,
        onClose,
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
                    <Button variant="link" className="w-full text-center" onClick={onClose}>
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
                            <Label htmlFor="logo-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>                            <span className="text-xs text-muted-foreground">{logoPositionY}%</span>
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
    const [controleAtivo, setControleAtivo] = useState<ControleAtivo>('proporcao');

    const handleSetControleAtivo = (controle: ControleAtivo) => {
        setControleAtivo(prev => prev === controle ? null : controle);
    }
    
    const renderControle = () => {
        if (!controleAtivo) return <p className="text-muted-foreground text-center p-4">Selecione uma opção ao lado.</p>;

        const Content = () => {
            switch(controleAtivo) {
                case 'proporcao':
                    return <ControleProporcao aspectRatio={props.aspectRatio} onAspectRatioChange={props.onAspectRatioChange} />
                case 'tipo':
                    return <ControleTipoFundo 
                                backgroundStyle={props.backgroundStyle} 
                                onBackgroundStyleChange={props.onBackgroundStyleChange}
                            />
                case 'assinatura':
                    return <ControleAssinatura {...props} />
                 case 'logo':
                    return <ControleLogo {...props} />
                default:
                    return null;
            }
        }
        
        return (
            <div className="w-full p-4">
                 <Content />
            </div>
        )
    }

    const subMenu = (
        <div className="flex h-full flex-col items-center gap-1 border-r bg-background/90 backdrop-blur-sm p-2">
            <BotaoRecurso icon={RectangleHorizontal} label="Proporção" onClick={() => handleSetControleAtivo('proporcao')} isActive={controleAtivo === 'proporcao'}/>
            <BotaoRecurso icon={ImageIcon} label="Mídia" onClick={() => handleSetControleAtivo('tipo')} isActive={controleAtivo === 'tipo'}/>
            <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handleSetControleAtivo('assinatura')} isActive={controleAtivo === 'assinatura'}/>
             <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handleSetControleAtivo('logo')} isActive={controleAtivo === 'logo'}/>
        </div>
    );

    return (
       <div className="w-full h-full flex flex-row">
            {subMenu}
            <div className="flex-1 overflow-y-auto">
                 {renderControle()}
            </div>
       </div>
    );
}
