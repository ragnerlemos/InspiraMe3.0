
// Componente para a aba "Estilo", que agrupa todos os controles de customização visual do texto.

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  MoveVertical,
  Bold,
  Italic,
  Baseline,
  Paintbrush,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { PainelEstiloProps } from "./tipos";
import { Separator } from "@/components/ui/separator";


export function PainelEstilo({
    fontFamily, onFontFamilyChange,
    fontSize, onFontSizeChange,
    fontWeight, onFontWeightChange,
    fontStyle, onFontStyleChange,
    textColor, onTextColorChange,
    textAlign, onTextAlignChange,
    textShadowBlur, onTextShadowBlurChange,
    textVerticalPosition, onTextVerticalPositionChange,
    textStrokeColor, onTextStrokeColorChange,
    textStrokeWidth, onTextStrokeWidthChange,
    showProfileSignature, onShowProfileSignatureChange,
}: PainelEstiloProps) {
    return (
        <>
            {/* Seletor de Fonte */}
            <div className="space-y-2">
                <Label htmlFor="font-family">Fonte</Label>
                <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                    <SelectTrigger id="font-family">
                        <SelectValue placeholder="Selecione a fonte" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="PT Sans">PT Sans</SelectItem>
                        <SelectItem value="Merriweather">Merriweather</SelectItem>
                        <SelectItem value="Lobster">Lobster</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Estilo da Fonte (Negrito/Itálico) */}
            <div className="space-y-2">
                <Label>Estilo</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant={fontWeight === 'bold' ? 'secondary' : 'ghost'} onClick={() => onFontWeightChange(fontWeight === 'bold' ? 'normal' : 'bold')}><Bold className="mr-2" />Negrito</Button>
                    <Button variant={fontStyle === 'italic' ? 'secondary' : 'ghost'} onClick={() => onFontStyleChange(fontStyle === 'italic' ? 'normal' : 'italic')}><Italic className="mr-2" />Itálico</Button>
                </div>
            </div>

            {/* Controle de Tamanho da Fonte */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                    id="font-size"
                    min={12}
                    max={128}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(value) => onFontSizeChange(value[0])}
                />
            </div>

            {/* Seletor de Cor do Texto */}
            <div className="space-y-2">
                <Label htmlFor="text-color">Cor do Texto</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="text-color"
                        type="text"
                        value={textColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="w-full"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" style={{ backgroundColor: textColor }} className="h-10 w-10 border-2" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none">
                            <input type="color" value={textColor} onChange={e => onTextColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Controles de Alinhamento do Texto */}
            <div className="space-y-2">
                <Label>Alinhamento do Texto</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant={textAlign === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => onTextAlignChange('left')}><AlignLeft /></Button>
                    <Button variant={textAlign === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => onTextAlignChange('center')}><AlignCenter /></Button>
                    <Button variant={textAlign === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => onTextAlignChange('right')}><AlignRight /></Button>
                </div>
            </div>

             <Separator />

            {/* Controle de Posição Vertical */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label htmlFor="vertical-position" className="flex items-center">
                        <MoveVertical className="mr-2 h-4 w-4" />
                        Posição Vertical
                    </Label>
                    <span className="text-sm text-muted-foreground">{textVerticalPosition}%</span>
                </div>
                <Slider
                    id="vertical-position"
                    min={15}
                    max={85}
                    step={1}
                    value={[textVerticalPosition]}
                    onValueChange={(value) => onTextVerticalPositionChange(value[0])}
                />
            </div>

             <Separator />

             {/* Controle da Assinatura do Perfil */}
              <div className="space-y-2">
                <Label>Assinatura</Label>
                 <Button 
                    variant={showProfileSignature ? 'secondary' : 'outline'} 
                    onClick={() => onShowProfileSignatureChange(!showProfileSignature)}
                    className="w-full"
                >
                    <UserCheck className="mr-2 h-4 w-4" />
                    {showProfileSignature ? 'Ocultar' : 'Mostrar'} Assinatura de Perfil
                </Button>
            </div>


            {/* Controles de Contorno do Texto */}
            <div className="space-y-4 rounded-lg border p-4">
                 <Label className="flex items-center"><Baseline className="mr-2 h-4 w-4" />Contorno</Label>
                 <div className="space-y-2">
                    <Label htmlFor="stroke-color" className="text-xs text-muted-foreground">Cor do Contorno</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="stroke-color"
                            type="text"
                            value={textStrokeColor}
                            onChange={(e) => onTextStrokeColorChange(e.target.value)}
                            className="w-full h-9"
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" style={{ backgroundColor: textStrokeColor }} className="h-9 w-9 border-2" />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none">
                                <input type="color" value={textStrokeColor} onChange={e => onTextStrokeColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Espessura do Contorno</Label>
                        <span className="text-xs text-muted-foreground">{textStrokeWidth}px</span>
                    </div>
                    <Slider
                        id="stroke-width"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[textStrokeWidth]}
                        onValueChange={(value) => onTextStrokeWidthChange(value[0])}
                    />
                </div>
            </div>
            
            {/* Controle de Sombra do Texto */}
            <div className="space-y-4 rounded-lg border p-4">
                <Label className="flex items-center"><Paintbrush className="mr-2 h-4 w-4" />Sombra</Label>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="shadow-blur" className="text-xs text-muted-foreground">Desfoque da Sombra</Label>
                        <span className="text-xs text-muted-foreground">{textShadowBlur}px</span>
                    </div>
                    <Slider
                        id="shadow-blur"
                        min={0}
                        max={32}
                        step={1}
                        value={[textShadowBlur]}
                        onValueChange={(value) => onTextShadowBlurChange(value[0])}
                    />
                </div>
            </div>
        </>
    );
}
