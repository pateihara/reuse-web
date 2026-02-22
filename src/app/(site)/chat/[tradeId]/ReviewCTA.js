//src/app/(site)/chat/[tradeId]/ReviewCTA.js

"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribeStorage(cb) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function getSnapshot() {
  return localStorage.getItem("reuse_user_id") || "";
}
function getServerSnapshot() {
  return "";
}

export default function ReviewCTA({ tradeId, tradeStatus, requesterId, ownerId }) {
  const userId = useSyncExternalStore(subscribeStorage, getSnapshot, getServerSnapshot);

  if (tradeStatus !== "DONE") return null;
  if (!userId) return null;

  const reviewedId = String(userId) === String(requesterId) ? ownerId : requesterId;

  return (
    <div className="alert flex items-center justify-between">
      <span>Troca concluída. Quer avaliar o usuário?</span>
      <Link className="btn btn-sm btn-primary" href={`/avaliar-usuario/${reviewedId}?tradeId=${tradeId}`}>
        Avaliar
      </Link>
    </div>
  );
}