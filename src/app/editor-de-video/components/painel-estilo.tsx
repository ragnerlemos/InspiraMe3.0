
// Componente para a aba "Estilo", que agrupa todos os controles de customização visual do texto.

import {
  AlignCenter, AlignLeft, AlignRight, MoveVertical, Bold, Italic,
  Baseline, Paintbrush, Text, Pipette, Type, CaseSensitive
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { PainelEstiloProps } from "./tipos";
import { BotaoRecurso } from "./botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


type ControleAtivo = 'fonte' | 'tamanho' | 'cor' | 'alinhamento' | 'estilo' | 'posicao' | 'contorno' | 'sombra' | null;


export function PainelEstilo(props: PainelEstiloProps & { onClose: () => void }) {
    const [controleAtivo, setControleAtivo] = useState<ControleAtivo>(null);
    
    // Para o modelo Twitter (ID -2), desativamos o controle de posição vertical.
    const isTwitterTemplate = props.activeTemplateId === -2;
    
    // Converte a unidade vw para uma aproximação em px para exibição.
    const getApproximatePx = (vw: number) => Math.round(vw * 3.6);


    const renderControle = () => {
        if (!controleAtivo) return null;

        return (
             <div className="space-y-4">
                {controleAtivo === 'fonte' && (
                    <div className="space-y-2">
                        <Label htmlFor="font-family">Fonte</Label>
                        <Select value={props.fontFamily} onValueChange={props.onFontFamilyChange}>
                            <SelectTrigger id="font-family"><SelectValue placeholder="Selecione a fonte" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                                <SelectItem value="PT Sans">PT Sans</SelectItem>
                                <SelectItem value="Merriweather">Merriweather</SelectItem>
                                <SelectItem value="Lobster">Lobster</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                 {controleAtivo === 'tamanho' && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="font-size">Tamanho da Fonte</Label>
                            <span className="text-sm text-muted-foreground">{getApproximatePx(props.fontSize)}px</span>
                        </div>
                        <Slider id="font-size" min={1} max={15} step={0.1} value={[props.fontSize]} onValueChange={(v) => props.onFontSizeChange(v[0])} />
                    </div>
                 )}
                 {controleAtivo === 'cor' && (
                     <div className="space-y-2">
                        <Label htmlFor="text-color">Cor do Texto</Label>
                        <div className="flex items-center gap-2">
                            <Input id="text-color" type="text" value={props.textColor} onChange={(e) => props.onTextColorChange(e.target.value)} className="w-full" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" style={{ backgroundColor: props.textColor }} className="h-10 w-10 border-2" />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-none">
                                    <input type="color" value={props.textColor} onChange={e => props.onTextColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                 )}
                 {controleAtivo === 'alinhamento' && (
                    <div className="space-y-2">
                        <Label>Alinhamento do Texto</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant={props.textAlign === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => props.onTextAlignChange('left')}><AlignLeft /></Button>
                            <Button variant={props.textAlign === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => props.onTextAlignChange('center')}><AlignCenter /></Button>
                            <Button variant={props.textAlign === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => props.onTextAlignChange('right')}><AlignRight /></Button>
                        </div>
                    </div>
                 )}
                 {controleAtivo === 'estilo' && (
                     <div className="space-y-2">
                        <Label>Estilo</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={props.fontWeight === 'bold' ? 'secondary' : 'ghost'} onClick={() => props.onFontWeightChange(props.fontWeight === 'bold' ? 'normal' : 'bold')}><Bold className="mr-2" />Negrito</Button>
                            <Button variant={props.fontStyle === 'italic' ? 'secondary' : 'ghost'} onClick={() => props.onFontStyleChange(props.fontStyle === 'italic' ? 'normal' : 'italic')}><Italic className="mr-2" />Itálico</Button>
                        </div>
                    </div>
                 )}
                 {controleAtivo === 'posicao' && (
                     <div className="space-y-4" style={{ opacity: isTwitterTemplate ? 0.5 : 1 }}>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="vertical-position" className="flex items-center"><MoveVertical className="mr-2 h-4 w-4" />Posição Vertical</Label>
                            <span className="text-sm text-muted-foreground">{props.textVerticalPosition}%</span>
                        </div>
                        <Slider id="vertical-position" min={15} max={85} step={1} value={[props.textVerticalPosition]} onValueChange={(v) => props.onTextVerticalPositionChange(v[0])} disabled={isTwitterTemplate} />
                    </div>
                 )}
                 {controleAtivo === 'contorno' && (
                    <div className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="stroke-color" className="text-xs text-muted-foreground">Cor</Label>
                            <div className="flex items-center gap-2">
                                <Input id="stroke-color" type="text" value={props.textStrokeColor} onChange={(e) => props.onTextStrokeColorChange(e.target.value)} className="w-full h-9" />
                                <Popover>
                                    <PopoverTrigger asChild><Button variant="outline" size="icon" style={{ backgroundColor: props.textStrokeColor }} className="h-9 w-9 border-2" /></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-none"><input type="color" value={props.textStrokeColor} onChange={e => props.onTextStrokeColorChange(e.target.value)} className="w-16 h-16 cursor-pointer" /></PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Espessura</Label>
                                <span className="text-xs text-muted-foreground">{props.textStrokeWidth.toFixed(1)}</span>
                            </div>
                            <Slider id="stroke-width" min={0} max={10} step={0.1} value={[props.textStrokeWidth]} onValueChange={(v) => props.onTextStrokeWidthChange(v[0])} />
                        </div>
                    </div>
                 )}
                 {controleAtivo === 'sombra' && (
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-blur" className="text-xs text-muted-foreground">Desfoque</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowBlur.toFixed(1)}</span>
                        </div>
                        <Slider id="shadow-blur" min={0} max={10} step={0.1} value={[props.textShadowBlur]} onValueChange={(v) => props.onTextShadowBlurChange(v[0])} />
                    </div>
                 )}
            </div>
        )
    }

    const subMenu = (
         <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex h-24 items-center justify-start px-2 gap-2">
                <BotaoRecurso icon={Type} label="Fonte" onClick={() => setControleAtivo('fonte')} isActive={controleAtivo === 'fonte'}/>
                <BotaoRecurso icon={CaseSensitive} label="Tamanho" onClick={() => setControleAtivo('tamanho')} isActive={controleAtivo === 'tamanho'}/>
                <BotaoRecurso icon={Pipette} label="Cor" onClick={() => setControleAtivo('cor')} isActive={controleAtivo === 'cor'}/>
                <BotaoRecurso icon={AlignLeft} label="Alinhar" onClick={() => setControleAtivo('alinhamento')} isActive={controleAtivo === 'alinhamento'}/>
                <BotaoRecurso icon={Bold} label="Estilo" onClick={() => setControleAtivo('estilo')} isActive={controleAtivo === 'estilo'}/>
                <BotaoRecurso icon={MoveVertical} label="Posição" onClick={() => setControleAtivo('posicao')} isActive={controleAtivo === 'posicao'}/>
                <BotaoRecurso icon={Baseline} label="Contorno" onClick={() => setControleAtivo('contorno')} isActive={controleAtivo === 'contorno'}/>
                <BotaoRecurso icon={Paintbrush} label="Sombra" onClick={() => setControleAtivo('sombra')} isActive={controleAtivo === 'sombra'}/>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )

    return (
       <div className="w-full h-full flex flex-col">
           {subMenu}
           <Separator/>
            <div className="flex-1 p-4 overflow-y-auto">
                {renderControle()}
            </div>
       </div>
    );
}
