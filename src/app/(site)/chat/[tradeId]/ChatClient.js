// src/app/(site)/chat/[tradeId]/ChatClient.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatClient({ tradeId, userId }) {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);

  const [canSend, setCanSend] = useState(true);
  const [tradeStatus, setTradeStatus] = useState("");

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function loadMessages() {
    setLoadingMsgs(true);

    const res = await fetch(`/api/messages?tradeId=${tradeId}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (res.status === 401) {
      router.push(`/login?redirect=/chat/${tradeId}`);
      return;
    }

    if (!res.ok) {
      setMessages([]);
      setLoadingMsgs(false);
      return;
    }

    const json = await res.json();
    setMessages(json?.messages || []);
    setCanSend(!!json?.canSend);
    setTradeStatus(json?.tradeStatus || "");
    setLoadingMsgs(false);
  }

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  async function send() {
    // ✅ não tenta enviar se o chat estiver encerrado
    if (!canSend) return;

    if (!text.trim()) return;

    setSending(true);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tradeId, content: text }),
    });

    if (res.status === 401) {
      setSending(false);
      router.push(`/login?redirect=/chat/${tradeId}`);
      return;
    }

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
          {loadingMsgs ? (
            <div className="skeleton h-24 w-full" />
          ) : messages.length ? (
            messages.map((m) => {
              const mine = userId && String(m.senderId) === String(userId);
              return (
                <div key={m.id} className={`chat ${mine ? "chat-end" : "chat-start"}`}>
                  <div className="chat-bubble">{m.content}</div>
                </div>
              );
            })
          ) : (
            <p className="text-sm opacity-70">Sem mensagens ainda.</p>
          )}
        </div>

        {/* ✅ Se o chat está encerrado, não renderiza input */}
        {!loadingMsgs && !canSend ? (
          <div className="alert alert-warning">
            <span>
              Conversa encerrada. Não é possível enviar novas mensagens
              {tradeStatus ? ` (status: ${tradeStatus}).` : "."}
            </span>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="input input-bordered w-full"
              placeholder="Digite sua mensagem..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={sending || !canSend}
            />
            <button className="btn btn-primary" onClick={send} disabled={sending || !canSend}>
              {sending ? "..." : "Enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}