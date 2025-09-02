// Arquivo para centralizar as definições de tipos compartilhadas entre os componentes do editor.

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


// Define as propriedades (props) para o componente de visualização do editor.
export interface VisualizacaoEditorProps {
    aspectRatio: ProporcaoTela;
    onAspectRatioChange: (ratio: ProporcaoTela) => void;
    backgroundStyle: EstiloFundo;
    text: string;
    textStyle: EstiloTexto;
    textVerticalPosition: number;
}

// Define as propriedades para o componente que contém os painéis de controle.
export interface PainelControlesProps extends PainelTextoProps, PainelEstiloProps, PainelFundoProps {}

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
}
