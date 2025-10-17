// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com opções de customização.

import type { ProfileData } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
  layout?: "horizontal" | "vertical";
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
  layout = "horizontal",
}: AssinaturaPerfilProps) {
  const shouldShowIcon =
    profile.showIcon &&
    (profile.iconUrl ||
      profile.social.includes("twitter.com") ||
      profile.social.includes("x.com"));

  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb
    ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})`
    : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  return (
    <div
      className={cn(
        "p-3 rounded-lg max-w-max",
        layout === "vertical" ? "flex flex-col items-center" : ""
      )}
      style={{
        backgroundColor: showBackground ? backgroundColor : "transparent",
      }}
    >
      <div className={cn("flex items-center", layout === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-3')}>
        {showPhoto && (
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={profile.photo || ""} alt={profile.username} />
            <AvatarFallback>
              <User className="text-white" />
            </AvatarFallback>
          </Avatar>
        )}

        {(showUsername || showSocial) && (
          <div
            className={cn(
              "flex flex-col text-white",
              layout === "vertical" ? "items-center text-center" : "items-start"
            )}
          >
            {showUsername && (
              <span className="font-bold text-base leading-none whitespace-nowrap">
                {profile.username}
              </span>
            )}
            {showSocial && (
              <span className="text-gray-300 text-sm leading-none whitespace-nowrap">
                {profile.social}
              </span>
            )}
          </div>
        )}

        {shouldShowIcon && (
          <div className="pl-2 flex items-center justify-center">
            {profile.iconUrl ? (
              <img src={profile.iconUrl} alt="Ícone social" className="h-5 w-5" />
            ) : (
              <Twitter className="h-5 w-5 text-blue-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
