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


export function PainelControles(props: PainelControlesProps) {
    const { toast } = useToast();
    const [activeSheet, setActiveSheet] = useState<'text' | 'style' | 'background' | null>(null);

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

    const renderSheetContent = () => {
        const commonProps = {
            onClose: () => setActiveSheet(null),
        };
        
        switch (activeSheet) {
            case 'text':
                return <PainelTexto {...props} />;
            case 'style':
                return <PainelEstilo {...props} {...commonProps} />;
            case 'background':
                 return <PainelFundo {...props} {...commonProps} />;
            default:
                return null;
        }
    }
    
    const getSheetTitle = () => {
        switch (activeSheet) {
            case 'text': return "Editar Texto";
            case 'style': return "Editar Estilo";
            case 'background': return "Editar Fundo";
            default: return "";
        }
    }

    return (
        <Sheet open={!!activeSheet} onOpenChange={(open) => !open && setActiveSheet(null)}>
            <div className="w-full border-t bg-background flex flex-col fixed bottom-0 left-0">
                {/* Barra de Ferramentas Principal */}
                <div className="flex h-24 items-center justify-around px-2">
                    <BotaoRecurso icon={Type} label="Texto" onClick={() => setActiveSheet('text')} isActive={activeSheet === 'text'} />
                    <BotaoRecurso icon={Palette} label="Estilo" onClick={() => setActiveSheet('style')} isActive={activeSheet === 'style'} />
                    <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => setActiveSheet('background')} isActive={activeSheet === 'background'}/>
                </div>
                
                {/* Barra de Ações */}
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
            </div>

            <SheetContent side="bottom" className="h-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => {
                if(e.target instanceof HTMLInputElement && e.target.type === 'color') return;
                e.preventDefault()
            }}>
                 <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center">
                         <Button variant="ghost" size="icon" className="mr-2" onClick={() => setActiveSheet(null)}>
                             <ArrowLeft className="h-5 w-5" />
                         </Button>
                         {getSheetTitle()}
                    </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto flex-1">
                    {renderSheetContent()}
                </div>
            </SheetContent>
        </Sheet>
    );
}
