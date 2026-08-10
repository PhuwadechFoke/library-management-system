"use client";

import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFaqAnswer, suggestedQuestions } from "@/lib/chatbotFaq";

const welcomeMessage = {
  role: "bot",
  text: "สวัสดีครับ ผมช่วยตอบคำถามเกี่ยวกับการใช้งานห้องสมุดได้ ลองเลือกคำถามด้านล่างหรือพิมพ์คำถามของคุณได้เลย",
};

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);

  function ask(question) {
    const text = question.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "bot", text: getFaqAnswer(text) },
    ]);
    setInput("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section className="mb-3 flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-card shadow-2xl">
          <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5" /><div><p className="font-semibold">ผู้ช่วยห้องสมุด</p><p className="text-xs opacity-90">ตอบคำถามการใช้งานทั่วไป</p></div></div>
            <Button type="button" variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground" onClick={() => setIsOpen(false)} aria-label="ปิดแชท"><X className="h-5 w-5" /></Button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p className={message.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground" : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm"}>{message.text}</p>
              </div>
            ))}
          </div>

          <div className="border-t p-3">
            {messages.length === 1 && <div className="mb-3 flex flex-wrap gap-2">{suggestedQuestions.map((question) => <button key={question} type="button" onClick={() => ask(question)} className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted">{question}</button>)}</div>}
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="พิมพ์คำถาม..." className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <Button type="submit" size="icon" aria-label="ส่งคำถาม"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </section>
      )}
      <Button type="button" size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "ปิดแชท" : "เปิดแชทช่วยเหลือ"}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
