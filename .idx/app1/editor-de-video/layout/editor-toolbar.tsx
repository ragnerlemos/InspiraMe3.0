
"use client";

// Componente da barra de ferramentas do editor, otimizado para mobile (Sheet)
// e reutilizável no desktop.

import { ArrowLeft, Brush, ImagePlus, Palette, RectangleHorizontal, Type, UserCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { PainelControlesProps, ActivePanel } from "../modulos-editor/tipos";
import { BotaoRecurso } from '../modulos-editor/botao-recurso';
import { PainelTexto } from "../modulos-editor/paineis/painel-texto";
import { PainelEstilo } from "../modulos-editor/paineis/painel-estilo";
import { PainelFundo } from "../modulos-editor/paineis/painel-fundo";
import { PainelCores } from '../modulos-editor/paineis/painel-cores';
import { PainelCanva } from '../modulos-editor/paineis/painel-canva';
import { PainelAssinatura } from '../modulos-editor/paineis/painel-assinatura';

interface EditorToolbarProps extends PainelControlesProps {
    activePanel: ActivePanel;
    setActivePanel: (panel: ActivePanel) => void;
    isDesktop: boolean;
}

export function EditorToolbar({ activePanel, setActivePanel, isDesktop, ...props }: EditorToolbarProps) {
    
    // Se for desktop, este componente não renderiza nada, pois a lógica está na Sidebar.
    if (isDesktop) {
        return null;
    }

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
            case 'colors':
                return <PainelCores {...props} {...commonProps} />;
            case 'canvas':
                return <PainelCanva {...props} {...commonProps} />;
            case 'signature':
                return <PainelAssinatura {...props} {...commonProps} />;
            default:
                return null;
        }
    };

    const getPanelTitle = () => {
        switch (activePanel) {
            case 'text': return "Editar Texto";
            case 'style': return "Editar Estilo";
            case 'background': return "Editar Fundo";
            case 'colors': return "Editar Cores";
            case 'canvas': return "Editar Canvas";
            case 'signature': return "Editar Assinatura";
            default: return "";
        }
    };
    
    return (
        <div className="md:hidden">
            {/* O toolbar agora fica fixo na parte inferior da tela */}
            <div className="fixed bottom-0 left-0 z-10 w-full border-t bg-background">
                 <div className="flex h-16 items-center justify-around px-2">
                    <BotaoRecurso icon={Type} label="Texto" onClick={() => setActivePanel('text')} isActive={activePanel === 'text'} />
                    <BotaoRecurso icon={Brush} label="Estilo" onClick={() => setActivePanel('style')} isActive={activePanel === 'style'} />
                    <BotaoRecurso icon={Palette} label="Cores" onClick={() => setActivePanel('colors')} isActive={activePanel === 'colors'} />
                    <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => setActivePanel('background')} isActive={activePanel === 'background'}/>
                    <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => setActivePanel('canvas')} isActive={activePanel === 'canvas'}/>
                    <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => setActivePanel('signature')} isActive={activePanel === 'signature'}/>
                </div>
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
