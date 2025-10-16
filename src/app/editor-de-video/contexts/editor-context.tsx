
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import type { EditorState } from '../tipos';
import { captureAndDownload, captureThumbnail } from '../exportar';

// Interface for the shared editor state and controls
export interface EditorContextType {
  isReady: boolean;
  canUndo: boolean;
  canRedo: boolean;
  currentState: EditorState | null;
  undo: () => void;
  redo: () => void;
  updateState: (newState: Partial<EditorState>) => void;
  setInitialState: (initialState: EditorState) => void;
  onSaveAsTemplate: () => Promise<void>;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const defaultState: EditorState = {
    text: "A inspiração está a caminho...",
    fontFamily: "Poppins",
    fontSize: 5,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0.2,
    letterSpacing: 0,
    lineHeight: 1.3,
    wordSpacing: 0,
    backgroundStyle: { type: 'solid', value: '#000000' },
    filmColor: "#000000",
    filmOpacity: 0,
    aspectRatio: "9 / 16",
    activeTemplateId: null,
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    showSignatureBackground: false,
    signatureBgColor: "#000000",
    signatureBgOpacity: 30,
    profileVerticalPosition: 25,
    showLogo: false,
    logoPositionX: 50,
    logoPositionY: 72,
    logoScale: 40,
    logoOpacity: 100,
};


// Editor Provider Component
export function EditorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<EditorState[]>([defaultState]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { addTemplate } = useTemplates();

  const currentState = history[currentStateIndex] || null;
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;

  const setInitialState = useCallback((initialState: EditorState) => {
    setHistory([initialState]);
    setCurrentStateIndex(0);
    setIsReady(true);
  }, []);

  const updateState = useCallback((newState: Partial<EditorState>) => {
    if (!isReady || !currentState) return;
    const nextState = { ...currentState, ...newState };
    const newHistory = history.slice(0, currentStateIndex + 1);
    setHistory([...newHistory, nextState]);
    setCurrentStateIndex(newHistory.length);
  }, [isReady, currentState, currentStateIndex, history]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [canUndo, currentStateIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentStateIndex(currentStateIndex + 1);
    }
  }, [canRedo, currentStateIndex]);

  const onSaveAsTemplate = useCallback(async () => {
    if (!currentState) return;
    const templateName = prompt("Digite um nome para o novo modelo:");
    if (!templateName) return;

    const thumbnail = await captureThumbnail(toast);
    if (!thumbnail) return;
    
    addTemplate(templateName, currentState, thumbnail);
    toast({ title: "Modelo Salvo!", description: `O modelo "${templateName}" foi adicionado.` });

  }, [addTemplate, currentState, toast]);

  const onExportJPG = useCallback(() => captureAndDownload('jpeg', toast), [toast]);
  const onExportPNG = useCallback(() => captureAndDownload('png', toast), [toast]);

  const onExportMP4 = useCallback(() => {
    toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
  }, [toast]);

  const value = useMemo(() => ({
    isReady,
    canUndo,
    canRedo,
    currentState,
    undo,
    redo,
    updateState,
    setInitialState,
    onSaveAsTemplate,
    onExportJPG,
    onExportPNG,
    onExportMP4,
  }), [isReady, canUndo, canRedo, currentState, undo, redo, updateState, setInitialState, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Custom hook to use the editor context
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
