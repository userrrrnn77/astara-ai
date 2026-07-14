import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutGrid,
  Code2,
  BarChart3,
  FolderTree,
} from "lucide-react";
import { Button } from "../ui/Button";

const UI_BLOCKS = [
  { label: "Code", icon: Code2 },
  { label: "Table", icon: LayoutGrid },
  { label: "Chart", icon: BarChart3 },
  { label: "Tree", icon: FolderTree },
] as const;

export function LandingPage() {
  const navigate = useNavigate();
  const [activeBlock, setActiveBlock] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlock((i) => (i + 1) % UI_BLOCKS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background-100">
      <header className="relative z-20 mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-gray-1000 text-xs font-bold text-background-100">
            <img src="/favicon.svg" alt="" />
          </div>
          <span className="text-sm font-semibold text-gray-1000">
            Astara AI
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate("/chat")}>
          Masuk
        </Button>
      </header>

      <section className="relative">
        <div className="bg-grid-fade pointer-events-none absolute inset-0 top-0 h-160" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-alpha-400 bg-background-200 px-3 py-1 text-xs text-gray-800">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-700 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-700" />
            </span>
            Satu model, jawaban langsung
          </div>

          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-gray-1000 sm:text-5xl md:text-6xl">
            Tanya langsung.
            <br />
            Jawab dengan{" "}
            <span className="text-blue-700">tampilan yang pas.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-gray-800 sm:text-lg">
            Astara AI jawab pertanyaan kamu langsung dari satu model — gak ada
            antrian draft atau tahap tambahan. Bedanya, jawabannya gak selalu
            teks polos: kode, tabel, chart, sampai struktur folder otomatis
            dirender sebagai UI interaktif, bukan cuma markdown.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={() => navigate("/chat")}>
              Mulai Chat
            </Button>
            <button
              onClick={() =>
                sectionRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm font-medium text-gray-800 transition-colors hover:text-gray-1000">
              Lihat cara kerjanya ↓
            </button>
          </div>

          <div className="mt-16 w-full max-w-2xl rounded-(--radius-lg) border border-gray-alpha-400 bg-background-200 p-5 text-left shadow-raised sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                Contoh pertanyaan
              </span>
              <span className="text-xs text-gray-700">
                Block {activeBlock + 1}/{UI_BLOCKS.length}
              </span>
            </div>

            <p className="mb-5 rounded-(--radius-md) bg-gray-alpha-100 px-4 py-3 text-sm text-gray-900">
              "Bandingin performa 3 library ini, terus kasih contoh kodenya"
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              {UI_BLOCKS.map((block, i) => {
                const Icon = block.icon;
                const isActive = i === activeBlock;
                const isDone = i < activeBlock;
                return (
                  <div
                    key={block.label}
                    className={
                      "flex-1 rounded-(--radius-md) border p-3 transition-all duration-500 " +
                      (isActive
                        ? "border-blue-700 bg-blue-100"
                        : "border-gray-alpha-300 bg-background-100")
                    }>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Icon
                        size={14}
                        className={
                          isActive
                            ? "text-blue-700"
                            : isDone
                              ? "text-gray-700"
                              : "text-gray-600"
                        }
                      />
                      <span
                        className={
                          "text-xs font-semibold " +
                          (isActive ? "text-blue-700" : "text-gray-800")
                        }>
                        {block.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-700">
                      {isActive
                        ? "dirender..."
                        : isDone
                          ? "selesai"
                          : "menunggu"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={sectionRef} className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-1000 sm:text-3xl">
            Jawaban yang render sesuai kontennya
          </h2>
          <p className="mt-3 text-sm text-gray-800 sm:text-base">
            Model otomatis milih bentuk tampilan paling pas — bukan nge-dump
            semuanya jadi teks panjang.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {UI_BLOCKS.map((block, i) => {
            const Icon = block.icon;
            return (
              <div
                key={block.label}
                className="group relative flex flex-col rounded-(--radius-lg) border border-gray-alpha-400 bg-background-200 p-6 transition-shadow hover:shadow-raised">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) bg-gray-alpha-100 text-gray-900">
                    <Icon size={17} />
                  </div>
                  <span className="text-xs text-gray-600">0{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-1000">
                  {block.label}
                </h3>
                <p className="mt-3 text-sm text-gray-800">
                  {block.label === "Code" &&
                    "Snippet & file config tampil dengan syntax highlighting, bukan code-fence polos."}
                  {block.label === "Table" &&
                    "Perbandingan data antar item dirender sebagai tabel terstruktur."}
                  {block.label === "Chart" &&
                    "Data numerik yang bisa divisualisasikan langsung jadi grafik."}
                  {block.label === "Tree" &&
                    "Struktur folder/direktori dirender sebagai file tree, bukan ASCII art."}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-gray-alpha-300 bg-background-200">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-1000 sm:text-3xl">
            Kenapa langsung satu model?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
            Gak perlu nunggu beberapa model bergantian draft dan koreksi cuma
            buat satu jawaban. Satu model yang cepat, plus tampilan yang
            otomatis nyesuain isi jawabannya — itu udah cukup buat jawaban yang
            jelas dan gampang dibaca.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-1000 sm:text-4xl">
          Coba tanya sesuatu yang susah.
        </h2>
        <p className="mt-4 text-sm text-gray-800 sm:text-base">
          Gratis buat dicoba. Masuk pakai Google atau GitHub.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate("/chat")}>
            Mulai Chat
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-alpha-300 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-gray-700 sm:flex-row">
          <span>© {new Date().getFullYear()} Astara AI</span>
          <span>Satu model, jawaban langsung</span>
        </div>
      </footer>
    </div>
  );
}
