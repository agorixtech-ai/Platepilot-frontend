import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Bot, X, Send, Expand } from "lucide-react";
import { ResultTable } from "@/components/dashboard/ResultTable";
import { useAgentChat } from "@/hooks/useAgentChat";

const MAX_CHARS = 2000;

const MARKDOWN_CLASSES =
  "text-sm leading-relaxed [&_h1]:mb-1 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5";

/**
 * Floating glowing Pilot AI launcher with an inline chat panel. Shares the active
 * conversation with the /dashboard/ai page via useAgentChat, so a chat started here
 * continues there (and vice versa).
 *
 * Colors come from the design-system tokens (--primary, card, border, ...) so the
 * widget follows the light/dark theme automatically.
 */
export function FloatingAiAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, sendQuestion } = useAgentChat();

  // Close when clicking outside the panel (but not on the launcher button itself).
  useEffect(() => {
    if (!isChatOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (chatRef.current && !chatRef.current.contains(target) && !target.closest(".floating-ai-button")) {
        setIsChatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatOpen]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isTyping, isChatOpen]);

  const handleSend = () => {
    const question = message.trim();
    if (!question || isTyping) return;
    setMessage("");
    sendQuestion(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating glowing launcher */}
      <button
        aria-label={isChatOpen ? "Close Pilot AI" : "Ask Pilot AI"}
        className={`floating-ai-button relative flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground transition-all duration-500 ${
          isChatOpen ? "rotate-90" : "rotate-0"
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
          boxShadow:
            "0 0 20px color-mix(in oklab, var(--primary) 55%, transparent), 0 0 40px color-mix(in oklab, var(--primary) 35%, transparent), 0 0 60px color-mix(in oklab, var(--primary) 20%, transparent)",
          border: "2px solid color-mix(in oklab, var(--primary-foreground) 20%, transparent)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        <div className="relative z-10">
          {isChatOpen ? <X className="h-7 w-7" /> : <Bot className="h-8 w-8" />}
        </div>
        <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
      </button>

      {/* Chat panel */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[min(420px,calc(100vw-3rem))] origin-bottom-right"
          style={{ animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
        >
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-3xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium text-muted-foreground">Pilot AI</span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/dashboard/ai"
                  aria-label="Open full chat"
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                  onClick={() => setIsChatOpen(false)}
                >
                  <Expand className="h-4 w-4" />
                </Link>
                <button
                  aria-label="Close"
                  onClick={() => setIsChatOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thread */}
            <div ref={threadRef} className="max-h-[50vh] min-h-[200px] overflow-y-auto p-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 ${
                        m.tableData && m.tableData.length > 0 ? "max-w-[95%]" : "max-w-[85%]"
                      } ${
                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className={MARKDOWN_CLASSES}>
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      )}
                      {m.tableData && m.tableData.length > 0 && <ResultTable rows={m.tableData} />}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-muted px-3.5 py-2.5">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  autoFocus
                  className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-transparent px-3 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                  style={{ scrollbarWidth: "none" }}
                  placeholder="Ask about sales, waste, purchases…"
                  disabled={isTyping}
                />
                <button
                  aria-label="Send"
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  className="rounded-xl bg-primary p-2.5 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary-dark active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .floating-ai-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 30px color-mix(in oklab, var(--primary) 70%, transparent),
                      0 0 50px color-mix(in oklab, var(--primary) 45%, transparent),
                      0 0 70px color-mix(in oklab, var(--primary) 25%, transparent);
        }
      `}</style>
    </div>
  );
}
