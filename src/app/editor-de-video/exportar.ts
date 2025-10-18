
'use client';

// Tipos importados diretamente, pois este arquivo não é um componente React
interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getClonedElementWithStyles = async (elementId: string, toast: ToastFn): Promise<HTMLElement | null> => {
    const originalElement = document.getElementById(elementId) as HTMLElement | null;
    if (!originalElement) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: `Elemento de visualização "${elementId}" não encontrado para exportar.`
        });
        return null;
    }

    const images = Array.from(originalElement.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = img.onerror = resolve; });
    }));

    await document.fonts.ready;
    await delay(150);

    const clone = originalElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '0px';
    clone.style.transform = 'none';
    document.body.appendChild(clone);
    await delay(100);

    return clone;
};

const downloadDataUrl = (dataUrl: string, format: 'jpeg' | 'png', toast: ToastFn) => {
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
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn) => {
    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const clone = await getClonedElementWithStyles('editor-preview-content', toast);
    if (!clone) return;

    try {
        const { toPng, toJpeg } = await import('html-to-image');
        const dataUrl = format === 'png'
            ? await toPng(clone, { pixelRatio: 2, cacheBust: true })
            : await toJpeg(clone, { pixelRatio: 2, quality: 0.95, cacheBust: true });
        
        downloadDataUrl(dataUrl, format, toast);

    } catch (error) {
        console.error('Erro ao exportar imagem com html-to-image:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
    } finally {
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
        }
    }
};

/**
 * Captura o estado atual do canvas como uma thumbnail.
 */
export const captureThumbnail = async (toast: ToastFn): Promise<string | null> => {
  const clone = await getClonedElementWithStyles('editor-preview-content', toast);
  if (!clone) return null;
  
  try {
    const { toJpeg } = await import('html-to-image');
    
    // Para thumbnail, podemos usar dimensões e qualidade menores
    const dataUrl = await toJpeg(clone, {
      quality: 0.8,
      width: 400,
      height: 400,
      style: {
        objectFit: 'cover',
        aspectRatio: '1',
      },
      cacheBust: true,
    });
    
    return dataUrl;

  } catch (error) {
    console.error('Erro ao gerar thumbnail:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível gerar a miniatura do modelo.'
    });
    return null;
  } finally {
    if (document.body.contains(clone)) {
        document.body.removeChild(clone);
    }
  }
};
