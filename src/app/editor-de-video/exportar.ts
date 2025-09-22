
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

    await document.fonts.ready;

    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.transform = 'none'; // Remove qualquer escala aplicada no preview
    document.body.appendChild(clone);

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
 * LOGICA ORIGINAL
 * Captura o conteúdo de um elemento HTML, converte para imagem e inicia o download.
 * @param format - O formato da imagem ('jpeg' ou 'png').
 * @param toast - A função de toast para dar feedback ao usuário.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando (Original)...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const elements = await getClonedElement(toast);
    if (!elements) return;

    const { clone, original } = elements;
    clone.style.width = `${original.offsetWidth}px`;
    clone.style.height = `${original.offsetHeight}px`;

    try {
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
        console.error('Erro ao exportar imagem (Original):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        if (document.body.contains(clone)) document.body.removeChild(clone);
    }
};

/**
 * LOGICA TESTE 1: Adiciona um delay para forçar a renderização completa.
 */
export const captureAndDownload_v1 = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando (Teste 1)...', description: `Adicionando delay antes da captura.` });

    const elements = await getClonedElement(toast);
    if (!elements) return;

    const { clone, original } = elements;
    clone.style.width = `${original.offsetWidth}px`;
    clone.style.height = `${original.offsetHeight}px`;

    await delay(150); // Adiciona um pequeno delay para garantir que o clone seja renderizado

    try {
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
        console.error('Erro ao exportar imagem (Teste 1):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        if (document.body.contains(clone)) document.body.removeChild(clone);
    }
};


/**
 * LOGICA TESTE 2: Ajusta a escala e dimensões do clone para garantir renderização correta.
 */
export const captureAndDownload_v2 = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando (Teste 2)...', description: `Ajustando dimensões e escala do clone.` });

    const elements = await getClonedElement(toast);
    if (!elements) return;

    const { clone, original } = elements;

    // Define dimensões fixas no clone com base no original, em alta resolução
    const scale = 2;
    const width = original.offsetWidth * scale;
    const height = original.offsetHeight * scale;
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;

    try {
        const canvas = await html2canvas(clone, {
            useCORS: true,
            width: width,
            height: height,
            scale: 1, // A escala já foi aplicada manualmente
            backgroundColor: null,
            logging: false,
        });
        document.body.removeChild(clone);
        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);
    } catch (error) {
        console.error('Erro ao exportar imagem (Teste 2):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        if (document.body.contains(clone)) document.body.removeChild(clone);
    }
};


/**
 * Captura o estado atual do canvas como uma thumbnail.
 * @returns Uma string data URL da thumbnail em formato JPEG, ou null em caso de erro.
 */
export const captureThumbnail = async (toast: (props: Parameters<typeof Toast>[0]) => void): Promise<string | null> => {
  const elements = await getClonedElement(toast);
  if (!elements) return null;

  const { clone } = elements;
  
  try {
    clone.style.width = '400px'; 
    clone.style.height = '400px';
    
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
