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
}

export function AssinaturaPerfil({
  profile,
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
}: AssinaturaPerfilProps) {
  // Define se o ícone da rede social deve ser exibido.
  const shouldShowIcon = profile.showIcon && (profile.iconUrl || profile.social.includes('twitter.com') || profile.social.includes('x.com'));
  
  return (
    <div className={cn(
        "flex items-center gap-3 p-2 rounded-lg max-w-max",
        showBackground && "bg-black/30 backdrop-blur-sm"
    )}>
      {showPhoto && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        {showUsername && (
          <p className="font-bold text-white text-sm leading-tight">
            {profile.username}
          </p>
        )}
        {showSocial && (
          <p className="text-gray-300 text-xs leading-tight">
            {profile.social}
          </p>
        )}
      </div>
       {shouldShowIcon && (
         <div className="pl-2">
            {profile.iconUrl ? (
                <img src={profile.iconUrl} alt="Ícone social" className="h-5 w-5" />
            ) : (
                <Twitter className="h-5 w-5 text-blue-400" />
            )}
         </div>
      )}
    </div>
  );
}
