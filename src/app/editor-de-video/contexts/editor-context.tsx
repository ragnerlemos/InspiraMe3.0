
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import { toPng, toJpeg } from 'html-to-image';
import type { EditorState } from '../tipos';

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
    if (!currentState) return;
    const nextState = { ...currentState, ...newState };
    const newHistory = history.slice(0, currentStateIndex + 1);
    setHistory([...newHistory, nextState]);
    setCurrentStateIndex(newHistory.length);
  }, [currentState, currentStateIndex, history]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [canUndo, currentStateIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [canRedo, currentStateIndex]);

  const onSaveAsTemplate = useCallback(async () => {
    if (!currentState) return;
    const templateName = prompt("Digite um nome para o novo modelo:");
    if (!templateName) return;
    const previewElement = document.getElementById('editor-preview-content');
    if (previewElement) {
        try {
            const thumbnail = await toJpeg(previewElement, { 
                quality: 0.8,
                pixelRatio: 1, // Use a lower resolution for thumbnails
            });
            addTemplate(templateName, currentState, thumbnail);
            toast({ title: "Modelo Salvo!", description: `O modelo "${templateName}" foi adicionado.` });
        } catch (error) {
            console.error("Erro ao criar thumbnail:", error);
            toast({ variant: "destructive", title: "Erro ao Salvar", description: "Não foi possível gerar a pré-visualização." });
        }
    }
  }, [addTemplate, currentState, toast]);

const captureCanvas = useCallback(async (format: 'jpeg' | 'png') => {
  const previewElement = document.getElementById('editor-preview-content') as HTMLElement | null;
  if (!previewElement || !currentState) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível encontrar a área de visualização.' });
    return;
  }
  toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}.` });

  try {
    // 1) Garantir que as fontes estejam carregadas.
    const fontsToLoad = [
      '1em "Poppins"',
      '700 1em "Poppins"',
      '1em "PT Sans"',
      '700 1em "PT Sans"',
      '1em "Merriweather"',
      'italic 1em "Merriweather"',
      '700 1em "Merriweather"',
      '1em "Lobster"'
    ];
    await Promise.all(fontsToLoad.map(f => document.fonts.load(f).catch(() => {})));
    await document.fonts.ready;

    // 2) Medir o elemento e preparar dimensões fixas em px
    const rect = previewElement.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    // 3) Função para copiar estilos computados em linha (recursiva)
    const cssProps = [
      'font-family','font-size','font-weight','font-style','letter-spacing','line-height','text-align',
      'color','direction','padding','margin','box-sizing','width','height','white-space','word-break',
      'word-wrap','text-transform','display','vertical-align','background','background-image',
      'background-size','background-position','background-repeat', 'text-shadow', 'transform'
    ];

    function inlineStylesRecursively(sourceEl: Element, targetEl: HTMLElement) {
      const computed = window.getComputedStyle(sourceEl);
      let cssText = '';
      cssProps.forEach(prop => {
        const val = computed.getPropertyValue(prop);
        if (val) cssText += `${prop}:${val};`;
      });
      targetEl.style.cssText += cssText;

      // processar filhos
      Array.from(sourceEl.children).forEach((child, i) => {
        const targetChild = targetEl.children[i] as HTMLElement | undefined;
        if (targetChild) {
          inlineStylesRecursively(child, targetChild);
        }
      });
    }

    // 4) Clonar e inlinear estilos
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.boxSizing = 'border-box';

    inlineStylesRecursively(previewElement, clone);

    // 5) Colocar o clone em um wrapper com dimensões exatas
    const wrapper = document.createElement('div');
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.overflow = 'hidden';
    wrapper.style.boxSizing = 'border-box';
    wrapper.appendChild(clone);

    // 7) Gerar a imagem com html-to-image
    const options: any = {
      width,
      height,
      pixelRatio: 3,
      cacheBust: true,
    };

    const dataUrl = format === 'png'
      ? await toPng(wrapper, options)
      : await toJpeg(wrapper, { ...options, quality: 0.95 });

    // 8) Forçar download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `inspire-me-export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Sucesso!', description: `A imagem foi baixada como ${link.download}.` });
  } catch (error) {
    console.error('Erro ao exportar imagem:', error);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
  }
}, [toast, currentState]);

  const onExportJPG = useCallback(() => captureCanvas('jpeg'), [captureCanvas]);
  const onExportPNG = useCallback(() => captureCanvas('png'), [captureCanvas]);

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
