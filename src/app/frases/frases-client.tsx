
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Search, Film, Copy, Share2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/use-favorites';
import type { Quote } from '@/lib/dados';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Tipos para as props do componente.
interface FrasesClientPageProps {
  initialQuotes: Quote[];
  initialMainCategories: string[];
  initialSubCategories: Record<string, string[]>;
  isCategorySheetOpen?: boolean;
  setIsCategorySheetOpen?: (isOpen: boolean) => void;
}

// Componente de Cliente: Gerencia o estado da UI, como filtros e favoritos.
export function FrasesClientPage({
  initialQuotes,
  initialMainCategories,
  initialSubCategories,
  isCategorySheetOpen = false, // Valor padrão
  setIsCategorySheetOpen = () => {}, // Função padrão
}: FrasesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Filtra as frases com base no termo de busca e nas categorias selecionadas.
  const filteredQuotes = useMemo(() => {
    return initialQuotes.filter((quote) => {
      // Filtro de busca
      const searchMatch =
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase());
  
      // Filtro da aba principal
      const mainCategoryMatch =
        selectedMainCategory === 'Todos' ||
        quote.mainCategory === selectedMainCategory;
  
      // Filtro das subcategorias
      let subCategoryMatch = true;
      if (selectedSubCategory && selectedSubCategory !== 'Todos') {
        subCategoryMatch = quote.subCategory === selectedSubCategory;
      }
  
      return searchMatch && mainCategoryMatch && subCategoryMatch;
    });
  }, [searchTerm, selectedMainCategory, selectedSubCategory, initialQuotes]);
  
  // Função para copiar o texto da frase.
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "A frase foi copiada para a área de transferência.",
    });
  };
  
  // Seleciona a categoria principal e reseta a subcategoria.
  const handleMainCategorySelect = (mainCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory(null);
  };
  
  // Seleciona a subcategoria e ajusta a categoria principal.
  const handleSubCategorySelect = (mainCategory: string, subCategory: string) => {
      setSelectedMainCategory(mainCategory);
      setSelectedSubCategory(subCategory);
  };


const renderFilters = () => {
  return (
    <div className="space-y-4">
      {/* Busca */}
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

      {/* Botão "Todos" */}
      <Button
        variant={selectedMainCategory === 'Todos' ? 'secondary' : 'ghost'}
        onClick={() => handleMainCategorySelect('Todos')}
        className="w-full justify-start"
      >
        Todos
      </Button>

      {/* Abas principais */}
      <Accordion type="multiple" className="w-full">
        {initialMainCategories
          .filter((cat) => cat !== 'Todos')
          .map((mainCat, index) => {
            const subCats = initialSubCategories[mainCat] || [];

            // Se não tiver subcategorias reais
            if (subCats.length <= 1 && subCats[0] === 'Todos') {
              return (
                <Button
                  key={mainCat}
                  variant={selectedMainCategory === mainCat ? 'secondary' : 'ghost'}
                  onClick={() => handleMainCategorySelect(mainCat)}
                  className="w-full justify-start font-semibold"
                >
                  {mainCat}
                </Button>
              );
            }

            return (
              <AccordionItem value={`item-${index}`} key={mainCat}>
                <AccordionTrigger
                  className={cn(
                    'font-semibold hover:no-underline',
                    selectedMainCategory === mainCat && 'text-primary'
                  )}
                  onClick={() => handleMainCategorySelect(mainCat)}
                >
                  {mainCat}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col items-start gap-1 pl-4">
                    {subCats
                      .filter((subCat) => subCat !== 'Todos')
                      .map((subCat) => (
                        <Button
                          key={subCat}
                          variant="ghost"
                          onClick={() => handleSubCategorySelect(mainCat, subCat)}
                          className={cn(
                            'w-full justify-start text-sm',
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
    <div className="h-full flex flex-col">
       {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Inspire-se com Frases Marcantes
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Explore, favorite e crie vídeos com nossa coleção de frases.
            </p>
          </div>
          
          <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8 md:items-start">
            {/* Menu Lateral para Desktop */}
            <aside className="hidden md:block sticky top-8">
              {renderFilters()}
            </aside>
            
            {/* Grid de Frases */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuotes.map((quote) => {
                const isFavorited = favorites.includes(quote.id);
                return (
                  <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 pb-0">
                      <p className="text-base font-body italic">"{quote.text}"</p>
                      <p className="text-right text-sm font-medium text-muted-foreground mt-2">
                        - {quote.author}
                      </p>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-between items-center">
                       <span className="bg-primary/10 px-2 py-0.5 text-xs rounded-full text-primary">{quote.subCategory}</span>
                      <div className="flex items-center">
                        <Link href={`/editor-de-video?quote=${encodeURIComponent(quote.text)}`} passHref>
                          <Button variant="ghost" size="icon"><Film className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(`"${quote.text}" - ${quote.author}`)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                          <Heart className={cn("h-4 w-4", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                        </Button>
                        <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Menu Lateral para Mobile */}
       <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="py-4">
             {renderFilters()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
