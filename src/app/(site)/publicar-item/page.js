//src/app/(site)/publicar-item/page.js
import { Suspense } from "react";
import PublishItemClient from "./PublishItemClient";

export default function PublicarItemPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Publicar item</h1>

      <Suspense fallback={<div className="skeleton h-40 w-full" />}>
        <PublishItemClient />
      </Suspense>
    </div>
  );
}