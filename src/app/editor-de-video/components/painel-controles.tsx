// Componente que agrupa os painéis de controle para customização do vídeo/imagem.
// Ele usa um sistema de abas para organizar as opções de "Texto" e "Estilo".

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Type, Palette, Download, Share2, ImagePlus } from "lucide-react";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import type { PainelControlesProps } from "./tipos";

export function PainelControles(props: PainelControlesProps) {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        Customizar
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
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
                                backgroundStyle={props.backgroundStyle}
                                onBackgroundStyleChange={props.onBackgroundStyleChange}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Botões de ação para baixar ou compartilhar a criação. */}
                    <div className="flex gap-2 mt-6">
                        <Button className="flex-1"><Download className="mr-2 h-4 w-4" /> Baixar</Button>
                        <Button variant="secondary" className="flex-1"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
