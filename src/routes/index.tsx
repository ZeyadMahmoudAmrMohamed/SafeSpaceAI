import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChatApi,
  EMPTY_CONTEXT,
  type ChatMetadata,
  type ContextAccumulated,
} from "@/lib/safespace-mock";
import { Sidebar } from "@/components/safespace/Sidebar";
import { MobileSidebar } from "@/components/safespace/MobileSidebar";
import { ChatHeader } from "@/components/safespace/ChatHeader";
import { CrisisBanner } from "@/components/safespace/CrisisBanner";
import { UserMessage } from "@/components/safespace/UserMessage";
import { BotMessage } from "@/components/safespace/BotMessage";
import { TypingIndicator } from "@/components/safespace/TypingIndicator";
import { ChatInput } from "@/components/safespace/ChatInput";
import { EmptyState } from "@/components/safespace/EmptyState";
import { ContextPanel } from "@/components/safespace/ContextPanel";
import { DotGrid } from "@/components/safespace/DotGrid";
import { Toaster } from "@/components/ui/sonner";
import { useSounds } from "@/hooks/use-sounds";

type Msg =
  | { id: string; role: "user"; text: string; time: string }
  | { id: string; role: "bot"; text: string; time: string; metadata: ChatMetadata };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeSpace — Judgment-free mental health support" },
      {
        name: "description",
        content:
          "A calm, AI-powered space to talk through anxiety, stress, and how you're feeling — with transparent emotion detection, evidence-based sources, and crisis support.",
      },
      { property: "og:title", content: "SafeSpace — Judgment-free mental health support" },
      {
        property: "og:description",
        content:
          "A calm conversational AI for mental health support. Emotion-aware, source-cited, with crisis resources always one tap away.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SafeSpace,
});

function fmtTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function SafeSpace() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [context, setContext] = useState<ContextAccumulated>(EMPTY_CONTEXT);
  const [isCrisis, setIsCrisis] = useState(false);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sounds = useSounds();
  const typingTickRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    sounds.setEnabled(soundOn);
  }, [soundOn, sounds]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // Soft typing pulses while the bot is thinking
  useEffect(() => {
    if (thinking) {
      typingTickRef.current = window.setInterval(() => sounds.play("typing"), 280);
    } else if (typingTickRef.current) {
      clearInterval(typingTickRef.current);
      typingTickRef.current = null;
    }
    return () => {
      if (typingTickRef.current) clearInterval(typingTickRef.current);
    };
  }, [thinking, sounds]);

  const send = async (text: string) => {
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text, time: fmtTime() };
    setMessages((m) => [...m, userMsg]);
    sounds.play("send");
    setThinking(true);
    try {
      const res = await ChatApi(text, context);
      setContext(res.metadata.context_accumulated);
      if (res.metadata.is_crisis) setIsCrisis(true);
      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "bot",
        text: res.response,
        time: fmtTime(),
        metadata: res.metadata,
      };
      setMessages((m) => [...m, botMsg]);
      sounds.play("receive");
    } catch {
      sounds.play("error");
    } finally {
      setThinking(false);
    }
  };

  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser || thinking) return;
    setMessages((m) => {
      let idx = -1;
      for (let i = m.length - 1; i >= 0; i--) {
        if (m[i].role === "bot") { idx = i; break; }
      }
      return idx === -1 ? m : [...m.slice(0, idx), ...m.slice(idx + 1)];
    });
    setThinking(true);
    try {
      const res = await ChatApi(lastUser.text, context);
      setContext(res.metadata.context_accumulated);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: res.response,
          time: fmtTime(),
          metadata: res.metadata,
        },
      ]);
      sounds.play("receive");
    } finally {
      setThinking(false);
    }
  };

  const clear = () => {
    setMessages([]);
    setContext(EMPTY_CONTEXT);
    setIsCrisis(false);
    setDraft("");
    sounds.play("open");
  };

  return (
    <div className="flex h-dvh w-full bg-background text-foreground selection:bg-primary/10 overflow-hidden">
      <Sidebar onNewChat={clear} onClear={clear} />
      <MobileSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onNewChat={clear}
        onClear={clear}
      />

      <main className="flex-1 flex flex-col relative h-full min-w-0">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
        />

        {isCrisis && <CrisisBanner />}

        {/* Subtle interactive dot field — fixed to the chat column, covers full height */}
        <div className="absolute inset-0 pointer-events-none opacity-60 z-0">
          <DotGrid spacing={26} dotRadius={1.1} cursorRadius={150} bulgeStrength={3.4} />
        </div>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto relative z-[1] safespace-scroll">
          <section
            className={`relative px-4 sm:px-8 py-8 sm:py-10 space-y-10 max-w-4xl mx-auto w-full ${
              messages.length === 0 ? "h-full flex items-center justify-center" : ""
            }`}
          >
            {messages.length === 0 && !thinking ? (
              <EmptyState onPick={(t) => setDraft(t)} />
            ) : (
              <>
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <UserMessage key={m.id} text={m.text} time={m.time} />
                  ) : (
                    <BotMessage
                      key={m.id}
                      text={m.text}
                      time={m.time}
                      metadata={m.metadata}
                      onRegenerate={
                        i === messages.length - 1 && !thinking ? regenerate : undefined
                      }
                    />
                  ),
                )}
                {thinking && <TypingIndicator />}
              </>
            )}
          </section>
        </div>

        <ChatInput
          onSend={send}
          disabled={thinking}
          draft={draft}
          onDraftChange={setDraft}
        />
      </main>

      <ContextPanel context={context} />
      <Toaster />
    </div>
  );
}
