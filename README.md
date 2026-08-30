# Sauce Demo Playwright Framework

A Page Object Model (POM) based automated test framework built with Playwright and TypeScript, targeting [SauceDemo](https://www.saucedemo.com). This project was built as a hands-on portfolio piece to demonstrate automation framework design, locator strategy, and data-driven testing — covering the full user journey from login through checkout — skills directly relevant to a QA Engineer II role.

## Tech Stack

- **Playwright** — cross-browser end-to-end testing (Chromium, Firefox, WebKit)
- **TypeScript** — typed page objects and test data
- **Page Object Model (POM)** — separation of locators/actions from test logic
- **GitHub Actions** — CI pipeline running the full suite on every push and pull request

## Project Structure

```
├── pages/                  # Page Object classes — locators + actions, no assertions
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/               # Reusable test data, kept separate from test logic
│   ├── LoginData.ts
│   └── CheckoutData.ts
├── tests/                    # Test specs — behavior + assertions
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   └── checkout.spec.ts
├── .github/workflows/
│   └── playwright.yml        # CI pipeline definition
├── playwright.config.ts      # Base URL, browser projects, reporter config
├── .env                      # Local environment config (not committed)
└── tsconfig.json
```

## Setup

1. Clone the repo and install dependencies:
```
   npm install
   npx playwright install --with-deps
```
2. Create a `.env` file in the project root:
```
   BASE_URL=https://www.saucedemo.com
```
   `playwright.config.ts` reads this via `dotenv` and falls back to the same default URL if the variable isn't set, so the suite still runs even without a `.env` file present.

## Test Coverage

**`login.spec.ts`** — covers the full login flow:
- Successful login with a valid account, verified by URL redirect to the inventory page
- Locked-out user, wrong password, empty username, and empty password — each asserting the exact error message SauceDemo displays

**`inventory.spec.ts`** — covers the product/cart flow after login:
- Page loads with the correct title and all 6 products visible
- Adding a single product to the cart, verified via the cart badge count
- Adding multiple products in a loop, with the expected cart count derived dynamically from the input array rather than hardcoded
- Removing a product from the cart, verified by the badge disappearing once the cart is empty
- Clicking the cart icon navigates to the correct URL

**`checkout.spec.ts`** — covers the full purchase flow end-to-end, 20 tests across five grouped scenarios:
- **Cart Page Navigation** — correct item count on the cart page, checkout/continue-shopping buttons visible, and returning to inventory via "Continue Shopping"
- **Checkout Step One (Customer Information)** — successful continuation with valid info (including an alternate customer profile), and validation errors for each empty required field individually and all fields empty at once; also confirms "Cancel" on this step returns to the cart
- **Checkout Step Two (Order Overview)** — cart items, subtotal, tax, and total labels all render, the finish button is visible, and confirms "Cancel" on this step returns to inventory (different destination than step one's cancel — verified explicitly rather than assumed)
- **Checkout Complete** — order submission redirects to the confirmation URL and displays the "Thank you for your order!" header
- **Full Checkout Journey** — one end-to-end test walking cart → checkout info → order overview → confirmation in a single pass, as a canonical smoke test alongside the more granular per-screen tests above

## Design Decisions

- **Page Object Model**: locators and page actions live in `pages/`, completely separate from test logic and assertions in `tests/`. This keeps tests readable (they describe *behavior*, not implementation) and means a locator only needs to be updated in one place if the UI changes.
- **`data-test` attributes over `id`/`class`**: SauceDemo tags most interactive elements with a `data-test` attribute specifically intended for automation, which is more resilient to styling or markup changes than targeting `id` or `class`. Every locator in this project was verified directly against the real DOM in DevTools rather than assumed from naming conventions.
- **Dynamic, parameterized locators**: the inventory page has one "Add to cart" button per product, each with a unique `data-test` value following a predictable pattern (`add-to-cart-<product-slug>`). Rather than writing six near-identical methods, `InventoryPage.addToCart(productSlug)` and `removeFromCart(productSlug)` build the locator dynamically using a template literal, so one method handles any product — including ones added to the site in the future.
- **Data-driven assertions**: the "add multiple items" test derives its expected cart count from `productsToAdd.length` rather than a hardcoded number, so the assertion stays correct even if the list of products being tested changes.
- **Structured, reusable test data**: valid and invalid scenarios live in `test-data/`, separate from test logic, so credentials, customer info, and expected error messages aren't duplicated across test files. `CheckoutData.ts` extends this further with multiple valid customer profiles (standard, alternative, international, hyphenated names) and a wider matrix of invalid/edge-case inputs (individual empty fields, all fields empty, special characters, very long input, numeric postal codes), so new edge cases can be added as data rather than new test logic.
- **Composed, full-journey testing**: `checkout.spec.ts` reuses `LoginPage` and `InventoryPage` from earlier in the suite via a shared `beforeEach`, chaining login → add to cart → cart → checkout rather than testing checkout in isolation. Tests are grouped into nested `describe` blocks that mirror the actual UI flow (cart → step one → step two → complete → full journey), making it straightforward to locate or extend tests for a specific screen.

## CI/CD

Every push and pull request to `main`/`master` triggers the full suite — 30 tests — across all three browsers via GitHub Actions (`.github/workflows/playwright.yml`). The pipeline installs dependencies, installs Playwright's browser binaries fresh on each run, executes the tests, and uploads the HTML report as a downloadable artifact regardless of pass/fail. `BASE_URL` is injected via a GitHub Actions repository secret rather than committed to the repo.

## Future Improvements

- Assert the computed subtotal, tax, and total against exact expected dollar amounts (data structured for this in `CheckoutData.ts`, not yet wired into assertions)
- Sorting dropdown tests (verify product order changes for each sort option)
- Logout flow test
- API-level test coverage, if/where the application under test exposes one
