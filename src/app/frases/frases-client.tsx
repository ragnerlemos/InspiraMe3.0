
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Copy, Film, Share2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  getQuotesForCategory,
  getQuotesForMainCategory,
  getAllQuotes,
  type QuoteWithAuthor,
  type CategoriesHierarchy,
} from '@/lib/dados';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FrasesClientPageProps = {
  initialQuotes: QuoteWithAuthor[];
  initialMainCategories: string[];
  initialSubCategories: CategoriesHierarchy;
};

// Página principal que exibe uma lista de frases e permite ao usuário filtrá-las.
export function FrasesClientPage({
  initialQuotes: serverQuotes,
  initialMainCategories,
  initialSubCategories,
}: FrasesClientPageProps) {
  const [quotes, setQuotes] = useState<QuoteWithAuthor[]>(serverQuotes);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todos');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Busca as frases no servidor quando a categoria muda
  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      try {
        let fetchedQuotes: QuoteWithAuthor[] = [];
        if (selectedMainCategory === 'Todos') {
          fetchedQuotes = await getAllQuotes();
        } else if (selectedSubCategory !== 'Todos') {
          fetchedQuotes = await getQuotesForCategory(selectedSubCategory);
        } else {
          fetchedQuotes = await getQuotesForMainCategory(selectedMainCategory);
        }
        setQuotes(fetchedQuotes);
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar frases',
          description: 'Não foi possível carregar as frases. Tente novamente.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Só busca se não for a renderização inicial com as quotes do servidor
    if (selectedMainCategory !== 'Todos' || selectedSubCategory !== 'Todos' || searchTerm) {
        fetchQuotes();
    } else {
        setQuotes(serverQuotes)
    }
  }, [selectedMainCategory, selectedSubCategory, toast, serverQuotes, searchTerm]);

  // Filtra as frases já carregadas com base no termo de busca
  const filteredQuotes = useMemo(() => {
    if (!searchTerm) {
      return quotes;
    }
    return quotes.filter(
      (quote) =>
        quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  const handleCopy = (text: string, author?: string) => {
    try {
      const textToCopy = author ? `${text} - ${author}` : text;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copiado!',
        description: 'A frase foi copiada para a sua área de transferência.',
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar a frase.",
      });
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
          variant={selectedMainCategory === 'Todos' ? 'secondary' : 'ghost'}
          onClick={() => handleMainCategorySelect('Todos')}
          className={cn('w-full justify-start text-base font-semibold px-3 transition-colors rounded-md hover:bg-muted/50',
             selectedMainCategory === 'Todos' && 'bg-primary/10 text-primary'
          )}
        >
          Todos
        </Button>
        <Accordion type="multiple" className="w-full" defaultValue={['item-0']}>
          {initialMainCategories
            .filter((cat) => cat !== 'Todos')
            .map((mainCat, index) => {
              const subCats = initialSubCategories[mainCat] || [];
              if (subCats.length === 0) {
                return (
                  <Button
                    key={mainCat}
                    variant='ghost'
                    onClick={() => handleMainCategorySelect(mainCat)}
                    className={cn('w-full justify-start text-base font-semibold px-3 transition-colors rounded-md hover:bg-muted/50',
                      selectedMainCategory === mainCat && 'bg-primary/10 text-primary'
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
                      'font-semibold text-base hover:no-underline px-3 py-2 transition-colors rounded-md hover:bg-muted/50',
                      selectedMainCategory === mainCat && 'bg-primary/10 text-primary'
                    )}
                  >
                    {mainCat}
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

  return (
    <>
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <div className="py-4">{renderFilters()}</div>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:items-start">
            <aside className="hidden md:block">
              <div className="sticky top-24">{renderFilters()}</div>
            </aside>
            <div>
              <div className="flex w-full justify-between items-center mb-8">
                <div className="flex-1 text-center md:text-left">
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
                    <span className="sr-only">Abrir categorias</span>
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Card key={i} className="h-40 animate-pulse bg-muted"></Card>
                    ))}
                  </div>
              ) : filteredQuotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuotes.map((quote) => {
                    const isFavorited = favorites.includes(quote.id);
                    return (
                      <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4 pb-0">
                          <p className="text-base font-body italic">{quote.quote}</p>
                        </CardContent>
                        <CardFooter className="p-2 pt-2 flex flex-col items-start w-full">
                           {quote.author && (
                             <p className="text-right text-sm font-medium text-muted-foreground w-full mb-2">
                               - {quote.author}
                             </p>
                           )}
                          <div className="flex justify-between items-center w-full">
                             <div/>
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
                              <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
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
