
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { quotes, templates } from "@/lib/dados";
import type { EstiloTexto, ProporcaoTela, EditorState } from "./tipos";
import { VisualizacaoEditor } from "./visualizacao";
import { PainelControles } from "./painel-controles";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useEditor } from "../contexts/editor-context";

// Estado inicial para o editor.
const getInitialState = (): EditorState => ({
    text: "",
    fontFamily: "Poppins",
    fontSize: 5, // Agora representa um percentual da largura do container (cqw)
    fontWeight: "normal",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0.2,
    backgroundStyle: {
        type: 'media',
        value: "",
    },
    aspectRatio: "9:16",
    activeTemplateId: null,
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    profileVerticalPosition: 25,
});


// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            <div className="flex-1 flex justify-center items-center bg-muted/40 relative overflow-hidden">
                 <Skeleton className="w-full h-full max-w-sm aspect-[9/16] rounded-lg" />
            </div>
             <div className="w-full md:w-96 border-t md:border-t-0 md:border-l bg-background">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-full w-full" />
             </div>
        </div>
    );
}

// Componente principal do cliente do editor de vídeo.
export function EditorClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { profile, isLoaded: isProfileLoaded } = useProfile();
  const { setUndoState } = useEditor();


  // Histórico de estados para a funcionalidade de desfazer.
  const [history, setHistory] = useState<EditorState[]>([getInitialState()]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const currentState = history[currentStateIndex];
  
  // Função para atualizar o estado e adicionar ao histórico.
  const updateState = (newState: Partial<EditorState>) => {
    const nextState = { ...currentState, ...newState };
    const newHistory = history.slice(0, currentStateIndex + 1);
    setHistory([...newHistory, nextState]);
    setCurrentStateIndex(newHistory.length);
  };
  
  // Função para desfazer a última ação.
  const undo = useCallback(() => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [currentStateIndex]);

  const canUndo = currentStateIndex > 0;
  
  useEffect(() => {
    setUndoState({ canUndo, undo });
  }, [canUndo, undo, setUndoState]);

  // Efeito para inicializar o editor com base nos parâmetros da URL.
  useEffect(() => {
    if (!isProfileLoaded) return; // Aguarda o perfil ser carregado

    const quoteParam = searchParams.get("quote");
    const templateIdParam = searchParams.get("templateId");
    
    let initialState = getInitialState();

    // Define o texto inicial a partir do parâmetro 'quote' ou de uma citação aleatória.
    if (quoteParam) {
      initialState.text = decodeURIComponent(quoteParam);
    } else {
      initialState.text = quotes[Math.floor(Math.random() * quotes.length)].text;
    }
    
    // Configura o editor com base em um modelo, se um 'templateId' for fornecido.
    if (templateIdParam) {
      const templateId = parseInt(templateIdParam);
      const template = templates.find(t => t.id === templateId);

      if (template) {
        initialState.activeTemplateId = templateId;
        initialState.aspectRatio = template.aspectRatio as ProporcaoTela;
        
        if (template.id === -1) { // Se for o modelo padrão (ID -1), aplica estilos específicos.
            initialState.backgroundStyle = { type: 'solid', value: '#000000' };
            initialState.textStrokeWidth = 0.2;
            initialState.textShadowBlur = 1;
            initialState.textVerticalPosition = 50;
            initialState.textAlign = 'center';
            initialState.textColor = '#FFFFFF';
        } else if (template.id === -2) { // Modelo Twitter (do Perfil)
            initialState.backgroundStyle = { type: 'solid', value: 'var(--card)' };
            initialState.textColor = 'var(--foreground)';
            initialState.fontFamily = 'PT Sans';
            initialState.fontSize = 4;
            initialState.textAlign = 'left';
            initialState.textShadowBlur = 0;
            initialState.textStrokeWidth = 0;
            initialState.textVerticalPosition = 45;
            initialState.profileVerticalPosition = 25;
        } else {
            initialState.backgroundStyle = { type: 'media', value: template.imageUrl || '' };
        }
      }
    } else {
         // Se nenhum template for selecionado, usa um fundo preto como padrão.
         initialState.backgroundStyle = { type: 'solid', value: '#000000' };
    }
    
    setHistory([initialState]);
    setCurrentStateIndex(0);
    // Marca o editor como pronto para ser renderizado.
    setIsReady(true);
  }, [searchParams, isProfileLoaded]);

  const createTextStrokeShadow = useCallback((width: number, color: string): string => {
    if (width === 0) return "none";
    const shadows = [];
    const numPoints = 12; // Número de pontos ao redor
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const x = Math.cos(angle) * (width * 0.1);
        const y = Math.sin(angle) * (width * 0.1);
        shadows.push(`${x.toFixed(2)}cqw ${y.toFixed(2)}cqw 0 ${color}`);
    }
    return shadows.join(', ');
  }, []);
  
  const createMainShadow = useCallback((blur: number): string => {
    if (blur === 0) return "none";
    const shadows = [];
    const numPoints = 8; // Menos pontos para um efeito mais sutil
    const opacity = 0.5; // Opacidade da sombra

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const blurRadius = blur * 0.05; 
        const x = Math.cos(angle) * (blur * 0.1);
        const y = Math.sin(angle) * (blur * 0.1);
        shadows.push(`${x.toFixed(2)}cqw ${y.toFixed(2)}cqw ${blurRadius.toFixed(2)}cqw rgba(0,0,0,${opacity})`);
    }
    return shadows.join(', ');
  }, []);

  const combinedTextShadow = useMemo(() => {
    const textStrokeShadow = createTextStrokeShadow(currentState.textStrokeWidth, currentState.textStrokeColor);
    const mainTextShadow = createMainShadow(currentState.textShadowBlur);
    
    if (textStrokeShadow !== "none" && mainTextShadow !== "none") {
      return `${textStrokeShadow}, ${mainTextShadow}`;
    }
    return textStrokeShadow !== "none" ? textStrokeShadow : mainTextShadow;
  }, [currentState.textStrokeWidth, currentState.textStrokeColor, currentState.textShadowBlur, createTextStrokeShadow, createMainShadow]);


  const textStyle: EstiloTexto = {
    fontFamily: currentState.fontFamily,
    fontSize: `${currentState.fontSize}cqw`,
    fontWeight: currentState.fontWeight,
    fontStyle: currentState.fontStyle,
    color: currentState.textColor,
    textAlign: currentState.textAlign,
    textShadow: combinedTextShadow,
    lineHeight: 1.3,
  };
  
  if (!isReady || !isProfileLoaded) {
     return <EditorSkeleton />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      {/* Área de visualização */}
      <div className="flex-1 flex justify-center items-center bg-muted/40 relative overflow-hidden p-4">
        <VisualizacaoEditor
            aspectRatio={currentState.aspectRatio}
            backgroundStyle={currentState.backgroundStyle}
            text={currentState.text}
            textStyle={textStyle}
            textVerticalPosition={currentState.textVerticalPosition}
            showProfileSignature={currentState.showProfileSignature}
            profile={profile}
            signaturePositionX={currentState.signaturePositionX}
            signaturePositionY={currentState.signaturePositionY}
            signatureScale={currentState.signatureScale}
            showSignaturePhoto={currentState.showSignaturePhoto}
            showSignatureUsername={currentState.showSignatureUsername}
            showSignatureSocial={currentState.showSignatureSocial}
            activeTemplateId={currentState.activeTemplateId}
            profileVerticalPosition={currentState.profileVerticalPosition}
        />
      </div>
      
      {/* Painel de Controles */}
      <div className="w-full md:w-96 border-t md:border-t-0 md:border-l bg-background">
        <PainelControles
            text={currentState.text}
            onTextChange={(text) => updateState({ text })}
            fontFamily={currentState.fontFamily}
            onFontFamilyChange={(fontFamily) => updateState({ fontFamily })}
            fontSize={currentState.fontSize}
            onFontSizeChange={(fontSize) => updateState({ fontSize })}
            fontWeight={currentState.fontWeight}
            onFontWeightChange={(fontWeight) => updateState({ fontWeight })}
            fontStyle={currentState.fontStyle}
            onFontStyleChange={(fontStyle) => updateState({ fontStyle })}
            textColor={currentState.textColor}
            onTextColorChange={(textColor) => updateState({ textColor })}
            textAlign={currentState.textAlign}
            onTextAlignChange={(textAlign) => updateState({ textAlign })}
            textShadowBlur={currentState.textShadowBlur}
            onTextShadowBlurChange={(textShadowBlur) => updateState({ textShadowBlur })}
            textVerticalPosition={currentState.textVerticalPosition}
            onTextVerticalPositionChange={(textVerticalPosition) => updateState({ textVerticalPosition })}
            textStrokeColor={currentState.textStrokeColor}
            onTextStrokeColorChange={(textStrokeColor) => updateState({ textStrokeColor })}
            textStrokeWidth={currentState.textStrokeWidth}
            onTextStrokeWidthChange={(textStrokeWidth) => updateState({ textStrokeWidth })}
            backgroundStyle={currentState.backgroundStyle}
            onBackgroundStyleChange={(backgroundStyle) => updateState({ backgroundStyle })}
            aspectRatio={currentState.aspectRatio}
            onAspectRatioChange={(ratio) => updateState({ aspectRatio: ratio })}
            onUndo={undo}
            canUndo={canUndo}
            showProfileSignature={currentState.showProfileSignature}
            onShowProfileSignatureChange={(show) => updateState({ showProfileSignature: show })}
            signaturePositionX={currentState.signaturePositionX}
            onSignaturePositionXChange={(x) => updateState({ signaturePositionX: x })}
            signaturePositionY={currentState.signaturePositionY}
            onSignaturePositionYChange={(y) => updateState({ signaturePositionY: y })}
            signatureScale={currentState.signatureScale}
            onSignatureScaleChange={(scale) => updateState({ signatureScale: scale })}
            showSignaturePhoto={currentState.showSignaturePhoto}
            onShowSignaturePhotoChange={(show) => updateState({ showSignaturePhoto: show })}
            showSignatureUsername={currentState.showSignatureUsername}
            onShowSignatureUsernameChange={(show) => updateState({ showSignatureUsername: show })}
            showSignatureSocial={currentState.showSignatureSocial}
            onShowSignatureSocialChange={(show) => updateState({ showSignatureSocial: show })}
            activeTemplateId={currentState.activeTemplateId}
            profileVerticalPosition={currentState.profileVerticalPosition}
            onProfileVerticalPositionChange={(profileVerticalPosition) => updateState({ profileVerticalPosition })}
        />
      </div>
    </div>
  );
}
