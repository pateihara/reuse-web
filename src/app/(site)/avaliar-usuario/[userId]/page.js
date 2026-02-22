//src/app/(site)/avaliar-usuario/[userId]/page.js
import { prisma } from "@/lib/prisma";
import ReviewFormClient from "./ReviewFormClient";

export default async function AvaliarUsuarioPage({ params, searchParams }) {
  const { userId } = await params;
  const sp = await searchParams;
  const tradeId = sp?.tradeId || "";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, username: true, avatarUrl: true, city: true, state: true },
  });

  if (!user) return <div className="p-6">Usuário não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Avaliar usuário</h1>
          <p className="opacity-80">
            Você está avaliando <span className="font-semibold">{user.name}</span>{" "}
            {user.username ? <span className="opacity-70">@{user.username}</span> : null}
          </p>
          <p className="text-sm opacity-70">
            {user.city || "—"} {user.state ? `- ${user.state}` : ""}
          </p>
        </div>
      </div>

      <ReviewFormClient tradeId={tradeId} reviewedId={user.id} />
    </div>
  );
}