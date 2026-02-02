
import type { ProfileData } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
  usernameColor: string;
  socialColor: string;
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
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
  bgColor,
  bgOpacity,
  usernameColor,
  socialColor,
}: AssinaturaPerfilProps) {
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  return (
    <div 
      className="flex items-center justify-center gap-3 p-3 rounded-lg max-w-max"
      style={{
        backgroundColor: showBackground ? backgroundColor : 'transparent',
      }}
    >
      {showPhoto && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center space-y-0">
          {showUsername && (
            <p className="font-bold text-sm leading-none" style={{ color: usernameColor }}>
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-xs leading-tight pt-0.5" style={{ color: socialColor, opacity: 0.9 }}>
              {profile.social}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
