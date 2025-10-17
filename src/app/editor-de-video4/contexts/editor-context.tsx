
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Interface para as funções de manipulação de ações do editor
interface EditorHandlers {
  onSaveProject: () => void;
  onSaveAsTemplate: () => void;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
  undo: () => void;
  redo: () => void;
}

// Interface para o valor completo do contexto
interface EditorContextType extends EditorHandlers {
  canUndo: boolean;
  canRedo: boolean;
  setUndoState: (state: { canUndo: boolean; canRedo: boolean }) => void;
  setHandlers: (handlers: Partial<EditorHandlers>) => void;
}

// Cria o contexto com valores padrão (placeholders)
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Cria o provedor do contexto
export function EditorProvider({ children }: { children: ReactNode }) {
  const [undoState, setUndoState] = useState({ canUndo: false, canRedo: false });
  const [handlers, setHandlers] = useState<Partial<EditorHandlers>>({
    onSaveProject: () => console.warn("onSaveProject não implementado"),
    onSaveAsTemplate: () => console.warn("onSaveAsTemplate não implementado"),
    onExportJPG: () => console.warn("onExportJPG não implementado"),
    onExportPNG: () => console.warn("onExportPNG não implementado"),
    onExportMP4: () => console.warn("onExportMP4 não implementado"),
    undo: () => console.warn("undo não implementado"),
    redo: () => console.warn("redo não implementado"),
  });

  const handleSetUndoState = useCallback((state: { canUndo: boolean; canRedo: boolean }) => {
    setUndoState(state);
  }, []);

  const handleSetHandlers = useCallback((newHandlers: Partial<EditorHandlers>) => {
    setHandlers(prev => ({ ...prev, ...newHandlers }));
  }, []);

  const value: EditorContextType = {
    ...undoState,
    setUndoState: handleSetUndoState,
    ...handlers,
    onSaveProject: handlers.onSaveProject!,
    onSaveAsTemplate: handlers.onSaveAsTemplate!,
    onExportJPG: handlers.onExportJPG!,
    onExportPNG: handlers.onExportPNG!,
    onExportMP4: handlers.onExportMP4!,
    undo: handlers.undo!,
    redo: handlers.redo!,
    setHandlers: handleSetHandlers,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Hook customizado para usar o contexto do editor
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor deve ser usado dentro de um EditorProvider');
  }
  return context;
}
