

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Film, GalleryVertical, Menu, Star, Settings, User, Clapperboard, GalleryHorizontal, Quote, Undo, Save, FileImage, Video, Redo, TestTube2, LayoutGrid, Feather } from "lucide-react";
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
  { href: "/frases", label: "Frases", icon: Quote },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/modelos", label: "Modelos", icon: GalleryVertical },
  { href: "/galeria", label: "Galeria", icon: GalleryHorizontal },
  { href: "/meus-videos", label: "Meus Vídeos", icon: Clapperboard },
  { href: "/editor-de-video", label: "Editor", icon: Film },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function EditorHeader() {
    const { controls } = useEditor();
    const { canUndo, undo, canRedo, redo, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4 } = controls;

    return (
        <div className="flex items-center justify-between w-full h-16 px-4 border-b bg-background shrink-0">
            <Link href="/" className="flex items-center gap-2">
                <Feather className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl font-bold">InspireMe</span>
            </Link>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
                    <Undo className="h-5 w-5" />
                    <span className="sr-only">Desfazer</span>
                </Button>
                 <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
                    <Redo className="h-5 w-5" />
                    <span className="sr-only">Refazer</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onExportJPG()}>
                            <FileImage className="mr-2 h-4 w-4" />
                            Exportar JPG
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => onExportPNG()}>
                            <FileImage className="mr-2 h-4 w-4" />
                            Exportar PNG
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

  const renderNavLinks = (isMobile = false) => {
    return navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const commonClasses = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary";
        
        if (isMobile) {
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                        commonClasses,
                        "text-muted-foreground text-base",
                        isActive && "bg-primary/10 text-primary"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            )
        }
        
        return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    commonClasses,
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
        )
    });
  }

  // Renderiza o cabeçalho do editor apenas na página /editor-de-video
  if (pathname.startsWith('/editor-de-video')) {
    return null;
  }
  
  if (pathname.startsWith('/boas-vindas')) {
    return null;
  }

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo e link para a página inicial. */}
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">InspireMe</span>
        </Link>
        {/* Navegação para telas maiores (desktop). */}
        <nav className="hidden items-center gap-1 md:flex">
            {renderNavLinks(false)}
        </nav>
        {/* Navegação para telas menores (mobile) usando um menu lateral. */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Navegação</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium pt-8">
                     {renderNavLinks(true)}
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
