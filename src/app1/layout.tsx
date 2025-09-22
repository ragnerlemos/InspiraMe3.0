
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { AppLayout } from './app-layout';


// Metadados da página, como título e descrição, para SEO.
export const metadata: Metadata = {
  title: 'InspireMe',
  description: 'Crie e compartilhe vídeos de frases marcantes.',
};

// Layout raiz da aplicação que envolve todas as páginas.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=PT+Sans:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lobster&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
            {/* O Toaster é usado para exibir notificações no aplicativo. */}
            <Toaster />
            <AppLayout>
                {children}
            </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
