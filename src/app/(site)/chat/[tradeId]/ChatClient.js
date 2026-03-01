// src/app/(site)/chat/[tradeId]/ChatClient.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatClient({ tradeId, userId }) {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);

  const [canSend, setCanSend] = useState(true);
  const [tradeStatus, setTradeStatus] = useState("");

  const [iConfirmed, setIConfirmed] = useState(false);
  const [otherConfirmed, setOtherConfirmed] = useState(false);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ evita setState depois de unmount + evita overlap de requests
  const aliveRef = useRef(true);
  const inFlightRef = useRef(false);

  async function loadMessages({ silent = false } = {}) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    if (!silent) setLoadingMsgs(true);

    try {
      const res = await fetch(`/api/messages?tradeId=${tradeId}`, {
        cache: "no-store",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push(`/login?redirect=/chat/${tradeId}`);
        return;
      }

      if (!res.ok) {
        if (aliveRef.current) {
          setMessages([]);
          setCanSend(false);
          setTradeStatus("");
          setIConfirmed(false);
          setOtherConfirmed(false);
          setLoadingMsgs(false);
        }
        return;
      }

      const json = await res.json();

      if (!aliveRef.current) return;

      setMessages(json?.messages || []);
      setCanSend(!!json?.canSend);
      setTradeStatus(json?.tradeStatus || "");
      setIConfirmed(!!json?.iConfirmed);
      setOtherConfirmed(!!json?.otherConfirmed);
      setLoadingMsgs(false);
    } catch (e) {
      console.error(e);
      if (aliveRef.current) setLoadingMsgs(false);
    } finally {
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    aliveRef.current = true;
    loadMessages();

    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  // ✅ poll leve enquanto o trade estiver ativo
  useEffect(() => {
    const active = ["PENDING", "CHAT_ACTIVE", "TRADE_MARKED"].includes(tradeStatus);
    if (!active) return;

    const id = setInterval(() => {
      loadMessages({ silent: true });
    }, 8000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeStatus, tradeId]);

  async function send() {
    if (!canSend) return;
    if (!text.trim()) return;

    setSending(true);

    try {
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

      // mantém sincronizado (status/confirm/etc)
      loadMessages({ silent: true });
      router.refresh();
    } catch (e) {
      console.error(e);
      setSending(false);
      alert("Erro de rede ao enviar mensagem.");
    }
  }

  const showConfirmBanner =
    !loadingMsgs && canSend && ["CHAT_ACTIVE", "TRADE_MARKED"].includes(tradeStatus);

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body space-y-3">
        <p className="font-semibold">Chat</p>

        {showConfirmBanner ? (
          iConfirmed && !otherConfirmed ? (
            <div className="alert alert-info">
              <span>Você já confirmou. Aguardando o outro usuário confirmar…</span>
            </div>
          ) : !iConfirmed && otherConfirmed ? (
            <div className="alert alert-warning">
              <span>O outro usuário já confirmou. Falta você confirmar para concluir.</span>
            </div>
          ) : null
        ) : null}

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