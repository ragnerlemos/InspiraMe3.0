
// Arquivo para centralizar as definições de tipos compartilhadas entre os componentes do editor.
import type { ProfileData } from "@/hooks/use-profile";
import type React from "react";

// Define as possíveis proporções de tela que podem ser usadas no editor.
export type ProporcaoTela = "1 / 1" | "9 / 16" | "16 / 9";

// Define o tipo para o objeto de estilo do texto, usando as propriedades CSS do React.
export type EstiloTexto = React.CSSProperties;

// Tipos para o estilo de fundo
export type TipoFundo = 'media' | 'solid' | 'gradient';
export type EstiloFundo = {
    type: TipoFundo;
    value: string; // URL da mídia, cor sólida, ou string do gradiente
};

// Agrupa todo o estado do editor em um único objeto.
export interface EditorState {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textColor: string;
    textAlign: "left" | "center" | "right";
    textShadowBlur: number;
    textShadowOpacity: number; // Agora é "Intensidade"
    textVerticalPosition: number;
    textStrokeColor: string;
    textStrokeWidth: number;
    textStrokeCornerStyle: 'rounded' | 'square'; // Novo!
    applyEffectsToEmojis: boolean; // Novo!
    letterSpacing: number;
    lineHeight: number;
    wordSpacing: number;
    backgroundStyle: EstiloFundo;
    filmColor: string;
    filmOpacity: number;
    aspectRatio: ProporcaoTela;
    activeTemplateId: string | null;
    showProfileSignature: boolean;
    signaturePositionX: number;
    signaturePositionY: number;
    signatureScale: number;
    showSignaturePhoto: boolean;
    showSignatureUsername: boolean;
    showSignatureSocial: boolean;
    showSignatureBackground: boolean;
    signatureBgColor: string;
    signatureBgOpacity: number;
    profileVerticalPosition: number;
    showLogo: boolean;
    logoPositionX: number;
    logoPositionY: number;
    logoScale: number;
    logoOpacity: number;
}

export interface EditorControlState {
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  onSaveAsTemplate: () => Promise<void>;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
  isReady: boolean;
}

// Tipo para um vídeo salvo pelo usuário.
export interface SavedVideo {
    id: string;
    thumbnail: string; // Um data URL da imagem de preview
    editorState: EditorState;
    createdAt: string; // Data no formato ISO
}
