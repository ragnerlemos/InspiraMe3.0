
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/cabecalho-app';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';


// Metadados da página, como título e descrição, para SEO.
export const metadata: Metadata = {
  title: 'QuoteVid',
  description: 'Crie e compartilhe vídeos de frases marcantes.',
};

// Layout raiz da aplicação que envolve todas as páginas.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Pré-conexão com o Google Fonts para otimizar o carregamento das fontes. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Importação das fontes utilizadas no projeto. */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&family=Lobster&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
            <div className="flex min-h-screen flex-col">
              {/* O cabeçalho da aplicação é renderizado em todas as páginas. */}
              <AppHeader />
              <main className="flex-1">
                {/* O conteúdo da página atual é renderizado aqui. */}
                {children}
              </main>
            </div>
            {/* O Toaster é usado para exibir notificações no aplicativo. */}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
