
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Film, GalleryVertical, Menu, Star, Settings, User, Clapperboard, GalleryHorizontal, Quote, Undo, Save, FileImage, Video } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditor } from "./editor-de-video/contexts/editor-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Itens de navegação exibidos no cabeçalho.
const navItems = [
  { href: "/", label: "Frases", icon: Quote },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/modelos", label: "Modelos", icon: GalleryVertical },
  { href: "/galeria", label: "Galeria", icon: GalleryHorizontal },
  { href: "/meus-videos", label: "Meus Vídeos", icon: Clapperboard },
  { href: "/editor-de-video", label: "Editor", icon: Film },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function EditorHeader() {
    const { canUndo, undo, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4 } = useEditor();

    return (
        <div className="flex items-center justify-between w-full h-16 px-4 border-b bg-background">
            <Link href="/" className="flex items-center gap-2">
                <Quote className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl font-bold">QuoteVid</span>
            </Link>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
                    <Undo className="h-5 w-5" />
                    <span className="sr-only">Desfazer</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={onExportJPG}>
                            <FileImage className="mr-2 h-4 w-4" />
                            Exportar como JPG
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={onExportPNG}>
                            <FileImage className="mr-2 h-4 w-4" />
                            Exportar como PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onExportMP4}>
                           <Video className="mr-2 h-4 w-4" />
                           Exportar Vídeo (MP4)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onSaveAsTemplate}>Salvar como Modelo</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

// Componente do cabeçalho da aplicação.
export function AppHeader() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const isEditorPage = pathname.startsWith('/editor-de-video');

  // Não renderiza o cabeçalho principal na página do editor
  if (isEditorPage) {
      return null;
  }

  // Função que renderiza os links de navegação.
  const navLinks = (className?: string) => (
    <>
      {navItems.map((item) => {
        // Verifica se o item de navegação atual é a página ativa.
        const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
        return (
            <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsSheetOpen(false)} // Fecha o menu ao clicar
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-primary/10 text-primary",
                className
            )}
            >
            <item.icon className="h-4 w-4" />
            {item.label}
            </Link>
        )
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo e link para a página inicial. */}
        <Link href="/" className="flex items-center gap-2">
          <Quote className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">QuoteVid</span>
        </Link>
        {/* Navegação para telas maiores (desktop). */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
             const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
             return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
             )
          })}
        </nav>
        {/* Navegação para telas menores (mobile) usando um menu lateral. */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium pt-8">
                    {navLinks("text-base")}
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
