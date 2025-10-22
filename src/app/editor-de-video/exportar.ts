
'use client';

import * as htmlToImage from 'html-to-image';
import type { EditorState, EstiloTexto } from './tipos';
import type { ProfileData } from '@/hooks/use-profile';

// Tipos importados diretamente, pois este arquivo não é um componente React
interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

/**
 * Captura a imagem do preview e inicia o download.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto) => {
    const previewElement = document.getElementById('editor-preview-content');

    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro de Exportação',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return;
    }

    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });
    
    // Espera fontes e imagens carregarem
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 150));

    try {
        const dataUrl = format === 'jpeg'
            ? await htmlToImage.toJpeg(previewElement, { quality: 0.95, pixelRatio: 2 })
            : await htmlToImage.toPng(previewElement, { pixelRatio: 2 });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `inspire-me-export-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Sucesso!',
            description: `A imagem foi baixada como ${link.download}.`
        });

    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem. Verifique o console para mais detalhes.' });
    }
};

/**
 * Captura o estado atual do canvas como uma thumbnail.
 */
export const captureThumbnail = async (toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content');

  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível encontrar a área de visualização para gerar a miniatura.'
    });
    return null;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(previewElement, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     return thumbnail;

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar Modelo', description: 'Não foi possível gerar a miniatura do modelo.' });
      return null;
  }
};
