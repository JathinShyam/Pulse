# Publishing notes

The article is in [`pulse-medium-article.md`](pulse-medium-article.md). It is
written for Medium but stays readable as a repository document.

## Metadata

- **Title:** Everyone Can Send an Email. Almost No One Can Tell You What Happened Next.
- **Subtitle:** Building Pulse, a self-hosted notification service that treats delivery as an inspectable state machine.
- **Suggested tags:** Software Engineering, Distributed Systems, Django, Web Development, Self Hosted.
- **Canonical link:** <https://github.com/JathinShyam/Pulse>
- **Cover image:** `docs/images/web-landing-hero.png` (1440 × 900; check the
  Medium cover crop before publishing so the headline stays visible).

## Images to upload, in order

Medium does not keep the repository-relative paths in the article. Upload these
files at the matching positions and keep the captions from the Markdown.

| Position     | File                                      | Caption                                                                     |
| ------------ | ----------------------------------------- | --------------------------------------------------------------------------- |
| Hero         | `docs/images/web-landing-hero.png`        | Every notification system starts as a one-line feature.                     |
| Architecture | `docs/diagrams/system-architecture.png`   | One public entry point, two priority queues, three provider adapters.       |
| Request flow | `docs/diagrams/request-delivery-flow.png` | Synchronous acceptance on top, asynchronous delivery below.                 |
| Delivery log | `docs/images/web-deliveries.png`          | Provider error, attempt count, latency, and trace for every row.            |
| Auth flow    | `docs/diagrams/auth-session-flow.png`     | Browser JWTs stay in httpOnly cookies; the proxy attaches them server-side. |
| Dashboard    | `docs/images/web-dashboard.png`           | Volume, provider success, p95 latency, queue state, and recent sends.       |
| Composer     | `docs/images/web-composer.png`            | One request, one channel, one template, with the exact payload visible.     |
| Deployment   | `docs/diagrams/deployment-topology.png`   | Next.js and Django as separate services; operations tooling stays internal. |

## Links to update after publishing

Medium will not resolve links relative to this repository. Replace them with the
public GitHub URLs if the article is published outside the repository:

- `../known_limitations.md` → <https://github.com/JathinShyam/Pulse/blob/master/docs/known_limitations.md>
- `../diagrams/` → <https://github.com/JathinShyam/Pulse/tree/master/docs/diagrams>
- `https://github.com/JathinShyam/Pulse` is already absolute.

## Pull quote options

- “A queue moves messages. A delivery system has to decide who owns a message.”
- “Idempotency is a unique constraint. The database is the truth.”
- “At-least-once is a design decision, not a bug.”
- “An operator should not have to reverse-engineer the reliability model from a marketing page.”

## Short social excerpt

> Everyone can send an email. Almost no one can tell you what happened next.
>
> I built Pulse: a self-hosted notification service for email, SMS, and push where every request, retry, and provider response is inspectable. New write-up on the architecture, the database invariants, and the failures I chose not to hide.
