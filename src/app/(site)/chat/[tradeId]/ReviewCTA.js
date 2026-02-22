// src/app/(site)/chat/[tradeId]/ReviewCTA.js
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ReviewCTA({ tradeId, tradeStatus, requesterId, ownerId, userId }) {
  const [checking, setChecking] = useState(false);
  const [reviewExists, setReviewExists] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const reviewedId = useMemo(() => {
    if (!userId) return "";
    return String(userId) === String(requesterId) ? ownerId : requesterId;
  }, [userId, requesterId, ownerId]);

  async function checkReview() {
    if (tradeStatus !== "DONE") return;
    if (!tradeId) return;

    try {
      setChecking(true);
      const res = await fetch(`/api/reviews?tradeId=${tradeId}`, { cache: "no-store" });
      if (!res.ok) {
        setReviewExists(false);
        setCheckedOnce(true);
        return;
      }
      const json = await res.json();
      setReviewExists(!!json?.exists);
      setCheckedOnce(true);
    } catch {
      setReviewExists(false);
      setCheckedOnce(true);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    checkReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId, tradeStatus]);

  useEffect(() => {
    function onFocus() {
      checkReview();
    }
    function onVisibility() {
      if (document.visibilityState === "visible") checkReview();
    }
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId, tradeStatus]);

  if (tradeStatus !== "DONE") return null;
  if (!userId) return null;

  if (checkedOnce && reviewExists) {
    return (
      <div className="alert alert-success flex items-center justify-between">
        <span>Avaliação enviada ✅</span>
        <span className="badge badge-outline">Trade finalizado</span>
      </div>
    );
  }

  if (checking && !checkedOnce) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Verificando avaliação...</span>
        <span className="loading loading-spinner loading-sm" />
      </div>
    );
  }

  return (
    <div className="alert flex items-center justify-between">
      <span>Troca concluída. Quer avaliar o usuário?</span>
      <Link className="btn btn-sm btn-primary" href={`/avaliar-usuario/${reviewedId}?tradeId=${tradeId}`}>
        Avaliar
      </Link>
    </div>
  );
}