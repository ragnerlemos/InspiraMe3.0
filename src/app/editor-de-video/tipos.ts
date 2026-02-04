
import type { CSSProperties } from 'react';

// Estilo de texto para o editor de vídeo
export interface EstiloTexto {
  fontFamily: string;
  fontSize: string | number;
  fontWeight: string | number;
  fontStyle: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

// Representa o estado completo do editor de vídeo.
export interface EditorState {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  textShadowBlur: number;
  textShadowOpacity: number;
  textVerticalPosition: number;
  textStrokeColor: string;
  textStrokeWidth: number;
  textStrokeCornerStyle: 'rounded' | 'miter';
  applyEffectsToEmojis: boolean;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  backgroundStyle: { type: 'solid' | 'media'; value: string };
  filmColor: string;
  filmOpacity: number;
  aspectRatio: '9 / 16' | '16 / 9' | '1 / 1' | '4 / 5';
  activeTemplateId: string | null;
  showProfileSignature: boolean;
  showLogo: boolean;
  logoPositionX: number;
  logoPositionY: number;
  logoScale: number;
  logoOpacity: number;
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
}
