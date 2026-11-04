# Studio Envelope

Architecture & interior design studio website. Next.js 16 (App Router) + TypeScript + Tailwind v4, with an
optional backend (Firestore + Auth on Firebase's free Spark plan, plus Vercel Blob for image and video storage)
and an admin panel at `/admin` for projects, videos and messages.

- **Live:** https://studio-envelope.vercel.app (auto-deploys on every push to `main`)
- **Firebase project:** `studio-envelope-site`
- **Vercel project:** `studio-envelope` (Blob store `studio-envelope-images`)

**The site works with zero configuration.** Without any env vars, the public site reads from local seed
data (`src/lib/content/seed.ts`) and the contact form just logs to the console. The backend is entirely opt-in —
wire it up whenever you're ready to manage content dynamically and store real contact submissions.

## Stack

- Next.js 16.3.5 (App Router, `src/` dir, `@/*` alias)
- TypeScript, Tailwind v4 (no animation libraries; scrolling is native)
- Firebase (client SDK v12) — Firestore + Auth only, on the free Spark plan (no Storage, no
  service-account/billing requirement)
- Vercel Blob — admin image uploads (cover + gallery images) and uploaded video files
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env.local` is required for this to work — the
public site falls back to seed data. `/admin` still opens and signs in (see "Admin panel"), but loading or
saving projects shows "Firebase isn't configured on the server" until the backend below is set up.

## Project structure

```
src/
  app/                    Routes only: pages, layout, API routes, sitemap/robots/manifest/OG image
    admin/                Admin panel pages (client-side, noindex)
    videos/               Public Videos page
    api/admin/            Admin API: login/logout/session, projects and videos (CRUD + order, projects
                          also import), messages
    api/upload            Vercel Blob upload token for images and videos (signed-in admins only)
  components/
    layout/               Header, Footer, HideOnAdmin, BackToTop
    ui/                   Reusable pieces: Button, Logo, Seal, SectionHeader, PageHero,
                          ProjectImage, Datasheet, Lightbox
    home/                 Hero, WorkGlimpse, FounderNote, WhyEnvelope
    videos/               VideoFeature (YouTube embed or uploaded file, plays on click)
    projects/             ProjectCard/Grid, ProjectHero, RoomChapter, lightbox
                          provider + image, NextProjectBand, roomLayout.ts (layout helpers)
    services/             ServiceGroup, ProcessStep, FaqItem
    contact/              ContactForm
    seo/                  JsonLd
    admin/                Admin-only components
  lib/
    content/              What the site says: site.ts (studio facts), services.ts, seed.ts
                          (fallback projects), videos.ts (fallback videos), types.ts
    firebase/             client.ts (public reads), admin-server.ts (server-only admin reads/writes),
                          contact.ts
    admin/                Admin internals: users.ts (the logins), session.ts (signed cookie), http.ts,
                          validate.ts (form payload checks), youtube.ts (YouTube link parsing),
                          client.ts (browser fetch helpers)
    data.ts               Public read API: getProjects / getProject / getVideos
    indexnow.ts           Pings search engines after admin edits (production only)
    seo.ts                SITE_URL, pageMetadata(), JSON-LD builders
```

`scripts/ping-indexnow.mjs` and `.github/workflows/indexnow.yml` submit the sitemap to IndexNow after each
production deploy (see "Search engine pings").

`firestore.rules` and `firestore.indexes.json` hold the security rules (only the server's private Firebase
account can write; see "Admin panel"). Brand files and the client brief live in `assets/`; web copies of
the logo are in `public/brand/`.

## Setting up the backend

### 1. Firebase (Firestore + Auth)

1. **Create a project** at [console.firebase.google.com](https://console.firebase.google.com). The free
   **Spark** plan is enough — this app never uses Storage or any paid Firebase product.
2. **Enable products**: Build → Firestore Database (production mode), Build → Authentication → Sign-in
   method → enable **Email/Password** (Google is *not* used any more).
3. **Register a Web app** (Project settings → General → Your apps → Add app → Web) and copy the config
   values into a new `.env.local` (copy `.env.local.example` as a starting point):

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. **Create the server's private Firebase account.** The admin logins (below) aren't Firebase users;
   instead the server signs in to Firebase as one private email/password account to read and write on their
   behalf, and `firestore.rules` trusts only that account. Pick a long random password, then create the
   account once (Authentication → Users → Add user, or the one-liner below) and put the same values in
   `.env.local` **and** in Vercel (Project → Settings → Environment Variables). Never commit them.

   ```
   FIREBASE_ADMIN_EMAIL=cms@studio-envelope.invalid      # must match the email in firestore.rules
   FIREBASE_ADMIN_PASSWORD=<long random password>
   ADMIN_SESSION_SECRET=<32+ random characters>          # signs the admin login cookie
   ```

   ```bash
   # run once, replacing the placeholders (uses your NEXT_PUBLIC_FIREBASE_API_KEY)
   curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"cms@studio-envelope.invalid","password":"<same password>","returnSecureToken":false}'
   ```

5. **Deploy Firestore rules and indexes** using the Firebase CLI (run via `npx`, nothing global to
   install):

   ```bash
   npx firebase-tools login
   npx firebase-tools use --add        # pick your project, or copy .firebaserc.example to .firebaserc
   npx firebase-tools deploy --only firestore
   ```

6. Restart `npm run dev`. `/admin` now shows the username/password sign-in (see "Admin panel").

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

- **`projects/{slug}`** — matches the `Project` type in `src/lib/content/types.ts`; the doc id is the
  project's slug (its page URL, fixed when the project is created). Publicly readable only where
  `published == true`; only the server's private account can read drafts or write.
- **`messages/{id}`** — contact form submissions. Anyone can `create` one (validated server-side by
  `firestore.rules` — allowed fields, size limits, `read: false`, `createdAt` must equal the server time);
  only the server's private account can read, mark as read, or delete.
- **`videos/{id}`** — `title`, `published`, `order`, and optionally `credits`, `projectSlug`, and either
  `youtubeId` or `src` (an uploaded file's Blob URL), plus `poster` (cover image). Publicly readable only
  where `published == true`; only the server's private account can read drafts or write. The public query
  filters on `published` and sorts in code, so no composite index is needed.
- **Vercel Blob** `projects/{slug}/{filename}` and `videos/{filename}` (random suffix added) — publicly
  readable files. Upload tokens are only issued to signed-in admins by `/api/upload`: images up to 25MB,
  videos (mp4, webm, mov) up to 500MB. Files dropped from a project or video (or from a deleted one) are
  removed from Blob automatically on save.

## Admin panel

Visit `/admin` to access the studio CMS. Configured accounts have full admin permissions.

Set the admin logins with the `ADMIN_USERS` environment variable (locally in `.env.local`, and in production under Vercel Project Settings → Environment Variables), as a comma-separated `username:password` list:

```bash
ADMIN_USERS="username:<strong password>,username2:<strong password>"
```

If `ADMIN_USERS` is not set, the app falls back to built-in development logins defined in
`src/lib/admin/users.ts`. Those are for local use only, so always set `ADMIN_USERS` before deploying.

> **Security note:** Use strong, unique passwords, keep them only in `.env.local` (gitignored) and Vercel's
> environment variables, and never write credentials into code, docs or commits.

- **Projects** — one ordered list of everything on the website (drafts marked "Draft"). Use the arrows to
  reorder (this is the order visitors see), the pencil to edit, the arrow-out icon to open the live page, the
  bin to delete. While the database is empty the site shows its built-in sample projects; the list shows
  them too, with a button to save them to the database so they become editable.
- **Add / edit a project** — title, location, year, status, type of work, area, credit, tagline, summary and
  description, a cover photo, rooms each with their own photos (reorder, describe, mark as photograph or
  3D visualisation, "use as cover"), and drawings. Images upload straight from the browser to Vercel Blob
  (drag and drop works). Switch **Published** off to keep a project as a draft; a published project needs a
  location, summary, description and cover photo.
- **Videos** — ordered list of the films on the public `/videos` page (drafts marked "Draft"), with the same
  arrows, pencil and bin as projects. Add a video with a title, an optional link to a project (shows its
  location, type of work, area and year under the title), optional credits, and **either** a YouTube link
  (any common link format) **or** an uploaded mp4/webm/mov file (up to 500MB, uploaded straight to Vercel
  Blob), plus an optional cover image (YouTube videos fall back to their thumbnail). A published video needs a
  source. While no videos are published the page says "Coming soon".
- **Messages** — inbox of contact submissions, newest first, mark as read on open, delete.
- **View website** — button in the admin header that opens the public site.

Every save, reorder and delete revalidates the public pages on the server, so the website shows the change
on the next page load, with no redeploy.

How sign-in works: `/api/admin/login` checks the username/password on the server and sets a signed,
`httpOnly`, same-site session cookie (7 days; needs `ADMIN_SESSION_SECRET`). Every `/api/admin/*` route
checks that cookie, then reads/writes Firestore using the server's private Firebase account (see "Setting up
the backend", step 4). The browser never talks to Firestore for admin work.

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add a Vercel Blob store (Storage → Create Database → Blob) and connect it to the project — this
   provisions `BLOB_READ_WRITE_TOKEN` automatically.
3. Add the remaining environment variables in Project Settings → Environment Variables: the
   `NEXT_PUBLIC_FIREBASE_*` vars plus `FIREBASE_ADMIN_EMAIL`, `FIREBASE_ADMIN_PASSWORD` and
   `ADMIN_SESSION_SECRET` and `ADMIN_USERS`. A real Firebase service-account JSON is not needed.
4. Deploy. In production `ADMIN_SESSION_SECRET` is required, otherwise sign-in is disabled.
5. Sign in to `/admin` on the deployed site. While `projects` is empty the list shows the built-in samples
   with a **"Save these projects and start editing"** button; or just start adding real projects.

## Testing locally without touching production data

`npx firebase-tools emulators:start --only firestore,auth` runs a local Firestore and Auth. With
`NEXT_PUBLIC_USE_FIREBASE_EMULATORS="true"` in `.env.local`, both the public site and the admin API use the
emulator (create the private account in it first with the `signUp` call from step 4 pointed at
`http://127.0.0.1:9099/identitytoolkit.googleapis.com`). Image uploads still go to the real Blob store.
Set the flag back to `"false"` (or remove it) to use the real project again.

## Search engine pings

After an admin save, `revalidateSite()` pings IndexNow (Bing, Yandex and partners) with the sitemap's URLs,
in production only and never blocking the save. After a code deploy, `.github/workflows/indexnow.yml` does the
same. To run it by hand: `npm run indexnow` (add `-- --dry` to just list the URLs). The IndexNow key is public by
design; it is served as a text file from `public/`.

## Notes

- If Firestore is configured but a read fails for any reason — or succeeds with zero published projects
  (e.g. before anything has been saved or published) — `getProjects()` falls back to the local seed data
  rather than showing an empty site. `getVideos()` does the same with the list in `src/lib/content/videos.ts`.
- Firestore rules changes (such as the `videos` collection) take effect only after
  `npx firebase-tools deploy --only firestore:rules`.
- Build with `npm run build` (webpack); the Turbopack build can't resolve the Jost font files.
