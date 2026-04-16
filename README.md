# ReUse Web (FIAP) — Next.js + Prisma + Postgres

Plataforma web do projeto **ReUse**, focada em facilitar a **troca de itens entre pessoas próximas**, incentivando **reutilização e sustentabilidade**.

- **Deploy (Vercel):** https://reuse-web.vercel.app  
- **Repositório:** https://github.com/pateihara/reuse-web

---

## 📌 Stack

- **Next.js 16 (App Router)** — JavaScript (sem TypeScript)
- **Turbopack** em desenvolvimento
- **Tailwind CSS v4 + DaisyUI**
  - `globals.css`:
    - `@import "tailwindcss";`
    - `@plugin "daisyui";`
  - `postcss.config.mjs`:
    - `export default { plugins: { "@tailwindcss/postcss": {} } };`
- **Prisma ORM + Postgres**
  - Banco: **Prisma Postgres (db.prisma.io)**
  - Dependências: `prisma`, `@prisma/client`, `pg`, `@prisma/adapter-pg`
- **Uploads de Imagens:** **Vercel Blob** (imagens públicas) via endpoint `/api/uploads` (Node runtime)
- **Auth (MVP):** cookie **HttpOnly** `reuse_session` com token assinado (**HMAC SHA256**)

---

## ✅ Funcionalidades

### Autenticação
- Login e Logout via API (cookie-based)
- Cadastro de usuário (`/cadastro` + `POST /api/auth/register`)
- **Sem localStorage** como fonte de autenticação (somente cookie)

### Itens
- Publicar item (`ACTIVE`)
- Buscar itens com filtros (visibilidade padrão: `ACTIVE`)
- Detalhe do item `/produto/[id]`
- Gerenciar itens do usuário (`/meus-produtos`)
- Alterar status do item: `ACTIVE`, `PAUSED`, `TRADED`, `DELETED` (soft delete)

> Observação: itens `TRADED/PAUSED` continuam acessíveis no detalhe do item (não retornam 404), porém a ação de troca só é permitida quando `status=ACTIVE`.

### Trocas (Trades)
**Status do Trade:**
- `PENDING` → `CHAT_ACTIVE` → `TRADE_MARKED` → `DONE` / `CANCELED`

**Regras principais:**
- `acceptedByOwner`: `null` (pendente), `true` (aceito), `false` (recusado)
- Conclusão exige confirmação dos dois lados:
  - `requesterDone` e `ownerDone`
- Ao finalizar (`DONE`):
  - `completedAt` definido
  - itens envolvidos marcados como `TRADED`
- Anti-duplicidade:
  - se já existir trade ativo (`PENDING/CHAT_ACTIVE/TRADE_MARKED`) para o mesmo par `wantedItemId + offeredItemId`, o backend reutiliza o trade existente.

### Chat
- Chat associado ao trade (`/chat/[tradeId]`)
- Bloqueia envio quando:
  - trade `DONE`/`CANCELED`
  - item `DELETED`
- UX:
  - mostra quando um usuário já confirmou e está aguardando o outro confirmar

### Avaliação (Reviews)
- Disponível após `DONE`
- 1 review por trade
- POST cookie-based (reviewer não é enviado pelo client)

---

## 🧭 Rotas (Telas)

Route group principal: `(site)`

- `/` — Home
- `/buscar`
- `/produto/[id]`
- `/publicar-item`
- `/meus-produtos`
- `/produtos-trocados`
- `/chats`
- `/chat/[tradeId]`

Auth:
- `/login`
- `/cadastro`

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

### Cadastro
- `POST /api/auth/register`

### Uploads (Imagens)
- `POST /api/uploads` (Vercel Blob, imagens públicas)

### Itens
- `GET /api/items` (lista com filtros)
- `POST /api/items` (criar item)
- `GET /api/items/[id]`
- `PATCH /api/items/[id]` / `PUT /api/items/[id]` (alterar item/status)

### Itens do usuário
- `GET /api/my-items` (cookie-based)

### Trades
- `POST /api/trades` (cookie-based, com anti-duplicidade)
- `PATCH /api/trades/[id]` actions:
  - `ACCEPT`, `REJECT`, `CANCEL`, `MARK_MEET`, `CONFIRM_DONE`

### Chat / Mensagens
- `GET /api/messages` (cookie-based)
  - retorna `tradeStatus`, `canSend`, `messages`
  - e também flags de UX: `requesterDone`, `ownerDone`, `myRole`, `iConfirmed`, `otherConfirmed`
- `POST /api/messages` (cookie-based)

### Trades do usuário
- `GET /api/my-trades` (lista trades do usuário + itens envolvidos)

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
- Banco Postgres (Prisma Postgres / db.prisma.io)

### 2) Instalar dependências
```bash
npm install
```

### 3) Variáveis de ambiente
Crie `.env.local` na raiz:

```env
# Postgres (Prisma Postgres)
DATABASE_URL="postgresql://..."
# opcional (se usado no projeto)
PRISMA_DATABASE_URL="postgresql://..."
POSTGRES_URL="postgresql://..."

# Auth (cookie HMAC)
AUTH_SECRET="sua-chave-secreta-longa"

# Vercel Blob (uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

### 4) Prisma
```bash
npx prisma generate
```

Se você usa migrations:
```bash
npx prisma migrate dev
```

### 5) Rodar em dev
```bash
npm run dev
```

Acesse:
- http://localhost:3000

### 6) Build + start (produção local)
```bash
npm run build
npm run start
```

---

## 🚀 Deploy (Vercel)

Scripts no `package.json`:
- `build`: `prisma generate && next build`
- `postinstall`: `prisma generate`

Configurar envs (Production):
- `DATABASE_URL` (e/ou `PRISMA_DATABASE_URL` / `POSTGRES_URL` conforme uso)
- `AUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN`

---

## 🖼️ Next/Image + Vercel Blob
- `next.config.js` em **CommonJS**
- `images.remotePatterns` habilitando:
  - `*.public.blob.vercel-storage.com`

---

## 📁 Estrutura de pastas (resumo)

- `src/app/(site)` — páginas do site
- `src/app/api` — rotas de API (Route Handlers)
- `src/app/_components` — componentes reutilizáveis (Header/Footer/UI)
- `src/lib/prisma.js` — Prisma Client
- `src/lib/auth.js` — auth por cookie (HMAC)
- `src/lib/getUserFromRequest.js` — leitura do cookie e validação do token
- `prisma/schema.prisma` — schema do banco

---

## 🧪 Notas importantes (Next.js 16)
- `cookies()` e `headers()` podem ser **Promise** → ao ler userId via cookie, use `await getUserIdFromRequest(req)` nas rotas API.
- Em páginas client com `useSearchParams`, pode ser necessário usar `Suspense` no `page.js` conforme o caso.

---

## ✅ Fluxo recomendado para avaliação
1. Criar conta (`/cadastro`)
2. Login (`/login`)
3. Publicar item (`/publicar-item`) com upload de imagem
4. Buscar item (`/buscar`) e abrir detalhe (`/produto/[id]`)
5. Criar trade (Trocar agora → selecionar item)
6. Chat (`/chat/[tradeId]`) → aceitar → marcar → confirmar → concluir (`DONE`)
7. Ver itens como `TRADED` e chat encerrado
8. Avaliar usuário após `DONE`

---

## 🔧 Patch rápido recomendado
No endpoint de debug, garantir `await`:

- `src/app/api/auth/me/route.js` deve usar `await getUserIdFromRequest(req)`

---

## 👤 Autores

Rafael Araújo Santos
Patrícia Sayuri Eihara
Natalia Silva Guaita

28.03
16.04
