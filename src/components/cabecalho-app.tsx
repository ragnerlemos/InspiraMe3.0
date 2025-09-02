
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, GalleryVertical, Quote, Menu, Star, Settings, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Itens de navegação exibidos no cabeçalho.
const navItems = [
  { href: "/", label: "Frases", icon: Quote },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/galeria", label: "Galeria", icon: GalleryVertical },
  { href: "/editor-de-video", label: "Editor", icon: Film },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

// Componente do cabeçalho da aplicação.
export function AppHeader() {
  const pathname = usePathname();

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
          <Sheet>
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
