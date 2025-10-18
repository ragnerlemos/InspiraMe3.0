
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import type { EditorState } from '../tipos';
import { captureAndDownload, captureThumbnail } from '../exportar';
import { useProfile } from '@/hooks/use-profile';
import { useWindowSize } from 'react-use';


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

// O estado padrão agora tem valores mais seguros para o primeiro render.
// O texto inicial é nulo para que possamos mostrar o loading até a frase real ser carregada.
const defaultState: EditorState = {
    text: "",
    fontFamily: "Poppins",
    fontSize: 5,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1,
    textShadowOpacity: 75,
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
  const [history, setHistory] = useState<EditorState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { addTemplate } = useTemplates();
  const { profile } = useProfile();
  const { width: windowWidth } = useWindowSize();

  const currentState = isReady ? history[currentStateIndex] : null;
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;

    // A lógica para calcular o textStyle foi movida para dentro do contexto
    // para que possa ser passada para as funções de exportação.
    const textStyle = useMemo(() => {
        if (!currentState) return {};
        const [aspectW, aspectH] = currentState.aspectRatio.replace(/\s/g, "").split('/').map(Number);
        const isVertical = aspectH > aspectW;
        
        // Simula uma largura de contêiner. Para exportação, usamos uma base fixa (ex: 1080px).
        // Para a tela, podemos usar uma aproximação baseada na largura da janela.
        const containerWidth = 1080; // Largura base para cálculo de exportação
        const calculatedFontSize = (currentState.fontSize / 100) * containerWidth;

        const createTextStrokeShadow = (strokeWidth: number, color: string): string => {
            if (strokeWidth === 0) return "none";
            const strokeWidthPx = (strokeWidth / 100) * calculatedFontSize * 0.2;
            if (strokeWidthPx === 0) return "none";

            const shadows = [];
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * 2 * Math.PI;
                shadows.push(`${(Math.cos(angle) * strokeWidthPx).toFixed(2)}px ${(Math.sin(angle) * strokeWidthPx).toFixed(2)}px 0 ${color}`);
            }
            return shadows.join(', ');
        };

        const createMainShadow = (blur: number, opacity: number): string => {
            if (blur === 0 && opacity === 0) return "none";
            const shadowBlurPx = (blur / 100) * calculatedFontSize;
            const shadowOpacity = opacity / 100;
            const baseOffset = (blur / 100) * calculatedFontSize * 0.2;
            return `${baseOffset.toFixed(2)}px ${baseOffset.toFixed(2)}px ${shadowBlurPx.toFixed(2)}px rgba(0,0,0,${shadowOpacity})`;
        };

        const textStrokeShadow = createTextStrokeShadow(currentState.textStrokeWidth || 0, currentState.textStrokeColor || '#000');
        const mainTextShadow = createMainShadow(currentState.textShadowBlur || 0, currentState.textShadowOpacity || 0);

        return {
            fontFamily: currentState.fontFamily,
            fontSize: `${calculatedFontSize}px`,
            fontWeight: currentState.fontWeight,
            fontStyle: currentState.fontStyle,
            color: currentState.textColor,
            textAlign: currentState.textAlign,
            lineHeight: currentState.lineHeight,
            letterSpacing: `${(currentState.letterSpacing || 0) / 100}em`,
            wordSpacing: `${(currentState.wordSpacing || 0) / 100}em`,
            textShadow: textStrokeShadow !== "none" && mainTextShadow !== "none" ? `${textStrokeShadow}, ${mainTextShadow}` : textStrokeShadow !== "none" ? textStrokeShadow : mainTextShadow,
        };
    }, [currentState, windowWidth]);


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
    if (!currentState || !profile) return;
    const templateName = prompt("Digite um nome para o novo modelo:");
    if (!templateName) return;

    const thumbnail = await captureThumbnail(toast, currentState, profile, textStyle);
    if (!thumbnail) return;
    
    addTemplate(templateName, currentState, thumbnail);
    toast({ title: "Modelo Salvo!", description: `O modelo "${templateName}" foi adicionado.` });

  }, [addTemplate, currentState, toast, profile, textStyle]);

  const onExportJPG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('jpeg', toast, currentState, profile, textStyle)
  }, [toast, currentState, profile, textStyle]);
  
  const onExportPNG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('png', toast, currentState, profile, textStyle)
  }, [toast, currentState, profile, textStyle]);


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
