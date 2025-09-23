
"use client";

import { useEffect } from 'react';

const FONT_URL = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&family=Lobster&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap";
const FONT_STYLE_ID = "google-fonts-stylesheet";

/**
 * Hook para buscar as fontes do Google Fonts e injetá-las como uma tag <style> no <head>.
 * Isso transforma as regras de fonte em "same-origin", resolvendo erros de CORS
 * que impedem bibliotecas como html-to-image de acessá-las.
 */
export const useGoogleFonts = () => {
  useEffect(() => {
    // Se a folha de estilo já foi injetada, não faz nada.
    if (document.getElementById(FONT_STYLE_ID)) {
      return;
    }

    fetch(FONT_URL)
      .then(response => response.text())
      .then(cssText => {
        const style = document.createElement('style');
        style.id = FONT_STYLE_ID;
        style.innerHTML = cssText;
        document.head.appendChild(style);
      })
      .catch(err => console.error("Falha ao buscar e injetar fontes do Google.", err));

  }, []);
};
