// Componente para renderizar a visualização no estilo do Twitter, usando os dados do perfil.

import type { VisualizacaoPerfilProps } from './tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Twitter } from 'lucide-react';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';

export function VisualizacaoPerfil({ profile, text, textStyle }: VisualizacaoPerfilProps) {
  // Pega a data atual para a pré-visualização.
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-center p-4 md:p-8 h-full w-full bg-background">
        <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl">
            <CardHeader className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.photo || ''} alt={profile.username} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold" style={{color: textStyle.color}}>{profile.username}</p>
                                <p className="text-sm text-muted-foreground">{profile.social}</p>
                            </div>
                            {profile.showIcon && (
                                profile.iconUrl ? 
                                    <img src={profile.iconUrl} alt="Ícone" className="h-5 w-5" /> : 
                                    <Twitter className="h-5 w-5 text-blue-500" />
                            )}
                        </div>
                    </div>
                </div>
                <div 
                    className="mt-3 text-base break-words"
                    style={textStyle}
                >
                    {text}
                </div>
            </CardHeader>
            {profile.showDate && (
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                    <p>{currentDate.replace('de', '·')}</p>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
