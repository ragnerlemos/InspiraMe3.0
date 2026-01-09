
'use client';

import { useState, useMemo, useRef, useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, Copy, Film, Share2, LayoutGrid, Download, MoreVertical, Sun, Calendar, Moon, MessageSquare, Quote, CircleDollarSign, PartyPopper, Gift, Egg, HeartHandshake, TestTube, ImageUp, Edit, ZoomIn, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/client-only';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import * as htmlToImage from 'html-to-image';
import { useProfile } from '@/hooks/use-profile';
import { ModeloTwitter } from '../editor-de-video/modelos/modelo-twitter';
import type { EditorState, EstiloTexto } from '../editor-de-video/tipos';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

type FrasesClientPageProps = {
  initialQuotes: QuoteWithAuthor[];
  initialMainCategories: string[];
  initialSubCategories: CategoriesHierarchy;
  pageTitle?: string;
};

// Componente para gerar e pré-visualizar o meme
function MemeGenerator({ quote, profile, editorState, onClose, shareDirectly = false }: {
  quote: QuoteWithAuthor;
  profile: ReturnType<typeof useProfile>['profile'];
  editorState: EditorState;
  onClose: () => void;
  shareDirectly?: boolean;
}) {
  const memeRef = useRef<HTMLDivElement>(null);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const baseTextStyle: EstiloTexto = {
      fontFamily: editorState.fontFamily,
      fontSize: `${editorState.fontSize}cqw`,
      fontWeight: editorState.fontWeight,
      fontStyle: editorState.fontStyle,
      color: editorState.textColor,
      textAlign: editorState.textAlign,
      lineHeight: editorState.lineHeight,
  };

  useEffect(() => {
    const generateAndProcess = async () => {
      if (!memeRef.current) return;
      
      try {
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 300)); // Aguarda a renderização
        
        const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
        if (!blob) {
            throw new Error("Falha ao gerar a imagem do meme.");
        }
        
        if (shareDirectly) {
            if (Capacitor.isNativePlatform()) {
                // Lógica para App Nativo
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const base64Data = reader.result?.toString().split('base64,')[1];
                    if (!base64Data) {
                         throw new Error("Não foi possível extrair os dados da imagem.");
                    }
                    const fileName = `inspireme_meme_${new Date().getTime()}.png`;
                    const { uri } = await Filesystem.writeFile({
                        path: fileName,
                        data: base64Data,
                        directory: Directory.Cache,
                    });
                    if (!uri) throw new Error("Não foi possível salvar o arquivo temporário.");
                    await Share.share({ url: uri });
                    onClose();
                }
            } else {
                // Lógica para Web
                const memeFile = new File([blob], `inspireme_meme_${new Date().getTime()}.png`, { type: 'image/png' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [memeFile] })) {
                    try {
                        await navigator.share({
                            files: [memeFile],
                            title: `Meme da frase: "${quote.quote}"`,
                            text: `Meme gerado com InspireMe`,
                        });
                        onClose(); // Fecha apenas se o compartilhamento for iniciado
                    } catch(error) {
                        if (error instanceof DOMException && error.name === 'AbortError') {
                            // User cancelled the share sheet, do nothing. This is not an error.
                            console.log("Compartilhamento cancelado pelo usuário.");
                            onClose(); // Fecha também se o usuário cancelar
                        } else {
                             // For other errors, just close, as user may want to try again.
                             console.error('Web Share API error:', error);
                             onClose();
                        }
                    }
                } else {
                    toast({
                        title: "Compartilhamento não suportado",
                        description: "Seu navegador não suporta o compartilhamento direto de imagens. Você pode baixar a imagem e compartilhar manualmente.",
                    });
                    setMemeUrl(URL.createObjectURL(blob)); // Permite download
                    return; // Return to show the download preview
                }
            }
        } else {
            // Lógica para download (preview)
            setMemeUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Erro ao gerar/compartilhar meme:', error);
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.log("Compartilhamento cancelado pelo usuário.");
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível ${shareDirectly ? 'compartilhar' : 'gerar'} o meme. ${error instanceof Error ? error.message : ''}` });
        }
        onClose();
      }
    };

    generateAndProcess();

    return () => {
        if (memeUrl) {
            URL.revokeObjectURL(memeUrl);
        }
    }
  }, [shareDirectly]);

  const handleDownloadClick = () => {
    if (!memeUrl) return;

    const category = quote.category?.replace(/\s+/g, '-') || 'Geral';
    const dateTime = new Date().toISOString().replace(/[-:.]/g, '');
    const filename = `InspiraMe_${category}_${dateTime}.png`;

    const link = document.createElement('a');
    link.href = memeUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Sucesso!', description: `Seu meme foi baixado como ${filename}.` });
    onClose();
  };

  // Se for para compartilhar diretamente e não houver fallback para download, apenas exibe o loader
  if (shareDirectly && !memeUrl) {
      return (
          <>
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <div className="text-white text-center flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-lg font-bold">Preparando imagem...</p>
              </div>
            </div>
            {/* Div oculta para renderização inicial */}
            <div className="fixed top-[-9999px] left-[-9999px]">
                <div ref={memeRef} style={{ width: '500px', aspectRatio: '9 / 16' }}>
                    <ModeloTwitter
                        editorState={editorState}
                        profile={profile}
                        baseTextStyle={baseTextStyle}
                        textEffectsStyle={{}}
                        dropShadowStyle={{}}
                    />
                </div>
            </div>
          </>
      );
  }

  // Renderiza a pré-visualização para download
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            {memeUrl ? (
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-white text-lg font-bold">Clique no meme para baixar</p>
                    <img 
                        src={memeUrl} 
                        alt="Pré-visualização do Meme" 
                        className="max-w-[80vw] max-h-[70vh] rounded-lg shadow-2xl cursor-pointer"
                        style={{ aspectRatio: '9 / 16' }}
                        onClick={handleDownloadClick}
                    />
                 </div>
            ) : (
                <div className="text-white text-center flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-lg font-bold">Gerando seu meme...</p>
                </div>
            )}
            {/* Div oculta para renderização inicial */}
            <div className="fixed top-[-9999px] left-[-9999px]">
                <div ref={memeRef} style={{ width: '500px', aspectRatio: '9 / 16' }}>
                    <ModeloTwitter
                        editorState={editorState}
                        profile={profile}
                        baseTextStyle={baseTextStyle}
                        textEffectsStyle={{}}
                        dropShadowStyle={{}}
                    />
                </div>
            </div>
        </div>
    </div>
  );
}


const getCategoryIcon = (categoryName: string): ComponentType<{className: string}> => {
    const lowerCaseName = categoryName.toLowerCase();

    if (lowerCaseName.includes('bom dia')) return Sun;
    if (lowerCaseName.includes('boa noite')) return Moon;
    if (lowerCaseName.includes('indireta')) return Quote;
    if (lowerCaseName.includes('teste')) return TestTube;
    if (lowerCaseName.includes('fim de mês')) return CircleDollarSign;
    if (['sábado', 'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta'].some(dia => lowerCaseName.includes(dia))) return Calendar;
    if (lowerCaseName.includes('namorados')) return HeartHandshake;
    if (lowerCaseName.includes('pais')) return Gift;
    if (lowerCaseName.includes('páscoa')) return Egg;
    if (lowerCaseName.includes('festa junina')) return PartyPopper;
    if (lowerCaseName.includes('datas comemorativas')) return Calendar;

    return BookOpen;
}

export function FrasesClientPage({
  initialQuotes,
  initialMainCategories,
  initialSubCategories,
  pageTitle = "Inspire-se com Frases",
}: FrasesClientPageProps) {
  const [allQuotes] = useState<QuoteWithAuthor[]>(initialQuotes);
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todos');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  
  const [quoteForMeme, setQuoteForMeme] = useState<{ quote: QuoteWithAuthor; action: 'preview' | 'share'; } | null>(null);

  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const router = useRouter();
  const { profile } = useProfile();
  
  const filteredQuotes = useMemo(() => {
    let quotes = allQuotes;

    if (selectedMainCategory !== 'Todos') {
      quotes = quotes.filter(q => q.category === selectedMainCategory);
    }
    
    if (selectedSubCategory !== 'Todos') {
      quotes = quotes.filter(q => q.subCategory === selectedSubCategory);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      quotes = quotes.filter(q => 
          q.quote.toLowerCase().includes(lowercasedTerm) ||
          (q.author && q.author.toLowerCase().includes(lowercasedTerm))
      );
    }
    
    return quotes;

  }, [allQuotes, searchTerm, selectedMainCategory, selectedSubCategory]);

  
  const handleShareMeme = (quote: QuoteWithAuthor) => {
    setQuoteForMeme({ quote, action: 'share' });
  };


  const handlePreviewMeme = (quote: QuoteWithAuthor) => {
    setQuoteForMeme({ quote, action: 'preview' });
  };
  
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
        await navigator.share({
          title: 'InspireMe',
          text: shareText,
        });
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

  const handleMainCategorySelect = (mainCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory('Todos');
    
    if (mainCategory === 'Todos' && window.innerWidth < 768) {
      setIsCategorySheetOpen(false);
    }
  };

  const handleSubCategorySelect = (mainCategory: string, subCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory(subCategory);
    if (window.innerWidth < 768) {
      setIsCategorySheetOpen(false);
    }
  };

  const renderFilters = (isMobile = false) => {
    return (
      <div className="space-y-1">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por frases ou autores..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            handleMainCategorySelect('Todos');
          }}
          className={cn(
            'w-full justify-start text-base font-semibold px-3 py-2 rounded-md bg-secondary text-primary'
          )}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Todos
        </Button>
        <ClientOnly>
          <Accordion type="multiple" className="w-full">
            {initialMainCategories
              .filter((cat) => cat !== 'Todos')
              .map((mainCat, index) => {
                const subCats = (initialSubCategories[mainCat] || []);
                const Icon = getCategoryIcon(mainCat);

                if (subCats.length === 0 || (subCats.length === 1 && subCats[0] === 'Todos')) {
                  return (
                    <Button
                      key={mainCat}
                      variant='ghost'
                      onClick={() => handleMainCategorySelect(mainCat)}
                      className={cn('w-full justify-start text-base font-semibold px-3 py-2 transition-colors rounded-md hover:bg-muted/50',
                        selectedMainCategory === mainCat && selectedSubCategory === 'Todos' && 'bg-primary/10 text-primary'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {mainCat}
                    </Button>
                  );
                }
                return (
                  <AccordionItem value={`item-${index}`} key={mainCat} className='border-none'>
                    <AccordionTrigger
                      onClick={() => handleMainCategorySelect(mainCat)}
                      className={cn(
                        'font-semibold text-base hover:no-underline px-3 py-2 transition-colors rounded-md hover:bg-muted/50 w-full justify-start',
                        selectedMainCategory === mainCat && 'bg-primary/10 text-primary'
                      )}
                    >
                        <div className="flex items-center flex-1 text-left">
                            <Icon className="mr-2 h-4 w-4" />
                            {mainCat}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='pt-1'>
                      <div className="flex flex-col items-start gap-1 pl-4 border-l-2 border-muted ml-3">
                        {subCats.map((subCat) => (
                            <Button
                              key={subCat}
                              variant="ghost"
                              onClick={() => handleSubCategorySelect(mainCat, subCat)}
                              className={cn(
                                'w-full justify-start text-sm h-8 px-3 transition-colors rounded-md hover:bg-muted/50',
                                selectedMainCategory === mainCat &&
                                  selectedSubCategory === subCat &&
                                  'bg-primary/10 text-primary font-semibold'
                              )}
                            >
                              {subCat}
                            </Button>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </ClientOnly>
      </div>
    );
  };
  
    const renderSkeletons = () => (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 pb-0">
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter className="p-4 pt-2 flex flex-col items-end gap-2">
                        <Skeleton className="h-4 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    const getMemeEditorState = (quote: QuoteWithAuthor): EditorState => {
        return {
            text: quote.quote,
            fontFamily: "Poppins",
            fontSize: profile.memeFontSize,
            fontWeight: "bold",
            fontStyle: "normal",
            textColor: "#FFFFFF",
            textAlign: "left",
            textShadowBlur: 0,
            textShadowOpacity: 0,
            textVerticalPosition: 50,
            textStrokeColor: "#000000",
            textStrokeWidth: 0,
            textStrokeCornerStyle: 'rounded',
            applyEffectsToEmojis: true,
            letterSpacing: 0,
            lineHeight: 1.4,
            wordSpacing: 0,
            backgroundStyle: { type: 'solid', value: '#000000' },
            filmColor: "#000000",
            filmOpacity: 0,
            aspectRatio: '9 / 16',
            activeTemplateId: 'template-twitter',
            showProfileSignature: false,
            showLogo: profile.memeShowLogo,
            logoPositionX: 50,
            logoPositionY: 95,
            logoScale: profile.memeLogoScale,
            logoOpacity: 80,
            signaturePositionX: 50,
            signaturePositionY: 95,
            signatureScale: 60,
            showSignaturePhoto: false,
            showSignatureUsername: false,
            showSignatureSocial: false,
            showSignatureBackground: false,
            signatureBgColor: '#000000',
            signatureBgOpacity: 50,
            profileVerticalPosition: 50,
        };
    };

    const memeEditorState = quoteForMeme ? getMemeEditorState(quoteForMeme.quote) : null;
  
  return (
    <>
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="py-4">{renderFilters(true)}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <main className="overflow-y-auto safe-area py-8 no-scrollbar">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:items-start">
          <aside className="hidden md:block pl-4">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-10rem)] -mr-4 pr-4">
                {renderFilters()}
              </ScrollArea>
            </div>
          </aside>
          <div className="px-4">
            <div className="w-full mb-8 flex justify-between items-center">
               <div className="flex-1 text-center">
                  <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                    {pageTitle}
                  </h1>
              </div>
              <div className="md:hidden ml-4">
                  <Button variant="outline" size="icon" onClick={() => setIsCategorySheetOpen(true)}>
                      <LayoutGrid className="h-5 w-5" />
                  </Button>
              </div>
            </div>
            
            {isLoading ? renderSkeletons() : filteredQuotes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuotes.map((quote) => {
                  const isFavorited = favorites.includes(quote.id);
                  return (
                    <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                      
                      <CardContent className="p-4 pb-0 flex-1">
                        <p className="text-base font-body">{quote.quote}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-2 flex flex-col items-stretch gap-2">
                          <div className="flex justify-between items-center text-sm w-full">
                              {quote.subCategory && quote.subCategory !== 'Todos' ? (
                                  <span className="bg-primary/10 px-2 py-0.5 text-xs rounded-full text-primary truncate max-w-[120px]">
                                      {quote.subCategory}
                                  </span>
                              ) : <div />}
                              {quote.author && (
                                  <p className="font-medium text-muted-foreground truncate">
                                      - {quote.author}
                                  </p>
                              )}
                          </div>
                          <div className="flex justify-end items-center w-full pt-1 -space-x-2 -mr-2">
                            <Button variant="ghost" size="icon-sm" onClick={() => handlePreviewMeme(quote)}>
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(quote.quote, quote.author)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => toggleFavorite(quote.id)}>
                              <Heart className={cn("h-4 w-4", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleShareMeme(quote)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => router.push(`/editor-de-video?quote=${encodeURIComponent(quote.quote)}`)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edição Avançada
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleShare(quote.quote, quote.author)}>
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                        Compartilhar Texto
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
                <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Nenhuma frase encontrada</h2>
                <p className="text-muted-foreground">Tente ajustar sua busca ou selecionar outra categoria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ClientOnly>
        {quoteForMeme && memeEditorState && (
          <MemeGenerator
            quote={quoteForMeme.quote}
            profile={profile}
            editorState={memeEditorState}
            onClose={() => setQuoteForMeme(null)}
            shareDirectly={quoteForMeme.action === 'share'}
          />
        )}
      </ClientOnly>
    </>
  );
}

    