
import { AssinaturaPerfil } from "../assinatura-perfil";
import type { ProfileData } from "@/hooks/use-profile";

const mockProfile: ProfileData = {
  username: "Seu Nome",
  social: "@seuusario",
  photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  iconUrl: "",
  showIcon: true,
  showDate: false,
  logo: null,
};

export default function AssinaturaPerfilPreviewPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-800 p-8">
      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Completo</h2>
            <AssinaturaPerfil profile={mockProfile} showPhoto={true} showUsername={true} showSocial={true} />
        </div>
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Apenas Foto</h2>
            <AssinaturaPerfil profile={mockProfile} showPhoto={true} showUsername={false} showSocial={false} />
        </div>
         <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Apenas Texto</h2>
            <AssinaturaPerfil profile={mockProfile} showPhoto={false} showUsername={true} showSocial={true} />
        </div>
         <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Sem Social</h2>
            <AssinaturaPerfil profile={mockProfile} showPhoto={true} showUsername={true} showSocial={false} />
        </div>
         <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Com Ícone (Padrão)</h2>
            <AssinaturaPerfil profile={{...mockProfile, showIcon: true, iconUrl: ''}} />
        </div>
         <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Com Ícone (URL)</h2>
             <AssinaturaPerfil profile={{...mockProfile, showIcon: true, iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'}} />
        </div>
      </div>
    </div>
  );
}

    