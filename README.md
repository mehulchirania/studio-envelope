# Studio Envelope

Architecture & interior design studio website. Next.js 16 (App Router) + TypeScript + Tailwind v4, with an
optional backend (Firestore + Auth on Firebase's free Spark plan, plus Vercel Blob for image storage) and
an admin panel at `/admin`.

**The site works with zero configuration.** Without any env vars, the public site reads from local seed
data (`src/lib/seed.ts`) and the contact form just logs to the console. The backend is entirely opt-in —
wire it up whenever you're ready to manage content dynamically and store real contact submissions.

## Stack

- Next.js 16.3.5 (App Router, `src/` dir, `@/*` alias)
- TypeScript, Tailwind v4
- Firebase (client SDK v12) — Firestore + Auth only, on the free Spark plan (no Storage, no
  service-account/billing requirement)
- Vercel Blob — admin image uploads (cover + gallery images)
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env.local` is required for this to work — the
public site falls back to seed data, and `/admin` shows a "Firebase not configured" screen instead of
crashing.

## Project structure (backend-relevant parts)

```
src/lib/
  types.ts        Project / ContactMessage types (source of truth)
  site.ts         Static site config (name, contact info, socials)
  seed.ts         Local seed project data (fallback when Firebase isn't configured, or Firestore is empty)
  firebase.ts     Firebase client SDK bootstrap + isFirebaseConfigured flag
  server-auth.ts  Server-only helper: verifies a Firebase ID token against ADMIN_EMAILS
  data.ts         Public read API: getProjects / getFeaturedProjects / getProject
  contact.ts      Public write API: submitContact (client-side)
  admin-api.ts    Admin-only API: auth, project CRUD, image upload/delete, messages inbox, revalidation,
                  seed data import

src/app/admin/    Admin panel (client-side, noindex)
src/app/api/revalidate/route.ts   Revalidation endpoint, called by the admin panel after writes
src/app/api/upload/route.ts       Issues Vercel Blob client-upload tokens (admin-only)
src/app/api/upload/delete/route.ts   Deletes a Blob image by URL (admin-only)

firestore.rules, firestore.indexes.json   Firestore security rules (includes the hardcoded admin allowlist)
```

## Setting up the backend

### 1. Firebase (Firestore + Auth)

1. **Create a project** at [console.firebase.google.com](https://console.firebase.google.com). The free
   **Spark** plan is enough — this app never uses Storage or any paid Firebase product.
2. **Enable products**: Build → Firestore Database (production mode), Build → Authentication → Sign-in
   method → enable **Google**.
3. **Register a Web app** (Project settings → General → Your apps → Add app → Web) and copy the config
   values into a new `.env.local` (copy `.env.local.example` as a starting point):

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ADMIN_EMAILS=you@example.com
   ```

4. **Add yourself as an admin.** There's no `config/admins` Firestore doc and no seed script for it (this
   project has no service account) — the admin allowlist is hardcoded directly in `firestore.rules`. Open
   `firestore.rules`, find the `isAdmin()` function near the top, and add your Google account's email to
   the list:

   ```js
   function isAdmin() {
     return isSignedIn()
       && request.auth.token.email_verified == true
       && request.auth.token.email in [
         'you@example.com'
       ];
   }
   ```

   Also add the same email to `ADMIN_EMAILS` above — that env var is what `/api/revalidate` and
   `/api/upload` check server-side, so the two lists must match.

5. **Deploy Firestore rules and indexes** using the Firebase CLI (run via `npx`, nothing global to
   install):

   ```bash
   npx firebase-tools login
   npx firebase-tools use --add        # pick your project, or copy .firebaserc.example to .firebaserc
   npx firebase-tools deploy --only firestore
   ```

6. Restart `npm run dev`. `/admin` now lets you sign in with Google (an account whose email is in both
   `firestore.rules` and `ADMIN_EMAILS`).

### 2. Vercel Blob (image uploads)

1. In the Vercel dashboard, open your project → **Storage** → **Create Database** → **Blob**, and connect
   it to the project. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into your Preview/Production
   environments — no manual copying needed there.
2. For local dev, pull that token down (or copy it from the store's `.env.local` tab in the dashboard) and
   add it to `.env.local`:

   ```
   BLOB_READ_WRITE_TOKEN=
   ```

   Without it, uploads in the local admin panel will fail with an auth error from Vercel Blob; everything
   else (Firestore reads/writes, sign-in) still works.

### Data model

- **`projects/{id}`** — matches the `Project` type in `src/lib/types.ts`. Publicly readable only where
  `published == true`; admins can read/write everything. Doc id is the project's slug when created via the
  admin panel's "Import sample projects" button, or via `addDoc` (a random id) when created through the
  regular "New project" form.
- **`messages/{id}`** — contact form submissions. Anyone can `create` one (validated server-side by
  `firestore.rules` — allowed fields, size limits, `read: false`, `createdAt` must equal the server time);
  only admins can read, mark as read, or delete. The admin panel also uses a read attempt on this
  collection as its client-side "am I an admin?" check.
- **Vercel Blob** `projects/{slug}/{filename}` (random suffix added) — publicly readable images, uploads
  and deletes restricted to admins via `/api/upload` and `/api/upload/delete`, images only, 10MB max.

## Admin panel

Visit `/admin` and sign in with a Google account listed in both `firestore.rules` and `ADMIN_EMAILS`.

- **Projects** — list (including unpublished), create/edit/delete, toggle Published and Featured, reorder
  with the up/down arrows (persists the `order` field), auto-generated slug from the title (editable). When
  the `projects` collection is empty, an **"Import sample projects"** button writes the site's local seed
  data (`src/lib/seed.ts`) into Firestore so the panel — and the live site — aren't empty before you've
  added real content.
- **Project form** — all `Project` fields; cover image and gallery images upload straight from the browser
  to Vercel Blob with progress, preview, remove (which also deletes the Blob object), and (for the gallery)
  reorder.
- **Messages** — inbox of contact submissions, newest first, mark as read on open, delete.

Every write triggers a call to `/api/revalidate` so the public site (statically rendered/cached pages)
picks up the change immediately instead of waiting for the next deploy.

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add a Vercel Blob store (Storage → Create Database → Blob) and connect it to the project — this
   provisions `BLOB_READ_WRITE_TOKEN` automatically.
3. Add the remaining environment variables in Project Settings → Environment Variables: the
   `NEXT_PUBLIC_FIREBASE_*` vars and `ADMIN_EMAILS`.
4. Deploy. No Firebase admin/service-account credentials are needed on Vercel — the app only ever uses the
   public client SDK at runtime, both for the public site's server-side reads and for the admin panel.
5. In the Firebase console, add your Vercel domain(s) to Authentication → Settings → Authorized domains so
   Google sign-in works on the deployed site.
6. Sign in to `/admin` on the deployed site and click **"Import sample projects"** (shown automatically
   while `projects` is empty) to populate Firestore, or start adding real projects right away.

## Notes

- If Firestore is configured but a read fails for any reason — or succeeds with zero published projects
  (e.g. right after step 6 above, before you've imported anything) — `getProjects()` falls back to the
  local seed data rather than showing an empty site.
