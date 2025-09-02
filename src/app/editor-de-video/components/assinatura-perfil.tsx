
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { ProfileData } from "@/hooks/use-profile";
import { User, Twitter } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
}

export function AssinaturaPerfil({ profile }: AssinaturaPerfilProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={profile.photo || ""} alt={profile.username} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-card-foreground">{profile.username}</p>
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
    </Card>
  );
}
