
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Image as ImageIcon, Video, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useGallery } from "@/hooks/use-gallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Página para exibir e gerenciar a galeria de mídias do usuário.
export default function GalleryPage() {
    const { categories, addCategory, mediaItems, selectedCategory, setSelectedCategory } = useGallery();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName("");
            setIsAdding(false);
        }
    };

    const mediaForSelectedCategory = mediaItems.filter(item => item.categoryId === selectedCategory);

    return (
        <main className="flex-1">
            <div className="container mx-auto py-8 px-4">
                <div className="text-center mb-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                        Galeria de Mídia
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Seu acervo pessoal de imagens e vídeos para suas criações.
                    </p>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full">
                            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setIsAdding(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nova Categoria
                            </Button>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" disabled={!selectedCategory}>
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Renomear
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir Categoria
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>

                {mediaForSelectedCategory.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Mapeamento das mídias virá aqui */}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Nenhuma mídia nesta categoria</h2>
                        <p className="text-muted-foreground mb-6">
                            Adicione imagens ou vídeos para começar a organizar sua galeria.
                        </p>
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Mídia
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
