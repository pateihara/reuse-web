// src/app/(site)/cadastro/page.js
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Cadastro | ReUse",
};

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12">
      <div className="breadcrumbs text-sm opacity-70">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li>Cadastro</li>
        </ul>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 items-start">
        <div className="card bg-base-200 rounded-3xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold">Crie sua conta</h1>
            <p className="mt-2 opacity-80">
              Cadastre-se para publicar itens, conversar e concluir trocas com segurança.
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 opacity-80 text-sm">
              <li>Publique itens para troca</li>
              <li>Negocie pelo chat</li>
              <li>Avalie após concluir</li>
            </ul>

            <p className="mt-6 text-sm">
              Já tem conta?{" "}
              <Link className="link link-primary" href="/login">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <div className="card bg-base-100 rounded-3xl shadow">
          <div className="card-body">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}