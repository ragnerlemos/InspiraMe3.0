
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
    
    // Garante que todas as imagens dentro do elemento estão carregadas
    const images = Array.from(previewElement.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = img.onerror = resolve; });
    }));
    
    // Garante que as fontes estão carregadas
    await document.fonts.ready;
    
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px'; 
    clone.style.left = '-9999px';
    clone.style.transform = 'none'; // Importante: remove qualquer transformação de escala
    document.body.appendChild(clone);
    
    // Pequeno delay para garantir que o navegador renderizou o clone
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

    const { clone } = elements;
    
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
    // Para thumbnail, podemos usar dimensões menores
    clone.style.width = '400px'; 
    clone.style.height = '400px';
    
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


// VERSÃO FINAL - Implementando a lógica sugerida pelo usuário
export const captureAndDownload_final = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando (Final)...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const previewElement = document.getElementById('editor-preview-content');
    if (!previewElement) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
        return;
    }

    try {
        await document.fonts.ready;
        const images = Array.from(previewElement.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => { img.onload = img.onerror = resolve; });
        }));

        // 1. Criar um wrapper temporário com tamanho fixo e flexbox para centralizar
        const wrapper = document.createElement('div');
        wrapper.style.width = `${previewElement.offsetWidth}px`;
        wrapper.style.height = `${previewElement.offsetHeight}px`;
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        
        // 2. Adicionar o wrapper invisível ao corpo do documento
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '-9999px';
        document.body.appendChild(wrapper);

        // 3. Clonar o conteúdo do preview DENTRO do wrapper
        wrapper.appendChild(previewElement.cloneNode(true));
        
        await delay(100); // Dar um tempo mínimo para renderização

        // 4. Capturar o WRAPPER, não o elemento original
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
            logging: false,
        });

        // 5. Baixar a imagem e limpar
        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);

        // 6. Remover o wrapper do DOM
        document.body.removeChild(wrapper);

    } catch (error) {
        console.error('Erro ao exportar imagem (versão final):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
    }
};
