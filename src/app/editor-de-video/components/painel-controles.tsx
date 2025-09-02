// Componente que agrupa os painéis de controle para customização do vídeo/imagem.
// Ele usa um sistema de abas para organizar as opções de "Texto" e "Estilo".

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Type, Palette, Download, Share2, ImagePlus, Undo2, RectangleHorizontal } from "lucide-react";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import type { PainelControlesProps, ProporcaoTela } from "./tipos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const proporcoes: ProporcaoTela[] = ["9:16", "1:1", "16:9"];

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
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2 font-headline">
                        Customizar
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={props.onUndo} disabled={!props.canUndo}>
                                        <Undo2 className="h-5 w-5" />
                                        <span className="sr-only">Desfazer</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Desfazer</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* Controles de Proporção da Tela - Agora fora das abas */}
                    <div className="space-y-2 mb-4">
                        <Label className="flex items-center"><RectangleHorizontal className="mr-2 h-4 w-4" />Proporção da Tela</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {proporcoes.map((ar) => (
                                <Button
                                    key={ar}
                                    variant={props.aspectRatio === ar ? "secondary" : "ghost"}
                                    onClick={() => props.onAspectRatioChange(ar)}
                                >
                                    {ar}
                                </Button>
                            ))}
                        </div>
                    </div>


                    <Tabs defaultValue="text">
                        {/* Lista de abas para alternar entre os painéis de texto e estilo. */}
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="text"><Type className="mr-2 h-4 w-4" />Texto</TabsTrigger>
                            <TabsTrigger value="style"><Palette className="mr-2 h-4 w-4" />Estilo</TabsTrigger>
                            <TabsTrigger value="background"><ImagePlus className="mr-2 h-4 w-4" />Fundo</TabsTrigger>
                        </TabsList>

                        {/* Conteúdo da aba de Texto. */}
                        <TabsContent value="text" className="space-y-4 pt-4">
                            <PainelTexto
                                text={props.text}
                                onTextChange={props.onTextChange}
                            />
                        </TabsContent>
                        
                        {/* Conteúdo da aba de Estilo. */}
                        <TabsContent value="style" className="space-y-6 pt-4">
                            <PainelEstilo {...props} />
                        </TabsContent>

                        {/* Conteúdo da aba de Fundo. */}
                        <TabsContent value="background" className="space-y-4 pt-4">
                            <PainelFundo 
                                {...props}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Botões de ação para baixar ou compartilhar a criação. */}
                    <div className="flex gap-2 mt-6">
                        <Button className="flex-1"><Download className="mr-2 h-4 w-4" /> Baixar</Button>
                        <Button variant="secondary" className="flex-1" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
