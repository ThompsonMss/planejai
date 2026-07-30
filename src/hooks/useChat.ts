import { useCallback, useState } from 'react';

import { buildChatPrompt } from '@/data/aiPrompt';
import type { ChatMessage } from '@/data/simulation';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { getChatAnswer, type InsightData } from '@/services/aiService';

export const useChat = (simulationId: string, insight: InsightData | null) => {
  const { getFormData, getChat, saveChat } = useSimulationStorage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => getChat(simulationId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAnswer = useCallback(
    async (history: ChatMessage[], question: string, baseMessages: ChatMessage[]) => {
      const simulation = getFormData(simulationId);

      if (!simulation || !insight) {
        setError('Não foi possível enviar sua pergunta. Tente novamente.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const prompt = buildChatPrompt({ simulation, insight, history, question });
        const answer = await getChatAnswer(prompt);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: answer,
        };

        const updated = [...baseMessages, assistantMessage];
        setMessages(updated);
        saveChat(simulationId, updated);
      } catch {
        setError('Erro ao obter a resposta. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    },
    [simulationId, insight, getFormData, saveChat],
  );

  const sendMessage = useCallback(
    (question: string) => {
      const trimmed = question.trim();

      if (!trimmed || isLoading) {
        return;
      }

      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
      const history = messages;
      const withUser = [...history, userMessage];

      setMessages(withUser);
      void requestAnswer(history, trimmed, withUser);
    },
    [messages, isLoading, requestAnswer],
  );

  const retryLastQuestion = useCallback(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user' || isLoading) {
      return;
    }

    void requestAnswer(messages.slice(0, -1), lastMessage.content, messages);
  }, [messages, isLoading, requestAnswer]);

  return { messages, isLoading, error, sendMessage, retryLastQuestion };
};
