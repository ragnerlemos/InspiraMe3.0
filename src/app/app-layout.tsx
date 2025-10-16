
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { AppHeader } from './cabecalho-app';
import { useGoogleFonts } from "@/hooks/use-google-fonts";

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  
  // Carrega e injeta as fontes do Google para evitar problemas de CORS
  useGoogleFonts();

  if (isEditorPage) {
     return (
        <div className="flex flex-col h-full">
            {children}
        </div>
     )
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}
