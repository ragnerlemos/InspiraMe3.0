

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
    <div className="flex items-center gap-3 text-white">
        {showPhoto && (
            <Avatar className="h-10 w-10">
                <AvatarImage src={profile.photo || ""} alt={profile.username} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
        )}
        {(showUsername || showSocial) && (
            <div className="flex flex-col">
                {showUsername && <div className="font-bold leading-none">{profile.username}</div>}
                {showSocial && <div className="text-sm opacity-80 leading-none">{profile.social}</div>}
            </div>
        )}
         {profile.showIcon && profile.iconUrl && (
            <img src={profile.iconUrl} alt="Ícone" className="h-5 w-5 ml-auto" />
        )}
    </div>
  );
}

    