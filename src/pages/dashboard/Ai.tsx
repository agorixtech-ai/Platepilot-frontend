import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResultTable } from "@/components/dashboard/ResultTable";
import { useConversations, useDeleteConversation } from "@/hooks/useApi";
import { useAgentChat, reviveMessages } from "@/hooks/useAgentChat";
import { conversationsApi } from "@/lib/api";

function RouteComponent() {
  const { conversationId, messages, isTyping, sendQuestion, startNewChat, openConversation } =
    useAgentChat();
  const conversations = useConversations();
  const deleteConversation = useDeleteConversation();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = async (id: string) => {
    if (id === conversationId) return;
    try {
      const res = await conversationsApi.get(id);
      openConversation(id, reviveMessages(res.messages));
    } catch {
      conversations.refetch(); // it was deleted elsewhere — refresh the list
    }
  };

  const handleDelete = (id: string) => {
    deleteConversation.mutate(id);
    if (id === conversationId) startNewChat();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const question = input;
    setInput("");
    await sendQuestion(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pilot AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your intelligent restaurant assistant
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={startNewChat}
          disabled={isTyping}
          className="gap-1.5 text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New chat
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <Card className="hidden w-64 shrink-0 flex-col overflow-hidden border-border/80 bg-card/50 backdrop-blur-xl md:flex">
          <div className="border-b border-border/50 px-4 py-3 text-sm font-semibold text-foreground">
            Chat history
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-0.5 p-2">
              {(conversations.data?.items ?? []).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpen(c.id)}
                  className={`group flex cursor-pointer items-center justify-between gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-muted ${
                    c.id === conversationId ? "bg-muted" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              {conversations.data?.items.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">No saved chats yet.</p>
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="flex flex-1 flex-col overflow-hidden border-border/80 bg-card/50 backdrop-blur-xl">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.tableData && message.tableData.length > 0
                        ? "max-w-[90%]"
                        : "max-w-[70%]"
                    } ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="text-sm leading-relaxed [&_h1]:mb-1 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                    {message.tableData && message.tableData.length > 0 && (
                      <ResultTable rows={message.tableData} />
                    )}
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RouteComponent;
