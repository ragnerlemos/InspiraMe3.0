'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';
import { Heart, RefreshCw, Loader2, MessageSquare, Smartphone, Copy as CopyIcon, MoreVertical, Download, Share2 } from 'lucide-react';
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

// --- Componente Gerador de Imagem ---
function TesteMemeGenerator({
  quote,
  onClose,
  action,
}: {
  quote: Quote;
  onClose: () => void;
  action: 'download' | 'share-web' | 'share-capacitor';
}) {
  const memeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateAndProcess = useCallback(async () => {
    if (!memeRef.current) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Elemento do meme não encontrado.' });
        onClose();
        return;
    }

    try {
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 200));
        const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
        if (!blob) throw new Error('Falha ao gerar a imagem (blob nulo).');

        if (action === 'download') {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = FILENAME;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast({ title: 'Sucesso!', description: `Imagem baixada como ${FILENAME}` });
        } else if (action === 'share-web') {
            const file = new File([blob], FILENAME, { type: blob.type });
            if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [file] })) {
                throw new Error('Web Share API (arquivos) não é suportada neste navegador.');
            }
            await navigator.share({ files: [file], title: 'Meme Inspirador' });
        } else if (action === 'share-capacitor') {
            if (!Capacitor.isNativePlatform()) {
                throw new Error('Não está em um ambiente nativo Capacitor. Use o compartilhamento Web.');
            }
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = (reader.result as string).split('base64,')[1];
                const { uri } = await Filesystem.writeFile({
                    path: FILENAME,
                    data: base64Data,
                    directory: Directory.Cache,
                });
                await Share.share({ url: uri, title: 'Meme Inspirador' });
            };
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
             toast({ title: 'Cancelado', description: 'Compartilhamento cancelado pelo usuário.' });
        } else {
            toast({ variant: 'destructive', title: 'Falha na Operação', description: `${error}` });
        }
    } finally {
        onClose();
    }
  }, [action, quote, toast, onClose]);

  useEffect(() => {
    generateAndProcess();
  }, [generateAndProcess]);
  
  return (
    <>
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-white text-lg">Processando...</p>
        </div>
        <div ref={memeRef} className="fixed top-[-9999px] left-[-9999px] bg-black text-white p-12 flex flex-col justify-center items-center" style={{ width: '500px', height: '500px' }}>
            <p style={{ fontFamily: 'Poppins', fontSize: '32px', textAlign: 'center', lineHeight: '1.3' }}>{quote.quote}</p>
            {quote.author && <p style={{ fontFamily: 'Poppins', fontSize: '24px', textAlign: 'right', alignSelf:'flex-end', paddingTop: '50px' }}>- {quote.author}</p>}
        </div>
    </>
  );
}

// --- Página de Teste ---
export default function TesteCompartilharPage() {
  const { toast } = useToast();
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => sampleQuotes[0]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [processingAction, setProcessingAction] = useState<'download' | 'share-web' | 'share-capacitor' | null>(null);

  const getNewQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    setCurrentQuote(sampleQuotes[randomIndex]);
    setIsFavorited(false);
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

  const handleShareText = async (text: string, author?: string) => {
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

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-6">
      {processingAction && (
        <TesteMemeGenerator 
            quote={currentQuote}
            action={processingAction}
            onClose={() => setProcessingAction(null)}
        />
      )}

      <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-bold mb-2">Card de Teste</h1>
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
                <Button variant="ghost" size="icon" onClick={() => setProcessingAction('download')} title="Baixar Imagem">
                    <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(currentQuote.quote, currentQuote.author)} title="Copiar Texto">
                  <CopyIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setProcessingAction('share-web')} title="Compartilhar Imagem (Web)">
                  <Share2 className="h-5 w-5 text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setProcessingAction('share-capacitor')} title="Compartilhar Imagem (App)">
                  <Smartphone className="h-5 w-5 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)} title="Favoritar">
                  <Heart className={cn("h-5 w-5", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary" onClick={() => handleShareText(currentQuote.quote, currentQuote.author)} title="Compartilhar Texto">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" title="Mais opções">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
