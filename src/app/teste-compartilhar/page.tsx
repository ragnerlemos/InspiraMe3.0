'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';

const TEST_TEXT = '"A imaginação é mais importante que o conhecimento." - Albert Einstein';
const TEST_URL = 'https://inspira.me';
const FILENAME = 'InspiraMe_Teste.png';

export default function TesteCompartilharPage() {
  const { toast } = useToast();
  const memeRef = useRef<HTMLDivElement>(null);
  const [isTesting, setIsTesting] = useState(false);

  // --- Funções de Compartilhamento de Texto ---

  const handleShareText_1_WebAPI = async () => {
    if (!navigator.share) {
      toast({ variant: 'destructive', title: 'Método 1 Falhou', description: 'Seu navegador não suporta a Web Share API (navigator.share).' });
      return;
    }
    try {
      await navigator.share({ title: 'Frase Inspiradora', text: TEST_TEXT, url: TEST_URL });
      toast({ title: 'Método 1 Sucesso', description: 'Web Share API (navigator.share) para texto funcionou.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Método 1 Erro', description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    }
  };

  const handleShareText_2_Capacitor = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast({ variant: 'destructive', title: 'Método 2 Falhou', description: 'Não está em um ambiente nativo Capacitor.' });
      return;
    }
    try {
      await Share.share({ title: 'Frase Inspiradora', text: TEST_TEXT, url: TEST_URL, dialogTitle: 'Compartilhar via App' });
      toast({ title: 'Método 2 Sucesso', description: 'Capacitor Share API funcionou.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Método 2 Erro', description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    }
  };

  const handleShareText_3_ClipboardAPI = async () => {
    if (!navigator.clipboard) {
      toast({ variant: 'destructive', title: 'Método 3 Falhou', description: 'Seu navegador não suporta a Clipboard API (navigator.clipboard).' });
      return;
    }
    try {
      await navigator.clipboard.writeText(TEST_TEXT);
      toast({ title: 'Método 3 Sucesso', description: 'Texto copiado com a Clipboard API.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Método 3 Erro', description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    }
  };

  // --- Funções de Compartilhamento de Imagem ---

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!memeRef.current) return null;
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 200));
      const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
      return blob;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao Gerar Imagem', description: `Falha na biblioteca html-to-image: ${error}` });
      return null;
    }
  };

  const handleShareImage_4_WebAPI = async () => {
    setIsTesting(true);
    const blob = await generateImageBlob();
    if (!blob) { setIsTesting(false); return; }

    const file = new File([blob], FILENAME, { type: blob.type });
    
    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      toast({ variant: 'destructive', title: 'Método 4 Falhou', description: 'Web Share API não suporta compartilhamento de arquivos neste navegador.' });
      setIsTesting(false);
      return;
    }

    try {
      await navigator.share({ files: [file], title: 'Meme Inspirador', text: 'Confira este meme!' });
      toast({ title: 'Método 4 Sucesso', description: 'Web Share API para IMAGEM funcionou.' });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        toast({ variant: 'destructive', title: 'Método 4 Erro', description: `Erro: ${error}` });
      }
    }
    setIsTesting(false);
  };

  const handleShareImage_5_Capacitor = async () => {
    setIsTesting(true);
    if (!Capacitor.isNativePlatform()) {
        toast({ variant: 'destructive', title: 'Método 5 Falhou', description: 'Não está em um ambiente nativo Capacitor.' });
        setIsTesting(false);
        return;
    }

    const blob = await generateImageBlob();
    if (!blob) { setIsTesting(false); return; }

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split('base64,')[1];
        if (!base64Data) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível converter a imagem.' });
            setIsTesting(false);
            return;
        }
        try {
            const { uri } = await Filesystem.writeFile({
                path: FILENAME,
                data: base64Data,
                directory: Directory.Cache,
            });
            await Share.share({ url: uri });
            toast({ title: 'Método 5 Sucesso', description: 'Capacitor Share para IMAGEM funcionou.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Método 5 Erro', description: `Erro: ${error}` });
        }
        setIsTesting(false);
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao ler o blob da imagem.' });
      setIsTesting(false);
    };
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {isTesting && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <p className="text-white text-lg">Processando...</p>
          </div>
      )}
      
      {/* Div oculta para renderizar o meme para captura */}
      <div ref={memeRef} className="fixed top-[-9999px] left-[-9999px] bg-black text-white p-8" style={{ width: '500px', height: '500px' }}>
        <p style={{ fontSize: '32px', textAlign: 'center', paddingTop: '150px' }}>{TEST_TEXT.split(' - ')[0]}</p>
        <p style={{ fontSize: '24px', textAlign: 'right', paddingTop: '50px' }}>- {TEST_TEXT.split(' - ')[1]}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Página de Teste de Compartilhamento</CardTitle>
          <CardDescription>Teste os diferentes métodos de compartilhamento em seu dispositivo e anote quais funcionam.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Compartilhamento de Texto</CardTitle>
            <CardDescription>Testa o compartilhamento de um texto simples com um link.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button onClick={handleShareText_1_WebAPI}>1. Compartilhar Texto (Web API)</Button>
            <Button onClick={handleShareText_2_Capacitor}>2. Compartilhar Texto (Capacitor)</Button>
            <Button onClick={handleShareText_3_ClipboardAPI}>3. Copiar Texto (Clipboard API)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compartilhamento de Imagem</CardTitle>
            <CardDescription>Testa o compartilhamento de uma imagem gerada dinamicamente.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button onClick={handleShareImage_4_WebAPI}>4. Compartilhar Imagem (Web API)</Button>
            <Button onClick={handleShareImage_5_Capacitor}>5. Compartilhar Imagem (Capacitor)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
