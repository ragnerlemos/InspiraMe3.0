// Componente que agrupa os painéis de controle para customização do vídeo/imagem.
// Ele usa um sistema de abas para organizar as opções de "Texto" e "Estilo".

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Palette, Download, Share2, ImagePlus, Undo2 } from "lucide-react";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import type { PainelControlesProps } from "./tipos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";


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
    
    return (
        <Card className="w-full max-w-lg sticky-top">
             <div className="p-2">
                <Tabs defaultValue="texto" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="texto"><Type className="mr-1 h-4 w-4" /> Texto</TabsTrigger>
                        <TabsTrigger value="estilo"><Palette className="mr-1 h-4 w-4" /> Estilo</TabsTrigger>
                        <TabsTrigger value="fundo"><ImagePlus className="mr-1 h-4 w-4" /> Fundo</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-22rem)] w-full">
                        <CardContent>
                            <TabsContent value="texto" className="pt-4">
                                <PainelTexto
                                    text={props.text}
                                    onTextChange={props.onTextChange}
                                />
                            </TabsContent>
                            <TabsContent value="estilo" className="pt-4">
                                <PainelEstilo {...props} />
                            </TabsContent>
                            <TabsContent value="fundo" className="pt-4">
                                <PainelFundo {...props} />
                            </TabsContent>
                        </CardContent>
                    </ScrollArea>
                </Tabs>
                <div className="flex gap-2 mt-2 px-2 pb-2">
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
        </Card>
    );
}
