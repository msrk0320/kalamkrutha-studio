# Placeholder images: replace before launch

Every image here was AI-generated with Codex (OpenAI image generation) on 2026-10-17. None of them are Kalamkrutha Digital Studio’s real work and none show real clients. The three stories (Priya & Ravi, Grace & Samuel, Anjali & Kiran) are sample couples; their names live in `lib/content/stories.ts` (`placeholder: true`).

## How to replace a photo

1. Put the studio’s photo in `_source/img/` (or `_source/img/v2/`) with the source filename listed in `scripts/build-images.mjs`, keeping roughly the same orientation.
2. Run `npm run images`. This rewrites the WebP files here and `lib/content/image-manifest.json`.
3. Update the alt text for that key under `Images` in `messages/en.json`, `te.json` and `hi.json`.

| Key | File | Size | Used in |
|---|---|---|---|
| hero1 | hero1.webp | 1536×1024 | Home hero slideshow; cover of sample story 1 |
| hero2 | hero2.webp | 1536×1024 | Home hero slideshow |
| hero3 | hero3.webp | 1536×1024 | Home hero slideshow |
| s1Talambralu | s1-talambralu.webp | 1024×1536 | Sample story 1 (Telugu wedding) |
| s1Jeelakarra | s1-jeelakarra.webp | 1024×1536 | Sample story 1 |
| s1Candid | s1-candid.webp | 1536×1024 | Sample story 1; Candid Photography service |
| s1Mangalsutra | s1-mangalsutra.webp | 1024×1024 | Sample story 1 |
| s2Cover | s2-cover.webp | 1024×1536 | Sample story 2 cover (church wedding) |
| s2Rings | s2-rings.webp | 1024×1024 | Sample story 2 |
| s2Family | s2-family.webp | 1536×1024 | Sample story 2 |
| s2Bride | s2-bride.webp | 1024×1536 | Sample story 2 |
| s3Fort | s3-fort.webp | 1536×1024 | Sample story 3 cover (pre-wedding) |
| s3River | s3-river.webp | 1024×1536 | Sample story 3 |
| s3Field | s3-field.webp | 1024×1536 | Sample story 3 |
| s3Closeup | s3-closeup.webp | 1024×1024 | Sample story 3 |
| weddingRitual | wedding-ritual.webp | 1120×1400 | Wedding Photography service |
| prewedding | prewedding.webp | 1536×1024 | Pre-Wedding service |
| svcTraditionalVideo | svc-traditional-video.webp | 1536×1024 | Traditional Videography service |
| svcCinematic | svc-cinematic.webp | 1536×1024 | Cinematic Videography service |
| svcPostWedding | svc-post-wedding.webp | 1024×1536 | Post-Wedding service |
| svcFunctions | svc-functions.webp | 1536×1024 | Functions & Events service |
| svcAlbum | svc-album.webp | 1536×1024 | Album Design service |
| svcStudioSitting | svc-studio-sitting.webp | 1024×1536 | Walk-in studio section |
| svcPassport | svc-passport.webp | 1024×1024 | Walk-in studio section |
