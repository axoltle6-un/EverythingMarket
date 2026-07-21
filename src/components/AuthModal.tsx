import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import { LogoMark } from "./Logo";

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function AuthModal() {
  const { modalOpen, mode, busy, error } = useAuth();
  const closeAuth = useAuth((s) => s.closeAuth);
  const setMode = useAuth((s) => s.setMode);
  const signIn = useAuth((s) => s.signIn);
  const signUp = useAuth((s) => s.signUp);
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (!modalOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setShowPw(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    if (modalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeAuth]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else await signUp(name.trim(), email.trim(), password);
    } catch {
      /* error surfaced in store */
    }
  };

  const isSignup = mode === "signup";

  return (
    <AnimatePresence>
      {modalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] bg-ink-900 shadow-2xl shadow-black/60"
            role="dialog"
            aria-modal="true"
            aria-label={isSignup ? "Create your account" : "Sign in"}
          >
            {/* glow */}
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(79,139,255,0.22), transparent 70%)" }}
            />

            <button
              onClick={closeAuth}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative px-6 pb-6 pt-8 sm:px-8">
              {/* Logo */}
              <LogoMark withText />

              <h2 className="mt-5 text-[22px] font-semibold tracking-tight text-white">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-[13.5px] text-white/50">
                {isSignup ? "Start tracking every market in seconds." : "Sign in to open your dashboard."}
              </p>

              {/* Mode tabs */}
              <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-lg py-2 text-[13px] font-medium transition-colors ${
                      mode === m ? "bg-white/[0.08] text-white" : "text-white/45 hover:text-white"
                    }`}
                  >
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              {/* Google */}
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                disabled={busy}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-[14px] font-medium text-white transition-colors hover:bg-white/[0.06] disabled:opacity-50"
              >
                <GoogleG /> Continue with Google
              </button>

              <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/25">
                <span className="h-px flex-1 bg-white/[0.07]" /> or <span className="h-px flex-1 bg-white/[0.07]" />
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-3">
                {isSignup && (
                  <Field icon={<User size={15} />} label="Name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-11 w-full bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </Field>
                )}
                <Field icon={<Mail size={15} />} label="Email">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
                  />
                </Field>
                <Field icon={<Lock size={15} />} label="Password">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="text-white/35 transition-colors hover:text-white"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                {error && (
                  <div className="rounded-lg border border-loss/20 bg-loss/[0.07] px-3 py-2 text-[12.5px] text-loss">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(79,139,255,0.7)] transition-all hover:bg-[#3f7af0] active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
                  {!busy && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="mt-4 text-center text-[12px] text-white/35">
                {isSignup ? "Already have an account? " : "New here? "}
                <button
                  onClick={() => setMode(isSignup ? "signin" : "signup")}
                  className="font-medium text-accent hover:underline"
                >
                  {isSignup ? "Sign in" : "Create one"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/40">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 transition-colors focus-within:border-white/20">
        <span className="text-white/35">{icon}</span>
        {children}
      </div>
    </label>
  );
}
