// Componente da barra de ferramentas inferior que gerencia os painéis deslizantes.

import { useState } from 'react';
import { Type, Palette, ImagePlus, Undo2, Download, Share2, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { PainelControlesProps } from "./tipos";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import { BotaoRecurso } from './botao-recurso';
import { useWindowSize } from 'react-use';


export function PainelControles(props: PainelControlesProps) {
    const { toast } = useToast();
    const [activePanel, setActivePanel] = useState<'text' | 'style' | 'background' | null>('text');
    const { width } = useWindowSize();
    const isDesktop = width >= 768; // Tailwind's md breakpoint

    const handleShare = async () => {
        const shareData = {
          title: "Frase de QuoteVid",
          text: `Confira esta frase que editei no QuoteVid:\n\n"${props.text}"`,
          url: window.location.href,
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
            toast({ title: "Conteúdo compartilhado com sucesso!" });
          } else {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: "Link copiado!",
              description: "A API de compartilhamento não está disponível neste navegador. O link foi copiado para a área de transferência.",
            });
          }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                toast({
                    variant: "destructive",
                    title: "Erro ao compartilhar",
                    description: "Não foi possível compartilhar o conteúdo.",
                });
            }
        }
    };
    
    const handlePanelChange = (panel: 'text' | 'style' | 'background' | null) => {
        if (isDesktop) {
            setActivePanel(panel);
        } else {
            // No mobile, se o painel já estiver ativo, não faz nada, 
            // se for diferente, abre o novo painel.
            if (activePanel !== panel) {
                setActivePanel(panel);
            }
        }
    };


    const renderPanelContent = () => {
        const commonProps = {
            onClose: () => setActivePanel(null),
        };
        
        switch (activePanel) {
            case 'text':
                return <PainelTexto {...props} />;
            case 'style':
                return <PainelEstilo {...props} {...commonProps} />;
            case 'background':
                 return <PainelFundo {...props} {...commonProps} />;
            default:
                // No desktop, renderiza um placeholder se nenhum painel estiver ativo
                if (isDesktop) {
                    return <div className="p-4 text-center text-muted-foreground">Selecione uma ferramenta para começar a editar.</div>;
                }
                return null;
        }
    }
    
    const getPanelTitle = () => {
        switch (activePanel) {
            case 'text': return "Editar Texto";
            case 'style': return "Editar Estilo";
            case 'background': return "Editar Fundo";
            default: return "";
        }
    }

    const mainToolbar = (
        <div className="flex h-24 items-center justify-around px-2 border-b">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange('text')} isActive={activePanel === 'text'} />
            <BotaoRecurso icon={Palette} label="Estilo" onClick={() => handlePanelChange('style')} isActive={activePanel === 'style'} />
            <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => handlePanelChange('background')} isActive={activePanel === 'background'}/>
        </div>
    );

    const actionToolbar = (
        <div className="flex gap-2 p-2 border-t">
            <Button className="flex-1"><Download className="mr-2 h-4 w-4" /> Baixar</Button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="secondary" size="icon" onClick={props.onUndo} disabled={!props.canUndo}>
                            <Undo2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Desfazer</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Button variant="secondary" className="flex-1" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
        </div>
    );


    // Layout para Desktop
    if (isDesktop) {
        return (
            <div className="flex flex-col h-full">
                {mainToolbar}
                <div className="flex-1 overflow-y-auto">
                    {renderPanelContent()}
                </div>
                {actionToolbar}
            </div>
        )
    }

    // Layout para Mobile com Sheet
    return (
        <Sheet open={!!activePanel} onOpenChange={(open) => !open && setActivePanel(null)}>
            <div className="w-full border-t bg-background flex flex-col fixed bottom-0 left-0 md:hidden">
                {mainToolbar}
                {actionToolbar}
            </div>

            <SheetContent 
                side="bottom" 
                className="h-auto max-h-[80vh] flex flex-col" 
                onInteractOutside={(e) => {
                    if (e.target instanceof HTMLElement && e.target.getAttribute('type') === 'color') {
                        e.preventDefault();
                    }
                }}
            >
                 <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center">
                         <Button variant="ghost" size="icon" className="mr-2" onClick={() => setActivePanel(null)}>
                             <ArrowLeft className="h-5 w-5" />
                         </Button>
                         {getPanelTitle()}
                    </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto flex-1">
                    {renderPanelContent()}
                </div>
            </SheetContent>
        </Sheet>
    );
}
