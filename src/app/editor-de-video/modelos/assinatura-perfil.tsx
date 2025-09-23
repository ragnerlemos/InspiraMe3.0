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
  scale: number; // Recebe a escala do editor
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
  scale,
}: AssinaturaPerfilProps) {
  // Define se o ícone da rede social deve ser exibido.
  const shouldShowIcon = profile.showIcon && (profile.iconUrl || profile.social.includes('twitter.com') || profile.social.includes('x.com'));
  
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;
  
  const finalScale = scale / 100;
  
  // Define os tamanhos base em 'rem' para escalabilidade
  const baseAvatarSize = 2.5; // rem (equivale a h-10 w-10)
  const baseFontSize = 0.875; // rem (text-sm)
  const baseSocialSize = 0.75; // rem (text-xs)
  const baseIconSize = 1.25; // rem (h-5 w-5)
  const baseGap = 0.75; // rem (gap-3)

  return (
    <div 
        className={cn("flex items-center rounded-lg max-w-max p-2")}
        style={{
            backgroundColor: showBackground ? backgroundColor : 'transparent',
            gap: `${baseGap * finalScale}rem`,
        }}
    >
      {showPhoto && (
        <Avatar 
          className="flex-shrink-0"
          style={{ 
            height: `${baseAvatarSize * finalScale}rem`, 
            width: `${baseAvatarSize * finalScale}rem` 
          }}
        >
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col items-start leading-tight whitespace-nowrap">
        {showUsername && (
          <p 
            className="font-bold text-white leading-none"
            style={{ fontSize: `${baseFontSize * finalScale}rem` }}
          >
            {profile.username}
          </p>
        )}
        {showSocial && (
          <p 
            className="text-gray-300 leading-none"
            style={{ fontSize: `${baseSocialSize * finalScale}rem` }}
          >
            {profile.social}
          </p>
        )}
      </div>
       {shouldShowIcon && (
         <div className="pl-1">
            {profile.iconUrl ? (
                <img 
                  src={profile.iconUrl} 
                  alt="Ícone social" 
                  style={{ 
                    height: `${baseIconSize * finalScale}rem`, 
                    width: `${baseIconSize * finalScale}rem` 
                  }}
                />
            ) : (
                <Twitter 
                  className="text-blue-400"
                  style={{ 
                    height: `${baseIconSize * finalScale}rem`, 
                    width: `${baseIconSize * finalScale}rem` 
                  }}
                />
            )}
         </div>
      )}
    </div>
  );
}
