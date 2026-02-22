// src/app/(site)/login/page.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const redirect = useMemo(() => sp.get("redirect") || "/buscar", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Falha no login");
      }

      const json = await res.json();

      router.push(redirect);
      router.refresh();
      window.dispatchEvent(new Event("reuse_auth")); // 🔥 atualiza componentes na mesma aba

      router.push(redirect);
    } catch (err) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow">
        <div className="card-body space-y-3">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm opacity-70">Entre para continuar.</p>

          {error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teste@reuse.com"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Senha</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
                required
              />
            </label>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="divider my-1" />

          <p className="text-xs opacity-70">
            (MVP) Salva <code>reuse_user_id</code> no localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}