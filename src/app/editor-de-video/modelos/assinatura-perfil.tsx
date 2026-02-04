
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Twitter } from 'lucide-react';
import type { ProfileData } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
}

// Este é um componente de placeholder para a assinatura do perfil.
// Ele será usado na página de Assinatura e no editor de vídeo.
export function AssinaturaPerfil({
  profile,
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
  bgColor,
  bgOpacity,
}: AssinaturaPerfilProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
        showBackground && 'bg-opacity-50'
      )}
      style={{
        backgroundColor: showBackground
          ? `${bgColor}${Math.round(bgOpacity * 2.55).toString(16).padStart(2, '0')}`
          : 'transparent',
      }}
    >
      {showPhoto && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.photo ?? ''} alt={profile.username} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1">
        {showUsername && (
          <p className="font-bold text-white text-sm">{profile.username}</p>
        )}
        {showSocial && (
          <p className="text-gray-300 text-xs">{profile.social}</p>
        )}
      </div>
      {profile.showIcon && (
        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
      )}
    </div>
  );
}
