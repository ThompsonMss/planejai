import { useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { ChatInput } from '@/components/features/Insights/Chat/ChatInput';
import { ChatMessage } from '@/components/features/Insights/Chat/ChatMessage';
import { ChatTyping } from '@/components/features/Insights/Chat/ChatTyping';
import { Content } from '@/components/features/Insights/Content';
import { Error } from '@/components/features/Insights/Error';
import { useChat } from '@/hooks/useChat';
import { useInsight } from '@/hooks/useInsight';

import 'react-loading-skeleton/dist/skeleton.css';

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId);
  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
    retryLastQuestion,
  } = useChat(simulationId, insight);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isChatLoading, chatError]);

  const isReady = !isLoading && !error && insight;

  return (
    <div className="order-2 flex flex-col rounded-2xl bg-card p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex flex-shrink-0 items-center gap-1.5">
        <span>✨</span>
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 lg:max-h-[30rem] lg:[scrollbar-color:var(--border)_transparent] lg:overflow-y-auto lg:pr-2"
      >
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}

        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => fetchInsight(simulationId)}
          />
        )}

        {isReady && (
          <>
            <Content insight={insight} />

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isChatLoading && <ChatTyping />}

            {chatError && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <p className="text-sm text-red-500">⚠️ {chatError}</p>
                <button
                  type="button"
                  onClick={retryLastQuestion}
                  className="cursor-pointer text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                >
                  Tentar novamente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isReady && (
        <div className="flex-shrink-0">
          <ChatInput onSend={sendMessage} disabled={isChatLoading} />
        </div>
      )}
    </div>
  );
}
