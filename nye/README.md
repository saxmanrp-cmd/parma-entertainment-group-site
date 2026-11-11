# NYE at Ahern landing page

Public path: https://parmaentertainmentgroup.com/nye/

This starter page reflects the supplied Ahern Hotel, live jazz and R&B, DJ, prime rib dinner, champagne toast and VIP experience details. December 31, 2026 is the working date for the upcoming NYE; times, performers, room, age policy, dress code, prices, exact package inclusions and refund terms still need confirmation. No hotel rooms, drinks beyond the announced toast, seating upgrades or particular VIP perks are promised.

The page is public but `noindex` while it is a starter. Remove that tag when final promotional content is ready. The existing homepage and rates section are preserved.

## Pay Hub integration scaffold

`event-config.js` keeps sales closed, with no prices and no checkout endpoint. No live payment intent is created in this state. The page contains the Pay Hub ticket area, ticket/quantity form and an embedded checkout with a new-tab fallback. It never routes ticket buyers to tip/song/course checkout.

The existing Rick Parma Pay Hub at `https://rickparma.com/pay/` supports a per-purchase `?intent=...` link. Its trusted creation endpoint, `POST /api/integrations/intents`, requires a server-side integration key; never put that key in this repository's public files. The existing public-intent endpoint currently supports tips, song requests and vocal tutorials, not event tickets.

Before enabling ticket sales:

1. Confirm the event date, hours, capacity, ticket types, prices, inclusion/refund/age policies and fulfillment requirements.
2. Implement a server endpoint that accepts only `eventId`, `ticketTypeId` and `quantity`, validates a server-owned ticket catalog/capacity, and creates a new Pay Hub intent for that particular order through the trusted integration. Add duplicate-request protection and durable ticket orders. Return `{checkoutUrl}` using the real unique intent. Do not share one intent link across buyers.
3. Implement ticket issuance and the admission/guest list after Pay Hub confirms PAID server-side. A browser redirect is not proof of payment. Integrate refunds/capacity as required.
4. Configure `checkoutEndpoint`, published `ticketTypes`, and `salesOpen` only after the server flow is ready. Validate iframe/wallet support on the deployed domains; the new-tab fallback is provided.
5. Test sandbox checkout and paid fulfillment before opening production sales. No charge was made while building this starter.

The ticket form submits no amount, credential or integration key. Checkout URLs are restricted to the existing Rick Parma Pay Hub intent route.
