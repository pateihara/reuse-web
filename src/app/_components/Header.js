// src/app/_components/Header.js
import HeaderPublico from "./HeaderPublico";
import HeaderLogado from "./HeaderLogado";
import { getUserIdFromCookies } from "@/lib/getUserFromCookies";

export default async function Header() {
  const userId = await getUserIdFromCookies();
  if (!userId) return <HeaderPublico />;
  return <HeaderLogado userName="" />;
}