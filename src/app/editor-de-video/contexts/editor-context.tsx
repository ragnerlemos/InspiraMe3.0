
"use client";

import { createContext, useContext, ReactNode } from 'react';

// Define a interface para o estado completo do editor que será compartilhado.
export interface EditorControlState {
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  onSaveAsTemplate: () => void;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
}

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

// Define a interface para o valor do contexto.
interface EditorContextType {
  controls: EditorControlState;
}

// Cria o contexto com valores padrão.
const EditorContext = createContext<EditorContextType>({
    controls: defaultControls,
});


// Cria o provedor do contexto.
export function EditorProvider({ children, controls }: { children: ReactNode, controls: EditorControlState }) {
  const value: EditorContextType = {
    controls,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Cria um hook customizado para usar o contexto.
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
