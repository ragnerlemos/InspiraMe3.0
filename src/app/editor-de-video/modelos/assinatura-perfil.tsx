// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com alinhamento otimizado para exportação.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/hooks/use-profile";
import { User } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto?: boolean;
  showUsername?: boolean;
  showSocial?: boolean;
}

export function AssinaturaPerfil({
  profile,
  showPhoto = true,
  showUsername = true,
  showSocial = true,
}: AssinaturaPerfilProps) {
  return (
    <div className="flex items-center gap-3 p-2 text-white">
      {/* Bloco do Avatar */}
      {showPhoto && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Bloco de Texto (Nome e Rede Social) */}
      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center">
          {showUsername && (
            <p className="font-bold text-base leading-tight">
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-sm opacity-80 leading-tight">
              {profile.social}
            </p>
          )}
        </div>
      )}

      {/* Ícone opcional */}
      {profile.showIcon && profile.iconUrl && (
        <img
          src={profile.iconUrl}
          alt="Ícone"
          className="h-5 w-5 ml-auto"
        />
      )}
    </div>
  );
}
