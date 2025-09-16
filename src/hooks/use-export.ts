
"use client";

import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { useTemplates } from '@/hooks/use-templates';
import type { EditorState } from '@/app/editor-de-video/modulos-editor/tipos';

export const useExport = (editorState: EditorState) => {
    const { toast } = useToast();
    const { addTemplate } = useTemplates();

    const handleSaveAsTemplate = useCallback(async () => {
        const templateName = prompt("Digite um nome para o novo modelo:");
        if (!templateName) return;
        const previewElement = document.getElementById('editor-preview-content');
        if (previewElement) {
            try {
                const canvas = await html2canvas(previewElement, {
                    scale: 0.5,
                    useCORS: true,
                    backgroundColor: null, 
                });
                const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                
                addTemplate(templateName, editorState, thumbnail);

                toast({
                    title: "Modelo Salvo!",
                    description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
                });
            } catch (error) {
                console.error("Erro ao criar thumbnail:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao Salvar",
                    description: "Não foi possível gerar a pré-visualização do modelo.",
                });
            }
        }
    }, [addTemplate, editorState, toast]);

    const captureCanvas = useCallback(async (format: 'jpeg' | 'png') => {
        const previewElement = document.getElementById('editor-preview-content');
        if (!previewElement) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível encontrar a área de visualização.' });
            return;
        }

        toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}.` });
        
        try {
            const canvas = await html2canvas(previewElement, {
                useCORS: true,
                backgroundColor: null, 
                scale: 4, // Aumenta a resolução para melhor qualidade
            });

            const image = canvas.toDataURL(`image/${format}`, format === 'png' ? 1.0 : 0.9);
            
            const link = document.createElement('a');
            link.href = image;
            link.download = `quotevid-export.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({ title: 'Sucesso!', description: `A imagem foi baixada como ${link.download}.` });

        } catch (error) {
            console.error('Erro ao exportar imagem:', error);
            toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        }
    }, [toast]);
    
    const onExportJPG = useCallback(() => captureCanvas('jpeg'), [captureCanvas]);
    const onExportPNG = useCallback(() => captureCanvas('png'), [captureCanvas]);

    const onExportMP4 = useCallback(() => {
        // Lógica de exportação de vídeo será implementada aqui
        toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
    }, [toast]);

    return {
        onSaveAsTemplate: handleSaveAsTemplate,
        onExportJPG,
        onExportPNG,
        onExportMP4,
    };
};
