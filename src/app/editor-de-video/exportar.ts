
'use client';

import html2canvas from 'html2canvas';
import type { Toast } from '@/hooks/use-toast';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getClonedElement = async (toast: (props: Parameters<typeof Toast>[0]) => void) => {
    const previewElement = document.getElementById('editor-preview-content') as HTMLElement | null;
    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return null;
    }
    
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px'; 
    clone.style.left = '-9999px';
    clone.style.transform = 'none'; 
    document.body.appendChild(clone);
    
    await delay(100); 

    return { clone, original: previewElement };
}

const downloadDataUrl = (dataUrl: string, format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
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
};

/**
 * Captura a imagem do preview e inicia o download.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const elements = await getClonedElement(toast);
    if (!elements) return;

    const { clone, original } = elements;
    clone.style.width = `${original.offsetWidth}px`;
    clone.style.height = `${original.offsetHeight}px`;
    
    // Aguarda fontes e imagens
    await document.fonts.ready;
    const images = Array.from(clone.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = img.onerror = resolve; });
    }));


    try {
        await delay(50); // Delay extra para renderização
        const canvas = await html2canvas(clone, {
            useCORS: true,
            scale: 2, 
            backgroundColor: null,
            logging: false,
        });
        document.body.removeChild(clone);
        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);
    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        if (document.body.contains(clone)) document.body.removeChild(clone);
    }
};

/**
 * Captura o estado atual do canvas como uma thumbnail.
 */
export const captureThumbnail = async (toast: (props: Parameters<typeof Toast>[0]) => void): Promise<string | null> => {
  const elements = await getClonedElement(toast);
  if (!elements) return null;

  const { clone } = elements;
  
  try {
    clone.style.width = '400px'; 
    clone.style.height = '400px';
    
    await document.fonts.ready;
    await delay(100);

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 1, 
      backgroundColor: null,
      logging: false,
    });
    
    document.body.removeChild(clone);

    return canvas.toDataURL('image/jpeg', 0.8);

  } catch (error) {
    console.error('Erro ao gerar thumbnail:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível gerar a miniatura do modelo.'
    });
    if (document.body.contains(clone)) document.body.removeChild(clone);
    return null;
  }
};


// VERSÃO FINAL - Baseada na análise do usuário
export const captureAndDownload_final = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando (Final)...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const previewElement = document.getElementById('editor-preview-content');
    if (!previewElement) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
        return;
    }

    try {
        // 1. Garantir que fontes externas estão carregadas
        await document.fonts.ready;

        // 2. Garantir que todas as imagens no elemento estão carregadas
        const images = Array.from(previewElement.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = img.onerror = resolve;
            });
        }));

        // 3. Chamar html2canvas com as melhores configurações
        const canvas = await html2canvas(previewElement, {
            scale: 2, // Para maior nitidez
            useCORS: true, // Para imagens de outras origens
            backgroundColor: null, // Para fundos transparentes (se aplicável)
            logging: false,
        });

        // 4. Iniciar o download
        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);

    } catch (error) {
        console.error('Erro ao exportar imagem (versão final):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
    }
};

