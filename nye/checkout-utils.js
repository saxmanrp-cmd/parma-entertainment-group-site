export function availableTicketTypes(config) {
  return (Array.isArray(config.ticketTypes) ? config.ticketTypes : []).filter(ticket =>
    typeof ticket.id === 'string' && ticket.id.trim() && typeof ticket.name === 'string' && ticket.name.trim()
    && Number.isSafeInteger(ticket.priceCents) && ticket.priceCents > 0 && ticket.enabled !== false);
}
export function checkoutEndpoint(config) {
  if (!config.checkoutEndpoint) return null;
  try {
    const endpoint = new URL(config.checkoutEndpoint);
    if (endpoint.protocol !== 'https:' || !['https://rickparma.com','https://parmaentertainmentgroup.com'].includes(endpoint.origin)
      || endpoint.username || endpoint.password) return null;
    return endpoint.href;
  } catch { return null; }
}
export function salesReady(config) {
  return config.salesOpen === true && availableTicketTypes(config).length > 0 && !!checkoutEndpoint(config);
}
export function validateCheckoutUrl(value, payHubOrigin = 'https://rickparma.com') {
  try {
    const url = new URL(value);
    if (payHubOrigin !== 'https://rickparma.com' || url.protocol !== 'https:' || url.origin !== payHubOrigin
      || !['/pay','/pay/'].includes(url.pathname) || !url.searchParams.get('intent') || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
export function checkoutRequest(config, ticketId, quantity) {
  if (!salesReady(config)) throw new Error('Ticket sales are not open yet.');
  const ticket = availableTicketTypes(config).find(option => option.id === ticketId);
  const limit = Number.isSafeInteger(config.maxTicketsPerOrder) ? Math.max(1, config.maxTicketsPerOrder) : 4;
  if (!ticket || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > limit) throw new Error('Choose a valid ticket option and guest count.');
  // No price or payment credentials are accepted from the browser.
  return { eventId: config.eventId, ticketTypeId: ticket.id, quantity };
}
