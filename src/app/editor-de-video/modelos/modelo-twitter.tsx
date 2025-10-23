
import type { EditorState, EstiloTexto } from '../tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { ProfileData } from '@/hooks/use-profile';

interface ModeloTwitterProps {
    editorState: EditorState;
    baseTextStyle: EstiloTexto;
    textEffectsStyle: EstiloTexto;
    dropShadowStyle: EstiloTexto;
    profile: ProfileData;
}


export function ModeloTwitter({
  profile,
  editorState,
  baseTextStyle,
  textEffectsStyle,
  dropShadowStyle,
}: ModeloTwitterProps) {
  
  const combinedTextStyle: EstiloTexto = {
      ...baseTextStyle,
      ...textEffectsStyle,
    };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8" style={dropShadowStyle}>
      {/* Container que agrupa a assinatura e o texto para garantir o alinhamento */}
      <div className="relative w-full space-y-4 transition-all duration-200">
        {/* Cabeçalho do Perfil */}
        <div className="w-full flex items-start gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={profile.photo || ''} alt={profile.username} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pt-1">
            <p
              className="font-bold text-lg"
              style={{ color: editorState.textColor }}
            >
              {profile.username}
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {profile.social}
            </p>
          </div>
        </div>

        {/* Texto da Frase */}
        <div style={combinedTextStyle} className="break-words w-full">
          {editorState.text}
        </div>
      </div>
    </div>
  );
}
