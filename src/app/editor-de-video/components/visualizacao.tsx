// Componente responsável por renderizar a área de visualização do editor, 
// incluindo a imagem de fundo, o texto e os controles de proporção de tela.

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VisualizacaoEditorProps, ProporcaoTela, TipoFundo, EstiloFundo } from "./tipos";
import { useEffect, useState } from "react";

// Mapeia os valores de proporção de tela para as classes CSS correspondentes do Tailwind.
const proporcoes: Record<ProporcaoTela, string> = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
};

// Função para verificar o tipo de mídia com base no seu conteúdo (Data URL ou URL normal)
const getMediaType = (src: string): 'image' | 'video' | 'unknown' => {
    if (src.startsWith('data:')) {
        if (src.startsWith('data:image')) return 'image';
        if (src.startsWith('data:video')) return 'video';
    }
    // Lógica para URLs externas, se necessário. Aqui, assumimos imagem por padrão.
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    
    if (imageExtensions.some(ext => src.toLowerCase().includes(ext))) return 'image';
    if (videoExtensions.some(ext => src.toLowerCase().includes(ext))) return 'video';
    
    // Fallback para as URLs do picsum que não têm extensão
    if(src.includes('picsum.photos')) return 'image';

    return 'unknown';
}

export function VisualizacaoEditor({
    aspectRatio,
    onAspectRatioChange,
    backgroundStyle,
    text,
    textStyle,
    textVerticalPosition,
}: VisualizacaoEditorProps) {

    const renderBackground = () => {
        const { type, value } = backgroundStyle;
        if (type === 'media') {
            const mediaType = getMediaType(value);
            if (mediaType === 'image') {
                return (
                    <Image
                        src={value}
                        alt="Background"
                        fill
                        className="object-cover"
                        key={value} // Força a recriação quando a imagem muda
                        data-ai-hint="background scenery"
                        priority
                    />
                );
            }
            if (mediaType === 'video') {
                return (
                    <video
                        src={value}
                        autoPlay
                        loop
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                        key={value} // Força a recriação quando o vídeo muda
                    />
                );
            }
        } else if (type === 'solid') {
             return <div className="absolute inset-0" style={{ backgroundColor: value }} />;
        } else if (type === 'gradient') {
             return <div className="absolute inset-0" style={{ background: value }} />;
        }
        return null; // ou um placeholder de carregamento/erro
    };


    return (
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
            {/* Controles para alterar a proporção da tela. */}
            <div className="flex gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-full border">
                {(Object.keys(proporcoes) as ProporcaoTela[]).map((ar) => (
                    <Button
                        key={ar}
                        variant={aspectRatio === ar ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => onAspectRatioChange(ar)}
                    >
                        {ar}
                    </Button>
                ))}
            </div>

            {/* Contêiner da visualização que se ajusta à proporção de tela selecionada. */}
            <div className={cn("relative w-full max-w-2xl bg-muted rounded-lg overflow-hidden shadow-2xl", proporcoes[aspectRatio])}>
                {renderBackground()}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-8">
                    {/* Área que contém o texto, permitindo o posicionamento vertical. */}
                    <div
                        className="relative w-full h-full"
                    >
                        <div
                            style={{
                                ...textStyle,
                                top: `${textVerticalPosition}%`,
                                transform: 'translateY(-50%)',
                             }}
                            className="break-words w-full absolute transition-all duration-200"
                        >
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
