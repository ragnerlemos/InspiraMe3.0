
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');

  return (
    <div className="flex flex-col h-full">
       {isEditorPage ? (
          <EditorProvider>
            <EditorHeader />
             <div className="flex-1 flex flex-col min-h-0">
               {children}
            </div>
          </EditorProvider>
       ) : (
          <>
            <AppHeader />
             <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
          </>
       )}
    </div>
  );
}
