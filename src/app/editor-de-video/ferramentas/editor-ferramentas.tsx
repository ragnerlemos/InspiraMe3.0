
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Regex para identificar a maioria dos emojis comuns
const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;


// Tipos para o estado do nosso novo editor
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

export function FerramentasEditor() {
  const [state, setState] = useState<ToolEditorState>({
    text: 'Texto de Exemplo\nCom emojis ✨',
    fontWeight: 'bold',
    fontStyle: 'normal',
    shadowBlur: 4,
    shadowOpacity: 75,
    strokeWidth: 0,
    strokeColor: '#000000',
    strokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };
  
  // Função para renderizar texto e emojis separadamente
  const renderTextWithEmojis = () => {
    const parts = state.text.split(emojiRegex);
    
    return parts.map((part, index) => {
      if (!part) return null; // Ignora partes vazias
      const isEmoji = part.match(emojiRegex);
      
      const allShadows: string[] = [];

      // 1. Lógica do Contorno
      if (state.strokeWidth > 0) {
        if (state.strokeCornerStyle === 'rounded') {
           const numSteps = 12;
           const blur = state.strokeWidth * 0.5; // Desfoque para arredondar
          for (let i = 0; i < numSteps; i++) {
            const angle = (i / numSteps) * 2 * Math.PI;
            const x = Math.cos(angle) * state.strokeWidth;
            const y = Math.sin(angle) * state.strokeWidth;
            allShadows.push(`${x}px ${y}px ${blur}px ${state.strokeColor}`);
          }
        } else { // 'square'
            const w = state.strokeWidth;
            for (let x = -w; x <= w; x += 1) {
                for (let y = -w; y <= w; y += 1) {
                    allShadows.push(`${x}px ${y}px 0 ${state.strokeColor}`);
                }
            }
        }
      }
      
      // 2. Lógica da Sombra Projetada
      if (state.shadowOpacity > 0 && state.shadowBlur > 0) {
        const opacityValue = Math.min(state.shadowOpacity / 100, 1);
        const shadowColor = `rgba(0, 0, 0, ${opacityValue})`;
        const spreadValue = state.shadowOpacity > 100 ? ((state.shadowOpacity - 100) / 100) * state.shadowBlur * 0.5 : 0;
        const shadowOffsetX = 2;
        const shadowOffsetY = 4;
        allShadows.push(`${shadowOffsetX}px ${shadowOffsetY}px ${state.shadowBlur}px ${spreadValue}px ${shadowColor}`);
      }

      const partStyle: React.CSSProperties = {
        fontWeight: state.fontWeight,
        fontStyle: state.fontStyle,
        fontSize: '60px',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        whiteSpace: 'pre-wrap', // Mantém as quebras de linha
      };
      
      // Aplica os estilos de sombra e contorno se necessário
      if (allShadows.length > 0) {
        if (!isEmoji || state.applyEffectsToEmojis) {
          partStyle.textShadow = allShadows.join(', ');
        }
      }

      return (
        <span key={index} style={partStyle}>
          {part}
        </span>
      );
    });
  };


  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Painel de Controles */}
      <div className="w-full md:w-96 bg-card border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold font-headline">Ferramentas de Texto</h2>

        {/* Editor de Texto */}
        <div className="space-y-2">
          <Label htmlFor="main-text">Texto</Label>
          <Textarea
            id="main-text"
            value={state.text}
            onChange={(e) => updateState({ text: e.target.value })}
            rows={4}
          />
        </div>

        {/* Estilo do Texto */}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <div className="flex gap-2">
            <Button
              variant={state.fontWeight === 'bold' ? 'secondary' : 'outline'}
              onClick={() => updateState({ fontWeight: state.fontWeight === 'bold' ? 'normal' : 'bold' })}
            >
              <Bold className="h-4 w-4 mr-2" />
              Negrito
            </Button>
            <Button
              variant={state.fontStyle === 'italic' ? 'secondary' : 'outline'}
              onClick={() => updateState({ fontStyle: state.fontStyle === 'italic' ? 'normal' : 'italic' })}
            >
              <Italic className="h-4 w-4 mr-2" />
              Itálico
            </Button>
          </div>
        </div>
        
        {/* Efeitos em Emojis */}
        <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="apply-to-emojis">Aplicar efeitos em Emojis</Label>
                 <Switch
                    id="apply-to-emojis"
                    checked={state.applyEffectsToEmojis}
                    onCheckedChange={(checked) => updateState({ applyEffectsToEmojis: checked })}
                />
            </div>
        </div>

        {/* Controles da Sombra */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Sombra Projetada</h3>
          <div className="space-y-2">
            <Label htmlFor="shadow-blur">Desfoque da Sombra: {state.shadowBlur}px</Label>
            <Slider
              id="shadow-blur"
              min={0}
              max={20}
              step={1}
              value={[state.shadowBlur]}
              onValueChange={(v) => updateState({ shadowBlur: v[0] })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shadow-opacity">Intensidade da Sombra: {state.shadowOpacity}%</Label>
            <Slider
              id="shadow-opacity"
              min={0}
              max={200}
              step={5}
              value={[state.shadowOpacity]}
              onValueChange={(v) => updateState({ shadowOpacity: v[0] })}
            />
          </div>
        </div>

        {/* Controles do Contorno */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Contorno</h3>
           <div className="space-y-2">
             <Label>Tipo de Canto do Contorno</Label>
             <div className="flex gap-2">
                <Button
                    variant={state.strokeCornerStyle === 'rounded' ? 'secondary' : 'outline'}
                    onClick={() => updateState({ strokeCornerStyle: 'rounded' })}
                    className="flex-1"
                >
                    Arredondado
                </Button>
                 <Button
                    variant={state.strokeCornerStyle === 'square' ? 'secondary' : 'outline'}
                    onClick={() => updateState({ strokeCornerStyle: 'square' })}
                    className="flex-1"
                >
                    Quadrado
                </Button>
             </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stroke-width">Espessura do Contorno: {state.strokeWidth}px</Label>
            <Slider
              id="stroke-width"
              min={0}
              max={20}
              step={0.5}
              value={[state.strokeWidth]}
              onValueChange={(v) => updateState({ strokeWidth: v[0] })}
            />
          </div>
           <div className="space-y-2">
              <Label htmlFor="stroke-color">Cor do Contorno</Label>
              <Input
                  id="stroke-color"
                  type="color"
                  value={state.strokeColor}
                  onChange={(e) => updateState({ strokeColor: e.target.value })}
                  className="w-full h-10 p-1"
              />
          </div>
        </div>
      </div>

      {/* Área de Pré-visualização */}
      <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <div
          className="text-center break-words"
        >
          {renderTextWithEmojis()}
        </div>
      </div>
    </div>
  );
}
