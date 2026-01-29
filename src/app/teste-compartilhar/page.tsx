'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';
import { Heart, RefreshCw, Loader2, MessageSquare, ImageDown, Smartphone, Copy as CopyIcon, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Dados e Tipos ---
interface Quote {
  id: string;
  quote: string;
  author?: string;
}

const sampleQuotes: Quote[] = [
  { id: '1', quote: 'A imaginação é mais importante que o conhecimento.', author: 'Albert Einstein' },
  { id: '2', quote: 'A única maneira de fazer um ótimo trabalho é amar o que você faz.', author: 'Steve Jobs' },
  { id: '3', quote: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
  { id: '4', quote: 'A vida é 10% o que acontece com você e 90% como você reage a isso.', author: 'Charles R. Swindoll' },
  { id: '5', quote: 'Se você quer viver uma vida feliz, amarre-a a um objetivo, não a pessoas ou coisas.', author: 'Albert Einstein' },
];

const FILENAME = 'InspiraMe_Teste.png';

// --- Página de Teste ---
export default function TesteCompartilharPage() {
  const { toast } = useToast();
  const memeRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => sampleQuotes[0]);
  const [isFavorited, setIsFavorited] = useState(false);

  const getNewQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    setCurrentQuote(sampleQuotes[randomIndex]);
    setIsFavorited(false); // Reseta o favorito ao pegar nova frase
  }, []);

  useEffect(() => { getNewQuote() }, [getNewQuote]);

  const handleCopy = async (text: string, author?: string) => {
    const textToCopy = author ? `"${text}" - ${author}` : text;
    try {
        if (Capacitor.isNativePlatform()) {
            await Clipboard.write({ string: textToCopy });
            toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
            return;
        }

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
            toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
            } catch (err) {
                console.error('Falha ao usar execCommand:', err);
                toast({ title: 'Erro ao Copiar', description: 'Não foi possível copiar.', variant: 'destructive' });
            }
            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error('Falha ao copiar:', err);
        toast({ title: 'Erro ao Copiar', description: 'Não foi possível copiar a frase.', variant: 'destructive' });
    }
  };

  const handleShare = async (text: string, author?: string) => {
    const shareText = author ? `"${text}" - ${author}` : text;
    
    if (Capacitor.isNativePlatform()) {
        try {
            await Share.share({
                title: 'InspireMe',
                text: shareText,
                dialogTitle: 'Compartilhar Frase'
            });
        } catch (error) {
            console.error("Erro ao usar Capacitor Share API, usando fallback de cópia:", error);
            await handleCopy(text, author);
        }
        return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'InspireMe', text: shareText });
      } catch (error) {
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
           await handleCopy(text, author);
        } else {
          console.error("Erro ao compartilhar, usando fallback de cópia:", error);
          await handleCopy(text, author);
        }
      }
    } else {
      await handleCopy(text, author);
    }
  };


  const runTest = async (testName: string, testFn: () => Promise<string | void>) => {
    setIsProcessing(true);
    try {
      const result = await testFn();
      toast({ title: `Teste '${testName}' bem-sucedido!`, description: result || 'Ação concluída com sucesso.' });
    } catch (error) {
      toast({ variant: 'destructive', title: `Teste '${testName}' falhou!`, description: `${error}` });
    }
    setIsProcessing(false);
  };

  const generateImageBlob = async (): Promise<Blob> => {
    if (!memeRef.current) throw new Error('Referência do meme não encontrada.');
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 200));
    const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
    if (!blob) throw new Error('Falha ao gerar a imagem (blob nulo).');
    return blob;
  };

  const getBase64FromBlob = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split('base64,')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }

  // --- Funções de Teste ---
  const test_Image_WebAPI = async () => {
    const blob = await generateImageBlob();
    const file = new File([blob], FILENAME, { type: blob.type });
    if (!navigator.canShare || !navigator.canShare({ files: [file] })) throw new Error('Web Share API não suporta compartilhamento de arquivos.');
    await navigator.share({ files: [file], title: 'Meme Inspirador', text: 'Criado com o InspireMe' });
  };
  const test_Image_Capacitor_App1 = async () => {
    if (!Capacitor.isNativePlatform()) throw new Error('Não é um ambiente nativo Capacitor.');
    const blob = await generateImageBlob();
    const base64Data = await getBase64FromBlob(blob);
    const { uri } = await Filesystem.writeFile({ path: FILENAME, data: base64Data, directory: Directory.Cache });
    await Share.share({ url: uri, title: 'InspiraMe Meme', dialogTitle: 'Compartilhar Imagem' });
  };
  const test_Image_Capacitor_App2 = async () => {
    if (!Capacitor.isNativePlatform()) throw new Error('Não é um ambiente nativo Capacitor.');
    const blob = await generateImageBlob();
    const base64Data = await getBase64FromBlob(blob);
    const { uri } = await Filesystem.writeFile({ path: FILENAME, data: base64Data, directory: Directory.Cache });
    await Share.share({ files: [uri], title: 'InspiraMe Meme', dialogTitle: 'Compartilhar Arquivo' });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-6">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white text-lg">Processando teste...</p>
        </div>
      )}

      <div ref={memeRef} className="fixed top-[-9999px] left-[-9999px] bg-black text-white p-12 flex flex-col justify-center items-center" style={{ width: '500px', height: '500px' }}>
        <p style={{ fontFamily: 'Poppins', fontSize: '32px', textAlign: 'center', lineHeight: '1.3' }}>{currentQuote.quote}</p>
        {currentQuote.author && <p style={{ fontFamily: 'Poppins', fontSize: '24px', textAlign: 'right', alignSelf:'flex-end', paddingTop: '50px' }}>- {currentQuote.author}</p>}
      </div>

      <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-bold mb-2">Card de Teste Idêntico</h1>
          <p className="text-center text-muted-foreground mb-4">Use os ícones para testar cada função.</p>
          <Button onClick={getNewQuote} variant="outline" className="w-full mb-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Nova Frase Aleatória
          </Button>

          <Card className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 pb-2 flex-1">
              <p className="text-lg font-body text-center">"{currentQuote.quote}"</p>
            </CardContent>
            <CardFooter className="px-4 pt-2 pb-2 flex flex-col items-stretch gap-2">
              {currentQuote.author && <p className="font-medium text-sm text-muted-foreground text-right w-full pr-2">- {currentQuote.author}</p>}
              
              <div className="flex justify-around items-center w-full pt-2">
                {/* --- Ícones Funcionais (como na produção) --- */}
                <Button variant="ghost" size="icon" onClick={() => handleCopy(currentQuote.quote, currentQuote.author)}>
                  <CopyIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)}>
                  <Heart className={cn("h-5 w-5", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                </Button>

                {/* --- Botão de compartilhar texto com a lógica funcional --- */}
                <Button variant="ghost" size="icon" className="text-primary" onClick={() => handleShare(currentQuote.quote, currentQuote.author)}>
                  <MessageSquare className="h-5 w-5" />
                </Button>

                 <Button variant="ghost" size="icon" className="text-primary" onClick={() => runTest('Imagem (Web API)', test_Image_WebAPI)}>
                    <ImageDown className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary">
                      <Smartphone className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Testar Imagem (Capacitor)</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => runTest('Imagem Cap. (App 1)', test_Image_Capacitor_App1)}>App 1 (Share URL)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => runTest('Imagem Cap. (App 2)', test_Image_Capacitor_App2)}>App 2 (Share Files)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* --- Ícone Visual (como na produção) --- */}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
