
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Search, Copy, Film, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Quote } from '@/lib/dados';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FrasesClientPageProps = {
  initialQuotes: Quote[];
  initialMainCategories: string[];
  initialSubCategories: Record<string, string[]>;
  isCategorySheetOpen?: boolean;
  setIsCategorySheetOpen?: (isOpen: boolean) => void;
};

// Página principal que exibe uma lista de frases e permite ao usuário filtrá-las.
export function FrasesClientPage({ 
    initialQuotes, 
    initialMainCategories, 
    initialSubCategories,
    isCategorySheetOpen = false,
    setIsCategorySheetOpen = () => {}
}: FrasesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todos');

  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const filteredQuotes = useMemo(() => {
    return initialQuotes.filter((quote) => {
      const searchMatch =
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase());
      const mainCategoryMatch =
        selectedMainCategory === 'Todos' || quote.mainCategory === selectedMainCategory;
      const subCategoryMatch =
        selectedSubCategory === 'Todos' || quote.subCategory === selectedSubCategory;

      return searchMatch && mainCategoryMatch && subCategoryMatch;
    });
  }, [searchTerm, selectedMainCategory, selectedSubCategory, initialQuotes]);

  const handleCopy = (text: string, author: string) => {
    navigator.clipboard.writeText(`${text} - ${author}`);
    toast({
      title: 'Copiado!',
      description: 'A frase foi copiada para a sua área de transferência.',
    });
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
    // Fecha o sheet no mobile ao selecionar
    if (window.innerWidth < 768) {
        setIsCategorySheetOpen(false);
    }
  }

  const renderFilters = () => {
    const mainCategoriesInAccordion = initialMainCategories.filter(cat => cat !== 'Todos' && cat !== 'Frases');
    const frasesSubcategories = initialSubCategories['Frases'] || [];

    return (
        <div className="space-y-4">
           <div className="relative">
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
              className="w-full justify-start"
            >
              Todos
          </Button>

          {/* Subcategorias de 'Frases' */}
          <div className="flex flex-col items-start gap-1 pl-4 border-l">
              {frasesSubcategories.map((subCat) => {
                if (subCat === 'Todos') return null;
                return (
                    <Button
                      key={subCat}
                      variant="ghost"
                      onClick={() => handleSubCategorySelect('Frases', subCat)}
                      className={cn(
                        'w-full justify-start text-sm',
                        selectedMainCategory === 'Frases' && selectedSubCategory === subCat && 'bg-primary/10 text-primary font-semibold'
                      )}
                    >
                      {subCat}
                    </Button>
                )
              })}
          </div>

          <Accordion type="single" collapsible className="w-full">
            {mainCategoriesInAccordion.map((mainCat, index) => {
              const subCats = initialSubCategories[mainCat] || [];
              if (mainCat === 'Todos') return null;

              return (
                <AccordionItem value={`item-${index}`} key={mainCat}>
                  <AccordionTrigger
                    className={cn(
                      'font-semibold',
                      selectedMainCategory === mainCat && 'text-primary'
                    )}
                    onClick={() => handleMainCategorySelect(mainCat)}
                  >
                    {mainCat}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col items-start gap-1 pl-4">
                       {subCats.map((subCat) => (
                        <Button
                          key={subCat}
                          variant="ghost"
                          onClick={() => handleSubCategorySelect(mainCat, subCat)}
                          className={cn(
                            'w-full justify-start',
                            selectedMainCategory === mainCat && selectedSubCategory === subCat && 'bg-primary/10 text-primary'
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
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:items-start">
            {/* Sidebar de Filtros (Desktop) */}
            <aside className="hidden md:block">
                <div className="sticky top-24">
                   {renderFilters()}
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <div>
                <div className="text-center md:text-left mb-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                    Inspire-se. Crie. Compartilhe.
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                    Encontre a frase perfeita para o seu próximo vídeo.
                    </p>
                </div>
                {filteredQuotes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuotes.map((quote) => (
                        <Card
                        key={quote.id}
                        className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                        >
                        <CardContent className="p-4 pb-2">
                            <p className="text-base font-body">{quote.text}</p>
                            <p className="text-right text-xs font-medium text-muted-foreground mt-2">
                            - {quote.author}
                            </p>
                        </CardContent>
                        <CardFooter className="p-2 pt-0 flex justify-between items-center">
                            <span className="bg-primary/10 px-2 py-0.5 text-xs rounded-full text-primary">
                            {quote.subCategory}
                            </span>
                            <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                                <Heart className={cn("h-4 w-4", favorites.includes(quote.id) ? "text-red-500 fill-current" : "")} />
                            </Button>
                            <Link href={`/modelos?quote=${encodeURIComponent(quote.text)}`} passHref>
                                <Button variant="ghost" size="icon">
                                <Film className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(quote.text, quote.author)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold">Nenhuma frase encontrada</h2>
                    <p className="text-muted-foreground mt-2">
                        Tente ajustar sua busca ou selecionar outra categoria.
                    </p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </main>
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <div className="py-4">{renderFilters()}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
