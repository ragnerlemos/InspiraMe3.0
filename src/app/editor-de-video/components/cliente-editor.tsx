
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { quotes, templates } from "@/lib/dados";
import type { EstiloTexto, ProporcaoTela, TipoFundo, EstiloFundo } from "./tipos";
import { VisualizacaoEditor } from "./visualizacao";
import { PainelControles } from "./painel-controles";
import { Skeleton } from "@/components/ui/skeleton";

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
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
                    <Skeleton className="w-full h-[800px] rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Componente principal do cliente do editor de vídeo.
export function EditorClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Estados para gerenciar as propriedades do vídeo/imagem.
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontSize, setFontSize] = useState(23);
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textShadowBlur, setTextShadowBlur] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<ProporcaoTela>("9:16");
  const [isReady, setIsReady] = useState(false); // Estado para controlar quando o editor está pronto.
  const [textVerticalPosition, setTextVerticalPosition] = useState(50); // Posição vertical do texto em porcentagem (50% = centro)
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [textStrokeWidth, setTextStrokeWidth] = useState(0);

  // Estado para o fundo
  const [backgroundStyle, setBackgroundStyle] = useState<EstiloFundo>({
    type: 'media',
    value: templates[0].imageUrl,
  });

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
        setBackgroundStyle({ type: 'media', value: template.imageUrl });
        setAspectRatio(template.aspectRatio as ProporcaoTela);
        // Se não houver uma citação específica, escolhe uma aleatória.
        if (!quoteParam) setText(quotes[Math.floor(Math.random() * quotes.length)].text);
      }
    } else {
        // Configurações padrão se nenhum modelo for especificado.
        setBackgroundStyle({ type: 'media', value: templates[0].imageUrl });
        setAspectRatio("9:16");
    }
    // Marca o editor como pronto para ser renderizado.
    setIsReady(true);
  }, [searchParams]);

  // Gera a sombra do texto para simular um contorno.
  // Isso cria um contorno mais suave e que não sobrepõe o texto.
  const createTextStrokeShadow = (width: number, color: string): string => {
    if (width === 0) return "none";
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (Math.sqrt(x * x + y * y) <= width) {
          shadows.push(`${x}px ${y}px 0 ${color}`);
        }
      }
    }
    return shadows.join(", ");
  };
  
  const textStrokeShadow = createTextStrokeShadow(textStrokeWidth, textStrokeColor);
  const mainTextShadow = textShadowBlur > 0 ? `2px 2px ${textShadowBlur}px rgba(0,0,0,0.8)` : "none";
  
  const combinedTextShadow = 
    textStrokeShadow !== "none" && mainTextShadow !== "none"
      ? `${textStrokeShadow}, ${mainTextShadow}`
      : textStrokeShadow !== "none"
      ? textStrokeShadow
      : mainTextShadow;


  // Estilos CSS para o texto, aplicados dinamicamente.
  const textStyle: EstiloTexto = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    color: textColor,
    textAlign: textAlign,
    textShadow: combinedTextShadow,
    lineHeight: 1.3,
  };
  
  // Renderiza um esqueleto de carregamento enquanto o editor não está pronto.
  if (!isReady) {
     return <EditorSkeleton />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <VisualizacaoEditor
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            backgroundStyle={backgroundStyle}
            text={text}
            textStyle={textStyle}
            textVerticalPosition={textVerticalPosition}
        />

        <PainelControles
            text={text}
            onTextChange={setText}
            fontFamily={fontFamily}
            onFontFamilyChange={setFontFamily}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            fontWeight={fontWeight}
            onFontWeightChange={setFontWeight}
            fontStyle={fontStyle}
            onFontStyleChange={setFontStyle}
            textColor={textColor}
            onTextColorChange={setTextColor}
            textAlign={textAlign}
            onTextAlignChange={setTextAlign}
            textShadowBlur={textShadowBlur}
            onTextShadowBlurChange={setTextShadowBlur}
            textVerticalPosition={textVerticalPosition}
            onTextVerticalPositionChange={setTextVerticalPosition}
            textStrokeColor={textStrokeColor}
            onTextStrokeColorChange={setTextStrokeColor}
            textStrokeWidth={textStrokeWidth}
            onTextStrokeWidthChange={setTextStrokeWidth}
            backgroundStyle={backgroundStyle}
            onBackgroundStyleChange={setBackgroundStyle}
        />
      </div>
    </div>
  );
}
