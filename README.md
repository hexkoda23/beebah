# Laid by Beebah — portfolio website

A one-page portfolio site for **Habibat Abiola Sosanya**, founder of *Laid by Beebah*.
Built from the content in her Creative Portfolio PDF.

Pure HTML / CSS / JavaScript. **No build step, no backend, no dependencies.**

---

## Run it locally

Just open `index.html` in a browser.

Or serve it (recommended, so fonts and images behave exactly like production):

```bash
python -m http.server 5310
# then visit http://localhost:5310
```

---

## Deploy it (free)

Any static host works. Easiest options:

- **Netlify** — go to <https://app.netlify.com/drop> and drag the whole `beebah` folder in. Done, you get a live URL.
- **Vercel** — `vercel` in this folder, or drag-drop in the dashboard.
- **GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy from branch.

To use a custom domain (e.g. `laidbybeebah.com`), buy the domain and point it at
the host in that host's dashboard.

---

## Files

```
index.html            all page content — edit text here
assets/css/styles.css all styling, colours, layout
assets/js/main.js     all animations and interactions
images/work/          the 7 hairstyle photos
images/certs/         the 3 certificates
images/brand/         the BB Baddies services flyer (not currently on the page)
_source-not-published/  files deliberately kept OFF the website — see below
```

---

## Editing the common things

**Phone / WhatsApp / email / socials** — all in the `<!-- CONTACT -->` section near
the bottom of `index.html`. The WhatsApp link is `https://wa.me/2347042707206`.

**Add a new photo**
1. Drop the file into `images/work/`.
2. Copy an existing `<figure class="shot">` block in the `<!-- WORK -->` section and
   point it at your new file. Update the `alt` text and the caption.

The gallery and the lightbox pick up new photos automatically — no JS changes needed.

**Colours** — the palette lives at the top of `styles.css` under `:root`. Change
`--violet`, `--magenta` and `--gold` and the whole site reflows to the new scheme.

---

## Things you should check before going live

1. **Email address.** The PDF spells it three different ways
   (`soaanyahabibat@`, `sosanyahabiabt@`). The site currently uses
   **`sosanyahabibat@gmail.com`** — confirm this is right and fix it in
   `index.html` if not.
2. **TikTok URL.** The flyer only gives the display name "Bb Baddies", not the
   handle. The site guesses `@bb_baddies01` to match Instagram — verify it.
3. **Testimonials.** The reference site had a testimonials section. There were no
   real client quotes in the PDF, so none were invented. Add real ones when you
   have them.

## What was deliberately left out

`_source-not-published/instagram-screenshot.jpg` — a screenshot of the Instagram
profile taken from the PDF. It shows the private creator dashboard, the follower
count and app UI, so it is not appropriate for a public portfolio. It is kept here
for reference only and is not linked from the site.

---

## Accessibility & performance notes

- Every image has descriptive `alt` text.
- All motion is disabled automatically for visitors who have
  "reduce motion" turned on in their OS.
- The desktop horizontal gallery becomes a native swipe carousel on phones.
- Below-the-fold images are lazy-loaded.
