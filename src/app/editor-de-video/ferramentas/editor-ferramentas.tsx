
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
    strokeWidth: 0,
    strokeColor: '#000000',
    strokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // --- Lógica de Geração de Estilo ---

  const textBaseStyle: React.CSSProperties = {
    fontWeight: state.fontWeight,
    fontStyle: state.fontStyle,
    fontSize: '60px',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
  };

  const textEffectsStyle = useMemo(() => {
    const shadows: string[] = [];
    const styles: React.CSSProperties = {};

    // 1. Lógica da Sombra Projetada (Drop Shadow)
    if (state.shadowOpacity > 0 && state.shadowBlur > 0) {
      const effectiveOpacity = state.shadowOpacity / 100;
      const offsetX = state.shadowBlur * 0.15;
      const offsetY = state.shadowBlur * 0.3;
      const blurRadius = state.shadowBlur;
      const spread = state.shadowOpacity > 100 ? (state.shadowOpacity - 100) / 10 : 0;
      const color = `rgba(0, 0, 0, ${effectiveOpacity > 1 ? 1 : effectiveOpacity})`;
      shadows.push(`${offsetX}px ${offsetY}px ${blurRadius}px ${spread}px ${color}`);
    }

    // 2. Lógica do Contorno (Stroke)
    if (state.strokeWidth > 0) {
      if (state.strokeCornerStyle === 'square') {
        // Usa -webkit-text-stroke para um contorno nítido e profissional
        styles.WebkitTextStroke = `${state.strokeWidth}px ${state.strokeColor}`;
        styles.textStroke = `${state.strokeWidth}px ${state.strokeColor}`;
      } else { // 'rounded'
        // Usa a técnica de múltiplas sombras com desfoque para simular cantos arredondados
        const width = state.strokeWidth;
        const color = state.strokeColor;
        const numSteps = 8;
        for (let i = 0; i < numSteps; i++) {
          const angle = (i / numSteps) * 2 * Math.PI;
          const x = Math.cos(angle) * width;
          const y = Math.sin(angle) * width;
          shadows.push(`${x}px ${y}px 0 ${color}`);
        }
      }
    }

    if (shadows.length > 0) {
      styles.textShadow = shadows.join(', ');
    }

    return styles;
  }, [
    state.shadowBlur,
    state.shadowOpacity,
    state.strokeWidth,
    state.strokeColor,
    state.strokeCornerStyle,
  ]);

  // --- Renderização ---

  const renderTextWithEmojis = () => {
    const parts = state.text.split(EMOJI_REGEX);
    
    // O estilo base e os efeitos são combinados aqui
    const combinedStyle = { ...textBaseStyle, ...textEffectsStyle };

    return (
        <div style={combinedStyle}>
            {parts.map((part, index) => {
                // Se o segmento é um emoji (índice ímpar)
                if (index % 2 !== 0) {
                    // Se a aplicação de efeitos em emojis estiver DESATIVADA
                    if (!state.applyEffectsToEmojis) {
                        // Renderiza o emoji sem nenhum efeito
                        return (
                            <span key={index} style={{ textShadow: 'none', WebkitTextStroke: '0' }}>
                                {part}
                            </span>
                        );
                    }
                }
                // Renderiza o texto ou o emoji com os efeitos padrão
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
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
            <Label htmlFor="stroke-width">Espessura do Contorno: {state.strokeWidth.toFixed(1)}px</Label>
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
          className="text-center break-words"
        >
          {renderTextWithEmojis()}
        </div>
      </div>
    </div>
  );
}
