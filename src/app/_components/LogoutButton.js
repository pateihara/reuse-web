//src/app/_components/LogoutButton.js

"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button className="w-full text-left" onClick={logout}>
      Sair
    </button>
  );
}