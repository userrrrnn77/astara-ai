# Astara AI — Frontend

Frontend chat client buat Astara AI. Dibangun dengan React + TypeScript + Vite, terhubung ke backend Astara AI (Express/Vercel serverless) buat orkestrasi AI dan Supabase buat autentikasi.

Fitur utamanya: **Generative UI** — jawaban dari AI gak cuma teks/markdown biasa, tapi bisa berupa blok terstruktur (code, tabel, chart, tree) yang di-render langsung sebagai komponen interaktif di dalam chat.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router v7** — routing (`/`, `/chat`, `/chat/:roomId`)
- **Zustand** — state management (auth, chat, feedback, theme)
- **Tailwind CSS v4** — styling
- **Supabase JS** — autentikasi (email/password, Google OAuth, GitHub OAuth)
- **Axios** — HTTP client ke backend API
- **Recharts** — render chart block
- **react-markdown** + **remark-gfm** + **rehype-highlight** — render markdown block & syntax highlighting
- **highlight.js** — tema syntax highlighting untuk code block
- **lucide-react** — icon set

## Struktur Proyek

```
src/
├── components/
│   ├── auth/            # LoginPage, AuthGuard (gate route yang butuh session)
│   ├── blocks/           # Renderer untuk tiap tipe generative block
│   │   ├── BlockRenderer.tsx     # Dispatcher: pilih komponen berdasarkan block.type
│   │   ├── MarkdownBlockView.tsx
│   │   ├── CodeBlockView.tsx
│   │   ├── TableBlockView.tsx
│   │   ├── ChartBlockView.tsx
│   │   └── TreeBlockView.tsx
│   ├── chat/             # ChatWindow, MessageBubble, MessageInput, PipelineIndicator, dll
│   ├── landing/          # Landing page publik (sebelum login)
│   ├── layout/           # AppLayout, Sidebar, Topbar
│   └── ui/                # Komponen primitif (Button, Avatar, Spinner)
├── hooks/                 # useAuth, useConversations, useMessages, useSendMessage
├── lib/
│   ├── api.ts             # Axios client + semua pemanggilan endpoint backend
│   └── supabase.ts        # Supabase client + helper ambil access token
├── pages/
│   └── ChatPage.tsx       # Halaman utama chat, sync activeConversationId <-> URL
├── stores/                # Zustand stores: authStore, chatStore, feedbackStore, themeStore
├── types/                 # Tipe TypeScript: chat.ts (Conversation/Message), blocks.ts (GenerativeBlock)
├── utils/
│   └── blockSerialize.ts  # Serialisasi/parsing generative block dari respons backend
├── App.tsx                # Root routing
└── main.tsx                # Entry point
```

## Generative UI Blocks

Setiap pesan dari assistant bisa membawa `blocks?: GenerativeBlock[]` di samping `content` (markdown/teks biasa). Tipe blok yang didukung (lihat `src/types/blocks.ts`):

| Tipe       | Deskripsi                                          |
| ---------- | --------------------------------------------------- |
| `markdown` | Teks/markdown biasa                                  |
| `code`     | Blok kode dengan bahasa & nama file opsional          |
| `table`    | Tabel dengan header & baris data                       |
| `chart`    | Chart (line/bar/pie/area/scatter) via Recharts          |
| `tree`     | Struktur folder/file (tree view)                          |

`BlockRenderer.tsx` bertugas memilih komponen render yang sesuai berdasarkan `block.type`.

## Autentikasi

Autentikasi ditangani lewat Supabase (`src/lib/supabase.ts`, `src/stores/authStore.ts`):

- **Email/password** — sign in & sign up langsung
- **Google OAuth**
- **GitHub OAuth**

Setelah login (baik email maupun OAuth), user diarahkan ke `/chat`. `AuthGuard` melindungi route `/chat` dan `/chat/:roomId` — kalau belum ada session, otomatis menampilkan `LoginPage`.

Access token Supabase disisipkan otomatis ke setiap request backend lewat Axios interceptor di `src/lib/api.ts` (header `Authorization: Bearer <token>`).

## Environment Variables

Buat file `.env` (development) atau `.env.local` di root, isi:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3000
```

- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` — didapat dari dashboard Supabase project kamu (Project Settings → API).
- `VITE_API_BASE_URL` — base URL backend Astara AI (misal `http://localhost:3000` saat dev lokal, atau URL deployment Vercel backend saat production).

> Provider **Email**, **Google**, dan **GitHub** harus diaktifkan manual di Supabase Dashboard → Authentication → Providers, dan Redirect URL diarahkan ke `<origin>/chat`.

## Menjalankan Proyek

Install dependencies:

```bash
bun install
# atau: npm install
```

Jalankan dev server:

```bash
bun run dev
# atau: npm run dev
```

App jalan di `http://localhost:5173` (default Vite).

## Scripts

| Script    | Deskripsi                                                    |
| --------- | -------------------------------------------------------------- |
| `dev`     | Jalankan Vite dev server dengan HMR                              |
| `build`   | Typecheck (`tsc -b`) lalu build production (`vite build`)          |
| `preview` | Preview hasil build production secara lokal                        |
| `lint`    | Jalankan Oxlint                                                     |

## Routing

| Path            | Deskripsi                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/`             | Landing page publik. Juga bertindak sebagai safety-net OAuth callback — kalau hash `access_token`/`refresh_token` nyangkut di sini, otomatis redirect ke `/chat`. |
| `/chat`         | Halaman chat utama (dilindungi `AuthGuard`)                                                                               |
| `/chat/:roomId` | Halaman chat untuk conversation tertentu (dilindungi `AuthGuard`)                                                          |
| `*`             | Redirect ke `/`                                                                                                              |

## Catatan Development

- Semua request ke backend butuh Supabase access token yang valid — pastikan `VITE_API_BASE_URL` mengarah ke backend yang sudah jalan (lihat repo backend Astara AI) sebelum testing fitur chat.
- Styling menggunakan Tailwind v4 dengan custom design tokens (lihat `src/index.css`) — warna, radius, dan shadow dipakai lewat CSS variable seperti `bg-gray-1000`, `rounded-(--radius-md)`, dll, bukan default Tailwind palette.
- Optimistic update dipakai saat kirim pesan (`chatStore.sendMessage`) — pesan user langsung muncul di UI sebelum response backend datang, lalu di-reconcile setelah request selesai.