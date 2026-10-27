import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ChevronLeft, MoreVertical, Plus, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResultTable } from "@/components/dashboard/ResultTable";
import { timeAgo } from "@/components/dashboard/InventoryAlertsCard";
import { useAgentChat } from "@/hooks/useAgentChat";

const SUGGESTIONS = [
  "Why did food cost increase this week?",
  "Which branch sold the most yesterday?",
  "What should I reorder today?",
];

const MD =
  "text-[13px] leading-relaxed [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5";

/** PlatePielet AI — full-screen phone chat (the desktop page keeps history sidebar). */
export default function MobileAi() {
  const history = useHistory();
  const { messages, isTyping, sendQuestion, startNewChat } = useAgentChat();
  // Home's suggestion chips link here with ?q= to prefill the question.
  const [input, setInput] = useState(
    () => new URLSearchParams(window.location.search).get("q") ?? "",
  );
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || isTyping) return;
    setInput("");
    await sendQuestion(q);
  };

  const last = messages[messages.length - 1];
  const showFollowUps = !isTyping && last?.role === "assistant" && messages.length > 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-card px-3 pb-2.5 pt-[calc(0.6rem+env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => history.goBack()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full active:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          <h1 className="text-[16px] font-bold text-foreground">PlatePielet</h1>
          <span className="rounded-md bg-success-soft px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-success">
            BETA
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Chat options"
            className="flex h-9 w-9 items-center justify-center rounded-full outline-none active:bg-muted"
          >
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={startNewChat} disabled={isTyping}>
              <Plus className="mr-2 h-4 w-4" />
              New chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-success-soft px-3.5 py-2.5 text-[13px] font-medium text-foreground">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-2">
              <img
                src="/hero/hero-mascot.png"
                alt=""
                className="h-9 w-9 shrink-0 rounded-full bg-primary-soft object-cover object-top"
              />
              <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border border-border/60 bg-card px-3.5 py-2.5 shadow-card">
                <div className={MD}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {m.tableData && m.tableData.length > 0 && <ResultTable rows={m.tableData} />}
                {m === last && m.id !== "1" && (
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Data from your restaurant · {timeAgo(m.timestamp.getTime())}
                  </p>
                )}
              </div>
            </div>
          ),
        )}

        {isTyping && (
          <div className="flex items-center gap-2">
            <img
              src="/hero/hero-mascot.png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full bg-primary-soft object-cover object-top"
            />
            <div className="flex gap-1 rounded-2xl border border-border/60 bg-card px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pl-11">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-full border border-primary/40 bg-card px-3 py-1.5 text-left text-[12px] font-semibold text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showFollowUps && (
          <div className="flex gap-2 pl-11">
            <Link
              to="/dashboard/food-cost"
              className="flex-1 rounded-full border border-primary px-3 py-2 text-center text-[12px] font-semibold text-primary"
            >
              View Food Cost
            </Link>
            <Link
              to="/dashboard/branches"
              className="flex-1 rounded-full border border-primary px-3 py-2 text-center text-[12px] font-semibold text-primary"
            >
              Compare Branches
            </Link>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="shrink-0 border-t border-border/60 bg-card px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-4 pr-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your restaurant..."
            disabled={isTyping}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
              (!input.trim() || isTyping) && "opacity-50",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
