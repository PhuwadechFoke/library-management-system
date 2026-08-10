"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, MessageCircle, Send, X, Loader2, AlertCircle, Trash2, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suggestedQuestions } from "@/lib/chatbotFaq";

const welcomeMessage = {
  role: "bot",
  isWelcome: true,
  text: "สวัสดีครับ! ผมคือ LibraryBot ผู้ช่วย AI ของห้องสมุด 🤖\nพิมพ์คำถามอะไรก็ได้เลยครับ — ไม่ว่าจะเรื่องห้องสมุดหรือเรื่องทั่วไป",
};

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  // countdown สำหรับ rate limit (วินาที, null = ไม่ได้ถูก limit)
  const [rateLimitCountdown, setRateLimitCountdown] = useState(null);
  // เก็บคำถามล่าสุดไว้สำหรับ retry
  const pendingRetry = useRef(null);
  const countdownRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, rateLimitCountdown]);

  // Focus on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Cleanup countdown on unmount
  useEffect(() => () => clearInterval(countdownRef.current), []);

  /** เริ่ม countdown แล้ว retry อัตโนมัติเมื่อหมดเวลา */
  function startRateLimitCountdown(seconds, questionToRetry) {
    pendingRetry.current = questionToRetry;
    setRateLimitCountdown(seconds);

    let remaining = seconds;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        setRateLimitCountdown(null);
        // Retry อัตโนมัติ
        if (pendingRetry.current) {
          const q = pendingRetry.current;
          pendingRetry.current = null;
          sendMessage(q, true); // isRetry = true (ไม่เพิ่ม user bubble ซ้ำ)
        }
      } else {
        setRateLimitCountdown(remaining);
      }
    }, 1000);
  }

  const sendMessage = useCallback(async (text, isRetry = false) => {
    if (!text?.trim() || isLoading) return;

    // ถ้าไม่ใช่ retry ให้เพิ่ม user bubble
    if (!isRetry) {
      setMessages((prev) => [...prev, { role: "user", text }]);
      setInput("");
    }
    setIsLoading(true);

    try {
      // ดึง messages ปัจจุบัน (ต้องใช้ functional update เพื่อให้ได้ค่าล่าสุด)
      const currentMessages = await new Promise((resolve) => {
        setMessages((prev) => {
          resolve(prev);
          return prev;
        });
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          userMessage: text,
        }),
      });

      const data = await response.json();

      if (response.status === 429 && data.error === "RATE_LIMITED") {
        const waitSec = data.retryAfter ?? 20;
        // เพิ่ม error bubble พร้อมข้อมูล retry
        setMessages((prev) => [
          ...prev,
          { role: "bot", isRateLimit: true, retryAfter: waitSec, text: "" },
        ]);
        startRateLimitCountdown(waitSec, text);
        return;
      }

      if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", isError: true, text: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  function ask(question) {
    const text = question.trim();
    if (!text || isLoading || rateLimitCountdown !== null) return;
    sendMessage(text);
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  }

  function handleClear() {
    clearInterval(countdownRef.current);
    setRateLimitCountdown(null);
    pendingRetry.current = null;
    setMessages([welcomeMessage]);
    setInput("");
  }

  /** ยกเลิก countdown และ retry ทันที */
  function handleRetryNow() {
    clearInterval(countdownRef.current);
    setRateLimitCountdown(null);
    const q = pendingRetry.current;
    pendingRetry.current = null;
    if (q) sendMessage(q, true);
  }

  const isBlocked = isLoading || rateLimitCountdown !== null;
  const showSuggestions = messages.length === 1;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section
          className="mb-3 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
          style={{ animation: "slideUp 0.2s ease-out" }}
        >
          {/* Header */}
          <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold leading-tight">LibraryBot AI</p>
                <p className="text-xs opacity-80">ตอบได้ทุกคำถาม • Powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <Button
                  type="button" variant="ghost" size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
                  onClick={handleClear} title="ล้างบทสนทนา"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button" variant="ghost" size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
                onClick={() => setIsOpen(false)} aria-label="ปิดแชท"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                style={{ animation: "fadeIn 0.2s ease-out" }}
              >
                {message.role === "bot" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {message.isError ? (
                      <AlertCircle className="h-3 w-3 text-destructive" />
                    ) : message.isRateLimit ? (
                      <Clock className="h-3 w-3 text-amber-500" />
                    ) : (
                      <Bot className="h-3 w-3 text-primary" />
                    )}
                  </div>
                )}

                {/* Rate limit bubble */}
                {message.isRateLimit ? (
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-amber-200 bg-amber-50 px-3 py-2 text-sm dark:border-amber-800 dark:bg-amber-950">
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      ⏳ คำขอเยอะเกินไป
                    </p>
                    {rateLimitCountdown !== null ? (
                      <>
                        <p className="mt-0.5 text-amber-600 dark:text-amber-500">
                          กำลัง retry อัตโนมัติใน{" "}
                          <span className="font-mono font-bold">{rateLimitCountdown}</span> วินาที
                        </p>
                        <button
                          onClick={handleRetryNow}
                          className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-700 underline hover:no-underline dark:text-amber-400"
                        >
                          <RefreshCw className="h-3 w-3" />
                          ลอง retry เดี๋ยวนี้
                        </button>
                      </>
                    ) : (
                      <p className="mt-0.5 text-amber-600 dark:text-amber-500">กำลัง retry…</p>
                    )}
                  </div>
                ) : (
                  <p
                    className={
                      message.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : message.isError
                        ? "max-w-[80%] rounded-2xl rounded-bl-sm bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        : "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm"
                    }
                  >
                    {message.text}
                  </p>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start" style={{ animation: "fadeIn 0.2s ease-out" }}>
                <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {showSuggestions && (
            <div className="border-t px-3 pt-2 pb-0">
              <p className="mb-1.5 text-xs text-muted-foreground">คำถามยอดนิยม</p>
              <div className="flex flex-wrap gap-1.5 pb-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => ask(question)}
                    disabled={isBlocked}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-3">
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  rateLimitCountdown !== null
                    ? `รอ ${rateLimitCountdown}s แล้ว retry อัตโนมัติ…`
                    : "พิมพ์คำถามอะไรก็ได้..."
                }
                disabled={isBlocked}
                className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary disabled:opacity-50"
                aria-label="ช่องพิมพ์คำถาม"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isBlocked || !input.trim()}
                aria-label="ส่งคำถาม"
                className="rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : rateLimitCountdown !== null ? (
                  <span className="text-xs font-mono font-bold">{rateLimitCountdown}</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </section>
      )}

      {/* Toggle button */}
      <Button
        type="button"
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "ปิดแชท" : "เปิดแชท AI ผู้ช่วย"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
