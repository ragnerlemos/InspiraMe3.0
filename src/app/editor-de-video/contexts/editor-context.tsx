
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import type { EditorState, EstiloTexto } from '../tipos';
import { captureAndDownload, captureAndShare, captureThumbnail } from '../exportar';
import { useProfile } from '@/hooks/use-profile';
import { useProjects } from '@/hooks/use-projects';
import { createStrokeStyle, createDropShadowStyle } from '../utils/text-style-utils';

export interface EditorContextType {
  isReady: boolean;
  canUndo: boolean;
  canRedo: boolean;
  currentState: EditorState | null;
  baseTextStyle: EstiloTexto;
  textEffectsStyle: EstiloTexto;
  dropShadowStyle: EstiloTexto;
  undo: () => void;
  redo: () => void;
  updateState: (newState: Partial<EditorState>) => void;
  setInitialState: (initialState: EditorState) => void;
  onSaveAsTemplate: () => Promise<void>;
  onSaveProject: () => Promise<void>;
  onExportJPG: () => void;
  onExportPNG: (share?: boolean) => void;
  onExportMP4: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<EditorState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { addTemplate } = useTemplates();
  const { profile } = useProfile();
  const { addProject, updateProject } = useProjects();

  const currentState = isReady ? history[currentStateIndex] : null;
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;

  const { baseTextStyle, textEffectsStyle, dropShadowStyle } = useMemo(() => {
      if (!currentState) return { baseTextStyle: {}, textEffectsStyle: {}, dropShadowStyle: {} };

      const baseStyle: EstiloTexto = {
          fontFamily: currentState.fontFamily,
          fontSize: `${currentState.fontSize}cqw`,
          fontWeight: currentState.fontWeight,
          fontStyle: currentState.fontStyle,
          color: currentState.textColor,
          textAlign: currentState.textAlign,
          lineHeight: currentState.lineHeight,
          letterSpacing: `${(currentState.letterSpacing || 0) / 100}em`,
          wordSpacing: `${(currentState.wordSpacing || 0) / 100}em`,
      };

      const strokeStyle = createStrokeStyle(
          currentState.textStrokeWidth,
          currentState.textStrokeColor,
          currentState.textStrokeCornerStyle
      );
      
      const shadowStyle = createDropShadowStyle(
          currentState.textShadowBlur,
          currentState.textShadowOpacity
      );

      const effectsStyle = {
        ...strokeStyle,
      };

      return { baseTextStyle: baseStyle, textEffectsStyle: effectsStyle, dropShadowStyle: shadowStyle };
  }, [currentState]);

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

  const undo = useCallback(() => { if (canUndo) setCurrentStateIndex(currentStateIndex - 1); }, [canUndo, currentStateIndex]);
  const redo = useCallback(() => { if (canRedo) setCurrentStateIndex(currentStateIndex + 1); }, [canRedo, currentStateIndex]);

  const onSaveAsTemplate = useCallback(async () => {
    if (!currentState || !profile) return;
    const templateName = prompt("Digite um nome para o novo modelo:");
    if (!templateName) return;

    const thumbnail = await captureThumbnail(toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
    if (!thumbnail) return;
    
    addTemplate(templateName, currentState, thumbnail);
    toast({ title: "Modelo Salvo!", description: `O modelo "${templateName}" foi adicionado.` });

  }, [addTemplate, currentState, toast, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);

  const onSaveProject = useCallback(async () => {
    if (!currentState || !profile) return;

    const thumbnail = await captureThumbnail(toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
    if (!thumbnail) {
        toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível gerar a miniatura do projeto.'});
        return;
    }

    if (currentState.projectId) {
        // Atualizar projeto existente
        updateProject(currentState.projectId, currentState, thumbnail);
        toast({ title: 'Projeto Atualizado!', description: 'Suas alterações foram salvas.'});
    } else {
        // Salvar como novo projeto
        const projectName = prompt("Digite um nome para o novo projeto:");
        if (!projectName) return;

        const newProjectId = addProject({
            name: projectName,
            editorState: currentState,
            thumbnail: thumbnail,
        });

        // Atualiza o estado atual com o novo ID do projeto para salvamentos futuros
        updateState({ projectId: newProjectId });

        toast({ title: 'Projeto Salvo!', description: `O projeto "${projectName}" foi salvo.`});
    }
  }, [currentState, profile, toast, baseTextStyle, textEffectsStyle, dropShadowStyle, addProject, updateProject, updateState]);

  const onExportJPG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('jpeg', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
  }, [toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);
  
  const onExportPNG = useCallback((share = false) => {
      if(!currentState || !profile) return;
      if (share) {
          captureAndShare(toast, currentState);
      } else {
          captureAndDownload('png', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
      }
  }, [toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);

  const onExportMP4 = useCallback(() => {
    toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
  }, [toast]);

  const value = useMemo(() => ({
    isReady,
    canUndo,
    canRedo,
    currentState,
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
    undo,
    redo,
    updateState,
    setInitialState,
    onSaveAsTemplate,
    onSaveProject,
    onExportJPG,
    onExportPNG,
    onExportMP4,
  }), [isReady, canUndo, canRedo, currentState, baseTextStyle, textEffectsStyle, dropShadowStyle, undo, redo, updateState, setInitialState, onSaveAsTemplate, onSaveProject, onExportJPG, onExportPNG, onExportMP4]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
