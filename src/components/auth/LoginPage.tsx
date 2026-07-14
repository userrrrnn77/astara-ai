import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

type OAuthProvider = "google" | "github";
type EmailMode = "login" | "register";

/**
 * GoogleIcon / GithubIcon di-inline sebagai SVG (bukan import dari
 * lucide-react) karena lucide gak nyediain brand logo — cuma icon generik.
 */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3h3.89c2.28-2.1 3.56-5.2 3.56-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.89-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.27v3.1C3.25 21.3 7.29 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4.01-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.29 0 3.25 2.7 1.27 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.89-.39.98.01 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
      <path d="M9.88 5.09A10.7 10.7 0 0 1 12 5c7 0 10.5 7 10.5 7a13.2 13.2 0 0 1-3.13 4.06M6.6 6.6C3.86 8.36 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 4.24-.88" />
    </svg>
  );
}

export function LoginPage() {
  const {
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [emailMode, setEmailMode] = useState<EmailMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  async function handleSignIn(provider: OAuthProvider) {
    setError(null);
    setInfo(null);
    setPendingProvider(provider);
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithGithub();
    } catch {
      setError("Gagal memulai proses login. Coba lagi.");
      setPendingProvider(null);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsEmailSubmitting(true);
    try {
      if (emailMode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        setInfo(
          "Akun berhasil dibuat. Cek email kamu buat verifikasi sebelum login.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memproses permintaan. Coba lagi.",
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-background-100">
      <div className="bg-grid-fade absolute inset-0" />

      <div className="relative z-10 w-full max-w-95 px-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-(--radius-md) bg-gray-1000 text-lg font-bold text-background-100">
            <img src="/favicon.svg" alt="" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-1000">Astara AI</h1>
          <p className="mt-2 text-sm text-gray-800">
            Satu jawaban, banyak bentuk. AI yang render code, tabel, chart,
            sampai tree — bukan cuma teks.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-(--radius-lg) border border-gray-alpha-400 bg-background-200 p-6 shadow-raised">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={<GoogleIcon />}
            isLoading={pendingProvider === "google"}
            disabled={pendingProvider !== null || isEmailSubmitting}
            onClick={() => handleSignIn("google")}>
            Lanjutkan dengan Google
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={<GithubIcon />}
            isLoading={pendingProvider === "github"}
            disabled={pendingProvider !== null || isEmailSubmitting}
            onClick={() => handleSignIn("github")}>
            Lanjutkan dengan GitHub
          </Button>

          {error && <p className="text-center text-xs text-red-700">{error}</p>}
          {info && <p className="text-center text-xs text-green-700">{info}</p>}

          <div className="my-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-alpha-400" />
            <span className="text-xs text-gray-700">atau</span>
            <div className="h-px flex-1 bg-gray-alpha-400" />
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-(--radius-md) border border-gray-alpha-400 bg-background-100 px-3 py-2 text-sm text-gray-1000 outline-none placeholder:text-gray-700 focus:border-gray-alpha-600"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  emailMode === "login" ? "current-password" : "new-password"
                }
                className="w-full rounded-(--radius-md) border border-gray-alpha-400 bg-background-100 px-3 py-2 pr-10 text-sm text-gray-1000 outline-none placeholder:text-gray-700 focus:border-gray-alpha-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                aria-pressed={showPassword}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-gray-700 hover:text-gray-1000">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isEmailSubmitting}
              disabled={isEmailSubmitting || pendingProvider !== null}>
              {emailMode === "login" ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() =>
              setEmailMode((m) => (m === "login" ? "register" : "login"))
            }
            className="text-center text-xs text-gray-800 underline-offset-2 hover:underline">
            {emailMode === "login"
              ? "Belum punya akun? Daftar"
              : "Udah punya akun? Masuk"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          Dengan masuk, kamu setuju data percakapan disimpan buat riwayat chat.
        </p>
      </div>
    </div>
  );
}
