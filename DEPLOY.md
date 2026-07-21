# Everything Market — Deploy Guide

## 1. Build the app

```bash
npm install
npm run build      # outputs the self-contained app to /dist
```

---

## 2. Deploy to Firebase Hosting (recommended)

Hosting on Firebase auto-authorizes the `*.web.app` / `*.firebaseapp.com` domain for
Authentication, which is the most reliable way to get Google sign-in working.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

Your app goes live at **`https://everythingmarket-e41dd.web.app`**.
That domain is already trusted by Firebase Auth — no extra domain setup needed.

> Want Firestore rules deployed too? `firebase deploy --only firestore:rules,storage`

---

## 3. Push to GitHub

> ⚠️ Never paste a token into a chat or commit it. Use a credential helper, GitHub CLI, or SSH keys.

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: Everything Market"
git remote add origin https://github.com/axoltle6-un/HashMarket.git
git push -u origin main
```

If prompted for credentials, use **GitHub CLI** (`gh auth login`) or generate a fresh
**fine-grained token** (not a classic one) and use it via HTTPS — but keep it out of the repo.

---

## 4. If login still doesn't work

The auth code is complete and fixed (popup → redirect fallback, exact error messages).
A "doesn't work" almost always means one of these:

1. **You're testing an old/previous build.** Always run `npm run build` and redeploy after changes.
2. **You're opening `dist/index.html` via `file://`.** Firebase Auth needs an `http(s)` origin.
   Use Firebase Hosting, Netlify, Vercel, or `npx serve dist`.
3. **Google provider isn't enabled.** Console → Authentication → Sign-in method →
   enable **Google** (set a support email) AND **Email/Password**.
4. **Domain not authorized.** Console → Authentication → Settings → Authorized domains →
   add the exact origin (host only, e.g. `your-app.netlify.app`).
5. **Check the browser console (F12).** The sign-in modal now shows the exact Firebase
   error code — e.g. `auth/unauthorized-domain`, `auth/operation-not-allowed`,
   `auth/popup-blocked`. Each has a specific fix.

If you deployed to Firebase Hosting (step 2), Google sign-in should work out of the box.
