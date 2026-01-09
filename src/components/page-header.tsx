
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string | ReactNode;
    showBack?: boolean;
    children?: ReactNode; // Para o menu ou outras ações
}

export function PageHeader({ title, showBack = false, children }: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.replace('/frases');
        }
    };

    return (
        <header className="px-4 pt-4 flex items-center justify-between bg-background h-22">
            {/* Slot da Esquerda: Para o menu ou ações específicas da página */}
            <div className="flex items-center justify-start w-auto flex-shrink-0">
                {children}
            </div>
            
            {/* Título Centralizado */}
            <div className="font-headline text-lg font-bold text-center truncate flex-1 px-2">
                {title}
            </div>
            
            {/* Slot da Direita: Para o botão de voltar ou espaço */}
            <div className="flex items-center justify-end w-12 flex-shrink-0">
                 {showBack && (
                     <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                )}
            </div>
        </header>
    );
}
