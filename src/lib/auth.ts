import { create } from "zustand";
import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FbUser,
} from "firebase/auth";
import { useStore } from "../store";
import type { View } from "../store";
import { usePrefs } from "./prefs";

export interface AppUser {
  uid: string;
  email: string | null;
  name: string;
  photoURL: string | null;
}

export type AuthStatus = "loading" | "ready";

function mapUser(u: FbUser | null): AppUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    name: u.displayName || (u.email ? u.email.split("@")[0] : "Trader"),
    photoURL: u.photoURL,
  };
}

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/unavailable": "Authentication isn't available right now. Please reload and try again.",
    "auth/invalid-email": "That email address looks invalid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with those credentials.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/popup-blocked": "The pop-up was blocked. Redirecting to Google…",
    "auth/unauthorized-domain":
      "This domain isn't authorized for sign-in. Add it under Firebase → Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in the Firebase console yet.",
    "auth/configuration-not-found": "Google sign-in isn't configured. Enable it in the Firebase console.",
    "auth/web-storage-unsupported": "Your browser blocked sign-in storage. Enable cookies/third-party access.",
    "auth/network-request-failed": "Network error — check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  if (map[code]) return map[code];
  // Always surface the real code so issues are diagnosable.
  return `Couldn't complete sign-in (${code || "unknown error"}).`;
}

// Errors where we should retry Google sign-in via full-page redirect.
const REDIRECT_FALLBACK_CODES = [
  "auth/popup-blocked",
  "auth/cancelled-popup-request",
  "auth/popup-closed-by-user",
  "auth/unauthorized-domain",
  "auth/web-storage-unsupported",
  "auth/internal-error",
];

interface AuthState {
  status: AuthStatus;
  user: AppUser | null;
  modalOpen: boolean;
  mode: "signin" | "signup";
  pendingView: View | null;
  busy: boolean;
  error: string | null;

  openAuth: (mode?: "signin" | "signup", view?: View) => void;
  closeAuth: () => void;
  setMode: (m: "signin" | "signup") => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

function applyPendingView() {
  const { pendingView } = useAuth.getState();
  const target = pendingView ?? usePrefs.getState().defaultView;
  useStore.getState().setView(target);
  useAuth.setState({ pendingView: null });
}

export const useAuth = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  modalOpen: false,
  mode: "signin",
  pendingView: null,
  busy: false,
  error: null,

  openAuth: (mode = "signin", view) => set({ modalOpen: true, mode, error: null, pendingView: view ?? null }),
  closeAuth: () => set({ modalOpen: false, error: null }),
  setMode: (m) => set({ mode: m, error: null }),

  signIn: async (email, password) => {
    set({ busy: true, error: null });
    try {
      if (!auth) throw { code: "auth/unavailable" };
      await signInWithEmailAndPassword(auth, email, password);
      set({ busy: false, modalOpen: false });
      applyPendingView();
    } catch (e: any) {
      set({ busy: false, error: friendlyError(e?.code || "") });
      throw e;
    }
  },

  signUp: async (name, email, password) => {
    set({ busy: true, error: null });
    try {
      if (!auth) throw { code: "auth/unavailable" };
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      set({ user: mapUser(cred.user), busy: false, modalOpen: false });
      applyPendingView();
    } catch (e: any) {
      set({ busy: false, error: friendlyError(e?.code || "") });
      throw e;
    }
  },

  signInWithGoogle: async () => {
    set({ busy: true, error: null });
    try {
      if (!auth || !googleProvider) throw { code: "auth/unavailable" };
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (e: any) {
        const code: string = e?.code || "";
        // Pop-ups are unreliable on mobile, in webviews, or when blocked —
        // fall back to a full-page redirect, which always works.
        if (REDIRECT_FALLBACK_CODES.includes(code) || /popup/i.test(code)) {
          await signInWithRedirect(auth, googleProvider);
          return; // The browser navigates away and back; onAuthStateChanged resumes the session.
        }
        throw e;
      }
      set({ busy: false, modalOpen: false });
      applyPendingView();
    } catch (e: any) {
      set({ busy: false, error: friendlyError(e?.code || "") });
      throw e;
    }
  },

  signOut: async () => {
    try {
      if (auth) await fbSignOut(auth);
    } catch {
      /* ignore */
    }
    useStore.getState().setView("dashboard");
    set({ user: null, modalOpen: false });
  },
}));

/* ---------------- Session bootstrap ---------------- */
if (auth) {
  // Complete any pending redirect-based sign-in.
  getRedirectResult(auth).catch(() => {});
  onAuthStateChanged(
    auth,
    (u) => setAuthReady(mapUser(u)),
    () => setAuthReady(null)
  );
  // Safety net so the UI never hangs on the splash.
  setTimeout(() => useAuth.setState((s) => (s.status === "loading" ? { status: "ready" } : s)), 6000);
} else {
  setAuthReady(null);
}

function setAuthReady(user: AppUser | null) {
  useAuth.setState({ status: "ready", user });
}
