import { Sparkles, User } from 'lucide-react';

import type { ChatMessage as ChatMessageData } from '@/data/simulation';

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <section className="mt-5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          {isUser ? (
            <User size={14} className="text-primary" />
          ) : (
            <Sparkles size={14} className="text-primary" />
          )}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {isUser ? 'Você' : 'Resposta da IA'}
        </span>
      </div>
      <p className="pl-8 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
        {message.content}
      </p>
    </section>
  );
}
