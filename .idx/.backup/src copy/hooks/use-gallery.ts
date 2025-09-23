
"use client";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from 'nanoid';

const GALLERY_CATEGORIES_KEY = "quotevid_gallery_categories";
const GALLERY_MEDIA_ITEMS_KEY = "quotevid_gallery_media_items";
const GALLERY_SELECTED_CATEGORY_KEY = "quotevid_gallery_selected_category";

export interface GalleryCategory {
  id: string;
  name: string;
}

export interface MediaItem {
  id: string;
  categoryId: string;
  type: 'image' | 'video';
  src: string; // data URL
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  isPinned: boolean;
  createdAt: string; // ISO date string
}

const defaultCategories: GalleryCategory[] = [
    { id: 'geral', name: 'Geral' },
    { id: 'favoritos', name: 'Favoritos' },
];

export const useGallery = () => {
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carregar dados do localStorage
    useEffect(() => {
        try {
            const storedCategories = localStorage.getItem(GALLERY_CATEGORIES_KEY);
            const storedMedia = localStorage.getItem(GALLERY_MEDIA_ITEMS_KEY);
            const storedSelected = localStorage.getItem(GALLERY_SELECTED_CATEGORY_KEY);

            const loadedCategories = storedCategories ? JSON.parse(storedCategories) : defaultCategories;
            setCategories(loadedCategories);

            if (storedMedia) {
                setMediaItems(JSON.parse(storedMedia));
            }
            
            // Define a categoria selecionada (a primeira da lista, se existir)
            const initialSelected = storedSelected ? JSON.parse(storedSelected) : (loadedCategories[0]?.id || null);
            setSelectedCategory(initialSelected);

        } catch (error) {
            console.error("Failed to parse gallery data from localStorage", error);
            setCategories(defaultCategories);
            setSelectedCategory(defaultCategories[0]?.id || null);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Salvar categorias
    const saveCategories = useCallback((items: GalleryCategory[]) => {
        try {
            localStorage.setItem(GALLERY_CATEGORIES_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save categories to localStorage", error);
        }
    }, []);

    // Salvar itens de mídia
    const saveMediaItems = useCallback((items: MediaItem[]) => {
        try {
            localStorage.setItem(GALLERY_MEDIA_ITEMS_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save media items to localStorage", error);
        }
    }, []);
    
    // Salvar categoria selecionada
    const handleSetSelectedCategory = useCallback((categoryId: string | null) => {
        try {
            if (categoryId) {
                localStorage.setItem(GALLERY_SELECTED_CATEGORY_KEY, JSON.stringify(categoryId));
            } else {
                localStorage.removeItem(GALLERY_SELECTED_CATEGORY_KEY);
            }
            setSelectedCategory(categoryId);
        } catch (error) {
            console.error("Failed to save selected category to localStorage", error);
        }
    }, []);

    // --- Funções de Gerenciamento ---

    const addCategory = useCallback((name: string) => {
        const newCategory: GalleryCategory = { id: nanoid(), name };
        setCategories(prev => {
            const updated = [...prev, newCategory];
            saveCategories(updated);
            handleSetSelectedCategory(newCategory.id); // Seleciona a nova categoria
            return updated;
        });
    }, [saveCategories, handleSetSelectedCategory]);

    return { 
        isLoaded,
        categories, 
        addCategory,
        mediaItems,
        selectedCategory,
        setSelectedCategory: handleSetSelectedCategory,
    };
};
