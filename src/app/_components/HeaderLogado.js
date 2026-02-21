import Link from "next/link";
import Image from "next/image";

export default function HeaderLogado() {
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
            <li><Link href="/baixar-app">Baixar App</Link></li>
          </ul>

          <label className="input input-bordered flex items-center gap-2 w-[280px]">
            <input className="grow" placeholder="Busque seu produto" />
            <span className="opacity-60">🔍</span>
          </label>
        </div>

        <div className="navbar-end gap-2">
          <button className="btn btn-ghost btn-circle" aria-label="Notificações">
            🔔
          </button>

          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-9">
                <span>F</span>
              </div>
            </button>
            <ul tabIndex={0} className="menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
              <li><Link href="/meus-produtos">Meus produtos</Link></li>
              <li><Link href="/produtos-trocados">Produtos trocados</Link></li>
              <li><Link href="/publicar-item">Publicar item</Link></li>
              <li><a href="#">Sair</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}