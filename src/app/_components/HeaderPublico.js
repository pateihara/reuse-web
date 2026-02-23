// src/app/_components/HeaderPublico.js
import Link from "next/link";
import Image from "next/image";

export default function HeaderPublico() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100 shadow">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="navbar-start">
          <Link href="/" className="inline-flex items-center px-1">
            <Image
              src="/assets/reuse_logo.svg"
              alt="ReUse"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="navbar-center hidden md:flex gap-2">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/">Início</Link></li>
            <li><Link href="/buscar">Produtos</Link></li>
          </ul>

          <label className="input input-bordered flex items-center gap-2 w-[280px]">
            <input className="grow" placeholder="Busque seu produto" />
            <span className="opacity-60">🔍</span>
          </label>
        </div>

        <div className="navbar-end gap-2">
          <Link href="/login" className="btn btn-ghost">Entrar</Link>
          <Link href="/publicar-item" className="btn btn-primary">Publicar Item</Link>
        </div>
      </div>
    </header>
  );
}