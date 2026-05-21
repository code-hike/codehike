---
"codehike": patch
---

Declare zod as a peer dependency because `codehike/blocks` imports it at runtime and exposes zod v3 schema types.
