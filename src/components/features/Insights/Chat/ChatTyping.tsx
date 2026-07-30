import { Sparkles } from 'lucide-react';

export function ChatTyping() {
  return (
    <section className="mt-5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <Sparkles size={14} className="text-primary" />
        </span>
        <span className="text-sm font-semibold text-foreground">Resposta da IA</span>
      </div>
      <div className="flex gap-1 pl-8">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </section>
  );
}
