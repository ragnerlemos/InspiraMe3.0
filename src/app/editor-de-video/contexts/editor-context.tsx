
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { EditorState } from '@/app/editor-de-video/tipos';

// O estado inicial para o editor
const initialState: EditorState = {
  text: 'Sua frase inspiradora aqui...',
  fontFamily: 'Poppins',
  fontSize: 3.5,
  fontWeight: 'bold',
  fontStyle: 'normal',
  textColor: '#FFFFFF',
  textAlign: 'center',
  textShadowBlur: 0,
  textShadowOpacity: 1,
  textVerticalPosition: 50,
  textStrokeColor: '#000000',
  textStrokeWidth: 0,
  textStrokeCornerStyle: 'rounded',
  applyEffectsToEmojis: false,
  letterSpacing: 0,
  lineHeight: 1.4,
  wordSpacing: 0,
  backgroundStyle: { type: 'solid', value: '#1a1a1a' },
  filmColor: '#000000',
  filmOpacity: 0,
  aspectRatio: '9 / 16',
  activeTemplateId: 'template-default',
  showProfileSignature: false,
  showLogo: false,
  logoPositionX: 50,
  logoPositionY: 95,
  logoScale: 40,
  logoOpacity: 100,
  signaturePositionX: 50,
  signaturePositionY: 90,
  signatureScale: 68,
  showSignaturePhoto: true,
  showSignatureUsername: true,
  showSignatureSocial: true,
  showSignatureBackground: true,
  signatureBgColor: '#000000',
  signatureBgOpacity: 50,
  profileVerticalPosition: 50,
};

// Interface para o valor do contexto
interface EditorContextType {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

// Cria o contexto com um valor padrão undefined
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// O provedor do contexto
export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editorState, setEditorState] = useState<EditorState>(initialState);

  return (
    <EditorContext.Provider value={{ editorState, setEditorState }}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
