import { eventConfig } from './event-config.js';
import { availableTicketTypes, checkoutEndpoint, salesReady, validateCheckoutUrl, checkoutRequest } from './checkout-utils.js';

const $ = selector => document.querySelector(selector);
const date = $('[data-event-date]');
if (date) date.textContent = eventConfig.dateLabel;

if (salesReady(eventConfig)) {
  const select = $('#ticket-type');
  for (const ticket of availableTicketTypes(eventConfig)) {
    const option = document.createElement('option');
    option.value = ticket.id;
    option.textContent = `${ticket.name} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ticket.priceCents / 100)}`;
    select.appendChild(option);
  }
  $('#closed-button').hidden = true;
  $('#ticket-form-wrap').hidden = false;
  $('#sale-status').textContent = 'TICKETS';
  $('#ticket-state-heading').textContent = 'Choose your evening.';
  $('#ticket-state-copy').textContent = 'Select your tickets, then continue to Rick Parma Pay Hub for payment.';
  const intro = document.querySelector('.ticket-intro > p:not(.eyebrow)');
  if (intro) intro.textContent = 'Explore the ticket options and VIP packages for your evening at Ahern.';
  const count = $('#ticket-quantity');
  count.replaceChildren();
  const max = Number.isSafeInteger(eventConfig.maxTicketsPerOrder) ? Math.max(1, eventConfig.maxTicketsPerOrder) : 4;
  for (let i = 1; i <= max; i++) count.add(new Option(`${i} ${i === 1 ? 'guest' : 'guests'}`, String(i)));
}

let checkoutBusy = false;
$('#ticket-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  if (checkoutBusy) return;
  const button = $('#checkout-button');
  const status = $('#checkout-message');
  try {
    const request = checkoutRequest(eventConfig, $('#ticket-type').value, Number($('#ticket-quantity').value));
    checkoutBusy = true;
    button.disabled = true;
    status.textContent = 'Opening your secure checkout…';
    const response = await fetch(checkoutEndpoint(eventConfig), {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(request)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Checkout could not open. Please try again.');
    const url = validateCheckoutUrl(result.checkoutUrl, eventConfig.payHubOrigin);
    if (!url) throw new Error('Checkout is not available yet. Please contact the event team.');
    $('#checkout-fallback').href = url;
    $('#pay-hub-frame').src = url;
    $('#embedded-checkout').hidden = false;
    $('#embedded-checkout').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    status.textContent = 'Your checkout is ready below.';
    // Preserve this unique checkout instead of generating a second payment intent.
    button.textContent = 'Checkout opened below';
  } catch (error) {
    status.textContent = error.message || 'Checkout could not open. Please try again.';
    checkoutBusy = false;
    button.disabled = false;
  }
});
