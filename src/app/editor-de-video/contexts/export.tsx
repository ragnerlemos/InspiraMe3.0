"use client";

import html2canvas from "html2canvas";
import type { ProporcaoTela } from "../tipos";

// Mapear proporções do app para dimensões fixas e rótulos
const exportDimensions: Record<ProporcaoTela, { width: number; height: number }> = {
  "9 / 16": { width: 1080, height: 1920 },
  "1 / 1": { width: 1080, height: 1080 },
  "16 / 9": { width: 1920, height: 1080 },
};

/**
 * Captura o PreviewCanva exatamente como está na tela, com dimensões fixas.
 * @param proporcao "9 / 16" | "1 / 1" | "16 / 9"
 * @param formato "png" | "jpeg"
 * @param scaleExport Multiplicador de resolução (ex: 2 para alta resolução)
 * @returns Data URL da imagem ou null
 */
export async function exportPreviewAsImage(
  proporcao: ProporcaoTela,
  formato: "png" | "jpeg" = "png",
  scaleExport: number = 1
): Promise<string | null> {
  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    console.error("Elemento #editor-preview-content não encontrado");
    return null;
  }

  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  const dims = exportDimensions[proporcao];
  if (!dims) {
    console.error(`Proporção inválida para exportação: ${proporcao}`);
    return null;
  }

  // Salva dimensões originais do elemento
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;

  // Define dimensões fixas para captura
  element.style.width = `${dims.width}px`;
  element.style.height = `${dims.height}px`;

  try {
    const canvas = await html2canvas(element, {
      width: dims.width,
      height: dims.height,
      backgroundColor: null,
      useCORS: true,
      scale: scaleExport,
    });

    return canvas.toDataURL(`image/${formato}`, formato === 'jpeg' ? 0.9 : 1.0);
  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    return null;
  } finally {
    // Restaura dimensões originais
    element.style.width = originalWidth;
    element.style.height = originalHeight;
  }
}
