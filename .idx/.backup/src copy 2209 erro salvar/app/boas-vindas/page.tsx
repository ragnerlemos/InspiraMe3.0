

"use client";

import { Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Página de boas-vindas com animação
export default function WelcomePage() {
    const [show, setShow] = useState(false);

    // Efeito para iniciar a animação após a montagem do componente
    useEffect(() => {
        // O timeout garante que a transição CSS seja aplicada
        const timer = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
            <div className={`transition-all duration-1000 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                <Feather className="h-20 w-20 text-primary animate-pulse" />
            </div>

            <div className={`transition-all duration-1000 ease-in-out delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h1 className="mt-8 font-headline text-4xl font-bold text-foreground md:text-5xl">
                    Bem-vindo ao InspireMe
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Selecione uma categoria no menu para começar sua jornada de inspiração.
                </p>
            </div>

            <div className={`transition-all duration-1000 ease-in-out delay-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <Link href="/frases" passHref>
                    <Button className="mt-10" size="lg">
                        Explorar Frases
                    </Button>
                </Link>
            </div>
        </div>
    );
}
