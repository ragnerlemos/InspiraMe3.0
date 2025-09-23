
"use client";

import html2canvas from "html2canvas";

/**
 * Captura o PreviewCanva exatamente como está na tela e retorna um Data URL.
 * @param formato "png" ou "jpeg"
 * @param scaleExport Multiplicador de resolução (ex: 2 para alta resolução)
 * @returns Data URL da imagem ou null em caso de erro
 */
export async function exportPreviewAsImage(
  formato: "png" | "jpeg" = "png",
  scaleExport: number = 2
): Promise<string | null> {
  try {
    // 1️⃣ Seleciona o elemento real do preview no DOM
    const element = document.querySelector<HTMLElement>("#editor-preview-content");
    if (!element) {
      console.error("Elemento #editor-preview-content não encontrado");
      return null;
    }

    // 2️⃣ Aguarda fontes carregarem
    await document.fonts.ready;

    // 3️⃣ Pequeno delay para garantir renderização completa
    await new Promise(r => setTimeout(r, 50));

    // 4️⃣ Captura com html2canvas
    const canvas = await html2canvas(element, {
      backgroundColor: null,  // mantém transparência
      useCORS: true,          // permite imagens externas
      logging: false,
      scale: scaleExport      // aumenta resolução
    });

    // 5️⃣ Retorna Data URL no formato desejado
    return canvas.toDataURL(`image/${formato}`, formato === 'jpeg' ? 0.9 : 1.0);

  } catch (error) {
    console.error("Erro ao capturar preview:", error);
    return null;
  }
}
