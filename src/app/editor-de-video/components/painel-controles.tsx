
// Componente que agrupa os painéis de controle para customização do vídeo/imagem.
// Ele usa um sistema de abas para organizar as opções de "Texto" e "Estilo".

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Palette, Download, Share2, ImagePlus, Undo2 } from "lucide-react";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import type { PainelControlesProps } from "./tipos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BotaoRecurso } from "./botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function PainelControles(props: PainelControlesProps) {
    const { toast } = useToast();

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
            // Fallback para copiar o link
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
    
    const renderPainelTexto = () => (
        <>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><Type /> Opções de Texto</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                <PainelTexto
                    text={props.text}
                    onTextChange={props.onTextChange}
                />
            </div>
        </>
    );

     const renderPainelEstilo = () => (
        <>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><Palette /> Opções de Estilo</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full">
                <div className="space-y-6 p-4">
                    <PainelEstilo {...props} />
                </div>
            </ScrollArea>
        </>
    );

    const renderPainelFundo = () => (
         <>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><ImagePlus /> Opções de Fundo</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full">
                <div className="space-y-4 p-4">
                     <PainelFundo {...props} />
                </div>
            </ScrollArea>
        </>
    );

    return (
        <Card className="w-full max-w-4xl sticky bottom-4">
            <CardContent className="p-2">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <BotaoRecurso icon={Type} label="Texto" />
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[40vh]">
                                {renderPainelTexto()}
                            </SheetContent>
                        </Sheet>
                        
                        <Sheet>
                             <SheetTrigger asChild>
                                <BotaoRecurso icon={Palette} label="Estilo" />
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh]">
                                {renderPainelEstilo()}
                            </SheetContent>
                        </Sheet>
                        
                        <Sheet>
                             <SheetTrigger asChild>
                                <BotaoRecurso icon={ImagePlus} label="Fundo" />
                            </SheetTrigger>
                             <SheetContent side="bottom" className="h-[80vh]">
                                {renderPainelFundo()}
                            </SheetContent>
                        </Sheet>
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center">
                                    <Button variant="ghost" size="icon" onClick={props.onUndo} disabled={!props.canUndo} className="w-14 h-14">
                                        <Undo2 className="h-6 w-6" />
                                        <span className="sr-only">Desfazer</span>
                                    </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Desfazer</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                     <ScrollBar orientation="horizontal" />
                </ScrollArea>

                 <div className="flex gap-2 mt-2">
                    <Button className="flex-1"><Download className="mr-2 h-4 w-4" /> Baixar</Button>
                    <Button variant="secondary" className="flex-1" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                </div>
            </CardContent>
        </Card>
    );
}

