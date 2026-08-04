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

| # | What | Where | Status |
|---|------|-------|--------|
| 1 | Connect the quote form | `index.html` → `<form ... action="…">` | **done** — Formspree |
| 2 | Real domain | `index.html` head + structured data, `sitemap.xml`, `robots.txt` | **done** — chaneyspressurewashing.com |
| 3 | Google review link | `index.html` → `#leave-review` + footer, `vercel.json` → `/review` | **done** — short link is chaneyspressurewashing.com/review |
| 4 | Facebook link | `index.html` → footer + structured data `sameAs` | **done** |
| 4b | Instagram link | `index.html` → footer | **hidden** — no account yet, icon commented out |
| 5 | 3 more before & after pairs | `assets/img/gallery/` | waiting — one real pair is in, other 3 tiles commented out |
| 6 | Real reviews on the page | `index.html` → Reviews section | waiting — section removed until real ones exist |
| 7 | Contact email | `privacy.html` + structured data | **done** |
| 8 | Turn on search engines | — | **done** — indexing on since 2026-07-29 |

Instagram stays commented out rather than deleted, because a button pointing at a
placeholder URL is a dead link on a site that is publicly reachable. The block
carries instructions — switching it on is uncommenting and pasting a URL.

If the form is ever disconnected again, it tells visitors to call rather than
silently failing.

### If placeholder content ever goes back up

Search engines are **on**. Before restoring anything with placeholder text or
"photo needed" artwork, hide the site from Google *first*, or that content gets
cached against Chaney's name — which is the slowest thing here to undo:

1. `index.html` — add a robots meta tag set to `noindex, nofollow`
2. `privacy.html` — change its robots tag to match
3. `robots.txt` — replace the `Allow: /` block with `Disallow: /`

Reverse all three once the real content is in, then re-submit the sitemap in
[Google Search Console](https://search.google.com/search-console).

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

## The "Leave a review" section

`index.html` → `#leave-review`. The words LEAVE A REVIEW start covered in grime and
a pressure washer sweeps across and cleans them. It runs once, when the section
scrolls into view.

**How it works**, in case it ever needs changing: the same word is drawn twice, one
dirty copy and one clean copy sitting exactly on top of it. A mask slides left to
right revealing the clean one, and the wand rides the same keyframes so the nozzle
stays on the wet edge. All of it is in `styles.css` under "LEAVE A REVIEW" and eight
lines at the bottom of `main.js`.

The resting state is the **clean, finished** one. With JavaScript off the visitor
just reads the words normally — `main.js` is what dirties it and runs the wash.
Anyone who has asked their system for reduced motion gets the clean state too.

### The short link — chaneyspressurewashing.com/review

For asking in person or by text, while the customer is still standing on the clean
driveway. `/reviews` works too, because people say it both ways. Either one jumps
straight to the Google review form.

It is a redirect in `vercel.json`, not a page. Nothing to maintain, and it is
deliberately a **temporary** redirect (`"permanent": false`): a permanent one gets cached in the customer's
browser forever, so if the Google listing were ever recreated with a new ID, anyone
who had used the old link would keep landing on the wrong business with no way to
clear it.

Worth Ty having that link saved in his phone — the best moment to ask is the moment
the job is finished.

> **If the site ever moves off Vercel**, this redirect is the one thing here that
> does not come with it — `vercel.json` is Vercel's file. The buttons on the page
> keep working anywhere, because they link to Google directly. Re-create `/review`
> on the new host.

### Changing where it points

The Google *write-a-review* link appears in **three** places, and all three must
match:

```
https://search.google.com/local/writereview?placeid=ChIJ03ljkkPl7IgRjE0BMG9oFt4
```

1. `index.html` → the `a.wash-card` in the `#leave-review` section
2. `index.html` → the footer "Leave a Google review" link
3. `vercel.json` → the `/review` redirect

The `placeid` is what ties it to Chaney's Google listing. **If that listing is ever
deleted and recreated, the ID changes and all three break** — they will still open
Google, just not the right business, which is worse than a dead link because nobody
notices. Re-check it any time the profile is touched.

Don't relabel this "Read our reviews". It drops the customer into a review form, and
a label that promises something else loses them at exactly the wrong moment.

**No star ratings here, deliberately.** Stars drawn on the page read as a claimed
rating. Google generates real ones from the Business Profile, and hand-written
`aggregateRating` markup violates their guidelines.

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
| `state-capitol.*` | Recent work grid | 1:1 square |
| `commercial-office.*` | Recent work grid | 1:1 square |
| `storefront.*` | Recent work grid | 1:1 square |
| `historic-residence.*` | Recent work grid | 1:1 square |
| `stadium-structure.*` | Recent work grid | 1:1 square |
| `stadium-seating.*` | Recent work grid | 1:1 square |
| `og-share.*` | Facebook/text-message preview | 1200 x 630 |

**Adding a photo to the recent-work grid:** copy one `<li class="recent-item">…</li>`
block in `index.html`, point it at your new file, and write an `alt` line describing
what is actually in the shot. Square (1:1) images keep the grid tidy.

**Processing a batch of new phone photos:** `tools/process-photos.py` takes HEIC
files from `~/Downloads`, corrects rotation, crops each to the right shape, and
writes matching `.jpg`/`.webp` pairs into `assets/img/work/`. Add a row to the
`JOBS` list at the top of the script (source filename, output slug, width, crop
aspect, vertical bias) and run it:

```bash
python3 tools/process-photos.py
```

**Never reuse an existing slug for different content.** `vercel.json` caches
everything in `assets/img/` as `immutable` for a year — browsers are told to
never even check whether the file changed. Give new content a new filename and
update the reference in `index.html`; don't overwrite an old one, or some
visitors keep seeing the old photo regardless of redeploys.

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

## Editing `vercel.json`

**It cannot hold comments.** Vercel validates the file against a published schema
with `additionalProperties: false`, so any extra key — including a `"//"` used as a
comment — fails the build outright, and the site keeps serving the previous
deployment. Explain things here in the README instead.

Check a change before pushing:

```bash
curl -sS https://openapi.vercel.sh/vercel.json -o /tmp/vercel-schema.json && python3 -c "import json,jsonschema;jsonschema.Draft7Validator(json.load(open('/tmp/vercel-schema.json'))).validate(json.load(open('vercel.json')));print('valid')"
```

A failed deploy shows up as a red check on the commit in GitHub, not as a broken
site — which is safe, but easy to miss if nobody looks.

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

## Who the site says runs the business

Chaney's is **Ty Chaney**, and the copy says so plainly — he owns it and does the
work, with a hand alongside him when a job calls for it. That is a selling point
against the franchise operators, so it is stated rather than implied.

Nothing on the page says "crew", "team", "our technicians" or "family-owned". Those
promise a headcount that isn't there, and a customer notices on the day. If wording
is ever added here, keep it singular. Ty is named in:

- the meta description and the Facebook/share description (`index.html` head)
- the "Why Chaney's" intro and its first checklist item
- the thank-you message after a quote request
- the final call-to-action and the footer
- the structured data, as `founder` and `employee`

Two photo `alt` descriptions say what is happening without naming who is in shot,
because it was never confirmed whether those are Ty. If they are, say so in the alt
text — it is worth the credit.

---

## Notes on what is deliberately *not* on this site

These were left out because the information hasn't been confirmed. Adding anything
invented here would risk both customer trust and Google penalties.

- **No street address — settled, not pending.** Ty works out of his home; the truck
  stays there. There is no business premises to publish, so the `PostalAddress` block
  stays locality-only ("Tallahassee, FL"). Do not add a home address here. The place
  for the service area is the Google Business Profile, which supports hiding the
  address and listing a service radius instead — see "Search engines" below.
- **No opening hours — settled, not pending.** A one-man operation does not keep
  posted hours. No `openingHoursSpecification` block. Publishing invented hours is
  worse than none: it creates a promise that gets broken on the first missed call.
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
