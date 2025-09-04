
// Componente da barra de ferramentas inferior que gerencia os painéis deslizantes.

import { useState } from 'react';
import { Type, Palette, ImagePlus, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { PainelControlesProps } from "./tipos";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import { BotaoRecurso } from './botao-recurso';
import { useWindowSize } from 'react-use';


export function PainelControles(props: PainelControlesProps) {
    const [activePanel, setActivePanel] = useState<'text' | 'style' | 'background' | null>(null);
    const { width } = useWindowSize();
    const isDesktop = width >= 768; // Tailwind's md breakpoint
    
    const handlePanelChange = (panel: 'text' | 'style' | 'background' | null) => {
        if (isDesktop) {
            setActivePanel(panel);
        } else {
            // No mobile, se o painel já estiver ativo, não faz nada, 
            // se for diferente, abre o novo painel.
            if (activePanel !== panel) {
                setActivePanel(panel);
            }
        }
    };


    const renderPanelContent = () => {
        const commonProps = {
            onClose: () => setActivePanel(null),
        };
        
        switch (activePanel) {
            case 'text':
                // O painel de texto no desktop não é um painel separado, é sempre visível
                if (!isDesktop) {
                    return <PainelTexto {...props} />;
                }
                return null;
            case 'style':
                return <PainelEstilo {...props} {...commonProps} />;
            case 'background':
                 return <PainelFundo {...props} {...commonProps} />;
            default:
                // No desktop, renderiza um placeholder se nenhum painel estiver ativo
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
            <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange('text')} isActive={activePanel === 'text'} />
            <BotaoRecurso icon={Palette} label="Estilo" onClick={() => handlePanelChange('style')} isActive={activePanel === 'style'} />
            <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => handlePanelChange('background')} isActive={activePanel === 'background'}/>
        </div>
    );

    // Layout para Desktop
    if (isDesktop) {
        return (
            <div className="flex flex-col h-full">
                {/* O painel de texto é renderizado diretamente aqui no desktop */}
                <div className="border-b">
                    <PainelTexto {...props} />
                </div>
                {mainToolbar}
                <div className="flex-1 overflow-y-auto">
                    {renderPanelContent()}
                </div>
            </div>
        )
    }

    // Layout para Mobile com Sheet
    return (
        <Sheet open={!!activePanel} onOpenChange={(open) => !open && setActivePanel(null)}>
            <div className="w-full border-t bg-background flex flex-col fixed bottom-0 left-0 md:hidden">
                {mainToolbar}
            </div>

            <SheetContent 
                side="bottom" 
                className="h-auto max-h-[80vh] flex flex-col" 
                onInteractOutside={(e) => {
                    if (e.target instanceof HTMLElement && e.target.getAttribute('type') === 'color') {
                        e.preventDefault();
                    }
                }}
            >
                 <SheetHeader className="mb-4">
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
    );
}
