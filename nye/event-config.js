// Public event settings. Never put Pay Hub integration keys in this file.
export const eventConfig = {
  eventId: 'nye-ahern-2026',
  dateLabel: 'December 31, 2026',
  salesOpen: false,
  // Each published option needs an id, name and positive integer priceCents.
  // The eventual server endpoint must independently validate catalog, capacity and price.
  ticketTypes: [],
  maxTicketsPerOrder: 4,
  checkoutEndpoint: null,
  payHubOrigin: 'https://rickparma.com'
};
