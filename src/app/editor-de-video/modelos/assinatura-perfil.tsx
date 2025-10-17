// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Estrutura: [ Bloco Assinatura > Avatar | Bloco Texto (nome + rede) | Ícone opcional ]

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/hooks/use-profile";
import { User } from "lucide-react";

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

export function AssinaturaPerfil({
  profile,
  showPhoto = true,
  showUsername = true,
  showSocial = true,
}: AssinaturaPerfilProps) {
  return (
    // 🔹 BLOCO PRINCIPAL - agrupa tudo
    <div className="flex items-center gap-3 p-2 text-white">
      
      {/* 🔸 BLOCO DO AVATAR */}
      {showPhoto && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}

      {/* 🔸 BLOCO DE TEXTO (NOME + REDE SOCIAL) */}
      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center">
          {/* Nome */}
          {showUsername && (
            <p className="font-bold text-base m-0 leading-none">
              {profile.username}
            </p>
          )}
          {/* Rede social */}
          {showSocial && (
            <p className="text-sm opacity-80 m-0 leading-none mt-[2px]">
              {profile.social}
            </p>
          )}
        </div>
      )}

      {/* 🔸 BLOCO DO ÍCONE (opcional) */}
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
