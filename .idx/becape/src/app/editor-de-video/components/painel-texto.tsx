// Componente para a aba "Texto", que contém a área de texto para editar a frase.

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PainelTextoProps } from "./tipos";

export function PainelTexto({ text, onTextChange }: PainelTextoProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="text-input">Texto da Frase</Label>
            <Textarea
                id="text-input"
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                rows={5}
                placeholder="Digite sua frase aqui..."
            />
        </div>
    );
}
