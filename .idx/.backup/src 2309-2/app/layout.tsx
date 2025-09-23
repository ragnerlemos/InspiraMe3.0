
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
        {/* As fontes do Google serão injetadas dinamicamente através do hook useGoogleFonts */}
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
