# Prototypes

**Nothing in this folder is live.** These are ideas to show and react to, kept out
of the deployed site on purpose.

## instant-estimate.html

A three-tap ballpark calculator: what needs cleaning, how big, how dirty, then a
price *range*.

**Every price in it is invented.** They are placeholders so the thing can be
demonstrated at all. Ty replaces them before this goes anywhere near a customer.
The numbers live in one clearly-marked `PRICING` block at the top of the script:

- `base`   — the typical price for a MEDIUM job in AVERAGE condition
- `sizes`  — multipliers, plus the wording the customer sees
- `SPREAD` — how wide the range is either side (currently 15%)

Final range = `base x size x condition`, widened by `SPREAD`, rounded to $25.

### Why a range and not a price

A firm number sight-unseen is a liability. Ty either honours a figure he could not
have known was wrong, or walks it back and loses the trust that won the call. A
range with an honest caveat gives the customer what they actually want — a sense of
whether this is a $300 or a $3,000 conversation — without committing him.

Commercial deliberately returns "let's talk" rather than a number. Too variable to
guess at, and those jobs deserve a real walk-through.

### What it is actually for

The price is the hook; the lead is the point. It answers the "how much?" call
without Ty picking up the phone, it filters out people who were never going to
book, and the ones who continue arrive pre-qualified with their job already
described.

### Before this could go live

- [ ] Ty sets every real number
- [ ] Decide whether he wants public pricing at all — some trades deliberately
      do not, to keep the conversation on the phone
- [ ] Wire "Get my exact price" into the real quote form, pre-filling the three
      answers so nobody re-types what they just picked
- [ ] Re-check the ranges after a month of real jobs
