# Contract: Contact Form — Formspree Integration

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11

Defines the interface between `ContactComponent` and the Formspree email delivery service.

---

## Endpoint

```
POST https://formspree.io/f/{FORMSPREE_FORM_ID}
```

`{FORMSPREE_FORM_ID}` is stored in `src/environments/environment.ts` as `formspreeId` and is a public value (not a secret).

---

## Request

**Headers**:
```
Content-Type: application/json
Accept:       application/json
```

**Body** (`ContactSubmission`):
```json
{
  "name":    "Alice Recruiter",
  "email":   "alice@company.com",
  "message": "Hi, I'd like to discuss a senior Angular role.",
  "_gotcha": ""
}
```

**Rules**:
- `_gotcha` MUST be an empty string `""` in every legitimate submission. Formspree discards the submission silently if this field is non-empty.
- The field is rendered as `<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">` in the form template so real users never fill it.
- The Submit button MUST be disabled while any field is invalid (reactive form `formGroup.invalid`) and while a submission is in-flight.

---

## Response

### Success (HTTP 200)

```json
{ "ok": true }
```

**Angular handler**:
1. Show success banner: `"Message sent! I'll be in touch soon."` (visible for ≥ 3 seconds or until dismissed).
2. Reset all form fields to empty.
3. Emit `form_submit` event to GA4 via `AnalyticsService`.

### Error (HTTP 4xx / 5xx / network failure)

```json
{ "error": "ValidationError", "errors": [...] }
```

**Angular handler**:
1. Show error banner: `"Something went wrong. Please try again."` (persists until next submission attempt).
2. **Do not reset form fields** — preserve user input so they can retry.
3. Re-enable the Submit button.

---

## Client-Side Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | required, minLength 2 | `"Name must be at least 2 characters."` |
| `email` | required, pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `"Please enter a valid email address."` |
| `message` | required, minLength 10 | `"Message must be at least 10 characters."` |

Errors surface on `blur` (first time) and on `valueChange` after first touch.

---

## ARIA Requirements

- Each `<input>` / `<textarea>` MUST have an associated `<label>` via `for`/`id` or `aria-labelledby`.
- Error messages MUST be linked via `aria-describedby` on the input.
- The success/error banner MUST be an `aria-live="polite"` region so screen readers announce it without interrupting focus.
- Submit button MUST have explicit accessible name: `"Send Message"`.

---

## Rate Limiting

| Layer | Limit | Behaviour on Exceed |
|-------|-------|---------------------|
| Formspree (server) | Free tier: 50 submissions/month total | Formspree returns HTTP 429; Angular shows error banner |
| Angular (client) | Disable button on first submit; re-enable only on error | Prevents accidental double-submit |
