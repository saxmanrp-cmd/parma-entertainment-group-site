import test from 'node:test';
import assert from 'node:assert/strict';
import { eventConfig } from '../event-config.js';
import { salesReady, checkoutRequest, validateCheckoutUrl, checkoutEndpoint } from '../checkout-utils.js';
const ready = { ...eventConfig, salesOpen: true, checkoutEndpoint: 'https://rickparma.com/api/events/checkout', ticketTypes: [{ id: 'ga', name: 'General admission', priceCents: 10000 }] };
test('published starter cannot create a ticket order', () => {
  assert.equal(salesReady(eventConfig), false);
  assert.throws(() => checkoutRequest(eventConfig, 'ga', 1), /not open/);
  assert.equal(salesReady({ ...ready, checkoutEndpoint: null }), false);
  assert.equal(salesReady({ ...ready, ticketTypes: [] }), false);
});
test('order request contains server-verifiable identifiers and no client price', () => {
  assert.deepEqual(checkoutRequest(ready, 'ga', 2), { eventId: 'nye-ahern-2026', ticketTypeId: 'ga', quantity: 2 });
  for (const quantity of [0, -1, 5, 1.5, NaN, '2']) assert.throws(() => checkoutRequest(ready, 'ga', quantity));
  assert.throws(() => checkoutRequest(ready, 'unknown', 1));
  assert.throws(() => checkoutRequest({ ...ready, ticketTypes: [{ ...ready.ticketTypes[0], enabled: false }] }, 'ga', 1));
});
test('checkout only accepts the existing Pay Hub and a purchase intent', () => {
  assert.equal(validateCheckoutUrl('https://rickparma.com/pay/?intent=order-123'), 'https://rickparma.com/pay/?intent=order-123');
  for (const value of ['https://rickparma.com/pay/?mode=tip', 'https://rickparma.com/pay/?intent=', 'https://rickparma.com.evil.test/pay/?intent=123', 'https://evil.test/pay/?intent=123', 'javascript:alert(1)', 'http://rickparma.com/pay/?intent=123', 'https://rickparma.com/other/?intent=123', 'https://user:password@rickparma.com/pay/?intent=123']) assert.equal(validateCheckoutUrl(value), null);
  assert.equal(checkoutEndpoint({ checkoutEndpoint: 'https://evil.test/checkout' }), null);
});
