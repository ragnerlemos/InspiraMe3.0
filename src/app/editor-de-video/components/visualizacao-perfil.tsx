import type { VisualizacaoPerfilProps } from './tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export function VisualizacaoPerfil({ 
    profile, 
    text, 
    textStyle,
    textVerticalPosition,
    // A posição do perfil não é mais usada individualmente, mas mantemos para compatibilidade
    profileVerticalPosition, 
}: VisualizacaoPerfilProps) {
  return (
    <div className="absolute inset-0 p-8 flex items-center justify-center">
       {/* Container que agrupa a assinatura e o texto para garantir o alinhamento */}
      <div 
        className="relative w-full space-y-4 transition-all duration-200"
        style={{
            // Posicionamos o bloco inteiro. O valor de textVerticalPosition controlará o bloco.
            top: `${textVerticalPosition}%`,
            transform: 'translateY(-50%)',
            position: 'absolute',
        }}
    >

        {/* Cabeçalho do Perfil */}
        <div className="w-full flex items-start gap-3">
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

        {/* Texto da Frase */}
        <div
            style={textStyle}
            className="break-words w-full"
        >
            {text}
        </div>
      </div>
    </div>
  );
}
