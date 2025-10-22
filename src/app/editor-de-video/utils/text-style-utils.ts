
import React from 'react';

// Regex para identificar emojis
export const EMOJI_REGEX = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu;

// Função para criar o estilo de contorno (stroke)
export const createStrokeStyle = (
  strokeWidth: number,
  strokeColor: string,
  strokeCornerStyle: 'rounded' | 'square'
): React.CSSProperties => {
  if (strokeWidth <= 0) {
    return {};
  }
  const widthInCqw = strokeWidth * 0.1;

  if (strokeCornerStyle === 'square') {
    return {
      WebkitTextStroke: `${widthInCqw}cqw ${strokeColor}`,
      textShadow: `
        ${widthInCqw}cqw ${widthInCqw}cqw 0 ${strokeColor},
        -${widthInCqw}cqw ${widthInCqw}cqw 0 ${strokeColor},
        ${widthInCqw}cqw -${widthInCqw}cqw 0 ${strokeColor},
        -${widthInCqw}cqw -${widthInCqw}cqw 0 ${strokeColor}
      `,
    }
  }
  
  // Arredondado
  const numPoints = 12;
  const angleIncrement = 360 / numPoints;
  const shadows = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement;
    const rad = angle * (Math.PI / 180);
    const x = widthInCqw * Math.cos(rad);
    const y = widthInCqw * Math.sin(rad);
    shadows.push(`${x.toFixed(2)}cqw ${y.toFixed(2)}cqw ${widthInCqw*0.5}cqw ${strokeColor}`);
  }

  return { textShadow: shadows.join(', ') };
};

// Função para criar o estilo de sombra projetada (drop-shadow)
export const createDropShadowStyle = (
  blur: number,
  intensityPercent: number
): React.CSSProperties => {
  if (blur <= 0 || intensityPercent <= 0) {
    return {};
  }

  const shadowColor = 'rgba(0,0,0,0.9)';
  const offsetY = blur * 0.1;
  const offsetX = blur * 0.05;
  const numLayers = Math.ceil((intensityPercent / 200) * 10);
  const shadows = [];

  for (let i = 1; i <= numLayers; i++) {
    const layerBlur = (blur / numLayers) * i * 1.2;
    const shadow = `drop-shadow(${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px ${layerBlur.toFixed(2)}px ${shadowColor})`;
    shadows.push(shadow);
  }

  return { filter: shadows.join(' ') };
};
