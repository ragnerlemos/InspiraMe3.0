
// Componente responsável por renderizar a área de visualização do editor, 
// incluindo a imagem de fundo, o texto e os controles de proporção de tela.

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { VisualizacaoEditorProps, ProporcaoTela } from "./tipos";
import { AssinaturaPerfil } from "./assinatura-perfil";
import { VisualizacaoPerfil } from "./visualizacao-perfil";


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
    backgroundStyle,
    text,
    textStyle,
    textVerticalPosition,
    showProfileSignature,
    profile,
    signaturePositionX,
    signaturePositionY,
    showSignaturePhoto,
    showSignatureUsername,
    showSignatureSocial,
    activeTemplateId,
    profileVerticalPosition,
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

     const renderContent = () => {
        // Se o modelo "Twitter" (id -2) estiver ativo, renderiza a visualização especial.
        if (activeTemplateId === -2) {
            return (
                <VisualizacaoPerfil 
                    profile={profile}
                    text={text}
                    textStyle={textStyle}
                    textVerticalPosition={textVerticalPosition}
                    profileVerticalPosition={profileVerticalPosition}
                />
            )
        }
        
        // Renderização padrão para os outros modelos.
        return (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
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
                 {showProfileSignature && (
                    <div 
                        className="absolute"
                        style={{
                            top: `${signaturePositionY}%`,
                            left: `${signaturePositionX}%`,
                            transform: `translate(-50%, -50%)`,
                        }}
                    >
                        <AssinaturaPerfil 
                            profile={profile} 
                            showPhoto={showSignaturePhoto}
                            showUsername={showSignatureUsername}
                            showSocial={showSignatureSocial}
                        />
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="flex-1 w-full max-w-4xl flex justify-center items-center">
            {/* Contêiner da visualização que se ajusta à proporção de tela selecionada. */}
            <div className={cn("relative w-full max-w-md bg-muted dark:bg-black rounded-lg overflow-hidden shadow-2xl", proporcoes[aspectRatio])}>
                {renderBackground()}
                {renderContent()}
            </div>
        </div>
    );
}
