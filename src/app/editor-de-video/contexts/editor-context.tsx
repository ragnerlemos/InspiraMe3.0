
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define a interface para o estado que será compartilhado.
interface UndoState {
  canUndo: boolean;
  undo: () => void;
}

interface SaveActions {
  onSaveAsTemplate: () => void;
}

// Define a interface para o valor do contexto.
interface EditorContextType {
  canUndo: boolean;
  undo: () => void;
  setUndoState: (state: UndoState) => void;
  onSaveAsTemplate: () => void;
  setSaveActions: (actions: SaveActions) => void;
}

// Cria o contexto com valores padrão.
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Cria o provedor do contexto.
export function EditorProvider({ children }: { children: ReactNode }) {
  const [undoState, setUndoState] = useState<UndoState>({
    canUndo: false,
    undo: () => {},
  });
  const [saveActions, setSaveActions] = useState<SaveActions>({
    onSaveAsTemplate: () => {},
  })
  
  const handleSetUndoState = useCallback((state: UndoState) => {
    setUndoState(state);
  }, []);

  const handleSetSaveActions = useCallback((actions: SaveActions) => {
    setSaveActions(actions);
  }, []);
  
  const value = {
    ...undoState,
    setUndoState: handleSetUndoState,
    ...saveActions,
    setSaveActions: handleSetSaveActions,
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
