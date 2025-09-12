// Componente para a aba "Estilo", que agrupa todos os controles de customização visual do texto.

import {
  AlignCenter, AlignLeft, AlignRight, MoveVertical, Bold, Italic,
  Baseline, Paintbrush, Text, Pipette, Type, CaseSensitive
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { PainelEstiloProps } from "./tipos";
import { BotaoRecurso } from "./botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ControleAtivo = 'fonte' | 'tamanho' | 'cor' | 'alinhamento' | 'estilo' | 'posicao' | 'contorno' | 'sombra' | null;

export function PainelEstilo(props: PainelEstiloProps & { onClose: () => void }) {
    const [controleAtivo, setControleAtivo] = useState<ControleAtivo>('fonte');
    
    const isTwitterTemplate = props.activeTemplateId === -2;
    
    const handleSetControleAtivo = (controle: ControleAtivo) => {
        setControleAtivo(prev => prev === controle ? null : controle);
    }

    const renderControle = () => {
        if (!controleAtivo) return <p className="text-muted-foreground text-center p-4 text-sm">Selecione uma ferramenta.</p>;

        return (
            <div className="space-y-4 p-4">
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
                            <span className="text-sm text-muted-foreground">{props.fontSize.toFixed(1)} pt</span>
                        </div>
                        <Slider id="font-size" min={1} max={20} step={0.1} value={[props.fontSize]} onValueChange={(v) => props.onFontSizeChange(v[0])} />
                    </div>
                )}
                {controleAtivo === 'cor' && (
                     <div className="space-y-2">
                        <Label>Cor do Texto</Label>
                        <div className="relative h-10 w-full">
                           <Input
                                type="color"
                                value={props.textColor}
                                onChange={(e) => props.onTextColorChange(e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}
                {controleAtivo === 'alinhamento' && (
                    <div className="space-y-2">
                        <Label>Alinhamento do Texto</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <BotaoRecurso icon={AlignLeft} label="" onClick={() => props.onTextAlignChange('left')} isActive={props.textAlign === 'left'} />
                            <BotaoRecurso icon={AlignCenter} label="" onClick={() => props.onTextAlignChange('center')} isActive={props.textAlign === 'center'} />
                            <BotaoRecurso icon={AlignRight} label="" onClick={() => props.onTextAlignChange('right')} isActive={props.textAlign === 'right'} />
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
                             <div className="relative h-10 w-full">
                                <Input
                                    type="color"
                                    value={props.textStrokeColor}
                                    onChange={(e) => props.onTextStrokeColorChange(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Espessura</Label>
                                <span className="text-xs text-muted-foreground">{props.textStrokeWidth.toFixed(1)} pt</span>
                            </div>
                            <Slider id="stroke-width" min={0} max={10} step={0.1} value={[props.textStrokeWidth]} onValueChange={(v) => props.onTextStrokeWidthChange(v[0])} />
                        </div>
                    </div>
                )}
                {controleAtivo === 'sombra' && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="shadow-blur" className="text-xs text-muted-foreground">Desfoque</Label>
                            <span className="text-xs text-muted-foreground">{props.textShadowBlur.toFixed(1)} pt</span>
                        </div>
                        <Slider id="shadow-blur" min={0} max={10} step={0.1} value={[props.textShadowBlur]} onValueChange={(v) => props.onTextShadowBlurChange(v[0])} />
                    </div>
                )}
            </div>
        )
    }

    const subMenu = (
        <ScrollArea className="w-full whitespace-nowrap border-b">
            <div className="flex w-max space-x-1 p-2">
                <BotaoRecurso icon={Type} label="Fonte" onClick={() => handleSetControleAtivo('fonte')} isActive={controleAtivo === 'fonte'}/>
                <BotaoRecurso icon={CaseSensitive} label="Tamanho" onClick={() => handleSetControleAtivo('tamanho')} isActive={controleAtivo === 'tamanho'}/>
                <BotaoRecurso icon={Pipette} label="Cor" onClick={() => handleSetControleAtivo('cor')} isActive={controleAtivo === 'cor'}/>
                <BotaoRecurso icon={AlignLeft} label="Alinhar" onClick={() => handleSetControleAtivo('alinhamento')} isActive={controleAtivo === 'alinhamento'}/>
                <BotaoRecurso icon={Bold} label="Estilo" onClick={() => handleSetControleAtivo('estilo')} isActive={controleAtivo === 'estilo'}/>
                <BotaoRecurso icon={MoveVertical} label="Posição" onClick={() => handleSetControleAtivo('posicao')} isActive={controleAtivo === 'posicao'}/>
                <BotaoRecurso icon={Baseline} label="Contorno" onClick={() => handleSetControleAtivo('contorno')} isActive={controleAtivo === 'contorno'}/>
                <BotaoRecurso icon={Paintbrush} label="Sombra" onClick={() => handleSetControleAtivo('sombra')} isActive={controleAtivo === 'sombra'}/>
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
    )

    return (
       <div className="w-full h-full flex flex-col">
            {subMenu}
            <div className="flex-1 overflow-y-auto">
                {renderControle()}
            </div>
       </div>
    );
}
