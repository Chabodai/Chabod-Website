# Legal review needed

**No attorney review yet. No liability insurance yet.**

Everything on the legal pages (Privacy Policy, Website Terms of Use, Service Terms, SMS Terms) was drafted
without a lawyer. This file lists what a Texas attorney should look at first, and what depends on Andres.
Nothing on the website says anything about Chabod's insurance, bonding, licensing, background checks or
certification, and nothing should until that is true.

Effective date and version are at the top of each of the four pages (set again at publish).

---

## HIGH RISK (attorney, please look at these first)

1. **Limit of liability, Service Terms section 8.**
   - Cap = the amount the client paid for the visit in which the loss happened. Andres approved this as drafted.
     **The cap amount (visit price, or a larger fixed floor) is the attorney's to set.**
   - It says the limit applies even to our own ordinary negligence, in bold capitals, in a boxed paragraph
     (written to meet Texas "fair notice" / express-negligence rules). Attorney to confirm it is conspicuous and
     enforceable for consumers.
   - It also excludes indirect losses (lost rental income, lost or cancelled bookings, guest refunds, lost profits).
     That exclusion was added by Claude and is not on the approved list. It matters most for STR hosts.
   - Carve-outs written in: bodily injury or death; gross negligence or willful misconduct; rights under the Texas
     Deceptive Trade Practices Act (DTPA) or another law that cannot be limited by contract.
   - There is **no DTPA waiver, no contractual deadline to sue, no arbitration clause and no class-action waiver.**
     Do not add any without an attorney.
   - Chabod has no liability insurance today. A cap is not a substitute for insurance.
   - Website Terms of Use section 6 has a separate, bold limitation for the website and blog only.

2. **Deposit forfeiture and prepaid money (Service Terms sections 5 and 6). HIGH PRIORITY.**
   - **New clients pay a $50 booking deposit to hold the date. It is credited to the first visit. If the client
     cancels that booking, the deposit is NOT refunded. If Chabod cancels or cannot do the work, it is refunded in
     full.** Recurring clients pay no deposit. (Andres chose this wording; "Version B", credit-only for all prepaid
     money, was deleted.)
   - **Moving the first visit:** a new client may move the date of the first visit up to 3 times and the deposit stays
     with the booking. **What happens at a 4th move is undecided** (the text says "talk to us"). The 3-move limit
     applies only to a new client's first booked visit; recurring visits keep the 24-hours'-notice rules in section 6.
   - **The deposit forfeiture stays HIGH priority for the attorney.**
   - A non-refundable deposit can look like a cancellation fee or a penalty. The site and two posts say "no
     contracts" and "no penalty." Check against Texas consumer law (including the DTPA) and whether $50 is a
     reasonable estimate of loss.
   - The Service Terms now say: "There is no cancellation fee or lockout fee. A new client's $50 booking deposit is
     not refunded if that booking is cancelled." That sentence must stay in the key-terms box and in section 6.
   - Recurring clients are prepaid monthly. We credit or refund prepaid amounts for visits we cancel or miss, for
     visits after a client stops service (refund or credit within 14 days), and for prepaid visits we do not perform
     if we end service. **Attorney to review all refund/credit language.**
   - Never publish a bare "no refunds" for prepaid money.
   - Two stored posts were reworded so they stay true (see below); the pages' "no contracts" and "no lock-in fees"
     lines are proposals only, pending Andres: "no long-term contracts."

3. **Cancellation: no late-cancel fee and no lockout fee (decided by Andres).**
   A lockout fee can be added later, but only with attorney review **and** matching changes to the two blog posts
   `trapped-cleaning-contract-san-antonio` and `superhost-status-cleaning-company-san-antonio`, and to the "no
   contracts" lines on the pages.

4. **Pre-suit notice (Service Terms section 13).** 60 days' written notice before filing, Texas law, Bexar County,
   small claims allowed. It is written as a step to settle things, "not a time limit on any claim." Attorney to
   confirm it cannot be read as a contractual limitations period.

5. **"Report within 24 / 48 hours" windows (sections 7 and 8).** Written as requests, never as cut-offs. Late reports
   are not barred. Keep it that way.

6. **Team members.** The documents say "our team members" and make no statement about employee or contractor status.
   Attorney to confirm the classification and whether any wording needs to change.

7. **Texting (SMS Terms and the quote form).**
   - Andres will send **both service texts and promotional texts.** The form has the service disclosure under the
     button, plus a separate unchecked box: "Yes, text me offers and updates from Chabod Cleaning Services LLC at
     this number. By checking this box I agree to receive automated marketing texts. Message frequency varies.
     Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of
     purchase. See our SMS Terms and Privacy Policy."
   - Offers and updates are sent only between 8 a.m. and 9 p.m. in the recipient's local time. Replies to messages
     we receive are not restricted.
   - Opt-in wording, STOP/HELP handling and the consent records need review against TCPA / CTIA / carrier rules before
     10DLC registration. The "reply STOP" promise only holds if whatever sends the texts honours STOP.
   - **Consent records:** the policy says only "We keep a record of when and how you agreed to texts" with **no time
     period** until the Supabase consent table is built and approved (see DEPENDS ON ANDRES).
   - The mobile-information sentence is: "We do not share your mobile phone number or your text-message opt-in or
     consent information with third parties or affiliates for their marketing or promotional purposes. We share it
     only with service providers that help us run our forms and messages, and only for that purpose."

8. **Privacy Policy.**
   - It says we do not sell personal information for money, and that "Accept all" lets Meta receive visit information
     that some laws call "sharing" or a "sale." Attorney to confirm the wording, and whether Chabod is covered by
     Texas (TDPSA) or California (CPRA) privacy laws at all.
   - Global Privacy Control is treated as "Reject non-essential." "Do Not Track" is not acted on; the policy says so.
   - Accepted tools "may collect information about your activity over time and across websites."
   - Access / correct / delete requests: by email, answered within 45 days.

9. **STR section (Service Terms section 11).** New. Covers authority to book and grant access, guests' belongings,
   problem reports not being an inspection, use of scheduling platforms (Turno, Guesty, Hospitable, OwnerRez, Suite
   Ops, Breezeway; "not affiliated"), calendar and time responsibility, and linens and supplies. Attorney to review.

10. **Past data exposure, for the record.**
    - Since the Meta Pixel went live, **real submissions of the fee-calculator form sent hashed name, phone and
      email to Meta** through Meta's automatic advanced matching, and form-field details through automatic
      button/form detection. Both are now switched OFF in Meta Events Manager (Andres checked, screenshots seen),
      and also in code (`fbq('set','autoConfig',false,...)` before init).
    - Andres's **"ZZ TEST" submissions also fired real Lead events** (name `ZZ TEST Claude (ignore)`, phone
      555-555-0100, email zz-test-ignore@example.com), and Claude's audit runs did too. Andres deletes those leads
      from the Formspree inbox himself.
    - Meta Conversions API: **not verified.** Andres is checking. Nothing is assumed.

---

## DEPENDS ON ANDRES

- **Deletion job (36 months).** Andres is building it. **Published now:** "We keep job photos and records for as
  long as we need them for the purposes above, generally at least 36 months." **Switch to the firm sentence ("We
  keep job photos and records for 36 months, after which we delete or de-identify them") only after the deletion job
  runs.** Build flag: `RETENTION=firm` in the page generator.
- **Supabase consent-record table.** Not built. When built and approved, add Supabase as a provider in Privacy
  section 4 **in the same deploy**, and only then consider stating a retention period for consent records.
- **Records to keep for advertising claims.** Andres confirmed "60+ STR properties" and "13 trained teams" are true.
  **He must keep records that prove both** (client or property lists, team rosters, training records). "250+ repeat
  clients" was NOT confirmed and has been removed everywhere. Only "5.0 on Google · 44 reviews" (the Google rating
  already shown on the site) replaces it.
- **STR payment due term.** "Due on completion" (per-turnover invoice), as decided.
- **Text-messaging platform and 10DLC registration.** Not named anywhere on the site. GoHighLevel must not be
  mentioned until it is installed. STOP and HELP handling must work before the SMS Terms are used for a registration.
- **Mailing address.** Email only for now.
- **Meta Conversions API** check, and Meta ad settings.
- **Cloudflare Web Analytics.** Kept on. Described as "Cloudflare, aggregate visit counts, no cookies."
- **Microsoft Clarity dashboard** masking mode (Settings, Masking: Balanced). Form fields are also masked in code
  (`data-clarity-mask="True"` on the fee form, its name, phone and email fields, and the offers checkbox).

---

## Facts Andres confirmed (used exactly; nothing added)

1. **Keys and access.** Chabod does not receive or keep keys. Where a property uses a lockbox or door code, we use the
   access the client provides only for the scheduled visit, handle it under our internal procedures, and share it
   only with the team members assigned to the job. **Do not claim** encryption, deletion after the job, or any
   other specific safeguard.
2. **Training.** New team members complete an onboarding process and a two-week training program. "Trained" claims may
   stay. **Never say** background-checked, certified, licensed or insured.
3. **Meta Conversions API.** Still being checked.
4. **No attorney. No liability insurance.** Say nothing about insurance, bonding or licensing anywhere on the site.
   Keep the clause that the client is responsible for insuring their own property.
5. **Mailing address.** Email only for now (home@chabodcleaningservices.com).

## Things to settle

- **"You do not sign anything" (Service Terms) vs. the blog.** The post `trapped-cleaning-contract-san-antonio` says
  Chabod asks every owner to sign a scope of work. Either the post or the terms need to change so they agree.
- **"No contracts" and "no lock-in fees" stay** on all pages and footers (Andres's decision). The posts now say "no
  cancellation fees" while the Service Terms say a new client's $50 deposit is not refunded if that booking is
  cancelled. Attorney to look at whether those can both be said.
- **Absolute wording that was left alone:** STR page "there's always a clear record of who was there and when" and
  "so quality never depends on who shows up".

## Clauses Claude added that were not on the approved list (confirm or delete)

- Quotes are based on what the client tells us; we agree any price change before starting (section 2).
- Client's part: access, secured pets, valuables put away, tell us about hazards or existing damage (section 3).
- We may skip or stop an unsafe area and say why (section 3).
- Not responsible for damage that was already there, normal wear and tear, or items already broken, loose or unsafe (section 8).
- Indirect losses excluded (lost rental income and so on) inside the boxed limit (section 8).
- The client confirms they own the property or may arrange cleaning (section 10).
- Where a commercial proposal and the Service Terms differ, the proposal controls (section 12).
- Severability and "entire agreement" sentence (section 14).
- Website Terms of Use: information-only (not legal, tax or financial advice) and acceptable-use rules.

## Posts reworded so they stay true (production KV changes only after approval)

- `trapped-cleaning-contract-san-antonio`: three lines (see the approval message for exact before and after).
- `superhost-status-cleaning-company-san-antonio`: one line.
- The staged copies are in `legal-staging/`; originals are in `legal-archive/kv-*` and in the scratch copies of
  production KV. Production is untouched until Phase 4.

## Where the old and staged versions are

- `legal-archive/` has the old privacy page, old terms page, old loader (`analytics.js`), the stored fee-calculator
  post exactly as it was before the consent form was added, the post index, and the SMS consent text
  (`sms-consent-v2-2026-10-04.txt`).
- `legal-staging/` has the new fee-calculator post, the two reworded posts, and test screenshots. All tested on LOCAL
  KV only.
