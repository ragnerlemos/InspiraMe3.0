
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
      // Clona o elemento filho (a página) e injeta as props necessárias.
      // Isso permite que o layout controle o estado do sheet da página de frases.
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
