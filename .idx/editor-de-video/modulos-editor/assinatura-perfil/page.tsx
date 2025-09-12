
"use client";

import { AssinaturaPerfil } from "../assinatura-perfil";
import type { ProfileData } from "@/hooks/use-profile";

// Mock data para o perfil
const mockProfile: ProfileData = {
  username: "Seu Nome",
  social: "@seuperfil",
  photo: "https://picsum.photos/seed/101/200/200",
  iconUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/twitter.svg",
  showIcon: true,
  showDate: false,
  logo: null
};

// Página de teste para o componente AssinaturaPerfil
export default function AssinaturaPerfilPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-8 space-y-8">
      
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold">Visualização do Componente `AssinaturaPerfil`</h1>
        <p className="text-zinc-400">Teste de diferentes configurações de props.</p>
      </div>

      {/* Exemplo 1: Todas as props ativadas */}
      <div className="w-full max-w-sm">
        <p className="text-zinc-300 mb-2 font-mono text-sm">showPhoto, showUsername, showSocial = true</p>
        <div className="bg-zinc-800 rounded-lg p-4">
            <AssinaturaPerfil 
                profile={mockProfile}
                showPhoto={true}
                showUsername={true}
                showSocial={true}
            />
        </div>
      </div>

      {/* Exemplo 2: Apenas foto e nome */}
      <div className="w-full max-w-sm">
        <p className="text-zinc-300 mb-2 font-mono text-sm">showPhoto, showUsername = true; showSocial = false</p>
         <div className="bg-zinc-800 rounded-lg p-4">
            <AssinaturaPerfil 
                profile={mockProfile}
                showPhoto={true}
                showUsername={true}
                showSocial={false}
            />
        </div>
      </div>

       {/* Exemplo 3: Apenas nome e social */}
      <div className="w-full max-w-sm">
        <p className="text-zinc-300 mb-2 font-mono text-sm">showPhoto = false</p>
        <div className="bg-zinc-800 rounded-lg p-4">
            <AssinaturaPerfil 
                profile={mockProfile}
                showPhoto={false}
                showUsername={true}
                showSocial={true}
            />
        </div>
      </div>

       {/* Exemplo 4: Apenas foto */}
       <div className="w-full max-w-sm">
        <p className="text-zinc-300 mb-2 font-mono text-sm">showPhoto = true; showUsername, showSocial = false</p>
        <div className="bg-zinc-800 rounded-lg p-4">
            <AssinaturaPerfil 
                profile={mockProfile}
                showPhoto={true}
                showUsername={false}
                showSocial={false}
            />
        </div>
      </div>
    </div>
  );
}
