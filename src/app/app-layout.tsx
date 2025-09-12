
"use client";

import { usePathname } from 'next/navigation';
import { AppHeader, EditorHeader } from './cabecalho-app';
import { EditorProvider } from './editor-de-video/contexts/editor-context';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isEditorPage = pathname.startsWith('/editor-de-video');

    if (isEditorPage) {
        return (
            <EditorProvider>
                <div className="flex flex-col h-full">
                    <EditorHeader />
                    <main className="flex-1 min-h-0">{children}</main>
                </div>
            </EditorProvider>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <AppHeader />
            <main className="flex-1 min-h-0">{children}</main>
        </div>
    );
}
