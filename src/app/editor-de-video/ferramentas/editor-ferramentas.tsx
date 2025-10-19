
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
}

export function FerramentasEditor() {
  const [state, setState] = useState<ToolEditorState>({
    text: 'Texto de Exemplo\nCom emojis ✨',
    fontWeight: 'bold',
    fontStyle: 'normal',
    shadowBlur: 4,
    shadowOpacity: 50,
    strokeWidth: 2,
    strokeColor: '#000000',
    strokeCornerStyle: 'rounded',
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // Estilos do texto dinamicamente
  const textStyle: React.CSSProperties = {
    fontWeight: state.fontWeight,
    fontStyle: state.fontStyle,
    fontSize: '60px',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
  };
  
  const createDropShadow = () => {
    if (state.shadowOpacity > 0 && state.shadowBlur > 0) {
      const shadowColor = `rgba(0, 0, 0, ${state.shadowOpacity / 100})`;
      const shadowOffsetX = 2;
      const shadowOffsetY = 2;
      return `${shadowOffsetX}px ${shadowOffsetY}px ${state.shadowBlur}px ${shadowColor}`;
    }
    return 'none';
  };
  
  // Lógica de Estilo Condicional
  const shadows: string[] = [];
  const dropShadow = createDropShadow();
  if (dropShadow !== 'none') {
    shadows.push(dropShadow);
  }

  if (state.strokeWidth > 0 && state.strokeCornerStyle === 'square') {
    const w = state.strokeWidth;
    const c = state.strokeColor;
    for (let i = -Math.ceil(w); i <= Math.ceil(w); i++) {
        for (let j = -Math.ceil(w); j <= Math.ceil(w); j++) {
            if (Math.abs(i) <= w && Math.abs(j) <= w) {
                // Previne adicionar o 0 0 para não cobrir o texto
                if(i !== 0 || j !== 0) {
                  shadows.push(`${i}px ${j}px 0 ${c}`);
                }
            }
        }
    }
    textStyle.WebkitTextStroke = '0'; // Reseta o stroke do webkit
  } else if (state.strokeWidth > 0 && state.strokeCornerStyle === 'rounded') {
      textStyle.WebkitTextStroke = `${state.strokeWidth}px ${state.strokeColor}`;
      textStyle.paintOrder = 'stroke fill';
  }

  if (shadows.length > 0) {
    textStyle.textShadow = shadows.join(', ');
  }


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
            <Label htmlFor="shadow-opacity">Opacidade da Sombra: {state.shadowOpacity}%</Label>
            <Slider
              id="shadow-opacity"
              min={0}
              max={100}
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
          style={textStyle}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
}
