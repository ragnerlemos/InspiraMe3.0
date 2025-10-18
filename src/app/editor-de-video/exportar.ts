
'use client';

import type { EditorState } from './tipos';
import type { ProfileData } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';

// Tipos importados diretamente, pois este arquivo não é um componente React
interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadImageAsDataURL = (src?: string | null): Promise<string | null> =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        const dataUrl = c.toDataURL('image/png');
        resolve(dataUrl);
      } catch (e) {
        console.warn('Não foi possível converter a imagem para dataURL (CORS?):', e);
        resolve(null);
      }
    };
    img.onerror = () => {
        console.warn('Erro ao carregar a imagem:', src);
        resolve(null);
    }
    img.src = src;
    setTimeout(() => resolve(null), 4000); // Timeout
  });


const generateSvg = async (state: EditorState, profile: ProfileData, textStyle: React.CSSProperties): Promise<string> => {
    const { 
        aspectRatio, 
        backgroundStyle, 
        filmColor, 
        filmOpacity,
        text,
        textVerticalPosition,
        showProfileSignature,
        signaturePositionX,
        signaturePositionY,
        signatureScale,
        showSignaturePhoto,
        showSignatureUsername,
        showSignatureSocial,
        showSignatureBackground,
        signatureBgColor,
        signatureBgOpacity,
        showLogo,
        logoPositionX,
        logoPositionY,
        logoScale,
        logoOpacity
    } = state;

    const [width, height] = aspectRatio.replace(/\s/g, '').split('/').map(Number);
    const svgWidth = 1080;
    const svgHeight = (svgWidth * height) / width;

    // --- BACKGROUND ---
    let backgroundRender = `<rect width="${svgWidth}" height="${svgHeight}" fill="#000000" />`;
    if (backgroundStyle.type === 'solid') {
        backgroundRender = `<rect width="${svgWidth}" height="${svgHeight}" fill="${backgroundStyle.value}" />`;
    } else if (backgroundStyle.type === 'gradient') {
        backgroundRender = `<rect width="${svgWidth}" height="${svgHeight}" fill="url(#gradient)" />
        <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${backgroundStyle.value.split(',')[1]}" /><stop offset="100%" stop-color="${backgroundStyle.value.split(',')[2].replace(')','')}" /></linearGradient></defs>`;
    } else if (backgroundStyle.type === 'media' && backgroundStyle.value) {
        const bgDataUrl = await loadImageAsDataURL(backgroundStyle.value);
        if (bgDataUrl) {
            backgroundRender = `<image href="${bgDataUrl}" x="0" y="0" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid slice" />`;
        }
    }
    
    // --- FILM ---
    const filmRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(filmColor);
    const filmBackgroundColor = filmRgb ? `rgba(${parseInt(filmRgb[1], 16)}, ${parseInt(filmRgb[2], 16)}, ${parseInt(filmRgb[3], 16)}, ${filmOpacity / 100})` : `rgba(0, 0, 0, ${filmOpacity / 100})`;
    const filmRender = filmOpacity > 0 ? `<rect width="${svgWidth}" height="${svgHeight}" fill="${filmBackgroundColor}" />` : '';


    // --- TEXT ---
    const textLines = text.split('\n');
    const textY = svgHeight * (textVerticalPosition / 100);
    const textAnchor = textStyle.textAlign === 'center' ? 'middle' : textStyle.textAlign === 'right' ? 'end' : 'start';
    const textX = textAnchor === 'middle' ? svgWidth / 2 : textAnchor === 'end' ? svgWidth - 40 : 40;
    const fontSize = parseFloat(textStyle.fontSize as string); // fontSize is in 'px' here from editor logic
    const lineHeight = parseFloat(textStyle.lineHeight as string) * fontSize;
    const totalTextHeight = textLines.length * lineHeight;
    const startY = textY - totalTextHeight / 2 + fontSize / 2;

    const textRender = textLines.map((line, index) => 
        `<text x="${textX}" y="${startY + index * lineHeight}" font-family="${textStyle.fontFamily}" font-size="${fontSize}px" fill="${textStyle.color}" font-weight="${textStyle.fontWeight}" font-style="${textStyle.fontStyle}" text-anchor="${textAnchor}" style="text-shadow: ${textStyle.textShadow || 'none'}; letter-spacing: ${textStyle.letterSpacing}; word-spacing: ${textStyle.wordSpacing};">${line}</text>`
    ).join('');

    // --- SIGNATURE ---
    let signatureRender = '';
    if (showProfileSignature) {
        const avatarDataUrl = showSignaturePhoto ? await loadImageAsDataURL(profile.photo) : null;
        const sigX = svgWidth * (signaturePositionX / 100);
        const sigY = svgHeight * (signaturePositionY / 100);

        const sigScale = signatureScale / 100;
        const sigAvatarSize = 40 * sigScale;
        const sigFontSize = 14 * sigScale;
        const sigSocialSize = 12 * sigScale;
        const gap = 12 * sigScale;

        let contentWidth = 0;
        if(avatarDataUrl) contentWidth += sigAvatarSize + gap;
        
        const usernameWidth = (profile.username.length * sigFontSize * 0.6);
        const socialWidth = (profile.social.length * sigSocialSize * 0.6);
        contentWidth += Math.max(usernameWidth, socialWidth);

        const startX = -contentWidth / 2;

        const avatarPart = avatarDataUrl ? `<image href="${avatarDataUrl}" x="${startX}" y="-${sigAvatarSize/2}" width="${sigAvatarSize}" height="${sigAvatarSize}" />` : '';
        const textPart = `<text x="${startX + (avatarDataUrl ? sigAvatarSize + gap : 0)}" y="-${sigSocialSize/2 + 2}" font-size="${sigFontSize}px" font-family="Poppins, sans-serif" font-weight="bold" fill="#FFF">${profile.username}</text>
                         <text x="${startX + (avatarDataUrl ? sigAvatarSize + gap : 0)}" y="${sigFontSize/2 + 2}" font-size="${sigSocialSize}px" font-family="Poppins, sans-serif" fill="#DDD">${profile.social}</text>`;
        
        signatureRender = `<g transform="translate(${sigX}, ${sigY})">${avatarPart}${textPart}</g>`;
    }
    
    // --- LOGO ---
    let logoRender = '';
    if(showLogo && profile.logo) {
        const logoDataUrl = await loadImageAsDataURL(profile.logo);
        if(logoDataUrl) {
            const logoX = svgWidth * (logoPositionX / 100);
            const logoY = svgHeight * (logoPositionY / 100);
            const logoW = 150 * (logoScale / 100); // Base width of 150px scaled
            logoRender = `<image href="${logoDataUrl}" x="${logoX - logoW/2}" y="${logoY - logoW/2}" width="${logoW}" style="opacity: ${logoOpacity/100}" preserveAspectRatio="xMidYMid meet" />`
        }
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        ${backgroundRender}
        ${filmRender}
        ${textRender}
        ${signatureRender}
        ${logoRender}
    </svg>`;
};


const renderSvgToPng = (svgString: string, toast: ToastFn): Promise<string> => {
    return new Promise((resolve, reject) => {
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas context not available');
                
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(dataUrl);
            } catch(e) {
                reject(e);
            }
        };

        img.onerror = (e) => {
            console.error('Error loading SVG as image:', e);
            URL.revokeObjectURL(url);
            reject(new Error('Could not render SVG to image.'));
        };
        
        img.src = url;
    });
};

/**
 * Captura a imagem do preview e inicia o download.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn, state: EditorState, profile: ProfileData, textStyle: React.CSSProperties) => {
    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    try {
        await document.fonts.ready;
        await delay(150);

        const svgString = await generateSvg(state, profile, textStyle);
        const dataUrl = await renderSvgToPng(svgString, toast);

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
        console.error('Erro ao exportar imagem via SVG:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
    }
};

/**
 * Captura o estado atual do canvas como uma thumbnail.
 */
export const captureThumbnail = async (toast: ToastFn, state: EditorState, profile: ProfileData, textStyle: React.CSSProperties): Promise<string | null> => {
  try {
     await document.fonts.ready;
     await delay(50);
     
     const svgString = await generateSvg(state, profile, textStyle);
     const dataUrl = await renderSvgToPng(svgString, toast);
     return dataUrl;

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

    