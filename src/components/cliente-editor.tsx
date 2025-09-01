"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Download,
  Palette,
  Share2,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { quotes, templates } from "@/lib/dados";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Componente principal do cliente do editor de vídeo.
export function EditorClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Estados para gerenciar as propriedades do vídeo/imagem.
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textShadow, setTextShadow] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isReady, setIsReady] = useState(false); // Estado para controlar quando o editor está pronto.

  // Efeito para inicializar o editor com base nos parâmetros da URL.
  useEffect(() => {
    const quoteParam = searchParams.get("quote");
    const templateIdParam = searchParams.get("templateId");
    
    // Define o texto inicial a partir do parâmetro 'quote' ou de uma citação aleatória.
    if (quoteParam) {
      setText(decodeURIComponent(quoteParam));
    } else if (!templateIdParam) {
      // Se não houver citação ou modelo, usa a primeira citação como padrão.
      setText(quotes[0].text);
    }
    
    // Configura o editor com base em um modelo, se um 'templateId' for fornecido.
    if (templateIdParam) {
      const template = templates.find(t => t.id === parseInt(templateIdParam));
      if (template) {
        setBackgroundImage(template.imageUrl);
        setAspectRatio(template.aspectRatio);
        // Se não houver uma citação específica, escolhe uma aleatória.
        if (!quoteParam) setText(quotes[Math.floor(Math.random() * quotes.length)].text);
      }
    } else {
        // Configurações padrão se nenhum modelo for especificado.
        setBackgroundImage(templates[0].imageUrl);
        setAspectRatio("9:16");
    }
    // Marca o editor como pronto para ser renderizado.
    setIsReady(true);
  }, [searchParams]);

  // Mapeia proporções de tela para classes CSS do Tailwind.
  const aspectRatios = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
  };

  // Estilos CSS para o texto, aplicados dinamicamente.
  const textStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    textAlign: textAlign,
    textShadow: textShadow ? "2px 2px 8px rgba(0,0,0,0.8)" : "none",
    lineHeight: 1.3,
  };
  
  // Renderiza um esqueleto de carregamento enquanto o editor não está pronto.
  if (!isReady) {
     return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                    </div>
                    <Skeleton className="w-full max-w-2xl aspect-[9/16] rounded-lg" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="w-full h-[700px] rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
          {/* Controles para alterar a proporção da tela. */}
          <div className="flex gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-full border">
            {Object.keys(aspectRatios).map((ar) => (
              <Button
                key={ar}
                variant={aspectRatio === ar ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setAspectRatio(ar)}
              >
                {ar}
              </Button>
            ))}
          </div>
          {/* Visualização da imagem/vídeo. */}
          <div className={cn("relative w-full max-w-2xl bg-muted rounded-lg overflow-hidden shadow-2xl", aspectRatios[aspectRatio as keyof typeof aspectRatios])}>
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              key={backgroundImage}
              data-ai-hint="background scenery"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/10">
              <div style={textStyle} className="break-words">
                {text}
              </div>
            </div>
          </div>
        </div>

        {/* Painel de controle para customização. */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                Customizar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text"><Type className="mr-2 h-4 w-4"/>Texto</TabsTrigger>
                  <TabsTrigger value="style"><Palette className="mr-2 h-4 w-4"/>Estilo</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="text-input">Texto da Frase</Label>
                        <Textarea
                        id="text-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="style" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Fonte</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="PT Sans">PT Sans</SelectItem>
                        <SelectItem value="Merriweather">Merriweather</SelectItem>
                        <SelectItem value="Lobster">Lobster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="font-size">Tamanho da Fonte</Label>
                        <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      id="font-size"
                      min={12}
                      max={128}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-color">Cor do Texto</Label>
                     <div className="flex items-center gap-2">
                      <Input
                        id="text-color"
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" size="icon" style={{backgroundColor: textColor}} className="h-10 w-10 border-2" />
                        </PopoverTrigger>
                         <PopoverContent className="w-auto p-0 border-none">
                           <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-16 h-16 cursor-pointer"/>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alinhamento do Texto</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={textAlign === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('left')}><AlignLeft /></Button>
                      <Button variant={textAlign === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('center')}><AlignCenter /></Button>
                      <Button variant={textAlign === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('right')}><AlignRight /></Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Sombra no Texto</Label>
                    <Switch checked={textShadow} onCheckedChange={setTextShadow} />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1"><Download className="mr-2 h-4 w-4"/> Baixar</Button>
                <Button variant="secondary" className="flex-1"><Share2 className="mr-2 h-4 w-4"/> Compartilhar</Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
