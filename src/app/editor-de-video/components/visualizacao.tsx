import Image from "next/image";
import { cn } from "@/lib/utils";
import type { EstiloFundo, VisualizacaoEditorProps, ProporcaoTela } from "./tipos";
import { AssinaturaPerfil } from "./assinatura-perfil";
import { VisualizacaoPerfil } from "./visualizacao-perfil";

const getMediaType = (src: string): 'image' | 'video' | 'unknown' => {
    if (src.startsWith('data:')) {
        if (src.startsWith('data:image')) return 'image';
        if (src.startsWith('data:video')) return 'video';
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    
    if (imageExtensions.some(ext => src.toLowerCase().includes(ext))) return 'image';
    if (videoExtensions.some(ext => src.toLowerCase().includes(ext))) return 'video';
    
    if(src.includes('picsum.photos')) return 'image';

    return 'unknown';
}

const renderBackground = (backgroundStyle: EstiloFundo) => {
    const { type, value } = backgroundStyle;
    if (type === 'media' && value) {
        const mediaType = getMediaType(value);
        if (mediaType === 'image') {
            return (
                <Image
                    src={value}
                    alt="Background"
                    fill
                    className="object-cover"
                    key={value}
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
                    key={value}
                />
            );
        }
    } else if (type === 'solid') {
         return <div className="absolute inset-0" style={{ backgroundColor: value }} />;
    } else if (type === 'gradient') {
         return <div className="absolute inset-0" style={{ background: value }} />;
    }
    return null;
};

const renderContent = (props: VisualizacaoEditorProps) => {
    if (props.activeTemplateId === -2) {
        return (
            <VisualizacaoPerfil 
                profile={props.profile}
                text={props.text}
                textStyle={props.textStyle}
                textVerticalPosition={props.textVerticalPosition}
                profileVerticalPosition={props.profileVerticalPosition}
            />
        )
    }
    
    return (
        <div className="absolute inset-0 flex items-center justify-center p-8 @container">
            <div className="relative w-full h-full">
                <div
                    style={{
                        ...props.textStyle,
                        top: `${props.textVerticalPosition}%`,
                        transform: 'translateY(-50%)',
                    }}
                    className="break-words w-full absolute transition-all duration-200"
                >
                    {props.text}
                </div>
            </div>
             {props.showProfileSignature && (
                <div 
                    className="absolute"
                    style={{
                        top: `${props.signaturePositionY}%`,
                        left: `${props.signaturePositionX}%`,
                        transform: `translate(-50%, -50%)`,
                    }}
                >
                    <AssinaturaPerfil 
                        profile={props.profile} 
                        showPhoto={props.showSignaturePhoto}
                        showUsername={props.showSignatureUsername}
                        showSocial={props.showSignatureSocial}
                    />
                </div>
            )}
        </div>
    );
};

export function VisualizacaoEditor(props: VisualizacaoEditorProps) {
  const { aspectRatio, backgroundStyle } = props;

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shadow-2xl bg-black max-w-full max-h-full",
      )}
      style={{
        aspectRatio: aspectRatio.replace(":", "/"),
      }}
    >
      {renderBackground(backgroundStyle)}
      {renderContent(props)}
    </div>
  );
}
