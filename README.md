# ReUse Web (FIAP) — Next.js + Prisma + Postgres

Plataforma web do projeto **ReUse**, focada em facilitar a **troca de itens entre pessoas próximas**, incentivando **reutilização e sustentabilidade**.

- **Deploy:** https://reuse-web.vercel.app  
- **Repositório:** https://github.com/pateihara/reuse-web

---

## 📌 Stack

- **Next.js 16 (App Router)** — JavaScript (sem TS)
- **Tailwind CSS v4 + DaisyUI**
  - `globals.css`:
    - `@import "tailwindcss";`
    - `@plugin "daisyui";`
  - `postcss.config.mjs`:
    - `export default { plugins: { "@tailwindcss/postcss": {} } };`
- **Prisma ORM + Postgres**
  - Banco: **Prisma Postgres (db.prisma.io)**
  - Driver/Adapter: `pg` + `@prisma/adapter-pg`
- **Auth (MVP):** cookie **HttpOnly** `reuse_session` com token assinado (HMAC SHA256)

---

## ✅ Funcionalidades

### Itens
- Criar item (publicação)
- Buscar itens com filtros (apenas `ACTIVE`)
- Detalhe do item
- Atualizar item / alterar status (inclui soft delete)

### Trocas (Trades)
Fluxo de status:
- `PENDING` → `CHAT_ACTIVE` → `TRADE_MARKED` → `DONE` / `CANCELED`

Regras:
- `acceptedByOwner`: `null` (pendente), `true` (aceito), `false` (recusado)
- Conclusão exige confirmação dos dois lados:
  - `requesterDone` e `ownerDone`
- Ao finalizar (`DONE`):
  - `completedAt` definido
  - itens envolvidos marcados como `TRADED`

### Chat
- GET retorna `{ tradeStatus, canSend, messages }`
- POST bloqueia envio quando:
  - trade `DONE`/`CANCELED`
  - item `DELETED`
- UI esconde input quando `canSend = false`

### Avaliação
- Aparece após `DONE`
- 1 review por trade
- POST cookie-based (não recebe `reviewerId` no client)

---

## 🧭 Rotas (Telas)

Páginas principais (route group `(site)`):
- `/` — Home
- `/login`
- `/buscar`
- `/produto/[id]`
- `/publicar-item`
- `/meus-produtos`
- `/produtos-trocados`
- `/chats`
- `/chat/[tradeId]`
- `/avaliar-usuario/[userId]`

Institucionais:
- `/sobre`
- `/como-funciona`
- `/contato`
- `/ajuda`

---

## 🔌 Rotas de API (App Router)

> Local: `src/app/api/**`

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (debug)

### Itens
- `GET /api/items` (somente `ACTIVE` + filtros)
- `POST /api/items`
- `GET /api/items/[id]`
- `PATCH /api/items/[id]`
- `PUT /api/items/[id]`

### Itens do usuário
- `GET /api/my-items` (cookie-based)

### Trades
- `POST /api/trades` (cookie-based)
- `PATCH /api/trades/[id]` (actions: `ACCEPT`, `REJECT`, `CANCEL`, `MARK_MEET`, `CONFIRM_DONE`)

### Chat / Mensagens
- `GET /api/messages` (cookie-based)
- `POST /api/messages` (cookie-based)

### Reviews
- `GET /api/reviews` (exists)
- `POST /api/reviews` (cookie-based, 1 por trade)

### Conversas
- `GET /api/my-chats`

### (Se existir)
- `GET /api/my-trades`

---

## 🗄️ Banco de Dados (Prisma Schema)

Entidades principais:
- `User`
- `Item`
- `ItemImage`
- `Trade`
- `Message`
- `Review`
- `ReviewImage`
- `Favorite`

Enums:
- `ItemStatus`: `ACTIVE`, `PAUSED`, `TRADED`, `DELETED`
- `TradeStatus`: `PENDING`, `CHAT_ACTIVE`, `TRADE_MARKED`, `DONE`, `CANCELED`

---

## ▶️ Como rodar localmente

### 1) Pré-requisitos
- Node.js (recomendado LTS)
- Conta/banco Postgres (Prisma Postgres / db.prisma.io)

### 2) Instalar dependências
```bash
npm install
```

### 3) Variáveis de ambiente
Crie um arquivo `.env.local` na raiz:

```env
# Postgres
DATABASE_URL="postgresql://..."
# (se você também usa)
PRISMA_DATABASE_URL="postgresql://..."

# Auth (cookie HMAC)
AUTH_SECRET="sua-chave-secreta-longa"
```

> Observação: no deploy Vercel as envs ficam em Project Settings → Environment Variables.

### 4) Prisma
```bash
npx prisma generate
```

Se você usa migrations (opcional):
```bash
npx prisma migrate dev
```

### 5) Rodar em dev
```bash
npm run dev
```

Acesse:
- http://localhost:3000

### 6) Build + start (modo produção local)
```bash
npm run build
npm run start
```

---

## 🚀 Deploy (Vercel)

Scripts no `package.json`:
- `build`: `prisma generate && next build`
- `postinstall`: `prisma generate`

Variáveis na Vercel:
- `DATABASE_URL`
- `PRISMA_DATABASE_URL` (se aplicável)
- `AUTH_SECRET`

---

## 📁 Estrutura de pastas (resumo)

- `src/app/(site)` — páginas do site
- `src/app/api` — rotas de API (Next.js Route Handlers)
- `src/app/_components` — componentes reutilizáveis (Header/Footer/UI)
- `src/lib/prisma.js` — Prisma Client
- `src/lib/auth.js` — auth por cookie (HMAC)
- `prisma/schema.prisma` — schema do banco

---

## 🧪 Notas importantes

- Next 16: `params/searchParams` podem ser Promise em alguns cenários.
- Páginas que usam `useSearchParams` precisam de `Suspense` no `page.js` (client components).

---

## 👤 Autores

Rafael Araújo Santos
Patrícia Sayuri Eihara
Natalia Silva Guaita