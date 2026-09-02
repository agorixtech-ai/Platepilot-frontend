import { useEffect, useState } from "react";
import { conversationsApi } from "@/lib/api";
import { useAgentQuery, useSaveConversation } from "@/hooks/useApi";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tableData?: Record<string, unknown>[] | null;
}

// Conversations live server-side (agent_conversations); localStorage only remembers
// which conversation is active so any consumer resumes it.
export const AI_CHAT_ID_KEY = "platepilot_ai_chat_id";

export const GREETING: ChatMessage = {
  id: "1",
  role: "assistant",
  content: "Hello! I'm Pilot AI, your intelligent assistant. How can I help you today?",
  timestamp: new Date(),
};

export function reviveMessages(raw: Record<string, unknown>[]): ChatMessage[] {
  return (raw as unknown as ChatMessage[]).map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
}

/**
 * The active Pilot AI conversation: resume-on-mount, send with history, server
 * persistence after every exchange. Used by both the AI page and the floating
 * assistant — they stay in sync because only one is on screen at a time and both
 * resume the AI_CHAT_ID_KEY conversation from the server when they mount.
 */
export function useAgentChat() {
  const [conversationId, setConversationId] = useState<string>(
    () => localStorage.getItem(AI_CHAT_ID_KEY) ?? crypto.randomUUID(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const agentQuery = useAgentQuery();
  const saveConversation = useSaveConversation();

  // Resume the active conversation, if it still exists on the server.
  useEffect(() => {
    const stored = localStorage.getItem(AI_CHAT_ID_KEY);
    if (!stored) return;
    conversationsApi
      .get(stored)
      .then((res) => setMessages(reviveMessages(res.messages)))
      .catch(() => {
        // deleted or first visit on this device — keep the fresh chat
      });
  }, []);

  useEffect(() => {
    localStorage.setItem(AI_CHAT_ID_KEY, conversationId);
  }, [conversationId]);

  const sendQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    const sent = [...messages, userMessage];
    setMessages(sent);

    let reply: ChatMessage;
    try {
      // `messages` is the pre-send state — prior turns only, not the new question.
      // Slice to what the server will replay anyway (agent_history_max_messages).
      const history = messages.slice(-40).map((m) => ({ role: m.role, content: m.content }));
      const res = await agentQuery.mutateAsync({ question, history });
      reply = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.answer,
        timestamp: new Date(),
        tableData: res.used_data ? res.table_data : null,
      };
    } catch (err) {
      reply = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Something went wrong reaching Pilot AI. Please try again.",
        timestamp: new Date(),
      };
    }
    const next = [...sent, reply];
    setMessages(next);

    const firstUser = next.find((m) => m.role === "user");
    if (firstUser) {
      saveConversation.mutate({
        id: conversationId,
        title: firstUser.content.slice(0, 80),
        messages: next,
      });
    }
  };

  const startNewChat = () => {
    setConversationId(crypto.randomUUID());
    setMessages([GREETING]);
  };

  /** Switch to an already-fetched conversation (AI page's history sidebar). */
  const openConversation = (id: string, msgs: ChatMessage[]) => {
    setConversationId(id);
    setMessages(msgs);
  };

  return {
    conversationId,
    messages,
    isTyping: agentQuery.isPending,
    sendQuestion,
    startNewChat,
    openConversation,
  };
}
