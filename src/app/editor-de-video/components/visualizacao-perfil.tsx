import type { VisualizacaoPerfilProps } from './tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export function VisualizacaoPerfil({ 
    profile, 
    text, 
    textStyle,
    textVerticalPosition,
    profileVerticalPosition,
}: VisualizacaoPerfilProps) {
  return (
    <div className="absolute inset-0 p-8">
       {/* Container relativo para posicionar os elementos */}
      <div className="relative w-full h-full">

        {/* Cabeçalho do Perfil (Posicionável) */}
        <div 
            className="absolute w-full flex items-start gap-3 transition-all duration-200"
            style={{
                top: `${profileVerticalPosition}%`,
                transform: 'translateY(-50%)',
            }}
        >
            <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={profile.photo || ''} alt={profile.username} />
                <AvatarFallback>
                <User />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-1">
                <p className="font-bold text-lg" style={{ color: textStyle.color }}>{profile.username}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{profile.social}</p>
            </div>
        </div>

        {/* Texto da Frase (Posicionável) */}
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
  );
}
