
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import React from "react";

interface FerramentaSombraProps {
  shadowBlur: number;
  shadowOpacity: number;
  updateState: (newState: {
    shadowBlur?: number;
    shadowOpacity?: number;
  }) => void;
}

// Algoritmo Final Definitivo: `filter: drop-shadow` com Desfoque Progressivo
export const createDropShadowStyle = (
  blur: number,
  intensityPercent: number
): React.CSSProperties => {
  if (blur <= 0 || intensityPercent <= 0) {
    return {};
  }

  const shadowColor = 'rgba(0,0,0,0.9)'; // Usar uma cor com alfa para suavizar
  const offsetY = blur * 0.1;
  const offsetX = blur * 0.05;

  // A intensidade (0-200%) controla o número de camadas (1-10)
  const numLayers = Math.ceil((intensityPercent / 200) * 10);

  const shadows = [];

  // O desfoque aumenta progressivamente, garantindo o acabamento suave
  for (let i = 1; i <= numLayers; i++) {
    const layerBlur = (blur / numLayers) * i * 1.2; // O multiplicador suaviza a transição
    const shadow = `drop-shadow(${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px ${layerBlur.toFixed(2)}px ${shadowColor})`;
    shadows.push(shadow);
  }

  return {
    filter: shadows.join(" "), // `drop-shadow`s são separados por espaço
  };
};


export function FerramentaSombra({
  shadowBlur,
  shadowOpacity,
  updateState,
}: FerramentaSombraProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Sombra Projetada</h3>
      <div className="space-y-2">
        <Label htmlFor="shadow-blur">Desfoque da Sombra: {shadowBlur}px</Label>
        <Slider
          id="shadow-blur"
          min={0}
          max={100}
          step={1}
          value={[shadowBlur]}
          onValueChange={(v) => updateState({ shadowBlur: v[0] })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shadow-intensity">Intensidade da Sombra: {shadowOpacity}%</Label>
        <Slider
          id="shadow-intensity"
          min={0}
          max={200}
          step={1}
          value={[shadowOpacity]}
          onValueChange={(v) => updateState({ shadowOpacity: v[0] })} // Corrigido: onValue-change -> onValueChange
        />
      </div>
    </div>
  );
}
