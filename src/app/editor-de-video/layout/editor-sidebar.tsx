
"use client";

// Componente da barra lateral do editor para desktop.
// Gerencia a exibição dos painéis de controle.

import type { PainelControlesProps, ActivePanel } from "../modulos-editor/tipos";
import { BotaoRecurso } from '../modulos-editor/botao-recurso';
import { PainelTexto } from "../modulos-editor/paineis/painel-texto";
import { PainelEstilo } from "../modulos-editor/paineis/painel-estilo";
import { PainelFundo } from "../modulos-editor/paineis/painel-fundo";
import { PainelCores } from '../modulos-editor/paineis/painel-cores';
import { PainelCanva } from '../modulos-editor/paineis/painel-canva';
import { PainelAssinatura } from '../modulos-editor/paineis/painel-assinatura';
import { Type, Brush, Palette, ImagePlus, RectangleHorizontal, UserCheck } from "lucide-react";

interface EditorSidebarProps extends PainelControlesProps {
    activePanel: ActivePanel;
    setActivePanel: (panel: ActivePanel) => void;
}

export function EditorSidebar({ activePanel, setActivePanel, ...props }: EditorSidebarProps) {
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
                return <div className="p-4 text-center text-muted-foreground">Selecione uma ferramenta para começar a editar.</div>;
        }
    };
    
    return (
        <div className="flex flex-col h-full border-l bg-background">
            <div className="flex h-16 items-center justify-around px-2 border-b">
                <BotaoRecurso icon={Type} label="Texto" onClick={() => setActivePanel('text')} isActive={activePanel === 'text'} />
                <BotaoRecurso icon={Brush} label="Estilo" onClick={() => setActivePanel('style')} isActive={activePanel === 'style'} />
                <BotaoRecurso icon={Palette} label="Cores" onClick={() => setActivePanel('colors')} isActive={activePanel === 'colors'} />
                <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => setActivePanel('background')} isActive={activePanel === 'background'}/>
                <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => setActivePanel('canvas')} isActive={activePanel === 'canvas'}/>
                <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => setActivePanel('signature')} isActive={activePanel === 'signature'}/>
            </div>
            <div className="flex-1 overflow-y-auto">
                {renderPanelContent()}
            </div>
        </div>
    );
}
