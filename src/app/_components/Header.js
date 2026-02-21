"use client";

import HeaderPublico from "./HeaderPublico";
import HeaderLogado from "./HeaderLogado";

export default function Header() {
  // por enquanto: simulação. depois você liga no auth (cookie/localStorage)
  const isLogged = false;

  return isLogged ? <HeaderLogado /> : <HeaderPublico />;
}