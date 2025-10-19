
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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

// Regex para encontrar emojis no texto.
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
    strokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const createDropShadow = (blur: number, opacity: number) => {
    if (opacity === 0) return 'none';
    const effectiveOpacity = opacity / 100;
    const offsetX = blur * 0.15;
    const offsetY = blur * 0.3;
    const blurRadius = blur;
    return `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, ${effectiveOpacity})`;
  };

  const createStrokeShadows = (width: number, color: string, cornerStyle: 'rounded' | 'square') => {
    if (width <= 0) return 'none';

    const shadows = [];
    const blur = cornerStyle === 'rounded' ? width * 0.5 : 0;
    const numSteps = 8; // Number of shadows to create the outline

    for (let i = 0; i < numSteps; i++) {
        const angle = (i / numSteps) * 2 * Math.PI;
        const x = Math.cos(angle) * width;
        const y = Math.sin(angle) * width;
        shadows.push(`${x}px ${y}px ${blur}px ${color}`);
    }
    return shadows.join(', ');
  };
  
  const textStyle: React.CSSProperties = {
    fontWeight: state.fontWeight,
    fontStyle: state.fontStyle,
    fontSize: '60px',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
  };

  const combinedShadow = useMemo(() => {
    const stroke = createStrokeShadows(state.strokeWidth, state.strokeColor, state.strokeCornerStyle);
    const drop = createDropShadow(state.shadowBlur, state.shadowOpacity);
    
    if (stroke !== 'none' && drop !== 'none') {
        return `${stroke}, ${drop}`;
    }
    return stroke !== 'none' ? stroke : drop;
  }, [state.strokeWidth, state.strokeColor, state.strokeCornerStyle, state.shadowBlur, state.shadowOpacity]);

  const renderTextWithEmojis = () => {
    const parts = state.text.split(EMOJI_REGEX);
    return parts.map((part, index) => {
        if (index % 2 === 1) { // It's an emoji
            return <span key={index}>{part}</span>;
        }
        // It's a text part
        return (
            <span key={index} style={{ textShadow: state.applyEffectsToEmojis ? 'none' : combinedShadow }}>
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

        <div className="space-y-2">
          <Label htmlFor="main-text">Texto</Label>
          <Textarea
            id="main-text"
            value={state.text}
            onChange={(e) => updateState({ text: e.target.value })}
            rows={4}
          />
        </div>

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

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Sombra</h3>
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

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Contorno</h3>
          <div className="space-y-2">
            <Label>Tipo de Canto do Contorno</Label>
            <div className="flex gap-2">
                <Button variant={state.strokeCornerStyle === 'rounded' ? 'secondary' : 'outline'} onClick={() => updateState({ strokeCornerStyle: 'rounded' })}>Arredondado</Button>
                <Button variant={state.strokeCornerStyle === 'square' ? 'secondary' : 'outline'} onClick={() => updateState({ strokeCornerStyle: 'square' })}>Quadrado</Button>
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
         <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Emojis</h3>
            <div className="flex items-center justify-between">
                <Label htmlFor="emoji-effects" className="cursor-pointer">Aplicar efeitos a emojis</Label>
                <Switch
                    id="emoji-effects"
                    checked={state.applyEffectsToEmojis}
                    onCheckedChange={(checked) => updateState({ applyEffectsToEmojis: checked })}
                />
            </div>
        </div>
      </div>

      {/* Área de Pré-visualização */}
      <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <div
          style={{ ...textStyle, textShadow: state.applyEffectsToEmojis ? combinedShadow : 'none' }}
          className="text-center break-words"
        >
          {renderTextWithEmojis()}
        </div>
      </div>
    </div>
  );
}
