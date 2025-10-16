
"use client";

import * as htmlToImage from 'html-to-image';
import type { EditorState } from "../tipos";

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Captura o preview como imagem usando a biblioteca html-to-image, que é mais fiel.
 * @param formato "png" | "jpeg"
 */
export async function onExportImage(
  formato: "png" | "jpeg" = "png",
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const mainElement = document.querySelector<HTMLElement>("#editor-preview-content");

  if (!mainElement) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }

  toast({ title: 'Exportando...', description: 'Gerando imagem, por favor aguarde...' });
  
  // Espera fontes e imagens carregarem
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 100));

  try {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}-${now.getSeconds().toString().padStart(2,'0')}`;
    const filename = `inspire-me-${timestamp}.${formato}`;

    let dataUrl: string;

    if (formato === 'jpeg') {
      dataUrl = await htmlToImage.toJpeg(mainElement, { 
        quality: 0.95,
        pixelRatio: 2, // Captura com 2x a resolução para alta qualidade
      });
    } else {
      dataUrl = await htmlToImage.toPng(mainElement, {
        pixelRatio: 2,
      });
    }

    downloadDataUrl(dataUrl, filename);

    toast({ title: 'Sucesso!', description: `Imagem salva como ${filename}` });

  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Ocorreu um problema ao gerar a imagem.' });
  }
}


/**
 * Gera uma miniatura para o template e o salva.
 * @param currentState Estado atual do editor
 * @param addTemplate Função para adicionar o template
 * @param toast Função para exibir notificações
 */
export async function handleSaveAsTemplate(
  currentState: EditorState,
  addTemplate: (name: string, state: EditorState, thumbnail: string) => void,
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const templateName = prompt("Digite um nome para o novo modelo:");
  if (!templateName) return;

  toast({ title: 'Salvando modelo...', description: 'Gerando miniatura...' });

  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(element, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            // Força o aspecto 1:1 para a miniatura se necessário
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     addTemplate(templateName, currentState, thumbnail);
     toast({
        title: "Modelo Salvo!",
        description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
     });

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível gerar a miniatura do modelo.' });
  }
}
