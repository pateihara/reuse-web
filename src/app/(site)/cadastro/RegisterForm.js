// src/app/(site)/cadastro/RegisterForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    // normalizar campos vazios
    ["username", "city", "state"].forEach((k) => {
      if (!payload[k] || String(payload[k]).trim() === "") delete payload[k];
    });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error || "Não foi possível cadastrar.");
        return;
      }

      setMsg("Cadastro realizado! Você já pode entrar.");
      // redireciona pro login
      router.push("/login");
      router.refresh();
    } catch {
      setMsg("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h2 className="text-xl font-semibold">Dados da conta</h2>

      <input
        name="name"
        className="input input-bordered w-full"
        placeholder="Nome"
        required
      />

      <input
        name="email"
        type="email"
        className="input input-bordered w-full"
        placeholder="E-mail"
        required
      />

      <input
        name="password"
        type="password"
        className="input input-bordered w-full"
        placeholder="Senha (mín. 6 caracteres)"
        minLength={6}
        required
      />

      <div className="divider my-2 opacity-60">Opcional</div>

      <input
        name="username"
        className="input input-bordered w-full"
        placeholder="Username (opcional)"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="city"
          className="input input-bordered w-full"
          placeholder="Cidade (opcional)"
        />
        <input
          name="state"
          className="input input-bordered w-full"
          placeholder="UF (opcional)"
          maxLength={2}
        />
      </div>

      {msg ? (
        <div className="alert">
          <span>{msg}</span>
        </div>
      ) : null}

      <button className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar conta"}
      </button>

      <p className="text-xs opacity-70">
        Ao criar sua conta, você concorda em usar o ReUse para trocas seguras e respeitosas.
      </p>
    </form>
  );
}