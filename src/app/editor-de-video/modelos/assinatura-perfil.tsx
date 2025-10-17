// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com opções de customização.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/hooks/use-profile";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto?: boolean;
  showUsername?: boolean;
  showSocial?: boolean;
  showBackground?: boolean;
  bgColor?: string;
  bgOpacity?: number;
  layout?: 'horizontal' | 'vertical';
}

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
    showPhoto = true, 
    showUsername = true, 
    showSocial = true,
    showBackground = false,
    bgColor = "#000000",
    bgOpacity = 30,
    layout = 'horizontal',
}: AssinaturaPerfilProps) {

  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  const containerClasses = cn(
    "flex items-center gap-3 p-2 text-white max-w-max",
    {
      "flex-col text-center gap-2": layout === 'vertical',
      "flex-row": layout === 'horizontal'
    }
  );
  
  const textContainerClasses = cn(
    "flex flex-col",
    {
      "items-center": layout === 'vertical',
      "items-start": layout === 'horizontal'
    }
  );

  return (
    <div 
        style={{ 
            backgroundColor: showBackground ? backgroundColor : 'transparent',
        }}
        className={cn(
            "inline-flex items-center gap-3 p-2 text-white rounded-lg",
            {
                "flex-col text-center gap-2": layout === 'vertical',
            }
        )}
    >
        {/* Avatar */}
        {showPhoto && (
            <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={profile.photo || ""} alt={profile.username} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
        )}

        {/* Div que agrupa o nome e a rede social */}
        {(showUsername || showSocial) && (
             <div className={textContainerClasses}>
                {showUsername && <span className="font-bold text-base leading-none whitespace-nowrap">{profile.username}</span>}
                {showSocial && <span className="text-sm opacity-80 leading-none whitespace-nowrap">{profile.social}</span>}
            </div>
        )}
        
        {/* Ícone opcional */}
         {profile.showIcon && profile.iconUrl && (
            <img src={profile.iconUrl} alt="Ícone" className="h-5 w-5 ml-auto" />
        )}
    </div>
  );
}
