
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import type { PainelCanvaProps, ProporcaoTela } from "../tipos";

export function PainelCanva(props: PainelCanvaProps & { onClose: () => void }) {
    const { aspectRatio, onAspectRatioChange } = props;
    
    const proportions: { ratio: ProporcaoTela; icon: React.ElementType; label: string }[] = [
        { ratio: '9 / 16', icon: RectangleVertical, label: 'Story' },
        { ratio: '1 / 1', icon: Square, label: 'Quadrado' },
        { ratio: '16 / 9', icon: RectangleHorizontal, label: 'Vídeo' },
    ];
    
    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <Label>Proporção da Tela</Label>
                <div className="grid grid-cols-3 gap-2">
                    {proportions.map(({ ratio, icon: Icon, label }) => (
                         <Button
                            key={ratio}
                            variant={aspectRatio === ratio ? 'secondary' : 'outline'}
                            onClick={() => onAspectRatioChange(ratio)}
                            className="flex flex-col h-16 gap-1"
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs">{label} ({ratio.replace(/ /g, '')})</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
