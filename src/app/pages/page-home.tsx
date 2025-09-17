
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, Search, Copy, Film, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Quote } from "@/lib/dados";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface HomePageClientProps {
  initialQuotes: Quote[];
  initialMainCategories: string[];
  initialSubCategories: Record<string, string[]>;
  isCategorySheetOpen?: boolean;
  setIsCategorySheetOpen?: (isOpen: boolean) => void;
}

// Componente Cliente para a página principal, responsável pela interatividade.
export function HomePageClient({ 
  initialQuotes, 
  initialMainCategories, 
  initialSubCategories,
  isCategorySheetOpen,
  setIsCategorySheetOpen
}: HomePageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>(initialMainCategories[0] || 'Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todos");
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(selectedMainCategory === 'Todos' ? undefined : selectedMainCategory);
  
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Atualiza a subcategoria para "Todos" quando a categoria principal muda
  const handleMainCategoryChange = (category: string) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory("Todos");
    // Controla o estado do acordeão
    if (category === 'Todos') {
        setOpenAccordion(undefined);
    } else {
        setOpenAccordion(category);
    }
  };

  const handleSubCategoryChange = (mainCategory: string, subCategory: string) => {
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory(subCategory);
    setOpenAccordion(mainCategory);
  }

  // Filtra as frases com base em tudo
  const filteredQuotes = useMemo(() => {
    return initialQuotes.filter((quote) => {
        const searchMatch = quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quote.author.toLowerCase().includes(searchTerm.toLowerCase());
        const mainCategoryMatch = selectedMainCategory === 'Todos' || quote.mainCategory === selectedMainCategory;
        const subCategoryMatch = selectedSubCategory === 'Todos' || quote.subCategory === selectedSubCategory;

        return searchMatch && mainCategoryMatch && subCategoryMatch;
    });
  }, [searchTerm, selectedMainCategory, selectedSubCategory, initialQuotes]);


  // Função para copiar o texto de uma frase para a área de transferência.
  const handleCopy = (text: string, author: string) => {
    navigator.clipboard.writeText(`${text} - ${author}`).then(() => {
      toast({
        title: "Copiado!",
        description: "A frase foi copiada para a sua área de transferência.",
      });
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível acessar a área de transferência.",
      });
    });
  };

  const renderFilters = () => (
     <div className="space-y-4">
        <div className="relative flex-1 px-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por frases ou autores..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Accordion 
            type="single" 
            collapsible 
            className="w-full" 
            value={openAccordion}
            onValueChange={setOpenAccordion}
        >
             <Button
                variant={selectedMainCategory === 'Todos' ? "secondary" : "ghost"}
                onClick={() => handleMainCategoryChange('Todos')}
                className="w-full justify-start text-left h-auto px-4 py-3 text-base font-normal"
            >
                Todas as Categorias
            </Button>
            {initialMainCategories.filter(c => c !== 'Todos').map(mainCat => (
                <AccordionItem value={mainCat} key={mainCat}>
                    <AccordionTrigger 
                        className={cn(
                            "px-4 py-3 text-base font-normal hover:no-underline",
                            selectedMainCategory === mainCat && selectedSubCategory === 'Todos' && 'bg-secondary'
                        )}
                        onClick={() => handleMainCategoryChange(mainCat)}
                    >
                        {mainCat}
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                       <div className="flex flex-col gap-1 px-4">
                            {(initialSubCategories[mainCat] || []).map(subCat => (
                                <Button
                                    key={subCat}
                                    variant={selectedSubCategory === subCat && selectedMainCategory === mainCat ? 'secondary' : 'ghost'}
                                    onClick={() => handleSubCategoryChange(mainCat, subCat)}
                                    className="w-full justify-start"
                                >
                                    {subCat}
                                </Button>
                            ))}
                       </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
  );

  const renderQuoteGrid = () => (
     <div className="container mx-auto py-8 px-4">
        {/* Grid de frases filtradas. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 pb-2">
                  <p className="text-lg font-body">{quote.text}</p>
                  <p className="text-right text-sm font-medium text-muted-foreground mt-4">
                    - {quote.author}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-4 flex justify-between items-center">
                    <span className="bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">
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

          {/* Mensagem exibida quando nenhuma frase é encontrada. */}
          {filteredQuotes.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold">Nenhuma frase encontrada</h2>
              <p className="text-muted-foreground mt-2">
                Tente ajustar sua busca ou selecionar outra categoria.
              </p>
            </div>
          )}
        </div>
  );

  return (
    <div className="flex flex-col">
        {/* Cabeçalho da página com título e descrição. */}
        <div className="text-center py-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Inspire-se. Crie. Compartilhe.
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Encontre a frase perfeita para o seu próximo vídeo.
          </p>
        </div>

       <PanelGroup direction="horizontal" className="flex-1 min-h-0">
          {/* Menu Lateral (Desktop) */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block">
             <ScrollArea className="h-full w-full">
                <div className="py-4">
                  {renderFilters()}
                </div>
             </ScrollArea>
          </Panel>
          <PanelResizeHandle className="hidden md:flex" />

          {/* Conteúdo Principal */}
          <Panel>
            {/* Filtros para Mobile em um Sheet */}
             <div className="md:hidden">
              <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
                <SheetContent side="left" className="p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>Categorias e Filtros</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100%-4rem)]">
                      <div className="py-4">
                        {renderFilters()}
                      </div>
                    </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            
            {renderQuoteGrid()}
          </Panel>
       </PanelGroup>
    </div>
  );
}
