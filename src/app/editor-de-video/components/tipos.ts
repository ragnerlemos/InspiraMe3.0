// Arquivo para centralizar as definições de tipos compartilhadas entre os componentes do editor.
import type { ProfileData } from "@/hooks/use-profile";

// Define as possíveis proporções de tela que podem ser usadas no editor.
export type ProporcaoTela = "1:1" | "9:16" | "16:9";

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
    textVerticalPosition: number;
    textStrokeColor: string;
    textStrokeWidth: number;
    backgroundStyle: EstiloFundo;
    aspectRatio: ProporcaoTela;
    activeTemplateId: number | null;
}

// Define as propriedades (props) para o componente de visualização do editor.
export interface VisualizacaoEditorProps {
    aspectRatio: ProporcaoTela;
    backgroundStyle: EstiloFundo;
    text: string;
    textStyle: EstiloTexto;
    textVerticalPosition: number;
    activeTemplateId: number | null;
    profile: ProfileData;
}

// Define as propriedades para o componente que contém os painéis de controle.
export interface PainelControlesProps extends PainelTextoProps, PainelEstiloProps, PainelFundoProps {
    onUndo: () => void;
    canUndo: boolean;
}

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
    textColor: string;
    onTextColorChange: (color: string) => void;
    textAlign: "left" | "center" | "right";
    onTextAlignChange: (align: "left" | "center" | "right") => void;
    textShadowBlur: number;
    onTextShadowBlurChange: (blur: number) => void;
    textVerticalPosition: number;
    onTextVerticalPositionChange: (position: number) => void;
    textStrokeColor: string;
    onTextStrokeColorChange: (color: string) => void;
    textStrokeWidth: number;
    onTextStrokeWidthChange: (width: number) => void;
}

// Define as propriedades para o painel de upload de fundo.
export interface PainelFundoProps {
    backgroundStyle: EstiloFundo;
    onBackgroundStyleChange: (style: EstiloFundo) => void;
    aspectRatio: ProporcaoTela;
    onAspectRatioChange: (ratio: ProporcaoTela) => void;
}

// Props para o componente de visualização do perfil.
export interface VisualizacaoPerfilProps {
    profile: ProfileData;
    text: string;
    textStyle: EstiloTexto;
}
