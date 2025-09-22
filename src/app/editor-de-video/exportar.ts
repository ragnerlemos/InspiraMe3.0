
'use client';

import html2canvas from 'html2canvas';
import type { Toast } from '@/hooks/use-toast';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Captura o conteúdo de um elemento HTML, converte para imagem e inicia o download.
 * @param format - O formato da imagem ('jpeg' ou 'png').
 * @param toast - A função de toast para dar feedback ao usuário.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
  const previewElement = document.getElementById('editor-preview-content') as HTMLElement | null;
  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Não foi possível encontrar a área de visualização para exportar.'
    });
    return;
  }

  toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

  try {
    // 1. Garantir que todas as fontes externas estejam carregadas
    await document.fonts.ready;

    // 2. Criar um clone temporário para capturar
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = `${previewElement.offsetWidth}px`;
    clone.style.height = `${previewElement.offsetHeight}px`;
    clone.style.transform = 'none'; // Remove qualquer escala aplicada no preview
    document.body.appendChild(clone);

    // Adiciona um pequeno delay para garantir que o clone seja totalmente renderizado no DOM
    await delay(100);

    // 3. Capturar o canvas do clone
    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 2, // Aumenta a resolução para uma imagem mais nítida
      backgroundColor: null, // Mantém fundo transparente (importante para PNGs)
      logging: false,
    });

    // 4. Remover o clone após a captura
    document.body.removeChild(clone);

    // 5. Converter para Data URL e iniciar o download
    const dataUrl = format === 'png'
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', 0.95);

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
    toast({
      variant: 'destructive',
      title: 'Erro de Exportação',
      description: 'Não foi possível gerar a imagem. Tente novamente.'
    });
  }
};


/**
 * Captura o estado atual do canvas como uma thumbnail.
 * @returns Uma string data URL da thumbnail em formato JPEG, ou null em caso de erro.
 */
export const captureThumbnail = async (toast: (props: Parameters<typeof Toast>[0]) => void): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content') as HTMLElement | null;
  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Não foi possível encontrar a área de visualização para gerar a miniatura.'
    });
    return null;
  }
  
  try {
    await document.fonts.ready;
    
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = '400px'; // Tamanho fixo para thumbnail
    clone.style.height = '400px'; // Tamanho fixo para thumbnail
    clone.style.transform = 'none';
    document.body.appendChild(clone);
    
    await delay(100);

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 1, // Escala normal para thumbnail
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
    return null;
  }
};
