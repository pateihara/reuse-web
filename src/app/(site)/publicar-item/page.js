//src/app/(site)/publicar-item/page.js
// src/app/(site)/publicar-item/page.js
import { Suspense } from "react";
import { redirect } from "next/navigation";
import PublishItemClient from "./PublishItemClient";
import { getUserIdFromCookies } from "@/lib/getUserFromCookies";

export default async function PublicarItemPage({ searchParams }) {
  const userId = await getUserIdFromCookies();

  // Se não estiver logado, manda pro login e volta depois
  if (!userId) {
    const sp = await searchParams; // Next 16: pode ser Promise
    const qs = new URLSearchParams(sp || {});
    const current = `/publicar-item${qs.toString() ? `?${qs.toString()}` : ""}`;

    redirect(`/login?redirect=${encodeURIComponent(current)}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Publicar item</h1>

      <Suspense fallback={<div className="skeleton h-40 w-full" />}>
        <PublishItemClient />
      </Suspense>
    </div>
  );
}