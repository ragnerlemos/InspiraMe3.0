
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
