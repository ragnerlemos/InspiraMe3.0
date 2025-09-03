
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { quotes, templates } from "@/lib/dados";
import type { EstiloTexto, ProporcaoTela, EstiloFundo, EditorState } from "./tipos";
import { VisualizacaoEditor } from "./visualizacao";
import { PainelControles } from "./painel-controles";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";

// Estado inicial para o editor.
const getInitialState = (): EditorState => ({
    text: "",
    fontFamily: "Poppins",
    fontSize: 23,
    fontWeight: "normal",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 0,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0,
    backgroundStyle: {
        type: 'media',
        value: templates[0].imageUrl,
    },
    aspectRatio: "9:16",
    activeTemplateId: null,
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    showSignaturePhoto: true,
    showSignatureUsername: true,
    showSignatureSocial: true,
    profileVerticalPosition: 25,
});


// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="flex justify-center items-start">
                    <Skeleton className="w-full max-w-sm aspect-[9/16] rounded-lg" />
                </div>
                <div className="w-full max-w-md mx-auto md:col-span-2">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Componente principal do cliente do editor de vídeo.
export function EditorClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { profile, isLoaded: isProfileLoaded } = useProfile();

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
            initialState.backgroundStyle = { type: 'solid', value: '#333333' };
            initialState.textStrokeWidth = 3.5;
            initialState.textShadowBlur = 16;
            initialState.textVerticalPosition = 50;
            initialState.textAlign = 'center';
            initialState.textColor = '#FFFFFF';
        } else if (template.id === -2) { // Modelo Twitter (do Perfil)
            initialState.backgroundStyle = { type: 'solid', value: 'var(--card)' };
            initialState.textColor = 'var(--foreground)';
            initialState.fontFamily = 'PT Sans';
            initialState.fontSize = 20;
            initialState.textAlign = 'left';
            initialState.textShadowBlur = 0;
            initialState.textStrokeWidth = 0;
            initialState.textVerticalPosition = 45;
            initialState.profileVerticalPosition = 25;
        } else {
            initialState.backgroundStyle = { type: 'media', value: template.imageUrl };
        }
      }
    }
    
    setHistory([initialState]);
    setCurrentStateIndex(0);
    // Marca o editor como pronto para ser renderizado.
    setIsReady(true);
  }, [searchParams, isProfileLoaded]);

  // Gera a sombra do texto para simular um contorno.
  // Isso cria um contorno mais suave e que não sobrepõe o texto.
  const createTextStrokeShadow = (width: number, color: string): string => {
    if (width === 0) return "none";
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (Math.sqrt(x * x + y * y) <= width) {
          shadows.push(`${x}px ${y}px 0 ${color}`);
        }
      }
    }
    return shadows.join(", ");
  };
  
  const textStrokeShadow = createTextStrokeShadow(currentState.textStrokeWidth, currentState.textStrokeColor);
  const mainTextShadow = currentState.textShadowBlur > 0 ? `2px 2px ${currentState.textShadowBlur}px rgba(0,0,0,0.8)` : "none";
  
  const combinedTextShadow = 
    textStrokeShadow !== "none" && mainTextShadow !== "none"
      ? `${textStrokeShadow}, ${mainTextShadow}`
      : textStrokeShadow !== "none"
      ? textStrokeShadow
      : mainTextShadow;


  // Estilos CSS para o texto, aplicados dinamicamente.
  const textStyle: EstiloTexto = {
    fontFamily: currentState.fontFamily,
    fontSize: `${currentState.fontSize}px`,
    fontWeight: currentState.fontWeight,
    fontStyle: currentState.fontStyle,
    color: currentState.textColor,
    textAlign: currentState.textAlign,
    textShadow: combinedTextShadow,
    lineHeight: 1.3,
  };
  
  // Renderiza um esqueleto de carregamento enquanto o editor não está pronto.
  if (!isReady || !isProfileLoaded) {
     return <EditorSkeleton />;
  }

  return (
    <div className="container mx-auto py-4 md:py-8 h-full">
      <div className="grid md:grid-cols-3 gap-8 items-start h-full">
        <div className="md:col-span-1">
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
                showSignaturePhoto={currentState.showSignaturePhoto}
                showSignatureUsername={currentState.showSignatureUsername}
                showSignatureSocial={currentState.showSignatureSocial}
                activeTemplateId={currentState.activeTemplateId}
                profileVerticalPosition={currentState.profileVerticalPosition}
            />
        </div>
        <div className="md:col-span-2">
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
    </div>
  );
}
