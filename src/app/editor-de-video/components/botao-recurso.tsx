
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface BotaoRecursoProps {
  icon: LucideIcon;
  label: string;
}

export function BotaoRecurso({ icon: Icon, label }: BotaoRecursoProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Button variant="ghost" className="w-14 h-14 rounded-full flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </Button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
