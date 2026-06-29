# ecommerce-modular-monolith-vuln

Intentionally vulnerable **modular monolith** e-commerce (web + api), written
in plain JavaScript (Node.js). Single deployable unit, but internally split
into feature modules with strict boundaries, an in-process event bus, and a
shared kernel (db, config, errors).

Built as a fixture for the AI security scanner in `coba-4`.

The code is deliberately insecure. **Do not deploy.**

## Architecture

```
ecommerce-modular-monolith-vuln/
  package.json                       # npm workspaces root
  apps/
    web/                             # React (Vite) SPA — intentionally vulnerable
      src/
        pages/                       # CheckoutPage, ProductPage, CartPage, ...
        components/                  # Re-usable UI (uses dangerouslySetInnerHTML)
        api/                         # API client (calls BE)
    api/                             # Express server (single process)
      src/
        server.js                    # Boots kernel, registers all module routers
  packages/
    modules/
      catalog/                       # product listing, search, review (XSS, SQLi)
      cart/                          # cart + line items (BOLA, mass-assign, exposure)
      checkout/                      # totals, order creation (price/discount tamper)
      payment/                       # Stripe (mock) (CORS wildcards, SSRF, stack trace)
      order/                         # order history (BOLA, no pagination)
      user/                          # auth, registration (weak JWT, MD5, no rate-limit)
    shared/
      db/                            # in-memory "DB" + raw query helper
      kernel/                        # module loader, registry, context
      config/                        # secrets (Stripe live key, test PANs)
      errors/                        # error types
      events/                        # in-process event bus
```

**Modular monolith properties:**

- Single deployable unit (one process, one HTTP server, one DB).
- Each module under `packages/modules/<feature>/` is self-contained: own
  `routes/`, `domain/`, `events/`, and `src/index.js` barrel.
- Modules register themselves with the kernel via `kernel.register({...})`.
- Cross-module calls go through the **in-process event bus**
  (`@app/shared-events`) or the **internal service registry** — not HTTP.
- The kernel owns shared infra (db, config, logger, error handler).
- The web app and api app are co-located: `npm run build` produces both, but
  they are not separate services. The web app is served by the same origin
  as the API in production (no CORS needed in prod).

## Module boundary contract

Every module exports a `Module` object:

```js
module.exports = {
  name: "catalog",
  version: "1.0.0",
  routes: ({ app, db, events, services }) => {
    app.get("/products", ...);
  },
  domain: {
    listProducts: (db) => { ... },
    addReview: (db, productId, body) => { ... },
  },
  events: {
    emits: ["product.review.created"],
    listens: [],
  },
};
```

`apps/api/src/server.js` iterates the registered modules, calls their
`routes({...})` factory with the kernel context, and mounts the resulting
router. Modules never directly `require()` each other — they emit events
or use `services.<otherModule>` from the registry.

## Vulnerability map

| #  | Module | File | Vulnerability | Semgrep rule |
|----|--------|------|---------------|--------------|
| 1  | shared-config | src/index.js | Stripe live key in source | `ecommerce-pci-stripe-secret-in-source` |
| 2  | shared-config | src/index.js | PAN-like numbers in source | `pci-dss-3-4-pan-in-source` |
| 3  | catalog | routes/products.js | SQL injection (literal) | `ecommerce-sqli-order-lookup` |
| 4  | catalog | routes/products.js | XSS via innerHTML | `ecommerce-xss-product-render` |
| 5  | catalog | routes/products.js | http:// asset URL for payments | `pci-dss-4-payment-over-http` |
| 6  | catalog | routes/products.js | `cvv` field stored from request | `pci-dss-3-4-cvv-in-source` |
| 7  | cart | routes/cart.js | BOLA on cart by id | `ecommerce-api-bola-cart-access` |
| 8  | cart | routes/cart.js | Mass assignment `{...req.body}` | `api-mass-assignment-spread-body` |
| 9  | cart | routes/cart.js | Returns full user object | `api-excessive-data-exposure` |
| 10 | checkout | routes/orders.js | Price from req.body | `ecommerce-price-tampering` |
| 11 | checkout | routes/orders.js | Discount from req.body | `ecommerce-discount-tampering` |
| 12 | checkout | routes/orders.js | POST /orders no auth | `ecommerce-api-no-auth-on-checkout` |
| 13 | checkout | routes/checkout.js | POST /checkout no CSRF | `ecommerce-csrf-no-protection` |
| 14 | payment | routes/payment.js | POST /payment no auth | `ecommerce-api-no-auth-on-checkout` |
| 15 | payment | routes/payment.js | POST /payment no CSRF | `ecommerce-csrf-no-protection` |
| 16 | payment | routes/payment.js | CORS `*` | `api-cors-wildcard-origin` |
| 17 | payment | routes/payment.js | CORS reflects origin | `api-cors-reflect-origin` |
| 18 | payment | routes/payment.js | Stack trace in response | `api-stack-trace-exposure` |
| 19 | payment | routes/payment.js | `fetch(req.body.url)` SSRF | `api-ssrf-user-controlled-url` |
| 20 | order | routes/orders.js | BOLA on /orders/:id | `ecommerce-api-bola-cart-access` |
| 21 | order | routes/orders.js | `SELECT * FROM orders` no pagination | `api-no-pagination` |
| 22 | user | routes/auth.js | `jwt.sign(payload, "secret")` | `ecommerce-jwt-weak-secret` |
| 23 | user | routes/auth.js | JWT without `expiresIn` | `ecommerce-jwt-no-expiration` |
| 24 | user | routes/auth.js | bcrypt with 8 rounds | `api-auth-bcrypt-missing-rounds` |
| 25 | user | routes/auth.js | POST /login no rate limit | `api-auth-no-rate-limit-on-login` |
| 26 | user | routes/auth.js | `crypto.createHash("md5")` for password | `ecommerce-md5-password` |
| 27 | user | routes/admin.js | GET /admin/users no role check | `api-admin-endpoint-no-role-check` |
| 28 | shared-middleware | src/body.js | `express.json()` no `limit` | `api-no-max-body-size` |
| 29 | shared-events | src/logger.js | `console.log(req.body)` | `ecommerce-log-sensitive-data` |
| 30 | shared-middleware | src/requestLogger.js | logs `cardNumber` field | `ecommerce-pci-card-data-in-logs` |
| 31 | web | components/ProductCard.jsx | XSS via dangerouslySetInnerHTML | `ecommerce-xss-product-render` |
| 32 | web | pages/CheckoutPage.jsx | logs card number to console | `ecommerce-pci-card-data-in-logs` |

## Verify

```bash
cd ecommerce-modular-monolith-vuln
npm install
node apps/api/src/server.js                 # bind 0.0.0.0:3000

# From repo root:
semgrep \
  --config=coba-4/ai-service/app/agents/semgrep_rules/ecommerce.yml \
  --config=coba-4/ai-service/app/agents/semgrep_rules/pci-dss.yml \
  --config=coba-4/ai-service/app/agents/semgrep_rules/owasp-api.yml \
  test-repo-dummy/ecommerce-modular-monolith-vuln/
```

Latest scan (Semgrep 1.167.0):

- **22 distinct rules triggered** out of the 30+ defined in the rule files.
- **162 total findings** (mostly `price-tampering` / `discount-tampering` per
  pattern repetition).
- **2 findings in `apps/web/`** (FE XSS via `innerHTML = req.body.*` in
  `apps/web/src/components/domRender.js`).
- The 8 rule IDs that don't trigger are blocked by **rule-file bugs** (parse
  errors in `ecommerce-mass-assignment-admin` and `ecommerce-jwt-weak-secret`;
  multiline `pattern-either` in `api-cors-*` not matching the inline form;
  generic metavariable issues in BOLA rules; `/api/admin` literal in
  `api-admin-endpoint-no-role-check`; unresolved glob in
  `pci-dss-4-payment-over-http`). The vulnerable code is there; the rule
  files need fixing.
