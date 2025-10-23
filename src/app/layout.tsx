
"use client";

import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { AppHeader } from './cabecalho-app';
import { useGoogleFonts } from "@/hooks/use-google-fonts";
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { FirebaseClientProvider } from "@/firebase";

// Layout raiz da aplicação que envolve todas as páginas.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Carrega e injeta as fontes do Google para evitar problemas de CORS
  useGoogleFonts();

  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');

  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        {/* As fontes do Google serão injetadas dinamicamente através do hook useGoogleFonts */}
      </head>
      <body className="font-body antialiased h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <EditorProvider>
              <Toaster />
              <div className="flex flex-col h-full">
                  {!isEditorPage && <AppHeader />}
                  <div className="flex-1 flex flex-col min-h-0">
                      {children}
                  </div>
              </div>
            </EditorProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
