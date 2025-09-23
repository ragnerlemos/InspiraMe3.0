
// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com opções de customização.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData } from '../tipos';

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
  scale: number; // A escala geral é passada para ajustar o padding e gap se necessário
}

// Função para converter cor hexadecimal para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function AssinaturaPerfil({
  profile,
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
  bgColor,
  bgOpacity,
}: AssinaturaPerfilProps) {
  const shouldShowIcon = profile.showIcon && (profile.iconUrl || profile.social.includes('twitter.com') || profile.social.includes('x.com'));
  
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  return (
    <div 
        className={cn("flex items-center rounded-lg max-w-max p-2")}
        style={{
            backgroundColor: showBackground ? backgroundColor : 'transparent',
        }}
    >
      {showPhoto && (
        <Avatar 
          className="h-10 w-10 flex-shrink-0"
        >
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white h-5 w-5"/>
          </AvatarFallback>
        </Avatar>
      )}
      {(showUsername || showSocial) && (
          <div className="flex flex-col ml-3 leading-[1.1]">
            {showUsername && (
              <p 
                className="font-bold text-white text-base m-0 whitespace-nowrap"
              >
                {profile.username}
              </p>
            )}
            {showSocial && (
              <p 
                className="text-gray-300 text-xs m-0"
              >
                {profile.social}
              </p>
            )}
          </div>
      )}
       {shouldShowIcon && (
         <div className="pl-2">
            {profile.iconUrl ? (
                <img 
                  src={profile.iconUrl} 
                  alt="Ícone social" 
                  className="h-5 w-5"
                />
            ) : (
                <Twitter 
                  className="text-blue-400 h-5 w-5"
                />
            )}
         </div>
      )}
    </div>
  );
}
