
"use client";

import { useState, useRef } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  RectangleHorizontal,
  Scaling,
  Paintbrush,
  RectangleVertical,
  Square,
  LayoutTemplate,
  UserCheck,
  ImageUp,
  ArrowLeft,
  Wand2,
  Type,
  CaseSensitive,
  Pipette,
  AlignLeft,
  Bold,
  MoveVertical,
  Baseline,
  Upload,
  Image as ImageIcon,
  Palette,
  Layers,
  Check,
  Edit,
  User,
  MoveHorizontal,
  ZoomIn,
  AtSign,
} from "lucide-react";
import { BotaoRecurso } from "../../botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/hooks/use-profile";


const aspectRatios = [
  { label: "Story", value: "9 / 16", icon: RectangleVertical },
  { label: "Quadrado", value: "1 / 1", icon: Square },
  { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

interface MobileToolbarProps {
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
  profile: ProfileData;
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
}

type ActivePanel = "texto" | "proporcao" | "escala" | "cores" | "fundo" | "assinatura" | "logo" | "estilo" | null;
type TipoFundoAtivo = 'media' | 'solid' | 'gradient';

function ControleTipoFundo({ bgColor, setBgColor }: { bgColor: string, setBgColor: (color: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<TipoFundoAtivo>('solid');
    
    // Simulating state for gradient, as we don't have full state persistence here yet
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
            // In a real scenario, this would update a different state for media background
            toast({ title: "Carregado!", description: "Mídia carregada (efeito visual não aplicado nesta tela)." });
        };
        reader.readAsDataURL(file);
    };

    const handleSolidColorChange = (color: string) => {
        setBgColor(color);
    };

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
                 <div className="space-y-1">
                    <Label htmlFor="bg-color-mobile">Cor de Fundo</Label>
                    <input id="bg-color-mobile" type="color" value={bgColor} onChange={(e) => handleSolidColorChange(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" />
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
                            <Label htmlFor="gradient-direction-mobile">Direção</Label>
                            <Select value={gradient.direction} onValueChange={(dir) => setGradient(g => ({...g, direction: dir}))}>
                                <SelectTrigger id="gradient-direction-mobile"><SelectValue /></SelectTrigger>
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
                        <Label>Cores</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {[0, 1].map((index) => (
                                <input key={index} type="color" value={gradient.colors[index]} onChange={(e) => {
                                    const newColors = [...gradient.colors];
                                    newColors[index] = e.target.value;
                                    setGradient(g => ({...g, colors: newColors as [string, string]}));
                                }} className="w-full h-10 rounded-md border cursor-pointer" />
                            ))}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    )
}

function ControleAssinatura(props: Omit<MobileToolbarProps, 'aspectRatio' | 'setAspectRatio' | 'scale' | 'setScale' | 'bgColor' | 'setBgColor' | 'fgColor' | 'setFgColor' | 'activeControl' | 'setActiveControl' | 'text' | 'setText'>) {
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
                            <Label htmlFor="signature-position-x-mobile" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionX}%</span>
                        </div>
                        <Slider id="signature-position-x-mobile" min={0} max={100} step={1} value={[signaturePositionX]} onValueChange={(value) => onSignaturePositionXChange(value[0])}/>
                    </div>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-y-mobile" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionY}%</span>
                        </div>
                        <Slider id="signature-position-y-mobile" min={0} max={100} step={1} value={[signaturePositionY]} onValueChange={(value) => onSignaturePositionYChange(value[0])}/>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-scale-mobile" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{signatureScale}%</span>
                        </div>
                        <Slider id="signature-scale-mobile" min={50} max={150} step={1} value={[signatureScale]} onValueChange={(value) => onSignatureScaleChange(value[0])}/>
                    </div>
                </div>
            )}
        </div>
     )
}


export function MobileToolbar({
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
  ...signatureProps
}: MobileToolbarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [activeSubControl, setActiveSubControl] = useState<string | null>(null);

  const handlePanelChange = (panel: ActivePanel) => {
    setActivePanel(panel);
    setActiveControl(panel);
    setActiveSubControl(null); // Reset sub-controls when main panel changes
  };

  const renderPanelContent = () => {
    if (!activePanel) return null;

    const panels: Record<string, JSX.Element | null> = {
      texto: (
          <div className="p-4 flex-1 flex flex-col">
              <Label htmlFor="text-input-mobile" className="sr-only">Texto da Frase</Label>
              <TextareaAutosize
                  id="text-input-mobile"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  minRows={6}
                  placeholder="Digite sua frase aqui..."
                  className={cn(
                      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                      ''
                  )}
              />
          </div>
      ),
      proporcao: (
        <div className="space-y-2 p-4">
          <Label>Proporção da Tela</Label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatios.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={aspectRatio === value ? "secondary" : "outline"}
                onClick={() => setAspectRatio(value)}
                className="flex flex-col h-16 gap-1"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      ),
      escala: (
        <div className="space-y-2 p-4">
          <div className="flex justify-between items-center">
            <Label>Escala do Canvas</Label>
            <span className="text-sm font-mono">{Math.round(scale * 100)}%</span>
          </div>
          <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={0.5} max={2} step={0.01} />
        </div>
      ),
      cores: (
        <div className="space-y-4 p-4">
          <Label>Cores</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bg-color-mobile">Fundo</Label>
              <input id="bg-color-mobile" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fg-color-mobile">Primeiro Plano</Label>
              <input id="fg-color-mobile" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-md border cursor-pointer" />
            </div>
          </div>
        </div>
      ),
      estilo: (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {!activeSubControl && <p className="text-muted-foreground text-center p-4">Selecione uma opção abaixo para editar.</p>}
                 {activeSubControl && <div className="p-4"><p className="text-center text-muted-foreground">Controles para '{activeSubControl}' aqui.</p></div>}
            </div>
             <div className="w-full whitespace-nowrap border-t">
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
      ),
      fundo: <div className="p-4"><ControleTipoFundo bgColor={bgColor} setBgColor={setBgColor} /></div>,
      assinatura: <div className="p-4"><ControleAssinatura {...signatureProps} /></div>,
      logo: <div className="p-4"><p className="text-center text-muted-foreground">Controles de Logo aqui.</p></div>,
    };

    return panels[activePanel];
  };

  const getPanelTitle = () => {
    const titles: Record<string, string> = {
      texto: "Editar Texto",
      proporcao: "Editar Proporção",
      escala: "Editar Escala",
      cores: "Editar Cores",
      estilo: "Editar Estilo",
      fundo: "Editar Fundo",
      assinatura: "Editar Assinatura",
      logo: "Editar Logo",
    };
    return titles[activePanel || ''] || '';
  };

  const mainToolbar = (
     <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex h-16 items-center justify-start gap-1 px-2 border-t bg-background">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange("texto")} isActive={activePanel === "texto"} />
            <BotaoRecurso icon={RectangleHorizontal} label="Proporção" onClick={() => handlePanelChange("proporcao")} isActive={activePanel === "proporcao"} />
            <BotaoRecurso icon={Scaling} label="Escala" onClick={() => handlePanelChange("escala")} isActive={activePanel === "escala"} />
            <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handlePanelChange("cores")} isActive={activePanel === "cores"} />
            <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handlePanelChange("estilo")} isActive={activePanel === "estilo"} />
            <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handlePanelChange("fundo")} isActive={activePanel === "fundo"} />
            <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handlePanelChange("assinatura")} isActive={activePanel === "assinatura"} />
            <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handlePanelChange("logo")} isActive={activePanel === "logo"} />
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t">
        {mainToolbar}
      </div>

      <Sheet open={!!activePanel} onOpenChange={(open) => { if (!open) { setActivePanel(null); setActiveControl(null); }}}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col">
          <SheetHeader className="mb-2">
            <SheetTitle className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => { setActivePanel(null); setActiveControl(null); }}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {getPanelTitle()}
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto flex-1 p-0">
            {renderPanelContent()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

    