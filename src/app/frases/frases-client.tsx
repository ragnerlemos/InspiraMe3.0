'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Search, Copy, Film, Share2, LayoutGrid } from 'lucide-react';
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
};

export function FrasesClientPage({
  initialQuotes,
  initialMainCategories,
  initialSubCategories,
}: FrasesClientPageProps) {
  const [allQuotes] = useState<QuoteWithAuthor[]>(initialQuotes);
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todos');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  
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


  const handleCopy = (text: string, author?: string) => {
    const textToCopy = author ? `${text} - ${author}` : text;
    try {
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copiado!',
        description: 'A frase foi copiada para a sua área de transferência.',
      });
    } catch (err) {
      console.error('Falha ao copiar:', err);
      toast({
        title: 'Erro ao Copiar',
        description: 'Não foi possível copiar para a área de transferência.',
        variant: 'destructive',
      });
    }
  };

 const handleShare = async (text: string, author?: string) => {
    const shareText = author ? `${text} - ${author}` : text;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'InspireMe',
          text: shareText,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error("Erro ao compartilhar, usando fallback de cópia:", error);
        handleCopy(text, author);
      }
    } else {
      handleCopy(text, author);
    }
  };

  const handleMainCategorySelect = (mainCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory('Todos');
    if (mainCategory === 'Todos') {
      setSelectedSubCategory('Todos');
    }
  };

  const handleSubCategorySelect = (mainCategory: string, subCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory(subCategory);
    if (window.innerWidth < 768) {
      setIsCategorySheetOpen(false);
    }
  };

  const renderFilters = () => {
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
          variant='ghost'
          onClick={() => handleMainCategorySelect('Todos')}
          className={cn('w-full justify-start text-base font-semibold px-3 py-2 transition-colors rounded-md hover:bg-muted/50',
             selectedMainCategory === 'Todos' && 'bg-primary/10 text-primary'
          )}
        >
          Todos
        </Button>
        <Accordion type="multiple" className="w-full" defaultValue={initialMainCategories.map((_, i) => `item-${i}`)}>
          {initialMainCategories
            .filter((cat) => cat !== 'Todos')
            .map((mainCat, index) => {
              const subCats = (initialSubCategories[mainCat] || []);
              if (subCats.length === 0) {
                return (
                  <Button
                    key={mainCat}
                    variant='ghost'
                    onClick={() => handleMainCategorySelect(mainCat)}
                    className={cn('w-full justify-start text-base font-semibold px-3 py-2 transition-colors rounded-md hover:bg-muted/50',
                      selectedMainCategory === mainCat && selectedSubCategory === 'Todos' && 'bg-primary/10 text-primary'
                    )}
                  >
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
                    <span className="flex-1 text-left">{mainCat}</span>
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
      </div>
    );
  };
  
    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

  return (
    <>
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="py-4">{renderFilters()}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:items-start">
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <ScrollArea className="h-[calc(100vh-10rem)] -mr-4 pr-4">
                  {renderFilters()}
                </ScrollArea>
              </div>
            </aside>
            <div>
              <div className="w-full mb-8 flex justify-between items-center">
                 <div className="flex-1 text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                      Inspire-se com Frases
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                      Explore, favorite e crie vídeos com nossa coleção de frases.
                    </p>
                </div>
                <div className="md:hidden ml-4">
                    <Button variant="outline" size="icon" onClick={() => setIsCategorySheetOpen(true)}>
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                </div>
              </div>
              
              {isLoading ? renderSkeletons() : filteredQuotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuotes.map((quote) => {
                    const isFavorited = favorites.includes(quote.id);
                    return (
                      <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4 pb-0 flex-1">
                          <p className="text-base font-body">{quote.quote}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex flex-col items-stretch gap-2">
                           {quote.author && (
                             <p className="text-sm font-medium text-muted-foreground self-end">
                               - {quote.author}
                             </p>
                           )}
                          <div className="flex justify-between items-center w-full pt-1">
                             {quote.subCategory && quote.subCategory !== 'Todos' ? (
                                <span className="bg-primary/10 px-2 py-0.5 text-xs rounded-full text-primary truncate max-w-[120px]">
                                    {quote.subCategory}
                                </span>
                            ) : <div/>}

                            <div className="flex items-center">
                              <Link href={`/editor-de-video?quote=${encodeURIComponent(quote.quote)}`} passHref>
                                <Button variant="ghost" size="icon"><Film className="h-4 w-4" /></Button>
                              </Link>
                              <Button variant="ghost" size="icon" onClick={() => handleCopy(quote.quote, quote.author)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                                <Heart className={cn("h-4 w-4", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleShare(quote.quote, quote.author)}>
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
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
        </div>
      </main>
    </>
  );
}
