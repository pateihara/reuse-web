// src/app/(site)/login/page.js
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-10"><div className="skeleton h-40 w-full" /></div>}>
      <LoginClient />
    </Suspense>
  );
}