#!/bin/bash
echo "Restaurando o editor para a versão addc261..."

# Restaurando src/app/editor-de-video/contexts/editor-context.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/contexts/editor-context.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import type { EditorState, EstiloTexto } from '../tipos';
import { captureAndDownload, captureThumbnail } from '../exportar';
import { useProfile } from '@/hooks/use-profile';
import { useWindowSize } from 'react-use';
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
  onExportJPG: () => void;
  onExportPNG: () => void;
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

  const onExportJPG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('jpeg', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
  }, [toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);
  
  const onExportPNG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('png', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
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
    onExportJPG,
    onExportPNG,
    onExportMP4,
  }), [isReady, canUndo, canRedo, currentState, baseTextStyle, textEffectsStyle, dropShadowStyle, undo, redo, updateState, setInitialState, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4]);

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
INNER_EOF

# Restaurando src/app/editor-de-video/utils/text-style-utils.ts
cat <<'INNER_EOF' > src/app/editor-de-video/utils/text-style-utils.ts
import React from 'react';

export const EMOJI_REGEX = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu;

export const createStrokeStyle = (
  strokeWidth: number,
  strokeColor: string,
  strokeCornerStyle: 'rounded' | 'square'
): React.CSSProperties => {
  if (strokeWidth <= 0) {
    return {};
  }
  
  const shadows: string[] = [];
  const width = strokeWidth * 0.5; 

  if (strokeCornerStyle === 'rounded') {
    const numPoints = 12;
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * (2 * Math.PI);
        const x = Math.cos(angle) * width;
        const y = Math.sin(angle) * width;
        shadows.push(`${x.toFixed(2)}px ${y.toFixed(2)}px ${width * 0.5}px ${strokeColor}`);
    }
  } else {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        shadows.push(`${x * width}px ${y * width}px 0 ${strokeColor}`);
      }
    }
  }

  return { textShadow: shadows.join(', ') };
};

export const createDropShadowStyle = (
  blur: number,
  intensityPercent: number
): React.CSSProperties => {
  if (blur <= 0 || intensityPercent <= 0) {
    return {};
  }

  const shadowColor = 'rgba(0,0,0,0.8)'; 
  const offsetY = blur * 0.1;
  const offsetX = blur * 0.05;
  
  const numLayers = Math.max(1, Math.ceil((intensityPercent / 100) * 5));
  
  const shadows = [];

  for (let i = 1; i <= numLayers; i++) {
    const progress = i / numLayers;
    const layerBlur = blur * progress;
    const shadow = `drop-shadow(${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px ${layerBlur.toFixed(2)}px ${shadowColor})`;
    shadows.push(shadow);
  }

  return {
    filter: shadows.join(" "),
  };
};
INNER_EOF

# Restaurando src/app/editor-de-video/modelos/modelo-padrao.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/modelos/modelo-padrao.tsx
import type { EditorState, EstiloTexto } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import { EMOJI_REGEX } from '../utils/text-style-utils';

interface ModeloPadraoProps {
    editorState: EditorState;
    baseTextStyle: EstiloTexto;
    textEffectsStyle: EstiloTexto;
    dropShadowStyle: EstiloTexto;
    profile: any;
}

export function ModeloPadrao({
    editorState,
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
    profile
}: ModeloPadraoProps) {
    const {
        text,
        textVerticalPosition,
        applyEffectsToEmojis,
        showProfileSignature,
        signaturePositionX,
        signaturePositionY,
        signatureScale,
        showSignaturePhoto,
        showSignatureUsername,
        showSignatureSocial,
        showSignatureBackground,
        signatureBgColor,
        signatureBgOpacity,
        showLogo,
        logoPositionX,
        logoPositionY,
        logoScale,
        logoOpacity,
    } = editorState;

    const renderTextWithEmojis = () => {
        if (!text) return null;
        const parts = text.split(EMOJI_REGEX);

        return (
            <>
                {parts.map((part, index) => {
                    const isEmoji = EMOJI_REGEX.test(part);
                    if (isEmoji && !applyEffectsToEmojis) {
                        return <span key={index} style={{ textShadow: 'none', filter: 'none' }}>{part}</span>;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    const combinedTextStyle: EstiloTexto = {
      ...baseTextStyle,
      ...textEffectsStyle,
    };
    
    return (
        <div className="relative w-full h-full">
            <div
                className="absolute w-full px-8"
                style={{
                    top: `${textVerticalPosition}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    ...dropShadowStyle,
                }}
            >
                <div
                    style={combinedTextStyle}
                    className="break-words relative"
                >
                    {renderTextWithEmojis()}
                </div>
            </div>

            {showLogo && profile.logo && (
                <div className="absolute" style={{ zIndex: 2, top: `${logoPositionY}%`, left: `${logoPositionX}%`, transform: 'translate(-50%, -50%)' }}>
                    <div style={{ transform: `scale(${logoScale / 100})`, opacity: logoOpacity / 100 }}>
                        <img src={profile.logo} alt="Logomarca" className="max-w-[150px] max-h-[150px]" />
                    </div>
                </div>
            )}
            {showProfileSignature && (
                <div className="absolute" style={{ zIndex: 2, top: `${signaturePositionY}%`, left: `${signaturePositionX}%`, transform: `translate(-50%, -50%) scale(${signatureScale / 100})`, transformOrigin: 'center center' }}>
                    <AssinaturaPerfil profile={profile} showPhoto={showSignaturePhoto} showUsername={showSignatureUsername} showSocial={showSignatureSocial} showBackground={showSignatureBackground} bgColor={signatureBgColor} bgOpacity={signatureBgOpacity} />
                </div>
            )}
        </div>
    );
}
INNER_EOF

# Restaurando src/app/editor-de-video/modelos/assinatura-perfil.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/modelos/assinatura-perfil.tsx
import type { ProfileData } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function AssinaturaPerfil({
  profile,
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
  bgColor,
  bgOpacity,
}: AssinaturaPerfilProps) {
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  return (
    <div 
      className="flex items-center justify-center gap-3 p-3 rounded-lg max-w-max"
      style={{
        backgroundColor: showBackground ? backgroundColor : 'transparent',
      }}
    >
      {showPhoto && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center text-white space-y-0">
          {showUsername && (
            <p className="font-bold text-sm leading-none">
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-gray-300 text-xs leading-tight pt-0.5">
              {profile.social}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
INNER_EOF

# Restaurando src/app/editor-de-video/components/sidebar.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/components/sidebar.tsx
"use client";

import { useState, useRef, useMemo } from "react";
import Link from 'next/link';
import { Wand2, RectangleHorizontal, RectangleVertical, Square, LayoutTemplate, UserCheck, ImageUp, Paintbrush, Type, CaseSensitive, Pipette, AlignLeft, Bold, MoveVertical, Baseline, Upload, Image as ImageIcon, Palette, Layers, Check, Edit, User, MoveHorizontal, ZoomIn, AtSign, BadgePercent, Film, AlignCenter, AlignRight, Italic, Box, Pilcrow, CaseUpper, Text, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BotaoRecurso } from "../botao-recurso";
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/hooks/use-profile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { EstiloFundo } from "../tipos";
import { Switch } from "@/components/ui/switch";


const aspectRatios = [
    { label: "Story", value: "9 / 16", icon: RectangleVertical },
    { label: "Quadrado", value: "1 / 1", icon: Square },
    { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

type TipoFundoAtivo = 'media' | 'solid' | 'gradient';

function ControleTipoFundo({ backgroundStyle, setBackgroundStyle }: { backgroundStyle: EstiloFundo, setBackgroundStyle: (style: EstiloFundo) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    
    const { activeTab, gradient } = useMemo(() => {
        const type = backgroundStyle.type;
        let grad = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };
        if (type === 'gradient' && backgroundStyle.value) {
            try {
                const gradType = backgroundStyle.value.startsWith('linear') ? 'linear' : 'radial';
                const parts = backgroundStyle.value.match(/\((.*)\)/)?.[1].split(', ');
                if (!parts) throw new Error("Invalid gradient string");
                
                let direction = 'to right';
                let colors: [string, string] = ['#AOCD5', '#45B8AC'];
                
                if (gradType === 'linear') {
                    if (parts[0].startsWith('to ')) {
                        direction = parts[0];
                        colors = [parts[1], parts[2]] as [string, string];
                    } else {
                        colors = [parts[0], parts[1]] as [string, string];
                    }
                } else {
                     const colorParts = backgroundStyle.value.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgb\([^)]+\)/g);
                     if (colorParts && colorParts.length >= 2) {
                        colors = [colorParts[0], colorParts[1]] as [string, string];
                    }
                }
                grad = { type: gradType, colors, direction };

            } catch {}
        }
        return { activeTab: type, gradient: grad };
    }, [backgroundStyle]);

    const handleTabChange = (tab: TipoFundoAtivo) => {
        if (tab === 'solid') {
            setBackgroundStyle({ type: 'solid', value: '#333333' });
        } else if (tab === 'gradient') {
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : `circle at center, `}${gradient.colors[0]}, ${gradient.colors[1]})`;
            setBackgroundStyle({ type: 'gradient', value: gradValue });
        } else { // media
             setBackgroundStyle({ type: 'media', value: '' });
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({ variant: "destructive", title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem ou vídeo." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setBackgroundStyle({ type: 'media', value: e.target?.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSolidColorChange = (color: string) => {
        setBackgroundStyle({ type: 'solid', value: color });
    };
    
    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : `circle at center, `}${grad.colors[0]}, ${grad.colors[1]})`;
        setBackgroundStyle({ type: 'gradient', value: gradValue });
    };

    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors] as [string, string];
        newColors[index] = color;
        handleGradientChange({ ...gradient, colors: newColors });
    };
    
    const handleGradientDirectionChange = (direction: string) => {
        handleGradientChange({ ...gradient, direction });
    };

    const handleGradientTypeChange = (type: 'linear' | 'radial') => {
        handleGradientChange({ ...gradient, type });
    }


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <Button variant={activeTab === 'media' ? "secondary" : "ghost"} onClick={() => handleTabChange('media')}><ImageIcon className="mr-2 h-4 w-4" /> Mídia</Button>
                <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => handleTabChange('solid')}><Palette className="mr-2 h-4 w-4" /> Cor</Button>
                <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => handleTabChange('gradient')}><Layers className="mr-2 h-4 w-4" /> Gradiente</Button>
            </div>
            
            <Separator />

            {activeTab === 'media' && (
                <div className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" /> Carregar do Dispositivo</Button>
                     <Link href="/galeria?fromEditor=true" passHref>
                        <Button className="w-full" variant="outline">
                            <ImageIcon className="mr-2 h-4 w-4" /> Carregar da Galeria
                        </Button>
                    </Link>
                </div>
            )}

            {activeTab === 'solid' && (
                 <div className="space-y-2">
                    <Label className="text-left">Cor do Fundo</Label>
                    <div className="relative h-10 w-full rounded-md border overflow-hidden">
                        <Input 
                            type="color" 
                            value={backgroundStyle.type === 'solid' ? backgroundStyle.value : '#333333'} 
                            onChange={e => handleSolidColorChange(e.target.value)} 
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: backgroundStyle.type === 'solid' ? backgroundStyle.value : '#333333' }} />
                    </div>
                </div>
            )}
            
            {activeTab === 'gradient' && (
                 <div className="space-y-4">
                    <div className="flex items-end gap-2">
                         <div className="space-y-2">
                            <Label>Tipo</Label>
                            <div className="flex gap-1">
                                <Button size="sm" variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('linear')}>Linear</Button>
                                <Button size="sm" variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('radial')}>Radial</Button>
                            </div>
                        </div>

                        {gradient.type === 'linear' && (
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="gradient-direction">Direção</Label>
                                <Select value={gradient.direction} onValueChange={handleGradientDirectionChange}>
                                    <SelectTrigger id="gradient-direction" className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="to right">Direita</SelectItem>
                                        <SelectItem value="to left">Esquerda</SelectItem>
                                        <SelectItem value="to bottom">Abaixo</SelectItem>
                                        <SelectItem value="to top">Acima</SelectItem>
                                        <SelectItem value="to bottom right">Diag. (↓→)</SelectItem>
                                        <SelectItem value="to top left">Diag. (↑←)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Cores do Gradiente</Label>
                        <div className="flex items-center gap-4">
                            {[0, 1].map((index) => (
                                <div key={index} className="flex-1 space-y-1">
                                    <Label className="text-xs text-muted-foreground">Cor {index + 1}</Label>
                                    <div className="relative h-9 w-full rounded-md border overflow-hidden">
                                        <Input
                                            type="color"
                                            value={gradient.colors[index as 0 | 1]}
                                            onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)}
                                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: gradient.colors[index as 0 | 1] }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

interface CommonStyleProps {
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
  textVerticalPosition: number;
  onTextVerticalPositionChange: (position: number) => void;
  textShadowBlur: number;
  onTextShadowBlurChange: (blur: number) => void;
  textShadowOpacity: number;
  onTextShadowOpacityChange: (opacity: number) => void;
  textStrokeColor: string;
  onTextStrokeColorChange: (color: string) => void;
  textStrokeWidth: number;
  onTextStrokeWidthChange: (width: number) => void;
  textStrokeCornerStyle: 'rounded' | 'square';
  onTextStrokeCornerStyleChange: (style: 'rounded' | 'square') => void;
  applyEffectsToEmojis: boolean;
  onApplyEffectsToEmojisChange: (apply: boolean) => void;
  letterSpacing: number;
  onLetterSpacingChange: (spacing: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
  wordSpacing: number;
  onWordSpacingChange: (spacing: number) => void;
}


interface ControleAssinaturaProps {
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
  profile: ProfileData;
}
function ControleAssinatura(props: ControleAssinaturaProps) {
    const { 
        showProfileSignature, onShowProfileSignatureChange,
        signaturePositionX, onSignaturePositionXChange,
        signaturePositionY, onSignaturePositionYChange,
        signatureScale, onSignatureScaleChange,
        showSignaturePhoto, onShowSignaturePhotoChange,
        showSignatureUsername, onShowSignatureUsernameChange,
        showSignatureSocial, onShowSignatureSocialChange,
        showSignatureBackground, onShowSignatureBackgroundChange,
        signatureBgColor, onSignatureBgColorChange,
        signatureBgOpacity, onSignatureBgOpacityChange,
        profile,
    } = props;
    
    const isProfileConfigured = profile.username && profile.username !== 'Seu Nome' && profile.social && profile.social !== '@seuusario';

     return (
        <div className="space-y-4">
            <Button 
                variant={showProfileSignature ? 'secondary' : 'outline'} 
                onClick={() => onShowProfileSignatureChange(!showProfileSignature)}
                className="w-full"
            >
                {showProfileSignature ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showProfileSignature ? 'Assinatura Ativada' : 'Ativar Assinatura'}
            </Button>
            
            <LinkConfigurarPerfil />



            {showProfileSignature && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <Label>Elementos Visíveis</Label>
                    <div className="grid grid-cols-4 gap-2">
                         <Button size="sm" variant={showSignaturePhoto ? 'secondary' : 'outline'} onClick={() => onShowSignaturePhotoChange(!showSignaturePhoto)}>
                             <ImageIcon className="mr-2 h-4 w-4" /> Foto
                        </Button>
                         <Button size="sm" variant={showSignatureUsername ? 'secondary' : 'outline'} onClick={() => onShowSignatureUsernameChange(!showSignatureUsername)}>
                            <CaseSensitive className="mr-2 h-4 w-4" /> Nome
                        </Button>
                         <Button size="sm" variant={showSignatureSocial ? 'secondary' : 'outline'} onClick={() => onShowSignatureSocialChange(!showSignatureSocial)}>
                            <AtSign className="mr-2 h-4 w-4" /> Social
                        </Button>
                        <Button size="sm" variant={showSignatureBackground ? 'secondary' : 'outline'} onClick={() => onShowSignatureBackgroundChange(!showSignatureBackground)}>
                           <Box className="mr-2 h-4 w-4" /> Fundo
                        </Button>
                    </div>

                    {showSignatureBackground && (
                         <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs flex items-center"><Pipette className="mr-2 h-3 w-3" />Cor do Fundo</Label>
                                    <Input
                                        type="color"
                                        value={signatureBgColor}
                                        onChange={(e) => onSignatureBgColorChange(e.target.value)}
                                        className="h-6 w-10 p-0 border-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="signature-bg-opacity" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade do Fundo</Label>
                                    <span className="text-xs text-muted-foreground">{signatureBgOpacity}%</span>
                                </div>
                                <Slider id="signature-bg-opacity" min={0} max={100} step={1} value={[signatureBgOpacity]} onValueChange={(v) => onSignatureBgOpacityChange(v[0])}/>
                            </div>
                        </div>
                    )}
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-x" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionX}%</span>
                        </div>
                        <Slider id="signature-position-x" min={0} max={100} step={1} value={[signaturePositionX]} onValueChange={(value) => onSignaturePositionXChange(value[0])}/>
                    </div>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionY}%</span>
                        </div>
                        <Slider id="signature-position-y" min={0} max={100} step={1} value={[signaturePositionY]} onValueChange={(value) => onSignaturePositionYChange(value[0])}/>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-scale" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{signatureScale}%</span>
                        </div>
                        <Slider id="signature-scale" min={50} max={150} step={1} value={[signatureScale]} onValueChange={(value) => onSignatureScaleChange(value[0])}/>
                    </div>
                </div>
            )}
        </div>
     )
}

interface ControleLogoProps {
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
function ControleLogo(props: ControleLogoProps) {
    const {
        showLogo, onShowLogoChange,
        logoPositionX, onLogoPositionXChange,
        logoPositionY, onLogoPositionYChange,
        logoScale, onLogoScaleChange,
        logoOpacity, onLogoOpacityChange,
        profile,
    } = props;
    
    const isLogoConfigured = !!profile.logo;

    return (
        <div className="space-y-4">
            <Button
                variant={showLogo ? 'secondary' : 'outline'}
                onClick={() => onShowLogoChange(!showLogo)}
                className="w-full"
                disabled={!isLogoConfigured}
            >
                {showLogo ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showLogo ? 'Logomarca Ativada' : 'Ativar Logomarca'}
            </Button>
            
            {!isLogoConfigured && <LinkConfigurarPerfil />}


            {showLogo && isLogoConfigured && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-x" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionX}%</span>
                        </div>
                        <Slider id="logo-position-x" min={0} max={100} step={1} value={[logoPositionX]} onValueChange={(v) => onLogoPositionXChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionY}%</span>
                        </div>
                        <Slider id="logo-position-y" min={0} max={100} step={1} value={[logoPositionY]} onValueChange={(v) => onLogoPositionYChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-scale" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{logoScale}%</span>
                        </div>
                        <Slider id="logo-scale" min={10} max={200} step={1} value={[logoScale]} onValueChange={(v) => onLogoScaleChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-opacity" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade</Label>
                            <span className="text-xs text-muted-foreground">{logoOpacity}%</span>
                        </div>
                        <Slider id="logo-opacity" min={0} max={100} step={1} value={[logoOpacity]} onValueChange={(v) => onLogoOpacityChange(v[0])} />
                    </div>
                </div>
            )}
        </div>
    )
}

type EstiloControlProps = CommonStyleProps & {
    fgColor: string;
    onFgColorChange: (color: string) => void;
};

function renderEstiloControl(subControl: string | null, props: EstiloControlProps) {
    if (!subControl) return <p className="text-center text-muted-foreground text-sm">Selecione um controle de estilo abaixo.</p>;

    switch (subControl) {
        case 'fonte':
            return (
                <div className="space-y-2">
                    <Label htmlFor="font-family">Fonte</Label>
                    <Select value={props.fontFamily} onValueChange={props.onFontFamilyChange}>
                        <SelectTrigger id="font-family"><SelectValue placeholder="Selecione a fonte" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="PT Sans">PT Sans</SelectItem>
                            <SelectItem value="Merriweather">Merriweather</SelectItem>
                            <SelectItem value="Lobster">Lobster</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        case 'tamanho':
            return (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="font-size">Tamanho da Fonte</Label>
                        <span className="text-sm text-muted-foreground">{props.fontSize.toFixed(1)} pt</span>
                    </div>
                    <Slider id="font-size" min={1} max={20} step={0.1} value={[props.fontSize]} onValueChange={(v) => props.onFontSizeChange(v[0])} />
                </div>
            );
        case 'cor':
            return (
                <div className="space-y-2">
                    <Label>Cor do Texto</Label>
                    <div className="relative h-10 w-full rounded-md border overflow-hidden">
                       <Input
                            type="color"
                            value={props.fgColor}
                            onChange={(e) => props.onFgColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: props.fgColor }} />
                    </div>
                </div>
            );
        case 'alinhamento':
            return (
                <div className="space-y-2">
                    <Label>Alinhamento do Texto</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <BotaoRecurso icon={AlignLeft} label="Esquerda" onClick={() => props.onTextAlignChange('left')} isActive={props.textAlign === 'left'} />
                        <BotaoRecurso icon={AlignCenter} label="Centro" onClick={() => props.onTextAlignChange('center')} isActive={props.textAlign === 'center'} />
                        <BotaoRecurso icon={AlignRight} label="Direita" onClick={() => props.onTextAlignChange('right')} isActive={props.textAlign === 'right'} />
                    </div>
                </div>
            );
        case 'estilo':
            return (
                 <div className="space-y-2">
                    <Label>Estilo</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant={props.fontWeight === 'bold' ? 'secondary' : 'ghost'} onClick={() => props.onFontWeightChange(props.fontWeight === 'bold' ? 'normal' : 'bold')}><Bold className="mr-2" />Negrito</Button>
                        <Button variant={props.fontStyle === 'italic' ? 'secondary' : 'ghost'} onClick={() => props.onFontStyleChange(props.fontStyle === 'italic' ? 'normal' : 'italic')}><Italic className="mr-2" />Itálico</Button>
                    </div>
                </div>
            );
        case 'posicao':
             return (
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="vertical-position" className="flex items-center"><MoveVertical className="mr-2 h-4 w-4" />Posição Vertical</Label>
                            <span className="text-sm text-muted-foreground">{props.textVerticalPosition}%</span>
                        </div>
                        <Slider id="vertical-position" min={0} max={100} step={1} value={[props.textVerticalPosition]} onValueChange={(v) => props.onTextVerticalPositionChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="letter-spacing" className="flex items-center"><CaseUpper className="mr-2 h-4 w-4" />Espaç. Letras</Label>
                            <span className="text-sm text-muted-foreground">{(props.letterSpacing / 10).toFixed(1)}</span>
                        </div>
                        <Slider id="letter-spacing" min={-10} max={50} step={0.5} value={[props.letterSpacing]} onValueChange={(v) => props.onLetterSpacingChange(v[0])} />
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="word-spacing" className="flex items-center"><Text className="mr-2 h-4 w-4" />Espaç. Palavras</Label>
                            <span className="text-sm text-muted-foreground">{(props.wordSpacing / 10).toFixed(1)}</span>
                        </div>
                        <Slider id="word-spacing" min={-10} max={50} step={0.5} value={[props.wordSpacing]} onValueChange={(v) => props.onWordSpacingChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="line-height" className="flex items-center"><Pilcrow className="mr-2 h-4 w-4" />Altura da Linha</Label>
                            <span className="text-sm text-muted-foreground">{props.lineHeight.toFixed(2)}</span>
                        </div>
                        <Slider id="line-height" min={0.8} max={2.5} step={0.05} value={[props.lineHeight]} onValueChange={(v) => props.onLineHeightChange(v[0])} />
                    </div>
                </div>
            );
        case 'contorno':
             return (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Canto</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={props.textStrokeCornerStyle === 'rounded' ? 'secondary' : 'outline'} onClick={() => props.onTextStrokeCornerStyleChange('rounded')}>Arredondado</Button>
                            <Button variant={props.textStrokeCornerStyle === 'square' ? 'secondary' : 'outline'} onClick={() => props.onTextStrokeCornerStyleChange('square')}>Quadrado</Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="stroke-color" className="text-xs text-muted-foreground">Cor</Label>
                         <div className="relative h-10 w-full rounded-md border overflow-hidden">
                            <Input
                                type="color"
                                value={props.textStrokeColor}
                                onChange={(e) => props.onTextStrokeColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                            />
                             <div className="w-full h-full" style={{ backgroundColor: props.textStrokeColor }} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Espessura</Label>
                            <span className="text-xs text-muted-foreground">{props.textStrokeWidth.toFixed(1)} pt</span>
                        </div>
                        <Slider id="stroke-width" min={0} max={20} step={0.1} value={[props.textStrokeWidth]} onValueChange={(v) => props.onTextStrokeWidthChange(v[0])} />
                    </div>
                </div>
            );
        case 'sombra':
             return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-blur" className="text-xs text-muted-foreground">Desfoque</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowBlur.toFixed(1)} pt</span>
                        </div>
                        <Slider id="shadow-blur" min={0} max={10} step={0.1} value={[props.textShadowBlur]} onValueChange={(v) => props.onTextShadowBlurChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-opacity" className="text-xs text-muted-foreground">Intensidade</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowOpacity}%</span>
                        </div>
                        <Slider id="shadow-opacity" min={0} max={100} step={1} value={[props.textShadowOpacity]} onValueChange={(v) => props.onTextShadowOpacityChange(v[0])} />
                    </div>
                </div>
            );
        case 'emoji':
            return (
                <div className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="apply-emoji-effects">Aplicar efeitos em emojis</Label>
                            <p className="text-xs text-muted-foreground">
                                Desative para manter os emojis com aparência padrão.
                            </p>
                        </div>
                        <Switch
                            id="apply-emoji-effects"
                            checked={props.applyEffectsToEmojis}
                            onCheckedChange={props.onApplyEffectsToEmojisChange}
                        />
                    </div>
                </div>
            )
        default:
            return null;
    }
}

function LinkConfigurarPerfil() {
    return (
      <Link href="/perfil" passHref>
        <Button variant="link" className="w-full text-center">
          <ImageUp className="mr-2 h-4 w-4" />
          Configurar Perfil
        </Button>
      </Link>
    );
  }
  
  

interface SidebarProps extends ControleAssinaturaProps, ControleLogoProps, CommonStyleProps {
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    scale: number;
    setScale: (scale: number) => void;
    backgroundStyle: EstiloFundo;
    setBackgroundStyle: (style: EstiloFundo) => void;
    filmColor: string;
    setFilmColor: (color: string) => void;
    filmOpacity: number;
    setFilmOpacity: (opacity: number) => void;
    fgColor: string;
    setFgColor: (color: string) => void;
    activeControl: string | null;
    setActiveControl: (control: string | null) => void;
    text: string;
    setText: (text: string) => void;
    profile: ProfileData;
}

export function Sidebar({
    activeControl,
    setActiveControl,
    text,
    setText,
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    backgroundStyle,
    setBackgroundStyle,
    filmColor,
    setFilmColor,
    filmOpacity,
    setFilmOpacity,
    fgColor,
    setFgColor,
    ...props
}: SidebarProps) {

    const [activeSubControl, setActiveSubControl] = useState<string | null>(null);

    const handleSetControleAtivo = (controle: string | null) => {
        setActiveControl(controle);
        if (controle !== 'estilo') {
            setActiveSubControl(null);
        }
    }
    
    const bgColor = backgroundStyle.type === 'solid' ? backgroundStyle.value : '#000000';

    const renderActiveControl = () => {
        if (!activeControl) {
            return <p className="text-sm text-muted-foreground text-center p-4">Selecione uma ferramenta para editar.</p>;
        }
        switch (activeControl) {
            case 'texto':
                return (
                    <div className="p-4 flex-1 flex flex-col">
                        <Label htmlFor="text-input" className="sr-only">Texto da Frase</Label>
                        <TextareaAutosize
                            id="text-input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            minRows={6}
                            placeholder="Digite sua frase aqui..."
                            className={cn(
                                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                            )}
                        />
                    </div>
                );
            case 'canvas':
                return (
                    <div className="space-y-4 p-4">
                        <div className="space-y-2">
                            <Label>Proporção da Tela</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {aspectRatios.map((ratio) => (
                                    <Button
                                        key={ratio.value}
                                        onClick={() => setAspectRatio(ratio.value)}
                                        variant={aspectRatio === ratio.value ? "secondary" : "outline"}
                                        className="flex flex-col h-20 gap-1"
                                    >
                                        <ratio.icon className="h-6 w-6" />
                                        <span className="text-xs">{ratio.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Escala do Canvas</Label>
                                <span className="text-sm font-mono">{Math.round(scale * 100)}%</span>
                            </div>
                            <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={0.5} max={2} step={0.01} />
                        </div>
                    </div>
                );
            case 'cores':
                 return (
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-left block">Cor do Fundo</Label>
                             <div className="relative h-10 w-full rounded-md border overflow-hidden">
                                 <Input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBackgroundStyle({ type: 'solid', value: e.target.value })}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-left block">Cor do Texto</Label>
                             <div className="relative h-10 w-full rounded-md border overflow-hidden">
                                 <Input
                                    type="color"
                                    value={fgColor}
                                    onChange={e => setFgColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: fgColor }} />
                            </div>
                        </div>
                    </div>
                 );
            case 'filtro':
                return (
                    <div className="space-y-4 p-4">
                        <div className="space-y-2">
                            <Label>Cor da Película</Label>
                            <div className="relative h-10 w-full rounded-md border overflow-hidden">
                                <Input
                                    type="color"
                                    value={filmColor}
                                    onChange={(e) => setFilmColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: filmColor }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="film-opacity" className="text-xs text-muted-foreground">Opacidade</Label>
                                <span className="text-xs text-muted-foreground">{filmOpacity}%</span>
                            </div>
                            <Slider id="film-opacity" min={0} max={100} step={1} value={[filmOpacity]} onValueChange={(v) => setFilmOpacity(v[0])} />
                        </div>
                    </div>
                );
            case 'estilo':
                 return (
                     <div className="w-full flex-1 flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            {renderEstiloControl(activeSubControl, { ...props, fgColor, onFgColorChange: setFgColor })}
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap border-t mt-auto">
                            <div className="flex h-16 items-center w-max space-x-1 bg-background/90 backdrop-blur-sm px-2">
                                <BotaoRecurso icon={Baseline} label="Contorno" onClick={() => setActiveSubControl('contorno')} isActive={activeSubControl === 'contorno'}/>
                                <BotaoRecurso icon={SmilePlus} label="Emoji" onClick={() => setActiveSubControl('emoji')} isActive={activeSubControl === 'emoji'} />
                                <BotaoRecurso icon={Paintbrush} label="Sombra" onClick={() => setActiveSubControl('sombra')} isActive={activeSubControl === 'sombra'}/>
                                <BotaoRecurso icon={Pipette} label="Cor" onClick={() => setActiveSubControl('cor')} isActive={activeSubControl === 'cor'}/>
                                <BotaoRecurso icon={CaseSensitive} label="Tamanho" onClick={() => setActiveSubControl('tamanho')} isActive={activeSubControl === 'tamanho'}/>
                                <BotaoRecurso icon={MoveVertical} label="Posição" onClick={() => setActiveSubControl('posicao')} isActive={activeSubControl === 'posicao'}/>
                                <BotaoRecurso icon={AlignLeft} label="Alinhar" onClick={() => setActiveSubControl('alinhamento')} isActive={activeSubControl === 'alinhamento'}/>
                                <BotaoRecurso icon={Bold} label="Estilo" onClick={() => setActiveSubControl('estilo')} isActive={activeSubControl === 'estilo'}/>
                                <BotaoRecurso icon={Type} label="Fonte" onClick={() => setActiveSubControl('fonte')} isActive={activeSubControl === 'fonte'}/>
                            </div>
                            <ScrollBar orientation="horizontal" className="h-2" />
                        </ScrollArea>
                     </div>
                 );
            case 'fundo':
                return <div className="p-4"><ControleTipoFundo backgroundStyle={backgroundStyle} setBackgroundStyle={setBackgroundStyle} /></div>;
            case 'assinatura':
                return <div className="p-4"><ControleAssinatura {...props} /></div>;
            case 'logo':
                return <div className="p-4"><ControleLogo {...props} /></div>;
            default:
                return null;
        }
    }

    const mainToolbar = (
        <ScrollArea className="w-full border-b">
            <div className="flex h-16 items-center justify-around w-full space-x-1 px-2">
                <BotaoRecurso icon={Type} label="Texto" onClick={() => handleSetControleAtivo('texto')} isActive={activeControl === 'texto'}/>
                <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => handleSetControleAtivo('canvas')} isActive={activeControl === 'canvas'}/>
                <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handleSetControleAtivo('cores')} isActive={activeControl === 'cores'}/>
                <BotaoRecurso icon={Film} label="Película" onClick={() => handleSetControleAtivo('filtro')} isActive={activeControl === 'filtro'} />
                <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handleSetControleAtivo('estilo')} isActive={activeControl === 'estilo'}/>
                <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handleSetControleAtivo('fundo')} isActive={activeControl === 'fundo'}/>
                <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handleSetControleAtivo('assinatura')} isActive={activeControl === 'assinatura'}/>
                <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handleSetControleAtivo('logo')} isActive={activeControl === 'logo'}/>
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
    );

    return (
        <aside className="hidden shrink-0 bg-card md:flex md:flex-col md:border-r w-full h-full">
            
            {mainToolbar}

            <div className="flex-1 overflow-y-auto flex flex-col">
                {renderActiveControl()}
            </div>
        </aside>
    );
}
INNER_EOF

# Restaurando src/app/editor-de-video/components/mobile-toolbar.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/components/mobile-toolbar.tsx
"use client";

import { useState, useRef, ComponentType, useMemo } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  RectangleHorizontal,
  Paintbrush,
  RectangleVertical,
  Square,
  LayoutTemplate,
  UserCheck,
  ImageUp,
  ArrowLeft,
  Wand2,
  Type,
  CaseSensitive,
  Pipette,
  AlignLeft,
  Bold,
  MoveVertical,
  Baseline,
  Upload,
  Image as ImageIcon,
  Palette,
  Layers,
  Check,
  Edit,
  User,
  MoveHorizontal,
  ZoomIn,
  AtSign,
  BadgePercent,
  Film,
  AlignCenter,
  AlignRight,
  Italic,
  Box,
  Pilcrow,
  CaseUpper,
  Text,
  SmilePlus,
} from "lucide-react";
import { BotaoRecurso } from "../botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/hooks/use-profile";
import type { EstiloFundo } from "../tipos";
import { Switch } from "@/components/ui/switch";


const aspectRatios = [
  { label: "Story", value: "9 / 16", icon: RectangleVertical },
  { label: "Quadrado", value: "1 / 1", icon: Square },
  { label: "Vídeo", value: "16 / 9", icon: RectangleHorizontal },
];

type ActivePanel = "texto" | "canvas" | "cores" | "filtro" | "fundo" | "assinatura" | "logo" | "estilo" | null;
type TipoFundoAtivo = 'media' | 'solid' | 'gradient';


function ControleTipoFundo({ backgroundStyle, setBackgroundStyle }: { backgroundStyle: EstiloFundo, setBackgroundStyle: (style: EstiloFundo) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    
    const { activeTab, gradient } = useMemo(() => {
        const type = backgroundStyle.type;
        let grad = { type: 'linear' as 'linear'|'radial', colors: ['#A06CD5', '#45B8AC'] as [string, string], direction: 'to right' };
        if (type === 'gradient' && backgroundStyle.value) {
            try {
                const gradType = backgroundStyle.value.startsWith('linear') ? 'linear' : 'radial';
                const parts = backgroundStyle.value.match(/\((.*)\)/)?.[1].split(', ');
                if (!parts) throw new Error("Invalid gradient string");
                
                let direction = 'to right';
                let colors: [string, string] = ['#AOCD5', '#45B8AC'];
                
                if (gradType === 'linear') {
                    if (parts[0].startsWith('to ')) {
                        direction = parts[0];
                        colors = [parts[1], parts[2]] as [string, string];
                    } else {
                        colors = [parts[0], parts[1]] as [string, string];
                    }
                } else {
                     const colorParts = backgroundStyle.value.match(/#(?:[0-9a-fA-F]{3}){1,2}|rgb\([^)]+\)/g);
                     if (colorParts && colorParts.length >= 2) {
                        colors = [colorParts[0], colorParts[1]] as [string, string];
                    }
                }
                grad = { type: gradType, colors, direction };

            } catch {}
        }
        return { activeTab: type, gradient: grad };
    }, [backgroundStyle]);

    const handleTabChange = (tab: TipoFundoAtivo) => {
        if (tab === 'solid') {
            setBackgroundStyle({ type: 'solid', value: '#333333' });
        } else if (tab === 'gradient') {
            const gradValue = `${gradient.type}-gradient(${gradient.type === 'linear' ? `${gradient.direction}, ` : `circle at center, `}${gradient.colors[0]}, ${gradient.colors[1]})`;
            setBackgroundStyle({ type: 'gradient', value: gradValue });
        } else { // media
             setBackgroundStyle({ type: 'media', value: '' });
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({ variant: "destructive", title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem ou vídeo." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setBackgroundStyle({ type: 'media', value: e.target?.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSolidColorChange = (color: string) => {
        setBackgroundStyle({ type: 'solid', value: color });
    };
    
    const handleGradientChange = (grad: { type: 'linear' | 'radial', colors: [string, string], direction: string }) => {
        const gradValue = `${grad.type}-gradient(${grad.type === 'linear' ? `${grad.direction}, ` : `circle at center, `}${grad.colors[0]}, ${grad.colors[1]})`;
        setBackgroundStyle({ type: 'gradient', value: gradValue });
    };

    const handleGradientColorChange = (index: 0 | 1, color: string) => {
        const newColors = [...gradient.colors] as [string, string];
        newColors[index] = color;
        handleGradientChange({ ...gradient, colors: newColors });
    };
    
    const handleGradientDirectionChange = (direction: string) => {
        handleGradientChange({ ...gradient, direction });
    };

    const handleGradientTypeChange = (type: 'linear' | 'radial') => {
        handleGradientChange({ ...gradient, type });
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <Button variant={activeTab === 'media' ? "secondary" : "ghost"} onClick={() => handleTabChange('media')}><ImageIcon className="mr-2 h-4 w-4" /> Mídia</Button>
                <Button variant={activeTab === 'solid' ? "secondary" : "ghost"} onClick={() => handleTabChange('solid')}><Palette className="mr-2 h-4 w-4" /> Cor</Button>
                <Button variant={activeTab === 'gradient' ? "secondary" : "ghost"} onClick={() => handleTabChange('gradient')}><Layers className="mr-2 h-4 w-4" /> Gradiente</Button>
            </div>
            
            <Separator />

            {activeTab === 'media' && (
                <div className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" /> Carregar do Dispositivo</Button>
                     <Link href="/galeria?fromEditor=true" passHref>
                        <Button className="w-full" variant="outline">
                            <ImageIcon className="mr-2 h-4 w-4" /> Carregar da Galeria
                        </Button>
                    </Link>
                </div>
            )}

            {activeTab === 'solid' && (
                 <div className="space-y-2">
                    <Label className="text-left">Cor do Fundo</Label>
                    <div className="relative h-10 w-full rounded-md border overflow-hidden">
                       <Input
                           type="color"
                           value={backgroundStyle.type === 'solid' ? backgroundStyle.value : '#333333'}
                           onChange={(e) => handleSolidColorChange(e.target.value)}
                           className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                       />
                       <div className="w-full h-full" style={{ backgroundColor: backgroundStyle.type === 'solid' ? backgroundStyle.value : '#333333' }} />
                   </div>
                </div>
            )}
            
            {activeTab === 'gradient' && (
                 <div className="space-y-4">
                    <div className="flex items-end gap-2">
                         <div className="space-y-2">
                            <Label>Tipo</Label>
                            <div className="flex gap-1">
                                <Button size="sm" variant={gradient.type === 'linear' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('linear')}>Linear</Button>
                                <Button size="sm" variant={gradient.type === 'radial' ? 'secondary' : 'outline'} onClick={() => handleGradientTypeChange('radial')}>Radial</Button>
                            </div>
                        </div>

                        {gradient.type === 'linear' && (
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="gradient-direction-mobile">Direção</Label>
                                <Select value={gradient.direction} onValueChange={handleGradientDirectionChange}>
                                    <SelectTrigger id="gradient-direction-mobile" className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="to right">Direita</SelectItem>
                                        <SelectItem value="to left">Esquerda</SelectItem>
                                        <SelectItem value="to bottom">Abaixo</SelectItem>
                                        <SelectItem value="to top">Acima</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                   </div>
                   <div className="space-y-2">
                       <Label>Cores</Label>
                       <div className="flex items-center gap-4">
                           {[0, 1].map((index) => (
                               <div key={index} className="flex-1 space-y-1">
                                   <Label className="text-xs text-muted-foreground">Cor {index + 1}</Label>
                                   <div className="relative h-9 w-full rounded-md border overflow-hidden">
                                       <Input 
                                            type="color" 
                                            value={gradient.colors[index as 0 | 1]} 
                                            onChange={(e) => handleGradientColorChange(index as 0 | 1, e.target.value)} 
                                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: gradient.colors[index as 0 | 1] }} />
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
                 </div>
            )}
        </div>
    )
}

interface CommonStyleProps {
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
  textVerticalPosition: number;
  onTextVerticalPositionChange: (position: number) => void;
  textShadowBlur: number;
  onTextShadowBlurChange: (blur: number) => void;
  textShadowOpacity: number;
  onTextShadowOpacityChange: (opacity: number) => void;
  textStrokeColor: string;
  onTextStrokeColorChange: (color: string) => void;
  textStrokeWidth: number;
  onTextStrokeWidthChange: (width: number) => void;
  textStrokeCornerStyle: 'rounded' | 'square';
  onTextStrokeCornerStyleChange: (style: 'rounded' | 'square') => void;
  applyEffectsToEmojis: boolean;
  onApplyEffectsToEmojisChange: (apply: boolean) => void;
  letterSpacing: number;
  onLetterSpacingChange: (spacing: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
  wordSpacing: number;
  onWordSpacingChange: (spacing: number) => void;
}


interface ControleAssinaturaProps {
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
  profile: ProfileData;
}
function ControleAssinatura(props: ControleAssinaturaProps) {
    const { 
        showProfileSignature, onShowProfileSignatureChange,
        signaturePositionX, onSignaturePositionXChange,
        signaturePositionY, onSignaturePositionYChange,
        signatureScale, onSignatureScaleChange,
        showSignaturePhoto, onShowSignaturePhotoChange,
        showSignatureUsername, onShowSignatureUsernameChange,
        showSignatureSocial, onShowSignatureSocialChange,
        showSignatureBackground, onShowSignatureBackgroundChange,
        signatureBgColor, onSignatureBgColorChange,
        signatureBgOpacity, onSignatureBgOpacityChange,
        profile,
    } = props;
    
    const isProfileConfigured = profile.username && profile.username !== 'Seu Nome' && profile.social && profile.social !== '@seuusario';

     return (
        <div className="space-y-4">
            <Button 
                variant={showProfileSignature ? 'secondary' : 'outline'} 
                onClick={() => onShowProfileSignatureChange(!showProfileSignature)}
                className="w-full"
            >
                {showProfileSignature ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showProfileSignature ? 'Assinatura Ativada' : 'Ativar Assinatura'}
            </Button>
            
            {!isProfileConfigured && (
                <Link href="/perfil" passHref>
                    <Button variant="link" className="w-full text-center">
                        <User className="mr-2 h-4 w-4" />
                        Configurar Assinatura no Perfil
                    </Button>
                </Link>
            )}

            {showProfileSignature && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <Label>Elementos Visíveis</Label>
                    <div className="grid grid-cols-4 gap-2">
                         <Button size="sm" variant={showSignaturePhoto ? 'secondary' : 'outline'} onClick={() => onShowSignaturePhotoChange(!showSignaturePhoto)}>
                             <ImageIcon className="mr-2 h-4 w-4" /> Foto
                        </Button>
                         <Button size="sm" variant={showSignatureUsername ? 'secondary' : 'outline'} onClick={() => onShowSignatureUsernameChange(!showSignatureUsername)}>
                            <CaseSensitive className="mr-2 h-4 w-4" /> Nome
                        </Button>
                         <Button size="sm" variant={showSignatureSocial ? 'secondary' : 'outline'} onClick={() => onShowSignatureSocialChange(!showSignatureSocial)}>
                            <AtSign className="mr-2 h-4 w-4" /> Social
                        </Button>
                        <Button size="sm" variant={showSignatureBackground ? 'secondary' : 'outline'} onClick={() => onShowSignatureBackgroundChange(!showSignatureBackground)}>
                           <Box className="mr-2 h-4 w-4" /> Fundo
                        </Button>
                    </div>

                    {showSignatureBackground && (
                         <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs flex items-center"><Pipette className="mr-2 h-3 w-3" />Cor do Fundo</Label>
                                    <Input
                                        type="color"
                                        value={signatureBgColor}
                                        onChange={(e) => onSignatureBgColorChange(e.target.value)}
                                        className="h-6 w-10 p-0 border-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="signature-bg-opacity-mobile" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade do Fundo</Label>
                                    <span className="text-xs text-muted-foreground">{signatureBgOpacity}%</span>
                                </div>
                                <Slider id="signature-bg-opacity-mobile" min={0} max={100} step={1} value={[signatureBgOpacity]} onValueChange={(v) => onSignatureBgOpacityChange(v[0])}/>
                            </div>
                        </div>
                    )}

                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-x-mobile" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionX}%</span>
                        </div>
                        <Slider id="signature-position-x-mobile" min={0} max={100} step={1} value={[signaturePositionX]} onValueChange={(value) => onSignaturePositionXChange(value[0])}/>
                    </div>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-position-y-mobile" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{signaturePositionY}%</span>
                        </div>
                        <Slider id="signature-position-y-mobile" min={0} max={100} step={1} value={[signaturePositionY]} onValueChange={(value) => onSignaturePositionYChange(value[0])}/>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label htmlFor="signature-scale-mobile" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{signatureScale}%</span>
                        </div>
                        <Slider id="signature-scale-mobile" min={50} max={150} step={1} value={[signatureScale]} onValueChange={(value) => onSignatureScaleChange(value[0])}/>
                    </div>
                </div>
            )}
        </div>
     )
}

interface ControleLogoProps {
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
function ControleLogo(props: ControleLogoProps) {
    const {
        showLogo, onShowLogoChange,
        logoPositionX, onLogoPositionXChange,
        logoPositionY, onLogoPositionYChange,
        logoScale, onLogoScaleChange,
        logoOpacity, onLogoOpacityChange,
        profile,
    } = props;
    
    const isLogoConfigured = !!profile.logo;

    return (
        <div className="space-y-4">
            <Button
                variant={showLogo ? 'secondary' : 'outline'}
                onClick={() => onShowLogoChange(!showLogo)}
                className="w-full"
                disabled={!isLogoConfigured}
            >
                {showLogo ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {showLogo ? 'Logomarca Ativada' : 'Ativar Logomarca'}
            </Button>
            
             {!isLogoConfigured && (
                <Link href="/perfil" passHref>
                    <Button variant="link" className="w-full text-center">
                        <ImageUp className="mr-2 h-4 w-4" />
                        Adicionar Logomarca no Perfil
                    </Button>
                </Link>
            )}

            {showLogo && isLogoConfigured && (
                <div className="space-y-4 pt-2 border-t mt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-x" className="text-xs flex items-center"><MoveHorizontal className="mr-2 h-3 w-3" />Posição Horizontal</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionX}%</span>
                        </div>
                        <Slider id="logo-position-x" min={0} max={100} step={1} value={[logoPositionX]} onValueChange={(v) => onLogoPositionXChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-position-y" className="text-xs flex items-center"><MoveVertical className="mr-2 h-3 w-3" />Posição Vertical</Label>
                            <span className="text-xs text-muted-foreground">{logoPositionY}%</span>
                        </div>
                        <Slider id="logo-position-y" min={0} max={100} step={1} value={[logoPositionY]} onValueChange={(v) => onLogoPositionYChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-scale" className="text-xs flex items-center"><ZoomIn className="mr-2 h-3 w-3" />Escala</Label>
                            <span className="text-xs text-muted-foreground">{logoScale}%</span>
                        </div>
                        <Slider id="logo-scale" min={10} max={200} step={1} value={[logoScale]} onValueChange={(v) => onLogoScaleChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="logo-opacity" className="text-xs flex items-center"><BadgePercent className="mr-2 h-3 w-3" />Opacidade</Label>
                            <span className="text-xs text-muted-foreground">{logoOpacity}%</span>
                        </div>
                        <Slider id="logo-opacity" min={0} max={100} step={1} value={[logoOpacity]} onValueChange={(v) => onLogoOpacityChange(v[0])} />
                    </div>
                </div>
            )}
        </div>
    )
}

type EstiloControlProps = CommonStyleProps & {
    fgColor: string;
    onFgColorChange: (color: string) => void;
};

function renderEstiloControl(subControl: string | null, props: EstiloControlProps) {
    if (!subControl) return <p className="text-muted-foreground text-center p-4 text-sm">Selecione uma opção abaixo para editar.</p>;

    switch (subControl) {
        case 'fonte':
            return (
                <div className="space-y-2">
                    <Label htmlFor="font-family">Fonte</Label>
                    <Select value={props.fontFamily} onValueChange={props.onFontFamilyChange}>
                        <SelectTrigger id="font-family"><SelectValue placeholder="Selecione a fonte" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="PT Sans">PT Sans</SelectItem>
                            <SelectItem value="Merriweather">Merriweather</SelectItem>
                            <SelectItem value="Lobster">Lobster</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        case 'tamanho':
            return (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="font-size">Tamanho da Fonte</Label>
                        <span className="text-sm text-muted-foreground">{props.fontSize.toFixed(1)} pt</span>
                    </div>
                    <Slider id="font-size" min={1} max={20} step={0.1} value={[props.fontSize]} onValueChange={(v) => props.onFontSizeChange(v[0])} />
                </div>
            );
        case 'cor':
            return (
                <div className="space-y-2">
                    <Label>Cor do Texto</Label>
                    <div className="relative h-10 w-full rounded-md border overflow-hidden">
                       <Input
                            type="color"
                            value={props.fgColor}
                            onChange={(e) => props.onFgColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: props.fgColor }} />
                    </div>
                </div>
            );
        case 'alinhamento':
            return (
                <div className="space-y-2">
                    <Label>Alinhamento do Texto</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <BotaoRecurso icon={AlignLeft} label="Esquerda" onClick={() => props.onTextAlignChange('left')} isActive={props.textAlign === 'left'} />
                        <BotaoRecurso icon={AlignCenter} label="Centro" onClick={() => props.onTextAlignChange('center')} isActive={props.textAlign === 'center'} />
                        <BotaoRecurso icon={AlignRight} label="Direita" onClick={() => props.onTextAlignChange('right')} isActive={props.textAlign === 'right'} />
                    </div>
                </div>
            );
        case 'estilo':
            return (
                 <div className="space-y-2">
                    <Label>Estilo</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant={props.fontWeight === 'bold' ? 'secondary' : 'ghost'} onClick={() => props.onFontWeightChange(props.fontWeight === 'bold' ? 'normal' : 'bold')}><Bold className="mr-2" />Negrito</Button>
                        <Button variant={props.fontStyle === 'italic' ? 'secondary' : 'ghost'} onClick={() => props.onFontStyleChange(props.fontStyle === 'italic' ? 'normal' : 'italic')}><Italic className="mr-2" />Itálico</Button>
                    </div>
                </div>
            );
        case 'posicao':
             return (
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="vertical-position" className="flex items-center"><MoveVertical className="mr-2 h-4 w-4" />Posição Vertical</Label>
                            <span className="text-sm text-muted-foreground">{props.textVerticalPosition}%</span>
                        </div>
                        <Slider id="vertical-position" min={0} max={100} step={1} value={[props.textVerticalPosition]} onValueChange={(v) => props.onTextVerticalPositionChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="letter-spacing" className="flex items-center"><CaseUpper className="mr-2 h-4 w-4" />Espaç. Letras</Label>
                            <span className="text-sm text-muted-foreground">{(props.letterSpacing / 10).toFixed(1)}</span>
                        </div>
                        <Slider id="letter-spacing" min={-10} max={50} step={0.5} value={[props.letterSpacing]} onValueChange={(v) => props.onLetterSpacingChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="word-spacing" className="flex items-center"><Text className="mr-2 h-4 w-4" />Espaç. Palavras</Label>
                            <span className="text-sm text-muted-foreground">{(props.wordSpacing / 10).toFixed(1)}</span>
                        </div>
                        <Slider id="word-spacing" min={-10} max={50} step={0.5} value={[props.wordSpacing]} onValueChange={(v) => props.onWordSpacingChange(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="line-height" className="flex items-center"><Pilcrow className="mr-2 h-4 w-4" />Altura da Linha</Label>
                            <span className="text-sm text-muted-foreground">{props.lineHeight.toFixed(2)}</span>
                        </div>
                        <Slider id="line-height" min={0.8} max={2.5} step={0.05} value={[props.lineHeight]} onValueChange={(v) => props.onLineHeightChange(v[0])} />
                    </div>
                </div>
            );
        case 'contorno':
             return (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Canto</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={props.textStrokeCornerStyle === 'rounded' ? 'secondary' : 'outline'} onClick={() => props.onTextStrokeCornerStyleChange('rounded')}>Arredondado</Button>
                            <Button variant={props.textStrokeCornerStyle === 'square' ? 'secondary' : 'outline'} onClick={() => props.onTextStrokeCornerStyleChange('square')}>Quadrado</Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="stroke-color" className="text-xs text-muted-foreground">Cor</Label>
                         <div className="relative h-10 w-full rounded-md border overflow-hidden">
                            <Input
                                type="color"
                                value={props.textStrokeColor}
                                onChange={(e) => props.onTextStrokeColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: props.textStrokeColor }} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Espessura</Label>
                            <span className="text-xs text-muted-foreground">{props.textStrokeWidth.toFixed(1)} pt</span>
                        </div>
                        <Slider id="stroke-width" min={0} max={20} step={0.1} value={[props.textStrokeWidth]} onValueChange={(v) => props.onTextStrokeWidthChange(v[0])} />
                    </div>
                </div>
            );
        case 'sombra':
             return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-blur" className="text-xs text-muted-foreground">Desfoque</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowBlur.toFixed(1)} pt</span>
                        </div>
                        <Slider id="shadow-blur" min={0} max={10} step={0.1} value={[props.textShadowBlur]} onValueChange={(v) => props.onTextShadowBlurChange(v[0])} />
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-opacity" className="text-xs text-muted-foreground">Intensidade</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowOpacity}%</span>
                        </div>
                        <Slider id="shadow-opacity" min={0} max={100} step={1} value={[props.textShadowOpacity]} onValueChange={(v) => props.onTextShadowOpacityChange(v[0])} />
                    </div>
                </div>
            );
        case 'emoji':
             return (
                <div className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="apply-emoji-effects-mobile">Aplicar efeitos em emojis</Label>
                            <p className="text-xs text-muted-foreground">
                                Desative para manter os emojis com aparência padrão.
                            </p>
                        </div>
                        <Switch
                            id="apply-emoji-effects-mobile"
                            checked={props.applyEffectsToEmojis}
                            onCheckedChange={props.onApplyEffectsToEmojisChange}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
}


interface MobileToolbarProps extends ControleAssinaturaProps, ControleLogoProps, CommonStyleProps {
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  backgroundStyle: EstiloFundo;
  setBackgroundStyle: (style: EstiloFundo) => void;
  filmColor: string;
  setFilmColor: (color: string) => void;
  filmOpacity: number;
  setFilmOpacity: (opacity: number) => void;
  fgColor: string;
  setFgColor: (color: string) => void;
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
  text: string;
  setText: (text: string) => void;
  profile: ProfileData;
}

export function MobileToolbar({
  aspectRatio,
  setAspectRatio,
  scale,
  setScale,
  backgroundStyle,
  setBackgroundStyle,
  filmColor,
  setFilmColor,
  filmOpacity,
  setFilmOpacity,
  fgColor,
  setFgColor,
  activeControl,
  setActiveControl,
  text,
  setText,
  ...props
}: MobileToolbarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [activeSubControl, setActiveSubControl] = useState<string | null>(null);

  const handlePanelChange = (panel: ActivePanel) => {
    setActivePanel(panel);
    setActiveControl(panel);
    setActiveSubControl(null); // Reset sub-controls when main panel changes
  };

  const renderPanelContent = () => {
    if (!activePanel) return null;
    
    const bgColor = backgroundStyle.type === 'solid' ? backgroundStyle.value : '#000000';

    const panels: Record<string, JSX.Element | null> = {
      texto: (
          <div className="p-2 flex-1 flex flex-col">
              <Label htmlFor="text-input-mobile" className="sr-only">Texto da Frase</Label>
              <TextareaAutosize
                  id="text-input-mobile"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  minRows={6}
                  placeholder="Digite sua frase aqui..."
                  className={cn(
                      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                  )}
              />
          </div>
      ),
      canvas: (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <Label>Proporção da Tela</Label>
                <div className="grid grid-cols-3 gap-2">
                    {aspectRatios.map(({ value, icon: Icon, label }) => (
                    <Button
                        key={value}
                        variant={aspectRatio === value ? "secondary" : "outline"}
                        onClick={() => setAspectRatio(value)}
                        className="flex flex-col h-16 gap-1"
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{label}</span>
                    </Button>
                    ))}
                </div>
            </div>
            <Separator />
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Escala do Canvas</Label>
                    <span className="text-sm font-mono">{Math.round(scale * 100)}%</span>
                </div>
                <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={0.5} max={2} step={0.01} />
            </div>
        </div>
      ),
      cores: (
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-left block">Cor do Fundo</Label>
            <div className="relative h-10 w-full rounded-md border overflow-hidden">
                <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBackgroundStyle({ type: 'solid', value: e.target.value })}
                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                />
                 <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
            </div>
          </div>
          <div className="space-y-2">
              <Label className="text-left block">Cor do Texto</Label>
              <div className="relative h-10 w-full rounded-md border overflow-hidden">
                   <Input
                      type="color"
                      value={fgColor}
                      onChange={e => setFgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                  />
                   <div className="w-full h-full" style={{ backgroundColor: fgColor }} />
              </div>
          </div>
        </div>
      ),
      filtro: (
         <div className="space-y-4 p-4">
            <div className="space-y-2">
                <Label>Cor da Película</Label>
                 <div className="relative h-10 w-full rounded-md border overflow-hidden">
                    <Input
                        type="color"
                        value={filmColor}
                        onChange={(e) => setFilmColor(e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer opacity-0"
                    />
                     <div className="w-full h-full" style={{ backgroundColor: filmColor }} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="film-opacity-mobile" className="text-xs text-muted-foreground">Opacidade</Label>
                    <span className="text-xs text-muted-foreground">{filmOpacity}%</span>
                </div>
                <Slider id="film-opacity-mobile" min={0} max={100} step={1} value={[filmOpacity]} onValueChange={(v) => setFilmOpacity(v[0])} />
            </div>
        </div>
      ),
      estilo: (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                {renderEstiloControl(activeSubControl, { ...props, fgColor, onFgColorChange: setFgColor })}
            </div>
             <ScrollArea className="w-full whitespace-nowrap border-t">
                <div className="flex h-16 items-center w-max space-x-1 bg-background/90 backdrop-blur-sm px-2">
                    <BotaoRecurso icon={Baseline} label="Contorno" onClick={() => setActiveSubControl('contorno')} isActive={activeSubControl === 'contorno'}/>
                    <BotaoRecurso icon={SmilePlus} label="Emoji" onClick={() => setActiveSubControl('emoji')} isActive={activeSubControl === 'emoji'} />
                    <BotaoRecurso icon={Pipette} label="Cor" onClick={() => setActiveSubControl('cor')} isActive={activeSubControl === 'cor'}/>
                    <BotaoRecurso icon={CaseSensitive} label="Tamanho" onClick={() => setActiveSubControl('tamanho')} isActive={activeSubControl === 'tamanho'}/>
                    <BotaoRecurso icon={Paintbrush} label="Sombra" onClick={() => setActiveSubControl('sombra')} isActive={activeSubControl === 'sombra'}/>
                    <BotaoRecurso icon={MoveVertical} label="Posição" onClick={() => setActiveSubControl('posicao')} isActive={activeSubControl === 'posicao'}/>
                    <BotaoRecurso icon={AlignLeft} label="Alinhar" onClick={() => setActiveSubControl('alinhamento')} isActive={activeSubControl === 'alinhamento'}/>
                    <BotaoRecurso icon={Bold} label="Estilo" onClick={() => setActiveSubControl('estilo')} isActive={activeSubControl === 'estilo'}/>
                    <BotaoRecurso icon={Type} label="Fonte" onClick={() => setActiveSubControl('fonte')} isActive={activeSubControl === 'fonte'}/>
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
       </div>
      ),
      fundo: <div className="p-4"><ControleTipoFundo backgroundStyle={backgroundStyle} setBackgroundStyle={setBackgroundStyle} /></div>,
      assinatura: <div className="p-4"><ControleAssinatura {...props} /></div>,
      logo: <div className="p-4"><ControleLogo {...props} /></div>,
    };

    return panels[activePanel];
  };

  const getPanelTitle = () => {
    const titles: Record<string, string> = {
      texto: "Editar Texto",
      canvas: "Editar Canvas",
      cores: "Editar Cores",
      filtro: "Editar Película",
      estilo: "Editar Estilo",
      fundo: "Editar Fundo",
      assinatura: "Editar Assinatura",
      logo: "Editar Logo",
    };
    return titles[activePanel || ''] || '';
  };

  const mainToolbar = (
     <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex h-16 items-center justify-around w-full space-x-1 px-2 border-t bg-background">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange("texto")} isActive={activePanel === "texto"} />
            <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => handlePanelChange("canvas")} isActive={activePanel === "canvas"} />
            <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handlePanelChange("cores")} isActive={activePanel === "cores"} />
            <BotaoRecurso icon={Film} label="Película" onClick={() => handlePanelChange("filtro")} isActive={activePanel === "filtro"} />
            <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handlePanelChange("estilo")} isActive={activePanel === "estilo"} />
            <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handlePanelChange("fundo")} isActive={activePanel === "fundo"} />
            <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handlePanelChange("assinatura")} isActive={activePanel === "assinatura"} />
            <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handlePanelChange("logo")} isActive={activePanel === "logo"} />
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t">
        {mainToolbar}
      </div>

      <Sheet open={!!activePanel} onOpenChange={(open) => { if (!open) { setActivePanel(null); setActiveControl(null); }}}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col p-0">
          <SheetHeader className="p-4 pb-2">
            <SheetTitle className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => { setActivePanel(null); setActiveControl(null); }}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {getPanelTitle()}
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto flex-1">
            {renderPanelContent()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
INNER_EOF

# Restaurando src/app/editor-de-video/editor.tsx
cat <<'INNER_EOF' > src/app/editor-de-video/editor.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import { useProfile } from "@/hooks/use-profile";
import { Sidebar } from "@/app/editor-de-video/components/sidebar";
import { PreviewCanva } from "@/app/editor-de-video/components/preview-canva";
import { MobileToolbar } from "@/app/editor-de-video/components/mobile-toolbar";
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable";
import type { EditorState, EstiloFundo } from "@/app/editor-de-video/tipos";
import { useSearchParams } from "next/navigation";
import { useTemplates } from "@/hooks/use-templates";
import { useEditor } from "./contexts/editor-context";
import Loading from './loading';
import { getAllQuotes } from '@/lib/dados';

const getInitialState = (): Omit<EditorState, 'activeTemplateId' | 'text'> => ({
    fontFamily: "Poppins",
    fontSize: 2.7,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1,
    textShadowOpacity: 75,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0,
    textStrokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
    letterSpacing: 0,
    lineHeight: 1.3,
    wordSpacing: 0,
    backgroundStyle: { type: 'solid', value: '#000000' },
    filmColor: "#000000",
    filmOpacity: 0,
    aspectRatio: "9 / 16",
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    showSignatureBackground: false,
    signatureBgColor: "#000000",
    signatureBgOpacity: 30,
    profileVerticalPosition: 25,
    showLogo: false,
    logoPositionX: 50,
    logoPositionY: 72,
    logoScale: 40,
    logoOpacity: 100,
});


export default function Editor() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { profile, isLoaded: isProfileLoaded } = useProfile();
  const searchParams = useSearchParams();
  const { templates: allTemplates, isLoaded: areTemplatesLoaded } = useTemplates();
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const {
    isReady,
    currentState,
    updateState,
    setInitialState,
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
  } = useEditor();

  const [activeControl, setActiveControl] = useState<string | null>('texto');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isReady || !isProfileLoaded || !areTemplatesLoaded) return;

    const initialize = () => {
        const quoteParam = searchParams.get("quote");
        const templateIdParam = searchParams.get("templateId");
        
        let initialState: EditorState;
        const baseState = getInitialState();

        const allQuotes = getAllQuotes();

        const text = quoteParam 
            ? decodeURIComponent(quoteParam) 
            : allQuotes.length > 0 
                ? allQuotes[Math.floor(Math.random() * allQuotes.length)].quote
                : "A inspiração está a caminho...";
        
        if (templateIdParam) {
          const template = allTemplates.find(t => t.id === templateIdParam);
          if (template) {
            initialState = { ...baseState, ...template.editorState, text, activeTemplateId: template.id };
          } else {
            initialState = { ...baseState, text, activeTemplateId: null };
          }
        } else {
            initialState = { ...baseState, text, activeTemplateId: null };
        }
        
        setInitialState(initialState);
    }

    initialize();
  }, [searchParams, isProfileLoaded, areTemplatesLoaded, isReady, setInitialState, allTemplates]);


  useEffect(() => {
    if (!currentState) return;
    if (isDesktop) {
        setScale(1);
    } else {
        if (currentState.aspectRatio === "9 / 16") {
            setScale(0.8);
        } else {
            setScale(1);
        }
    }
  }, [currentState?.aspectRatio, isDesktop, currentState]);
  
  if (!isReady || !isProfileLoaded || !currentState) {
    return <Loading />;
  }

  const commonProps = {
    // Canvas
    aspectRatio: currentState.aspectRatio, setAspectRatio: (val: string) => updateState({ aspectRatio: val as any }),
    scale, setScale,
    // Fundo
    backgroundStyle: currentState.backgroundStyle, setBackgroundStyle: (val: EstiloFundo) => updateState({ backgroundStyle: val }),
    // Película
    filmColor: currentState.filmColor, setFilmColor: (val: string) => updateState({ filmColor: val }),
    filmOpacity: currentState.filmOpacity, setFilmOpacity: (val: number) => updateState({ filmOpacity: val }),
    // Texto
    text: currentState.text, setText: (val: string) => updateState({ text: val }),
    fgColor: currentState.textColor, setFgColor: (val: string) => updateState({ textColor: val }),
    // Estilo Texto
    fontFamily: currentState.fontFamily, onFontFamilyChange: (val: string) => updateState({ fontFamily: val }),
    fontSize: currentState.fontSize, onFontSizeChange: (val: number) => updateState({ fontSize: val }),
    fontWeight: currentState.fontWeight, onFontWeightChange: (val: "normal" | "bold") => updateState({ fontWeight: val }),
    fontStyle: currentState.fontStyle, onFontStyleChange: (val: "normal" | "italic") => updateState({ fontStyle: val }),
    textAlign: currentState.textAlign, onTextAlignChange: (val: "left" | "center" | "right") => updateState({ textAlign: val }),
    textVerticalPosition: currentState.textVerticalPosition, onTextVerticalPositionChange: (val: number) => updateState({ textVerticalPosition: val }),
    textShadowBlur: currentState.textShadowBlur, onTextShadowBlurChange: (val: number) => updateState({ textShadowBlur: val }),
    textShadowOpacity: currentState.textShadowOpacity, onTextShadowOpacityChange: (val: number) => updateState({ textShadowOpacity: val }),
    textStrokeColor: currentState.textStrokeColor, onTextStrokeColorChange: (val: string) => updateState({ textStrokeColor: val }),
    textStrokeWidth: currentState.textStrokeWidth, onTextStrokeWidthChange: (val: number) => updateState({ textStrokeWidth: val }),
    textStrokeCornerStyle: currentState.textStrokeCornerStyle, onTextStrokeCornerStyleChange: (val: 'rounded' | 'square') => updateState({ textStrokeCornerStyle: val }),
    applyEffectsToEmojis: currentState.applyEffectsToEmojis, onApplyEffectsToEmojisChange: (val: boolean) => updateState({ applyEffectsToEmojis: val }),
    letterSpacing: currentState.letterSpacing, onLetterSpacingChange: (val: number) => updateState({ letterSpacing: val }),
    lineHeight: currentState.lineHeight, onLineHeightChange: (val: number) => updateState({ lineHeight: val }),
    wordSpacing: currentState.wordSpacing, onWordSpacingChange: (val: number) => updateState({ wordSpacing: val }),
    // Assinatura
    profile,
    showProfileSignature: currentState.showProfileSignature, onShowProfileSignatureChange: (val: boolean) => updateState({ showProfileSignature: val }),
    signaturePositionX: currentState.signaturePositionX, onSignaturePositionXChange: (val: number) => updateState({ signaturePositionX: val }),
    signaturePositionY: currentState.signaturePositionY, onSignaturePositionYChange: (val: number) => updateState({ signaturePositionY: val }),
    signatureScale: currentState.signatureScale, onSignatureScaleChange: (val: number) => updateState({ signatureScale: val }),
    showSignaturePhoto: currentState.showSignaturePhoto, onShowSignaturePhotoChange: (val: boolean) => updateState({ showSignaturePhoto: val }),
    showSignatureUsername: currentState.showSignatureUsername, onShowSignatureUsernameChange: (val: boolean) => updateState({ showSignatureUsername: val }),
    showSignatureSocial: currentState.showSignatureSocial, onShowSignatureSocialChange: (val: boolean) => updateState({ showSignatureSocial: val }),
    showSignatureBackground: currentState.showSignatureBackground, onShowSignatureBackgroundChange: (val: boolean) => updateState({ showSignatureBackground: val }),
    signatureBgColor: currentState.signatureBgColor, onSignatureBgColorChange: (val: string) => updateState({ signatureBgColor: val }),
    signatureBgOpacity: currentState.signatureBgOpacity, onSignatureBgOpacityChange: (val: number) => updateState({ signatureBgOpacity: val }),
    // Logo
    showLogo: currentState.showLogo, onShowLogoChange: (val: boolean) => updateState({ showLogo: val }),
    logoPositionX: currentState.logoPositionX, onLogoPositionXChange: (val: number) => updateState({ logoPositionX: val }),
    logoPositionY: currentState.logoPositionY, onLogoPositionYChange: (val: number) => updateState({ logoPositionY: val }),
    logoScale: currentState.logoScale, onLogoScaleChange: (val: number) => updateState({ logoScale: val }),
    logoOpacity: currentState.logoOpacity, onLogoOpacityChange: (val: number) => updateState({ logoOpacity: val }),
    // Controle
    activeControl, setActiveControl,
  };

  const previewProps = {
    editorState: currentState,
    profile,
    baseTextStyle: baseTextStyle,
    textEffectsStyle: textEffectsStyle,
    dropShadowStyle: dropShadowStyle,
    scale,
    containerRef: previewContainerRef,
  };

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-full">
      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
         <Panel defaultSize={30} minSize={25} maxSize={40} className="hidden md:flex flex-col">
            <Sidebar {...commonProps} />
        </Panel>
        {isDesktop && <PanelResizeHandle />}
        <Panel>
            <main className="flex-1 w-full h-full overflow-auto">
                <PreviewCanva {...previewProps} />
            </main>
        </Panel>
      </PanelGroup>

      <MobileToolbar {...commonProps} />
    </div>
  );
}
INNER_EOF

# Restaurando src/app/editor-de-video/exportar.ts
cat <<'INNER_EOF' > src/app/editor-de-video/exportar.ts
'use client';

import * as htmlToImage from 'html-to-image';
import type { EditorState, EstiloTexto } from './tipos';
import type { ProfileData } from '@/hooks/use-profile';

interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto) => {
    const previewElement = document.getElementById('editor-preview-content');

    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro de Exportação',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return;
    }

    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });
    
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 150));

    try {
        const dataUrl = format === 'jpeg'
            ? await htmlToImage.toJpeg(previewElement, { quality: 0.95, pixelRatio: 2 })
            : await htmlToImage.toPng(previewElement, { pixelRatio: 2 });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `inspire-me-export-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Sucesso!',
            description: `A imagem foi baixada como ${link.download}.`
        });

    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem. Verifique o console para mais detalhes.' });
    }
};

export const captureThumbnail = async (toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content');

  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível encontrar a área de visualização para gerar a miniatura.'
    });
    return null;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(previewElement, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     return thumbnail;

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar Modelo', description: 'Não foi possível gerar a miniatura do modelo.' });
      return null;
  }
};
INNER_EOF

# Restaurando src/app/editor-de-video/tipos.ts
cat <<'INNER_EOF' > src/app/editor-de-video/tipos.ts
import type { ProfileData } from "@/hooks/use-profile";
import type React from "react";

export type ProporcaoTela = "1 / 1" | "9 / 16" | "16 / 9";

export type EstiloTexto = React.CSSProperties;

export type TipoFundo = 'media' | 'solid' | 'gradient';
export type EstiloFundo = {
    type: TipoFundo;
    value: string;
};

export interface EditorState {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textColor: string;
    textAlign: "left" | "center" | "right";
    textShadowBlur: number;
    textShadowOpacity: number;
    textVerticalPosition: number;
    textStrokeColor: string;
    textStrokeWidth: number;
    textStrokeCornerStyle: 'rounded' | 'square';
    applyEffectsToEmojis: boolean;
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

export interface SavedVideo {
    id: string;
    thumbnail: string;
    editorState: EditorState;
    createdAt: string;
}


export interface VisualizacaoEditorProps {
    aspectRatio: ProporcaoTela;
    backgroundStyle: EstiloFundo;
    filmColor: string;
    filmOpacity: number;
    text: string;
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
INNER_EOF

echo "Restauração para a versão addc261 concluída!"
