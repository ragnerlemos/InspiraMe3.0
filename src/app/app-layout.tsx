
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');

  // O botão de categoria só deve aparecer na página de frases.
  const showCategoryButton = pathname.startsWith('/frases');

  // Clona o elemento filho para injetar a função de controle do menu
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && showCategoryButton) {
      // Cria uma função que será chamada pelo cabeçalho
      let openCategorySheet: () => void = () => {};

      // Função para que o filho (página) possa registrar sua função de abrir
      const setOpenCategorySheet = (fn: () => void) => {
        openCategorySheet = fn;
      };

      // Clona o componente filho passando a função de registro
      const clonedChild = React.cloneElement(child as React.ReactElement<any>, { 
        setOpenCategorySheet 
      });

      return (
        <>
          <AppHeader 
            showCategoryMenuButton={showCategoryButton} 
            onCategoryMenuClick={() => openCategorySheet && openCategorySheet()} 
          />
          <div className="flex-1 flex flex-col min-h-0">
            {clonedChild}
          </div>
        </>
      );
    }
    // Para outras páginas, renderiza normalmente
    return (
        <>
            <AppHeader showCategoryMenuButton={false} />
            <div className="flex-1 flex flex-col min-h-0">
                {child}
            </div>
        </>
    );
  });

  if (isEditorPage) {
     return (
        <EditorProvider>
            <div className="flex flex-col h-full">
                <EditorHeader />
                <div className="flex-1 flex flex-col min-h-0">
                    {children}
                </div>
            </div>
        </EditorProvider>
     )
  }

  // Para as páginas que não são de frases, ou se não houver children
  if (!showCategoryButton) {
    return (
      <div className="flex flex-col h-full">
        <AppHeader />
         <div className="flex-1 flex flex-col min-h-0">
           {children}
        </div>
      </div>
    );
  }

  return <div className="flex flex-col h-full">{childrenWithProps}</div>;
}
