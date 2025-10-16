
import type { VisualizacaoEditorProps, EstiloTexto } from '../tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ModeloTwitterProps extends VisualizacaoEditorProps {
    textStyle: EstiloTexto;
}


export function ModeloTwitter({
  profile,
  text,
  textStyle,
}: ModeloTwitterProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
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
              style={{ color: textStyle.color }}
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
        <div style={textStyle} className="break-words w-full">
          {text}
        </div>
      </div>
    </div>
  );
}
