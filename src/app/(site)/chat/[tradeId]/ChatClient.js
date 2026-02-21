"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

function subscribeStorage(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("reuse_user_id") || "";
}

function getServerSnapshot() {
  return "";
}

export default function ChatClient({ tradeId, initialMessages }) {
  const router = useRouter();

  const senderId = useSyncExternalStore(subscribeStorage, getSnapshot, getServerSnapshot);

  const [messages, setMessages] = useState(initialMessages || []);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!senderId) {
      router.push("/login");
      return;
    }
    if (!text.trim()) return;

    setSending(true);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tradeId,
        senderId: String(senderId),
        content: text,
      }),
    });

    if (!res.ok) {
      alert(await res.text());
      setSending(false);
      return;
    }

    const msg = await res.json();
    setMessages((prev) => [...prev, msg]);
    setText("");
    setSending(false);

    router.refresh();
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body space-y-3">
        <p className="font-semibold">Chat</p>

        <div className="min-h-[260px] bg-base-200 rounded-lg p-3 space-y-2">
          {messages.length ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`chat ${String(m.senderId) === String(senderId) ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-bubble">{m.content}</div>
              </div>
            ))
          ) : (
            <p className="text-sm opacity-70">Sem mensagens ainda.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="input input-bordered w-full"
            placeholder="Digite sua mensagem..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={sending}
          />
          <button className="btn btn-primary" onClick={send} disabled={sending}>
            {sending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}