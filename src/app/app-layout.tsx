
"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { AppHeader } from './cabecalho-app';
import { useGoogleFonts } from "@/hooks/use-google-fonts";
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

function AuthLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-8 h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-80" />
    </div>
  );
}

// Componente de layout que gerencia qual cabeçalho exibir e protege as rotas.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/boas-vindas');
  
  // Carrega e injeta as fontes do Google para evitar problemas de CORS
  useGoogleFonts();

  useEffect(() => {
    // Se não está carregando, não tem usuário e não está numa página de autenticação, redireciona para o login.
    if (!isUserLoading && !user && !isAuthPage) {
      router.replace('/login');
    }
    // Se não está carregando, tem usuário e está na página de login, redireciona para a home.
    if (!isUserLoading && user && isAuthPage) {
      router.replace('/frases');
    }
  }, [user, isUserLoading, isAuthPage, router]);

  // Enquanto carrega o estado de autenticação, exibe uma tela de loading para evitar piscar o conteúdo.
  if (isUserLoading && !isAuthPage) {
    return <AuthLoading />;
  }

  // Se não tem usuário e não está na página de auth, não renderiza nada para esperar o redirect.
  if (!user && !isAuthPage) {
      return null;
  }

  return (
    <EditorProvider>
        <div className="flex flex-col h-full">
            {!isEditorPage && <AppHeader />}
            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    </EditorProvider>
  );
}
