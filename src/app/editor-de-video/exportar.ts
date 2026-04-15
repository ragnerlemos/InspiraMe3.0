'use client';

import * as htmlToImage from 'html-to-image';
import type { EditorState, EstiloTexto } from './tipos';
import type { ProfileData } from '@/hooks/use-profile';

interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto) => {
    const previewElement = document.getElementById('editor-preview-content');

    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro de Exportação',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return;
    }

    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });
    
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 150));

    try {
        const dataUrl = format === 'jpeg'
            ? await htmlToImage.toJpeg(previewElement, { quality: 0.95, pixelRatio: 2 })
            : await htmlToImage.toPng(previewElement, { pixelRatio: 2 });
        
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
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem. Verifique o console para mais detalhes.' });
    }
};

export const captureThumbnail = async (toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content');

  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível encontrar a área de visualização para gerar a miniatura.'
    });
    return null;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(previewElement, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     return thumbnail;

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar Modelo', description: 'Não foi possível gerar a miniatura do modelo.' });
      return null;
  }
};

export const generateVideoBlob = async (
  toast: ToastFn,
  state: EditorState,
  profile: ProfileData,
  baseTextStyle: EstiloTexto,
  textEffectsStyle: EstiloTexto,
  dropShadowStyle: EstiloTexto,
  durationSeconds = 3,
  fps = 15
): Promise<Blob | null> => {
  const previewElement = document.getElementById('editor-preview-content');

  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro de Exportação',
      description: 'Não foi possível encontrar a área de visualização para exportar.'
    });
    return null;
  }

  if (typeof MediaRecorder === 'undefined' || typeof HTMLCanvasElement.prototype.captureStream !== 'function') {
    toast({
      variant: 'destructive',
      title: 'Exportação de vídeo não suportada',
      description: 'Seu navegador não suporta exportação de vídeo via MediaRecorder.'
    });
    return null;
  }

  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 150));

  const width = previewElement.clientWidth * 2;
  const height = previewElement.clientHeight * 2;
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');

  if (!ctx) {
    toast({
      variant: 'destructive',
      title: 'Erro de Exportação',
      description: 'Não foi possível criar o canvas de vídeo.'
    });
    return null;
  }

  const supportedTypes = [
    'video/mp4;codecs=h264',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];

  let mimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';

  if (!mimeType.includes('mp4')) {
    toast({ title: 'Exportando vídeo', description: 'Seu navegador não suporta MP4; exportando em WEBM.' });
  }

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(outputCanvas.captureStream(fps), { mimeType });
  } catch (error) {
    mimeType = 'video/webm';
    recorder = new MediaRecorder(outputCanvas.captureStream(fps), { mimeType });
  }

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = event => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const recordedBlob = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = event => reject(event.error || new Error('Falha ao gravar vídeo'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();

  const frameCount = Math.max(1, Math.round(durationSeconds * fps));
  for (let index = 0; index < frameCount; index += 1) {
    try {
      const frameCanvas = await htmlToImage.toCanvas(previewElement, {
        pixelRatio: 2,
        width,
        height,
      });
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frameCanvas, 0, 0, width, height);
    } catch (error) {
      console.error('Erro ao capturar frame de vídeo:', error);
    }
    await new Promise(r => setTimeout(r, 1000 / fps));
  }

  recorder.stop();

  try {
    const blob = await recordedBlob;
    return blob;
  } catch (error) {
    console.error('Erro ao gerar vídeo:', error);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar o vídeo. Verifique o console para mais detalhes.' });
    return null;
  }
};

export const captureAndDownloadVideo = async (
  toast: ToastFn,
  state: EditorState,
  profile: ProfileData,
  baseTextStyle: EstiloTexto,
  textEffectsStyle: EstiloTexto,
  dropShadowStyle: EstiloTexto,
  durationSeconds = 3,
  fps = 15
) => {
  const blob = await generateVideoBlob(toast, state, profile, baseTextStyle, textEffectsStyle, dropShadowStyle, durationSeconds, fps);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const link = document.createElement('a');
  link.href = url;
  link.download = `inspire-me-export-${Date.now()}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  toast({ title: 'Sucesso!', description: `O vídeo foi baixado como ${link.download}.` });
};


