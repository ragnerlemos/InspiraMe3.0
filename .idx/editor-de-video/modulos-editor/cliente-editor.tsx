
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { quotes } from "@/lib/dados";
import type { EstiloTexto, ProporcaoTela, EditorState } from "./tipos";
import { VisualizacaoEditor } from "./visualizacao";
import { PainelControles } from "./painel-controles";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useEditor } from "../contexts/editor-context";
import { useTemplates } from "@/hooks/use-templates";
import html2canvas from 'html2canvas';
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable";
import { useWindowSize } from "react-use";


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
    aspectRatio: "9 / 16",
    activeTemplateId: null,
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    profileVerticalPosition: 25,
    showLogo: false,
    logoPositionX: 85,
    logoPositionY: 10,
    logoScale: 40,
    logoOpacity: 100,
});


// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            <div className="flex-1 flex justify-center items-center bg-muted/40 p-4">
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
  const { setUndoState, setSaveActions } = useEditor();
  const { templates: allTemplates, isLoaded: areTemplatesLoaded, addTemplate } = useTemplates();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;


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

  // Função para refazer a última ação.
  const redo = useCallback(() => {
    if (currentStateIndex < history.length - 1) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  }, [currentStateIndex, history.length]);

  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;
  
  useEffect(() => {
    setUndoState({ canUndo, undo, canRedo, redo });
  }, [canUndo, undo, canRedo, redo, setUndoState]);

  const handleSaveAsTemplate = useCallback(async () => {
        const templateName = prompt("Digite um nome para o novo modelo:");
        if (!templateName) return;
        const previewElement = document.getElementById('editor-preview-content');
        if (previewElement) {
            try {
                const canvas = await html2canvas(previewElement, {
                    scale: 0.5,
                    useCORS: true,
                    backgroundColor: null, 
                });
                const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                
                addTemplate(templateName, currentState, thumbnail);

                toast({
                    title: "Modelo Salvo!",
                    description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
                });
            } catch (error) {
                console.error("Erro ao criar thumbnail:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao Salvar",
                    description: "Não foi possível gerar a pré-visualização do modelo.",
                });
            }
        }
    }, [addTemplate, currentState, toast]);

    const captureCanvas = useCallback(async (format: 'jpeg' | 'png') => {
        const previewElement = document.getElementById('editor-preview-content');
        if (!previewElement) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível encontrar a área de visualização.' });
            return;
        }

        toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}.` });
        
        try {
            const canvas = await html2canvas(previewElement, {
                useCORS: true,
                backgroundColor: null, 
                scale: 4, // Aumenta a resolução para melhor qualidade
            });

            const image = canvas.toDataURL(`image/${format}`, format === 'png' ? 1.0 : 0.9);
            
            const link = document.createElement('a');
            link.href = image;
            link.download = `quotevid-export.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({ title: 'Sucesso!', description: `A imagem foi baixada como ${link.download}.` });

        } catch (error) {
            console.error('Erro ao exportar imagem:', error);
            toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        }
    }, [toast]);
    
    const handleExportJPG = useCallback(() => captureCanvas('jpeg'), [captureCanvas]);
    const handleExportPNG = useCallback(() => captureCanvas('png'), [captureCanvas]);

    const handleExportMP4 = useCallback(() => {
        // Lógica de exportação de vídeo será implementada aqui
        toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
    }, [toast]);
    
    useEffect(() => {
        setSaveActions({
            onSaveAsTemplate: handleSaveAsTemplate,
            onExportJPG: handleExportJPG,
            onExportPNG: handleExportPNG,
            onExportMP4: handleExportMP4,
        });
    }, [handleSaveAsTemplate, handleExportJPG, handleExportPNG, handleExportMP4, setSaveActions]);

  // Efeito para inicializar o editor com base nos parâmetros da URL.
  useEffect(() => {
    if (!isProfileLoaded || !areTemplatesLoaded) return; // Aguarda o perfil e os templates serem carregados

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
      const template = allTemplates.find(t => t.id === templateIdParam);

      if (template) {
        // Aplica o estado salvo no template
        initialState = { ...initialState, ...template.editorState };
        initialState.activeTemplateId = template.id === 'template-twitter' ? -2 : template.id === 'template-default' ? -1 : null;
      }
    } else {
         // Se nenhum template for selecionado, usa um fundo preto como padrão.
         initialState.backgroundStyle = { type: 'solid', value: '#000000' };
    }
    
    setHistory([initialState]);
    setCurrentStateIndex(0);
    // Marca o editor como pronto para ser renderizado.
    setIsReady(true);
  }, [searchParams, isProfileLoaded, areTemplatesLoaded, allTemplates]);

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

  const editorProps = {
    aspectRatio: currentState.aspectRatio,
    backgroundStyle: currentState.backgroundStyle,
    text: currentState.text,
    textStyle: textStyle,
    textVerticalPosition: currentState.textVerticalPosition,
    showProfileSignature: currentState.showProfileSignature,
    profile: profile,
    signaturePositionX: currentState.signaturePositionX,
    signaturePositionY: currentState.signaturePositionY,
    signatureScale: currentState.signatureScale,
    showSignaturePhoto: currentState.showSignaturePhoto,
    showSignatureUsername: currentState.showSignatureUsername,
    showSignatureSocial: currentState.showSignatureSocial,
    activeTemplateId: typeof currentState.activeTemplateId === 'number' ? currentState.activeTemplateId : null,
    profileVerticalPosition: currentState.profileVerticalPosition,
    showLogo: currentState.showLogo,
    logoPositionX: currentState.logoPositionX,
    logoPositionY: currentState.logoPositionY,
    logoScale: currentState.logoScale,
    logoOpacity: currentState.logoOpacity,
  };

  const controlsPanel = (
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
        activeTemplateId={typeof currentState.activeTemplateId === 'number' ? currentState.activeTemplateId : null}
        profileVerticalPosition={currentState.profileVerticalPosition}
        onProfileVerticalPositionChange={(profileVerticalPosition) => updateState({ profileVerticalPosition })}
        showLogo={currentState.showLogo}
        onShowLogoChange={(show) => updateState({ showLogo: show })}
        logoPositionX={currentState.logoPositionX}
        onLogoPositionXChange={(x) => updateState({ logoPositionX: x })}
        logoPositionY={currentState.logoPositionY}
        onLogoPositionYChange={(y) => updateState({ logoPositionY: y })}
        logoScale={currentState.logoScale}
        onLogoScaleChange={(scale) => updateState({ logoScale: scale })}
        logoOpacity={currentState.logoOpacity}
        onLogoOpacityChange={(opacity) => updateState({ logoOpacity: opacity })}
        profile={profile}
    />
  );


  // Layout para Mobile e Desktop
  return (
    <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={100} minSize={30} className={!isDesktop ? "md:!flex-none" : ""}>
             <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 min-h-0 flex items-center justify-center bg-muted/40">
                    <div className="w-full h-full max-w-[900px] flex justify-center items-center p-4 md:p-8">
                        <VisualizacaoEditor {...editorProps} />
                    </div>
                </div>
                {/* O painel de controles para mobile é renderizado aqui e controlado internamente */}
                {!isDesktop && controlsPanel}
            </div>
        </Panel>
        {isDesktop && <PanelResizeHandle />}
        {isDesktop && (
          <Panel defaultSize={35} minSize={30} maxSize={45}>
              <div className="h-full w-full border-l bg-background">
                   {controlsPanel}
              </div>
          </Panel>
        )}
    </PanelGroup>
  );
}
