#!/bin/bash
echo "Restaurando editor-ferramentas.tsx..."
cat <<'INNER_EOF' > src/app/editor-de-video/ferramentas/editor-ferramentas.tsx

'use client';

import { useState, useMemo } from 'react';
// createStrokeStyle agora contém o algoritmo definitivo que funciona para tudo.
import { FerramentaContorno, createStrokeStyle } from './Ferramenta-Contorno';
import { FerramentaSombra, createDropShadowStyle } from './Ferramenta-Sombra';
import { FerramentasBasicas } from './Ferramentas-Basicas';
import { FerramentaEmojis } from './Ferramenta-Emojis';

interface ToolEditorState {
  text: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  shadowBlur: number;
  shadowOpacity: number;
  strokeWidth: number;
  strokeColor: string;
  strokeCornerStyle: 'rounded' | 'square';
  applyEffectsToEmojis: boolean;
}

const EMOJI_REGEX = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu;

export function FerramentasEditor() {
  const [state, setState] = useState<ToolEditorState>({
    text: 'Texto de Exemplo com Emoji ✨',
    fontWeight: 'bold',
    fontStyle: 'normal',
    shadowBlur: 5,
    shadowOpacity: 75,
    strokeWidth: 2,
    strokeColor: '#000000',
    strokeCornerStyle: 'square', // Iniciar com quadrado para ver o efeito
    applyEffectsToEmojis: true,
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // --- Lógica de Estilo 100% Unificada ---
  const textEffectsStyle = useMemo(() => {
    // 1. Gera o estilo de contorno (quadrado ou redondo) usando o novo algoritmo.
    const stroke = createStrokeStyle(state.strokeWidth, state.strokeColor, state.strokeCornerStyle);
    // 2. Gera a sombra projetada.
    const dropShadow = createDropShadowStyle(state.shadowBlur, state.shadowOpacity);
    
    // 3. Combina os dois efeitos em uma única propriedade text-shadow.
    const combinedShadows = [stroke.textShadow, dropShadow.textShadow]
      .filter(Boolean)
      .join(', ');

    // 4. Retorna o objeto de estilo final. Simples e unificado.
    return { textShadow: combinedShadows };

  }, [state.shadowBlur, state.shadowOpacity, state.strokeWidth, state.strokeColor, state.strokeCornerStyle]);


  // --- Renderização ---
  const renderTextWithEmojis = () => {
    const parts = state.text.split(EMOJI_REGEX);
    
    const baseStyle: React.CSSProperties = {
      fontWeight: state.fontWeight,
      fontStyle: state.fontStyle,
      fontSize: '60px',
      color: 'white',
      fontFamily: 'Poppins, sans-serif',
    };
    
    // O mesmo estilo (base + efeitos) é aplicado a tudo.
    const combinedStyle = { ...baseStyle, ...textEffectsStyle };

    return (
      <div style={combinedStyle}>
        {parts.map((part, index) => {
          // Se for um emoji e os efeitos estiverem desativados para ele...
          if (index % 2 !== 0 && !state.applyEffectsToEmojis) {
            // Renderiza o emoji sem NENHUM efeito de sombra.
            return (
              <span key={index} style={{ textShadow: 'none' }}>
                {part}
              </span>
            );
          }
          // Caso contrário, renderiza o texto ou emoji com todos os efeitos aplicados.
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div className="w-full md:w-96 bg-card border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold font-headline">Ferramentas de Texto</h2>
        <FerramentasBasicas text={state.text} fontWeight={state.fontWeight} fontStyle={state.fontStyle} updateState={updateState} />
        <FerramentaSombra shadowBlur={state.shadowBlur} shadowOpacity={state.shadowOpacity} updateState={updateState} />
        <FerramentaContorno strokeWidth={state.strokeWidth} strokeColor={state.strokeColor} strokeCornerStyle={state.strokeCornerStyle} updateState={updateState} />
        <FerramentaEmojis applyEffectsToEmojis={state.applyEffectsToEmojis} updateState={updateState} />
      </div>
      <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <div className="text-center break-words">{renderTextWithEmojis()}</div>
      </div>
    </div>
  );
}
INNER_EOF
echo Restaurando Ferramenta-Contorno.tsx...
cat <<'INNER_EOF' > src/app/editor-de-video/ferramentas/Ferramenta-Contorno.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import React from "react";

interface FerramentaContornoProps {
  strokeWidth: number;
  strokeColor: string;
  strokeCornerStyle: "rounded" | "square";
  updateState: (newState: {
    strokeWidth?: number;
    strokeColor?: string;
    strokeCornerStyle?: "rounded" | "square";
  }) => void;
}

export const createStrokeStyle = (
  width: number,
  color: string,
  cornerStyle: "rounded" | "square"
): React.CSSProperties => {
  if (width <= 0) {
    return {};
  }

  const shadows: string[] = [];
  if (cornerStyle === "rounded") {
    const numSteps = 8;
    const blurRadius = width * 0.5;
    for (let i = 0; i < numSteps; i++) {
      const angle = (i / numSteps) * 2 * Math.PI;
      const x = Math.cos(angle) * width;
      const y = Math.sin(angle) * width;
      shadows.push(`${x.toFixed(2)}px ${y.toFixed(2)}px ${blurRadius}px ${color}`);
    }
  } else {
    // Algoritmo definitivo para contorno quadrado: cria um bloco sólido e denso.
    // Funciona de forma consistente no texto e nos emojis.
    const W = Math.ceil(width);
    for (let x = -W; x <= W; x++) {
      for (let y = -W; y <= W; y++) {
        shadows.push(`${x}px ${y}px 0 ${color}`);
      }
    }
  }

  return { textShadow: shadows.join(", ") };
};

export function FerramentaContorno({
  strokeWidth,
  strokeColor,
  strokeCornerStyle,
  updateState,
}: FerramentaContornoProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Contorno</h3>
      <div className="space-y-2">
        <Label>Tipo de Canto do Contorno</Label>
        <div className="flex gap-2">
          <Button
            variant={strokeCornerStyle === "rounded" ? "secondary" : "outline"}
            onClick={() => updateState({ strokeCornerStyle: "rounded" })}
          >
            Arredondado
          </Button>
          <Button
            variant={strokeCornerStyle === "square" ? "secondary" : "outline"}
            onClick={() => updateState({ strokeCornerStyle: "square" })}
          >
            Quadrado
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stroke-width">
          Espessura do Contorno: {strokeWidth.toFixed(1)}px
        </Label>
        <Slider
          id="stroke-width"
          min={0}
          max={50}
          step={0.5}
          value={[strokeWidth]}
          onValueChange={(v) => updateState({ strokeWidth: v[0] })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stroke-color">Cor do Contorno</Label>
        <Input
          id="stroke-color"
          type="color"
          value={strokeColor}
          onChange={(e) => updateState({ strokeColor: e.target.value })}
          className="w-full h-10 p-1"
        />
      </div>
    </div>
  );
}
INNER_EOF
echo Restaurando Ferramenta-Sombra.tsx...
cat <<'INNER_EOF' > src/app/editor-de-video/ferramentas/Ferramenta-Sombra.tsx

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import React from 'react';

interface FerramentaSombraProps {
  shadowBlur: number;
  shadowOpacity: number;
  updateState: (newState: { shadowBlur?: number; shadowOpacity?: number }) => void;
}

/**
 * Gera o estilo de sombra para o texto.
 * @param blur - O nível de desfoque da sombra.
 * @param opacity - A opacidade da sombra (pode ser > 100 para um efeito mais forte).
 * @returns Um objeto de estilo React com a propriedade textShadow.
 */
export const createDropShadowStyle = (blur: number, opacity: number): React.CSSProperties => {
  if (blur <= 0 || opacity <= 0) {
    return {};
  }

  const numLayers = Math.floor(opacity / 100);
  const lastLayerOpacity = (opacity % 100) / 100;

  const baseOffsetX = blur * 0.1;
  const baseOffsetY = blur * 0.2;
  const blurRadius = blur;
  
  const shadows: string[] = [];

  // Cria camadas "sólidas" para opacidade > 100
  if (numLayers > 0) {
    const solidColor = `rgba(0, 0, 0, 1)`;
    for (let i = 0; i < numLayers; i++) {
        const offsetX = baseOffsetX + i * 0.5;
        const offsetY = baseOffsetY + i * 0.5;
        shadows.push(`${offsetX}px ${offsetY}px ${blurRadius}px ${solidColor}`);
    }
  }

  // Adiciona a camada final com a opacidade restante
  if (lastLayerOpacity > 0) {
    const finalColor = `rgba(0, 0, 0, ${lastLayerOpacity})`;
    const offsetX = baseOffsetX + numLayers * 0.5;
    const offsetY = baseOffsetY + numLayers * 0.5;
    shadows.push(`${offsetX}px ${offsetY}px ${blurRadius}px ${finalColor}`);
  }

  return { textShadow: shadows.join(', ') };
};


export function FerramentaSombra({
  shadowBlur,
  shadowOpacity,
  updateState,
}: FerramentaSombraProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Sombra</h3>
      <div className="space-y-2">
        <Label htmlFor="shadow-blur">Desfoque da Sombra: {shadowBlur}px</Label>
        <Slider
          id="shadow-blur"
          min={0}
          max={50}
          step={1}
          value={[shadowBlur]}
          onValueChange={(v) => updateState({ shadowBlur: v[0] })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shadow-opacity">
          Opacidade da Sombra: {shadowOpacity}%
        </Label>
        <Slider
          id="shadow-opacity"
          min={0}
          max={200}
          step={5}
          value={[shadowOpacity]}
          onValueChange={(v) => updateState({ shadowOpacity: v[0] })}
        />
      </div>
    </div>
  );
}
INNER_EOF
echo Restaurando Ferramentas-Basicas.tsx...
cat <<'INNER_EOF' > src/app/editor-de-video/ferramentas/Ferramentas-Basicas.tsx

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic } from 'lucide-react';

interface FerramentasBasicasProps {
  text: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  updateState: (newState: {
    text?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
  }) => void;
}

export function FerramentasBasicas({
  text,
  fontWeight,
  fontStyle,
  updateState,
}: FerramentasBasicasProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="main-text">Texto</Label>
      <Textarea
        id="main-text"
        value={text}
        onChange={(e) => updateState({ text: e.target.value })}
        rows={4}
      />
      <div className="space-y-2">
        <Label>Estilo</Label>
        <div className="flex gap-2">
          <Button
            variant={fontWeight === 'bold' ? 'secondary' : 'outline'}
            onClick={() =>
              updateState({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })
            }
          >
            <Bold className="h-4 w-4 mr-2" />
            Negrito
          </Button>
          <Button
            variant={fontStyle === 'italic' ? 'secondary' : 'outline'}
            onClick={() =>
              updateState({
                fontStyle: fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
          >
            <Italic className="h-4 w-4 mr-2" />
            Itálico
          </Button>
        </div>
      </div>
    </div>
  );
}
INNER_EOF
echo Restaurando Ferramenta-Emojis.tsx...
cat <<'INNER_EOF' > src/app/editor-de-video/ferramentas/Ferramenta-Emojis.tsx

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FerramentaEmojisProps {
  applyEffectsToEmojis: boolean;
  updateState: (newState: { applyEffectsToEmojis?: boolean }) => void;
}

export function FerramentaEmojis({
  applyEffectsToEmojis,
  updateState,
}: FerramentaEmojisProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Emojis</h3>
      <div className="flex items-center justify-between">
        <Label htmlFor="emoji-effects" className="cursor-pointer">
          Aplicar efeitos a emojis
        </Label>
        <Switch
          id="emoji-effects"
          checked={applyEffectsToEmojis}
          onCheckedChange={(checked) =>
            updateState({ applyEffectsToEmojis: checked })
          }
        />
      </div>
    </div>
  );
}
INNER_EOF
echo Restauração concluída!
