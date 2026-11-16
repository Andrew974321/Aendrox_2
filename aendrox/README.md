# AENDROX — local website

Complete Next.js App Router site built from the supplied brand images, assembly video, and frame sequence.

## Run locally

Requires Node.js 20.9+ and npm.

```powershell
cd 'D:\Aendrox_2\aendrox'
npm install
npm run dev
```

Open http://localhost:3000. For production mode run `npm run build`, then `npm start`.

## Included

- Nine page routes plus a custom 404, responsive navigation, and legal anchor navigation.
- Exact supplied branding, a session-only skippable video intro, and a replayable brand film.
- 48 optimized WebP frames for the scroll assembly, loaded near the section. Mobile and reduced-motion users receive static artwork.
- Pointer parallax, service tilt/details, project category filters, concept details, technology tabs, and a lazy React Three Fiber constellation.
- Local Inter and Space Grotesk fonts, metadata, sitemap, and robots settings.
- Validated contact endpoint with optional server-side Supabase storage and honest unconfigured/error responses.

## Enable contact storage

Copy `.env.example` to `.env.local`, supply `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and restart the server. Never prefix the service key with `NEXT_PUBLIC_`.

Run `supabase.sql` in your project's SQL editor. The table has RLS enabled with no public insert or read policy. The server uses the service-role credential. Successful responses are only shown after the database accepts a submission. Email delivery is not configured.

The endpoint validates sizes, types, the service selection, and consent; checks same-origin requests; includes a honeypot; and limits submissions in memory. For multi-instance public deployment, replace the in-memory limiter with a shared rate-limit service and configure a verified proxy/IP boundary. Configure retention and privacy practices before collecting real personal data.

## Editable content and pending information

`src/lib/data.ts` holds service, project, technology, experience, and legal section data. Product entries are explicitly concepts. No client results, employment records, contact details, or compliance claims are invented.

Legal screenshots were not supplied. Both legal pages are clearly marked editable drafts requiring professional review. Business identity, effective dates, jurisdiction, retention, and contractual decisions remain unfilled. Contact information and social links require verified values before publication.

The logo is rendered footage and artwork, not reconstructed mesh geometry. Individual gear motion is whatever the supplied video depicts; the site does not fake independent gears by rotating the logo image. The abstract constellation is actual WebGL geometry.

`prepare-assets.cjs` regenerates optimized media from the supplied original files in `D:/Aendrox Video`. Generated assets are already included; no regeneration is needed to run the site.

## Validation

```powershell
npm run typecheck
npm run build
node smoke.cjs
```

The smoke test expects the local server on port 3000 and a locally installed Playwright Chromium browser. It covers routes, links, images, mobile overflow/navigation, service details, portfolio filters, technology tabs, intro behavior, legal anchors, and contact validation.

## Future hosting

The app can run on Vercel using the `aendrox` folder as the project root. No deployment has been performed. Set `SITE_URL` to a verified domain, update metadata URLs, configure contact storage, approve legal content, and change the preview-only `robots.ts` disallow rule before any public release.





## Robotic chatbot
The Contact page includes an interactive local guide with preset service and project-planning answers. It does not submit inquiries. Chat history is held in component memory and cleared on reset or reload.

To enable live AI, set `OPENAI_API_KEY` and `OPENAI_CHAT_MODEL` in `.env.local` using a model available to your OpenAI project, then restart the server. Never prefix these with `NEXT_PUBLIC_`. The server uses the OpenAI Responses API with `store: false`, bounded message history, a timeout, and input validation. The UI labels live AI and discloses that messages are sent to OpenAI. Provider errors are shown honestly.

The in-memory limit is 15 messages per minute per forwarded client IP (shared local bucket without a proxy). Before public multi-instance hosting, use a shared limiter and a trusted proxy configuration. Live-provider calls require credentials and have not been verified locally.

Contact art was enhanced with built-in imagegen: preserve framing and chrome robot/gear identity; sharpen metallic details; remove static chat placeholders. Assets: `public/assets/contact/gear-enhanced.png` and `robot-enhanced.png`, with optimized WebP versions.

## 3D robotic assistant
The Contact assistant now lazy-loads `src/components/robot-scene.tsx`, an original procedural Three.js humanoid with hierarchical articulated joints (no external model download). It uses the existing Three.js, React Three Fiber, and Drei dependencies. Walking, waving, folding and idle motion are procedural, not a GLB skeletal clip or a moved screenshot. This stylized model is an approximation of the reference, not a photoreal production rig; foot locking and artist-authored animation blending remain refinements.

Skip and replay controls leave chat history intact. Reset asks for confirmation. Rendering pauses offscreen; reduced motion goes directly to the avatar pose. A rendering boundary and Canvas fallback leave chat usable without WebGL. Live AI still requires the server-only variables documented above. Run locally with `npm run dev`; validate with `npm run build`.

## Custom robot GLB
The new `public/assets/robot/aendrox-robot.glb` is an original Blender-authored model (2.14 MB), with 124 mesh parts, a 19-joint rigid mechanical skin and Idle, Walk, Wave and Transform clips. `tools/build-robot.py` regenerates it; editable source is `output/robot/aendrox-robot.blend` and preview is `output/robot/robot-preview.png`. No downloaded model or third-party textures are included. This replaces the earlier primitive-only robot runtime through `robot-asset.tsx`. The model is a stylized interpretation, not an exact reconstruction of the reference.
