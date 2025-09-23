
"use client";

import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';
import type { EditorControlState } from './editor-de-video/contexts/editor-context';

const defaultControls: EditorControlState = {
    canUndo: false,
    undo: () => {},
    canRedo: false,
    redo: () => {},
    onSaveAsTemplate: () => {},
    onExportJPG: () => {},
    onExportPNG: () => {},
    onExportMP4: () => {},
};

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  const [editorControls, setEditorControls] = useState<EditorControlState>(defaultControls);

  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && isEditorPage) {
        // Assume que o filho (página) aceita essas props
        // @ts-ignore
        return React.cloneElement(child, { setControls: setEditorControls });
    }
    return child;
  });

  if (isEditorPage) {
     return (
        <EditorProvider controls={editorControls}>
            <div className="flex flex-col h-full">
                <EditorHeader />
                <div className="flex-1 flex flex-col min-h-0">
                    {childWithProps}
                </div>
            </div>
        </EditorProvider>
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
