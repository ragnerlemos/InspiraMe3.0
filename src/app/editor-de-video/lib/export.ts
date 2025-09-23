
"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { PreviewCanva } from "../components/preview-canva";
import type { VisualizacaoEditorProps, ProporcaoTela } from "../tipos";

// Mapeia as proporções para dimensões de exportação em alta resolução.
const exportDimensions: Record<ProporcaoTela, { width: number; height: number }> = {
    "9 / 16": { width: 1080, height: 1920 }, // Stories/Reels
    "1 / 1": { width: 1080, height: 1080 },   // Post Quadrado
    "16 / 9": { width: 1920, height: 1080 }, // Vídeo Horizontal
};

/**
 * Renderiza o PreviewCanva em um contêiner off-screen e o exporta como uma imagem.
 * @param configProps - As propriedades exatas do PreviewCanva a serem renderizadas.
 * @param formato - O formato da imagem de saída ('png' ou 'jpeg').
 * @param isThumbnail - Se verdadeiro, exporta em uma resolução menor para miniaturas.
 * @returns A imagem como um Data URL (string) ou null em caso de falha.
 */
export async function exportPreviewAsImage(
  configProps: VisualizacaoEditorProps,
  formato: "png" | "jpeg" = "png",
  isThumbnail = false
): Promise<string | null> {
  // 1. Espera que as fontes da página estejam prontas.
  await document.fonts.ready;

  // 2. Cria um contêiner temporário fora da tela.
  const exportContainer = document.createElement("div");
  exportContainer.style.position = "fixed";
  exportContainer.style.top = "-9999px";
  exportContainer.style.left = "-9999px";
  exportContainer.style.pointerEvents = "none";
  document.body.appendChild(exportContainer);
  
  const root = createRoot(exportContainer);

  try {
    const dimensions = exportDimensions[configProps.aspectRatio];
    
    // 3. Renderiza o componente PreviewCanva no contêiner off-screen.
    // Usamos uma Promise para garantir que a renderização termine antes de continuar.
    await new Promise<void>((resolve) => {
       // Força a escala do preview para 1 para a captura ter o tamanho base correto
      root.render(<PreviewCanva {...configProps} scale={1} />);
      // Um pequeno timeout para garantir que o DOM e os estilos sejam aplicados
      setTimeout(resolve, 50); 
    });

    // 4. Encontra o elemento de conteúdo do preview renderizado.
    const elementToCapture = exportContainer.querySelector("#editor-preview-content") as HTMLElement;

    if (!elementToCapture) {
      console.error("Elemento do preview não encontrado para exportação.");
      return null;
    }

    // 5. Força as dimensões de exportação no elemento antes de capturar.
    elementToCapture.style.width = `${dimensions.width}px`;
    elementToCapture.style.height = `${dimensions.height}px`;

    // 6. Usa html2canvas para capturar o elemento.
    const canvas = await html2canvas(elementToCapture, {
      backgroundColor: null,
      useCORS: true,
      logging: false,
      width: dimensions.width,
      height: dimensions.height,
      // Para miniaturas, usamos uma escala menor. Para exportação final, usamos 2x para alta qualidade.
      scale: isThumbnail ? 0.5 : 2,
    });

    // 7. Retorna a imagem como um Data URL.
    return canvas.toDataURL(`image/${formato}`, formato === 'jpeg' ? 0.9 : 1.0);

  } catch (error) {
    console.error("Erro ao exportar imagem:", error);
    return null;
  } finally {
    // 8. Limpa o contêiner e remove-o do DOM.
    root.unmount();
    document.body.removeChild(exportContainer);
  }
}
