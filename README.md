# Chaney's Pressure Washing & Soft Wash — website

A single-page website. Plain HTML, CSS and JavaScript — no build step, no framework,
no dependencies to keep updated. Upload the folder to any host and it works.

```
index.html            the whole page
privacy.html          privacy policy
assets/css/styles.css all styling (brand colours defined at the top)
assets/js/main.js     menu, form validation, form submission
assets/fonts/         Barlow Condensed + Inter, self-hosted (63 KB total)
assets/img/           logos, icons
assets/img/work/      real job photos (hero, gallery, recent work, share image)
assets/img/gallery/   before & after placeholders still awaiting photos
robots.txt            search engine instructions
sitemap.xml           list of pages for search engines
```

---

## Before you go live — checklist

Search the project for `REPLACE` to find every one of these.

| # | What | Where |
|---|------|-------|
| 1 | ~~Connect the quote form~~ — **done**, posting to Formspree | `index.html` → `<form ... action="…">` — see below |
| 2 | **Real domain** (5 places) | `index.html` head + structured data, `sitemap.xml`, `robots.txt` |
| 3 | **Google Reviews link** | `index.html` → "Read Our Google Reviews" button |
| 4 | **Facebook + Instagram links** | `index.html` → footer |
| 5 | **3 more before & after pairs** | `assets/img/gallery/` — one real pair is already in |
| 6 | **Real reviews** | `index.html` → Reviews section |
| 7 | **Contact email** (optional) | `privacy.html` |
| 8 | **Turn on search engines** | see "Going live" below — the site is hidden from Google right now |

If the form is ever disconnected again, it tells visitors to call rather than
silently failing.

### Going live: unblock search engines

The site is currently set to **noindex** on purpose, so Google doesn't index the
"photo needed" placeholders and the unconnected form against Chaney's name — that is
slow and painful to undo once it happens. When the checklist above is finished:

1. `index.html` — delete the `<meta name="robots" content="noindex, nofollow">` line
   (and the comment block above it)
2. `privacy.html` — change its robots tag to `index, follow`
3. `robots.txt` — delete the `Disallow: /` block and uncomment the `Allow: /` block

Then submit the sitemap in [Google Search Console](https://search.google.com/search-console).

---

## The quote form

**Connected.** Submissions go to Formspree, which emails them to the address on that
Formspree account. The destination is this one line of `index.html`:

```html
<form class="quote-form" id="quoteForm" method="POST"
      action="https://formspree.io/f/mjgnppop"
```

**To change who receives quote requests**, log in at [formspree.io](https://formspree.io)
and change the notification email on the form — do *not* edit the website. The site
does not need to be touched or redeployed for that.

Free Formspree allows **50 submissions per month**, which is ample for a local service
business. Formspree emails the account owner when it is close to the limit.

Any service that accepts a normal form POST works here. The success message,
validation and spam filtering are independent of the provider.

### Photos are asked for by text, not uploaded

The Formspree plan in use **rejects file uploads** — a submission carrying a real
file fails outright with "File Uploads Not Permitted", which would lose the whole
lead over an optional field. So the site does this instead:

- the photo picker stays on the form, and its hint says photos will be texted
- on submit, the files are dropped from the POST so the request always succeeds
- if photos *were* chosen, the request includes a `photos_note` field flagging how
  many, and the thank-you screen asks the customer to text them to 850-566-WASH

The lead always arrives either way. Most homeowners find texting a photo easier
than uploading one anyway.

**If uploads are ever enabled** on the Formspree plan: delete the photo block in
`assets/js/main.js` (marked with a comment) and the `successPhotoNote` paragraph
in `index.html`. Nothing else depends on it.

### Cache busting

`index.html` and `privacy.html` load CSS and JS with a `?v=N` suffix. Assets are
cached hard for speed, so **after editing `styles.css` or `main.js`, bump that
number** in both files — otherwise returning visitors keep running the old file.

**Switching provider later** (Netlify Forms, Basin, Getform, your own server) is the
same single edit. Field names sent with each submission:

`name`, `phone`, `email`, `address`, `property_type`, `service`, `message`, `photos`, `contact_method`

**Spam protection** is already built in, no CAPTCHA required:
- a hidden honeypot field (`_gotcha`) that only bots fill in
- a timing check that ignores anything submitted within 3 seconds of the page loading

---

## Add or replace before & after photos

Tile 1 is a **real project** — a commercial flat roof, before and after. Its photos live
in `assets/img/work/` (`roof-before.*`, `roof-after.*`).

Tiles 2–4 are still placeholders, reading from `assets/img/gallery/`:

```
project-2-before.jpg   project-2-after.jpg     Residential — driveway & sidewalk
project-3-before.jpg   project-3-after.jpg     Commercial — storefront exterior
project-4-before.jpg   project-4-after.jpg     Commercial — concrete & pavement
```

The best thing you can add here is a **matched pair**: the same wall, same angle, one
dirty and one clean. Those three tiles are waiting for exactly that.

**To swap a photo:** save your picture over the matching file, keeping the exact same
filename. That's it — no code to edit.

Tips: shoot before and after from the same spot, use a 4:3 landscape shape, and save
around 1200 x 900 pixels so pages stay fast.

**To change a caption**, edit its `<figcaption>` in `index.html`.

**To add a fifth project**, copy a whole `<figure class="ba-card">…</figure>` block in
`index.html`, change the four filenames to `project-5-…`, and drop the new photos in.

> Six of the files there are still grey "PHOTO NEEDED" placeholders, and the page says
> so in print underneath the gallery. Delete that note once real photos are in: search
> `index.html` for `Three tiles still need photos`.

---

## Add real reviews

In the Reviews section of `index.html`, replace each placeholder card:

```html
<li class="review is-placeholder">
  <svg class="quote-mark" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-quote"/></svg>
  <p class="review-text">Review placeholder — a real customer review will appear here.</p>
  <p class="review-meta">Awaiting verified review</p>
</li>
```

with the customer's own words:

```html
<li class="review">
  <svg class="quote-mark" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-quote"/></svg>
  <p class="review-text">"Their exact words, copied from the review."</p>
  <p class="review-meta">Sarah M. · Tallahassee</p>
</li>
```

Remove `is-placeholder` so the dashed border becomes solid. Once every card is real,
delete the "Placeholder reviews" note below them.

Only publish reviews the customer actually left. Don't add star ratings to the page
unless they come from a real, published rating.

---

## Change the phone number

The number appears in several places. Search `index.html` for both forms and replace
each one:

- display text — `850-566-WASH` and `850-566-WASH (9274)`
- links — `tel:+18505669274`
- structured data — `"telephone": "+1-850-566-9274"`

Also check `privacy.html`. The phone number is part of the logo image too, so a new
number means new logo artwork from your designer.

---

## Real job photos (`assets/img/work/`)

These are Chaney's own photos, processed for the web. Every file exists twice — a
`.webp` (what nearly every browser gets) and a `.jpg` (fallback). **Replace both, or
the old WebP keeps showing.**

| File | Where it appears | Shape |
|---|---|---|
| `hero-action.*` | Hero, right side | 4:5 portrait |
| `roof-before.*` / `roof-after.*` | Before & after gallery, tile 1 | 4:3 landscape |
| `residential-home.*` | Bottom of "Why Chaney's" | 3:2 landscape |
| `landmark-capitol.*` | Recent work grid | 1:1 square |
| `commercial-office.*` | Recent work grid | 1:1 square |
| `storefront.*` | Recent work grid | 1:1 square |
| `historic-residence.*` | Recent work grid | 1:1 square |
| `stadium-structure.*` | Recent work grid | 1:1 square |
| `stadium-seating.*` | Recent work grid | 1:1 square |
| `og-share.*` | Facebook/text-message preview | 1200 x 630 |

**Adding a photo to the recent-work grid:** copy one `<li class="recent-item">…</li>`
block in `index.html`, point it at your new file, and write an `alt` line describing
what is actually in the shot. Square (1:1) images keep the grid tidy.

### Two things worth knowing about phone photos

**iPhone photos carry a rotation tag.** The pixels are stored one way and a separate
tag says "turn this 90°/180° when displaying." Some tools ignore the tag, which is how
a photo ends up sideways or upside down on a website while looking fine on the phone.
Four of the ten photos here were affected. If you add photos and one looks wrong,
that's why — open it and re-save it, or say so and it can be fixed.

**Captions don't name any client.** Descriptions say what was cleaned ("historic
government building", "storefront & walkway"), never who owns it. Commercial contracts
sometimes restrict using a client's name in advertising, and this avoids the question.
Note that a couple of photos have business signage visible in the frame — the caption
stays neutral, but the sign is legible. If any client would object, swap that photo.

---

## Brand colours and fonts

All defined once at the top of `assets/css/styles.css`:

```css
--electric: #087BFF;   --deep:   #0047B8;   --jet:    #080A0D;
--white:    #FFFFFF;   --chrome: #C9D2DC;   --ice:    #DCEEFF;
```

Headlines use Barlow Condensed ExtraBold, body copy uses Inter — both served from
`assets/fonts/`, so the site loads no third-party resources and sets no cookies.

Deep Blue is used for button fills rather than Electric Blue: white text on Electric
Blue is too low-contrast to meet accessibility standards at button size. Electric Blue
carries the accents, borders, icons and headline highlights instead.

---

## Hosting

Any static host works. Drag the folder onto [Netlify Drop](https://app.netlify.com/drop),
or use Vercel, Cloudflare Pages, GitHub Pages, or ordinary cPanel hosting. There is
nothing to build and no server to run.

To preview locally, run this from inside the project folder and open http://localhost:8000:

```bash
python3 -m http.server 8000
```

---

## Notes on what is deliberately *not* on this site

These were left out because the information hasn't been confirmed. Adding anything
invented here would risk both customer trust and Google penalties.

- **No street address** — only "Tallahassee, FL and surrounding areas". Add a real
  address to the `PostalAddress` block in `index.html`'s structured data once confirmed.
- **No opening hours** — add an `openingHoursSpecification` block when known.
- **No star rating** — Google generates rating stars from your Business Profile, not
  from the page. Never hand-write an `aggregateRating`; it violates Google's guidelines.
- **No guarantees, certifications or awards** beyond "Licensed & Insured", which was
  supplied.
- **No specific years of individual staff experience** or job counts.

## One thing to check with your designer

The circular "SINCE 2001" longevity badge in the supplied brand pack spells the word
**"SURROONDING"** instead of "surrounding". Because of that, the badge is not used
anywhere on the site — the "Since 2001" message is set in Barlow Condensed instead.
The file is saved at `assets/img/badge-since-2001.png` if you want it once corrected.

The logo artwork itself was used exactly as supplied — cropped out of the brand sheets
and given a transparent background, with no redrawing or recolouring.
