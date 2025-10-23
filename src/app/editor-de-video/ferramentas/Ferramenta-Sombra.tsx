
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import React from 'react';

interface FerramentaSombraProps {
  shadowBlur: number;
  shadowOpacity: number;
  updateState: (newState: { shadowBlur?: number; shadowOpacity?: number }) => void;
}

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
