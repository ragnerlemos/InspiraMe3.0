

// Componente para a aba "Fundo", permitindo o upload de imagem/vídeo ou seleção de cores/gradientes.

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, ImageUp, Check, Edit, MoveHorizontal, MoveVertical, ZoomIn, BadgePercent } from 'lucide-react';
import type { PainelFundoProps } from './tipos';
import { BotaoRecurso } from './botao-recurso';
import { Slider } from '@/components/ui/slider';


function ControleTipoFundo(props: {
    backgroundStyle: PainelFundoProps['backgroundStyle'],
    onBackgroundStyleChange: PainelFundoProps['onBackgroundStyleChange'],
}) {
    const { onBackgroundStyleChange } = props;
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
             <Label>Mídia de Fundo</Label>
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

type ControleAtivo = 'tipo' | 'logo' | null;


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
    const [controleAtivo, setControleAtivo] = useState<ControleAtivo>('tipo');

    const handleSetControleAtivo = (controle: ControleAtivo) => {
        setControleAtivo(prev => prev === controle ? null : controle);
    }
    
    const renderControle = () => {
        if (!controleAtivo) return <p className="text-muted-foreground text-center p-4">Selecione uma opção.</p>;

        const Content = () => {
            switch(controleAtivo) {
                case 'tipo':
                    return <ControleTipoFundo 
                                backgroundStyle={props.backgroundStyle} 
                                onBackgroundStyleChange={props.onBackgroundStyleChange}
                            />
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
        <div className="grid grid-cols-2 gap-1 border-b">
            <BotaoRecurso icon={ImageIcon} label="Mídia" onClick={() => handleSetControleAtivo('tipo')} isActive={controleAtivo === 'tipo'}/>
             <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handleSetControleAtivo('logo')} isActive={controleAtivo === 'logo'}/>
        </div>
    );

    return (
       <div className="w-full h-full flex flex-col">
            {subMenu}
            <div className="flex-1 overflow-y-auto">
                 {renderControle()}
            </div>
       </div>
    );
}
