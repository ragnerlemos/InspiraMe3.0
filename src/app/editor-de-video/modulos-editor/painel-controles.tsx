// Componente da barra de ferramentas inferior que gerencia os painéis deslizantes.

import { useState } from 'react';
import { Type, Palette, ImagePlus, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { PainelControlesProps } from "./tipos";
import { PainelTexto } from "./paineis/painel-texto";
import { PainelEstilo } from "./paineis/painel-estilo";
import { PainelFundo } from "./paineis/painel-fundo";
import { BotaoRecurso } from './botao-recurso';
import { useWindowSize } from 'react-use';


export function PainelControles(props: PainelControlesProps) {
    const [activePanel, setActivePanel] = useState<'text' | 'style' | 'background' | null>('text');
    const { width } = useWindowSize();
    const isDesktop = width >= 768; // Tailwind's md breakpoint
    
    const handlePanelChange = (panel: 'text' | 'style' | 'background') => {
        // No mobile, clicar no mesmo botão não deve fechar o painel.
        // O fechamento será feito pelo botão "voltar" ou deslizando.
        setActivePanel(panel);
    };


    const renderPanelContent = () => {
        const commonProps = {
            onClose: () => setActivePanel(null),
        };
        
        switch (activePanel) {
            case 'text':
                 return <PainelTexto {...props} />;
            case 'style':
                return <PainelEstilo {...props} {...commonProps} />;
            case 'background':
                 return <PainelFundo {...props} {...commonProps} />;
            default:
                if (isDesktop) {
                    return <div className="p-4 text-center text-muted-foreground">Selecione uma ferramenta para começar a editar.</div>;
                }
                return null;
        }
    }
    
    const getPanelTitle = () => {
        switch (activePanel) {
            case 'text': return "Editar Texto";
            case 'style': return "Editar Estilo";
            case 'background': return "Editar Fundo";
            default: return "";
        }
    }

    const mainToolbar = (
        <div className="flex h-16 items-center justify-around px-2 border-b">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange('text')} isActive={isDesktop && activePanel === 'text'} />
            <BotaoRecurso icon={Palette} label="Estilo" onClick={() => handlePanelChange('style')} isActive={isDesktop && activePanel === 'style'} />
            <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => handlePanelChange('background')} isActive={isDesktop && activePanel === 'background'}/>
        </div>
    );
    
    const mobileToolbar = (
         <div className="flex h-16 items-center justify-around px-2 border-t bg-background">
            <BotaoRecurso icon={Type} label="Texto" onClick={() => setActivePanel('text')} isActive={activePanel === 'text'} />
            <BotaoRecurso icon={Palette} label="Estilo" onClick={() => setActivePanel('style')} isActive={activePanel === 'style'} />
            <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => setActivePanel('background')} isActive={activePanel === 'background'}/>
        </div>
    )

    // Layout para Desktop
    if (isDesktop) {
        return (
            <div className="flex flex-col h-full">
                {mainToolbar}
                <div className="flex-1 overflow-y-auto">
                    {activePanel === 'text' && <PainelTexto {...props} />}
                    {activePanel === 'style' && <PainelEstilo {...props} onClose={() => setActivePanel(null)} />}
                    {activePanel === 'background' && <PainelFundo {...props} onClose={() => setActivePanel(null)} />}
                    {!activePanel && <div className="p-4 text-center text-muted-foreground">Selecione uma ferramenta para começar a editar.</div>}
                </div>
            </div>
        )
    }

    // Layout para Mobile com Sheet
    return (
        <div className="md:hidden">
            {/* O toolbar agora fica fixo na parte inferior da tela */}
            <div className="fixed bottom-0 left-0 z-10 w-full">
                {mobileToolbar}
            </div>

            <Sheet open={!!activePanel} onOpenChange={(open) => !open && setActivePanel(null)}>
                <SheetContent 
                    side="bottom" 
                    className="h-auto max-h-[85vh] flex flex-col bg-background/80 backdrop-blur-sm"
                    onInteractOutside={(e) => {
                        // Impede o fechamento ao interagir com o seletor de cores.
                        const target = e.target as HTMLElement;
                        if (target.closest('[type="color"]') || target.closest('.rcs-popover')) {
                            e.preventDefault();
                        }
                    }}
                >
                    <SheetHeader className="mb-2">
                        <SheetTitle className="flex items-center">
                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setActivePanel(null)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            {getPanelTitle()}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto flex-1">
                        {renderPanelContent()}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
