
"use client";

import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // O botão de categoria só deve aparecer na página de frases.
  const showCategoryButton = pathname.startsWith('/frases');

  // Injeta as props no children se for a página de frases
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && showCategoryButton) {
      // Verifica se o componente é FrasesPage para injetar props
      // O Next.js pode envolver o componente, então verificamos o tipo.
      // Assumindo que FrasesPage não terá um displayName customizado,
      // mas podemos nos basear na estrutura esperada.
      return React.cloneElement(child as React.ReactElement<any>, { 
        isCategorySheetOpen, 
        setIsCategorySheetOpen 
      });
    }
    return child;
  });


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
            <AppHeader 
              showCategoryMenuButton={showCategoryButton} 
              onCategoryMenuClick={() => setIsCategorySheetOpen(true)} 
            />
             <div className="flex-1 flex flex-col min-h-0">
                {childrenWithProps}
            </div>
          </>
       )}
    </div>
  );
}
