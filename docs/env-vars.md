# Contact form — environment variables

The `submitContact` server function (see `src/lib/contact-submit.functions.ts`) reads four values from the platform environment. Three are secrets; the fourth is a tag for rate-limit isolation between environments.

## Production / preview (set in the deploy platform)

| Name | Type | Required | Example | Notes |
| --- | --- | --- | --- | --- |
| `RESEND_API_KEY` | secret | yes | `re_…` | Resend production API key with "Sending access" scope. The user must sign up at https://resend.com, add the domain `torreabbondanza.com`, verify it via the three DNS records Resend shows (DKIM / SPF / return-path), and create a key once verification is complete. Configured in the platform's **Secrets** panel. |
| `ENV_TAG` | secret | recommended | `prod` (production) · `preview` (preview deploys) | Used as the rate-limit counter prefix (`kl:contact:${ENV_TAG}:${ip}`), so a `preview` deploy never shares counters with `prod`. Defaults to `"prod"` if unset. Configured in the **Secrets** panel. |
| `MAIL_FROM` | secret | optional | `Masseria Torre Abbondanza <info@torreabbondanza.com>` | The `From:` header on the auto-reply. Defaults to the same value in code if unset. Configured in the **Secrets** panel. |
| `RATE_LIMIT` | **KV binding** | yes | — | Cloudflare KV namespace bound to the project as `RATE_LIMIT`. **Different UI from secrets** — KV bindings are configured in the Cloudflare dashboard for the project (not the Secrets panel). The server function increments a 1-hour TTL counter per IP; more than 3 requests from the same IP in the window returns `{ ok: false, rateLimited: true }`. If the binding is absent, the function logs no error and lets every request through (dev fallback). |

## Local development

Locally you don't need the KV binding. For the email auto-reply, create a Resend account and a development API key. The other three values can be empty.

A stub `.env.example` (do **not** commit real values):

```env
# Local dev only — copy to .env and fill in. Never commit .env.
RESEND_API_KEY=
ENV_TAG=local
MAIL_FROM=Masseria Torre Abbondanza <info@torreabbondanza.com>
```

## Supabase

The same Supabase project is used for `contact_submissions`. The server function uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (set by the Supabase integration). The migration file `supabase/migrations/20261016_001_contact_submissions.sql` must be applied once via the Supabase SQL editor (it is not run by CLI in this repo).
