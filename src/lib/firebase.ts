import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

/* =========================================================================
   Firebase configuration — Everything Market
   Real project: everythingmarket-e41dd
   (API keys are safe to ship in client code — security is enforced via
    Security Rules + authorized domains, not key secrecy.)
   ========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyC-2Fmjfr8-T67EHyKETH2uSMcOjOcnO30",
  authDomain: "everythingmarket-e41dd.firebaseapp.com",
  projectId: "everythingmarket-e41dd",
  storageBucket: "everythingmarket-e41dd.firebasestorage.app",
  messagingSenderId: "121356746344",
  appId: "1:121356746344:web:6047625fe2c5db197805dd",
  measurementId: "G-BTHW3RE3GL",
};

export const firebaseReady = true;

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let gProvider: GoogleAuthProvider | null = null;
let analyticsInstance: Analytics | null = null;

if (firebaseReady) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    gProvider = new GoogleAuthProvider();
    // Analytics is browser-only and optional.
    if (typeof window !== "undefined") {
      isSupported()
        .then((ok) => {
          if (ok && app) {
            try {
              analyticsInstance = getAnalytics(app);
            } catch {
              /* analytics unavailable — non-fatal */
            }
          }
        })
        .catch(() => {});
    }
  } catch (err) {
    console.warn("[Everything Market] Firebase init failed.", err);
  }
}

export const auth = authInstance;
export const googleProvider = gProvider;
export const analytics = analyticsInstance;
export const authMode: "firebase" | "demo" = authInstance ? "firebase" : "demo";
