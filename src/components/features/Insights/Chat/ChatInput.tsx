import { SendHorizontal } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface ChatInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex items-center gap-2 rounded-full border border-border bg-input py-1.5 pr-1.5 pl-4"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Faça uma pergunta sobre a sua simulação..."
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Enviar pergunta"
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal size={16} />
      </button>
    </form>
  );
}
