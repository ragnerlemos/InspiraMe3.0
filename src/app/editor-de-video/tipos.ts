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


// Define as propriedades (props) para o componente de visualização do editor.
export interface VisualizacaoEditorProps {
    aspectRatio: ProporcaoTela;
    backgroundStyle: EstiloFundo;
    filmColor: string;
    filmOpacity: number;
    text: string;
    // O textStyle foi removido daqui pois a lógica será mais complexa e gerenciada internamente
    textVerticalPosition: number;
    showProfileSignature: boolean;
    profile: ProfileData;
    signaturePositionX: number;
    signaturePositionY: number;
    signatureScale: number;
    showSignaturePhoto: boolean;
    showSignatureUsername: boolean;
    showSignatureSocial: boolean;
    showSignatureBackground: boolean;
    signatureBgColor: string;
    signatureBgOpacity: number;
    activeTemplateId: string | null;
    profileVerticalPosition: number;
    showLogo: boolean;
    logoPositionX: number;
    logoPositionY: number;
    logoScale: number;
    logoOpacity: number;
}

// Define as propriedades para o componente que contém os painéis de controle.
export interface PainelControlesProps extends PainelTextoProps, PainelEstiloProps, PainelFundoProps, PainelCoresProps {}

// Define as propriedades para o painel de edição de texto.
export interface PainelTextoProps {
    text: string;
    onTextChange: (text: string) => void;
}

// Define as propriedades para o painel de customização de estilo.
export interface PainelEstiloProps {
    fontFamily: string;
    onFontFamilyChange: (font: string) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    fontWeight: "normal" | "bold";
    onFontWeightChange: (weight: "normal" | "bold") => void;
    fontStyle: "normal" | "italic";
    onFontStyleChange: (style: "normal" | "italic") => void;
    textAlign: "left" | "center" | "right";
    onTextAlignChange: (align: "left" | "center" | "right") => void;
    textShadowBlur: number;
    onTextShadowBlurChange: (blur: number) => void;
    textShadowOpacity: number; // Intensidade
    onTextShadowOpacityChange: (opacity: number) => void;
    textVerticalPosition: number;
    onTextVerticalPositionChange: (position: number) => void;
    textStrokeColor: string;
    onTextStrokeColorChange: (color: string) => void;
    textStrokeWidth: number;
    onTextStrokeWidthChange: (width: number) => void;
    textStrokeCornerStyle: 'rounded' | 'square'; // Novo!
    onTextStrokeCornerStyleChange: (style: 'rounded' | 'square') => void; // Novo!
    applyEffectsToEmojis: boolean; // Novo!
    onApplyEffectsToEmojisChange: (apply: boolean) => void; // Novo!
    letterSpacing: number;
    onLetterSpacingChange: (spacing: number) => void;
    lineHeight: number;
    onLineHeightChange: (height: number) => void;
    wordSpacing: number;
    onWordSpacingChange: (spacing: number) => void;
    activeTemplateId: string | null;
    profileVerticalPosition: number;
    onProfileVerticalPositionChange: (position: number) => void;
}

// Define as propriedades para o painel de upload de fundo.
export interface PainelFundoProps {
    backgroundStyle: EstiloFundo;
    onBackgroundStyleChange: (style: EstiloFundo) => void;
    aspectRatio: ProporcaoTela;
    onAspectRatioChange: (ratio: ProporcaoTela) => void;
    showProfileSignature: boolean;
    onShowProfileSignatureChange: (show: boolean) => void;
    signaturePositionX: number;
    onSignaturePositionXChange: (x: number) => void;
    signaturePositionY: number;
    onSignaturePositionYChange: (y: number) => void;
    signatureScale: number;
    onSignatureScaleChange: (scale: number) => void;
    showSignaturePhoto: boolean;
    onShowSignaturePhotoChange: (show: boolean) => void;
    showSignatureUsername: boolean;
    onShowSignatureUsernameChange: (show: boolean) => void;
    showSignatureSocial: boolean;
    onShowSignatureSocialChange: (show: boolean) => void;
    showSignatureBackground: boolean;
    onShowSignatureBackgroundChange: (show: boolean) => void;
    signatureBgColor: string;
    onSignatureBgColorChange: (color: string) => void;
    signatureBgOpacity: number;
    onSignatureBgOpacityChange: (opacity: number) => void;
    showLogo: boolean;
    onShowLogoChange: (show: boolean) => void;
    logoPositionX: number;
    onLogoPositionXChange: (x: number) => void;
    logoPositionY: number;
    onLogoPositionYChange: (y: number) => void;
    logoScale: number;
    onLogoScaleChange: (scale: number) => void;
    logoOpacity: number;
    onLogoOpacityChange: (opacity: number) => void;
    profile: ProfileData;
}

// Propriedades para o novo painel de cores
export interface PainelCoresProps {
    textColor: string;
    onTextColorChange: (color: string) => void;
    backgroundStyle: EstiloFundo;
    onBackgroundStyleChange: (style: EstiloFundo) => void;
    filmColor: string;
    onFilmColorChange: (color: string) => void;
    filmOpacity: number;
    onFilmOpacityChange: (opacity: number) => void;
}


// Propriedades para o componente de visualização de perfil
export interface VisualizacaoPerfilProps {
  profile: ProfileData;
  text: string;
  // textStyle foi removido
  textVerticalPosition: number;
  profileVerticalPosition: number;
}
