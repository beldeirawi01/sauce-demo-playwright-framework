import { test, expect } from './fixtures';

import { ValidCheckoutData, InvalidCheckoutData, CheckoutExpectedValues } from '../test-data/CheckoutData';

test.describe("Checkout Process", () => {

    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.addToCart('sauce-labs-backpack');
        await inventoryPage.addToCart('sauce-labs-bike-light');
        await inventoryPage.cartIcon.click();
    });

    test.describe("Cart Page Navigation", { tag: "@regression" }, () => {
        test("Validate cart page displays correct number of items", async ({ cartPage }) => {
            await expect(cartPage.cartItems).toHaveCount(2);
        });

        test("Validate checkout button is visible on cart page", async ({ cartPage }) => {
            await expect(cartPage.checkoutButton).toBeVisible();
        });

        test("Validate continue shopping button is visible", async ({ cartPage   }) => {
            await expect(cartPage.continueShoppingButton).toBeVisible();
        });

        test("Navigate back to inventory from cart", async ({ page, cartPage }) => {
            await cartPage.continueShopping();
            expect(page.url()).toContain("/inventory");
        });
    });

    test.describe("Checkout Step One - Customer Information", { tag: "@regression" }, () => {
        test.beforeEach(async ({ cartPage }) => {
            // Navigate to checkout
            await cartPage.checkout();
        });

        test("Validate successful checkout with valid customer info", async ({ page, checkoutPage }) => {
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            expect(page.url()).toContain("/checkout-step-two");
        });

        test("Validate error message when first name is empty", async ({ checkoutPage }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyFirstName.firstName,
                InvalidCheckoutData.emptyFirstName.lastName,
                InvalidCheckoutData.emptyFirstName.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyFirstName.expectedError);
        });

        test("Validate error message when last name is empty", async ({ checkoutPage }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyLastName.firstName,
                InvalidCheckoutData.emptyLastName.lastName,
                InvalidCheckoutData.emptyLastName.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyLastName.expectedError);
        });

        test("Validate error message when postal code is empty", async ({ checkoutPage }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyPostalCode.firstName,
                InvalidCheckoutData.emptyPostalCode.lastName,
                InvalidCheckoutData.emptyPostalCode.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyPostalCode.expectedError);
        });

        test("Validate error message with all fields empty", async ({ checkoutPage }) => {
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.allFieldsEmpty.expectedError);
        });

        test("Validate cancel button returns to cart", async ({ page, checkoutPage }) => {
            await checkoutPage.cancel();
            expect(page.url()).toContain("/cart");
        });

        test("Validate checkout with alternative customer data", async ({ page, checkoutPage }) => {
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.alternativeCustomer.firstName,
                ValidCheckoutData.alternativeCustomer.lastName,
                ValidCheckoutData.alternativeCustomer.postalCode
            );
            await checkoutPage.continue();
            expect(page.url()).toContain("/checkout-step-two");
        });
    });

    test.describe("Checkout Step Two - Order Overview", { tag: "@regression" }, () => {
        test.beforeEach(async ({ page, cartPage, checkoutPage }) => {
            // Navigate to checkout and fill customer info
            await cartPage.checkout();
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            await expect(page).toHaveURL(/checkout-step-two/); 
        });

        test("Validate order overview page displays cart items", async ({ checkoutPage }) => {
            await expect(checkoutPage.cartItems).toHaveCount(2);
        });

        test("Validate subtotal is displayed on order overview", async ({ checkoutPage }) => {
            //const subtotal = await checkoutPage.getSubtotal();
            //expect(subtotal).toContain("Item total");
            await expect(checkoutPage.subtotalLabel).toContainText("Item total");
        });

        test("Validate tax is displayed on order overview", async ({ checkoutPage }) => {
            //const tax = await checkoutPage.getTax();
            //expect(tax).toContain("Tax");
            await expect(checkoutPage.taxLabel).toContainText("Tax");
        });

        test("Validate total is displayed on order overview", async ({ checkoutPage }) => {
            //const total = await checkoutPage.getTotal();
            //expect(total).toContain("Total");
            await expect(checkoutPage.totalLabel).toContainText("Total");
        });

        test("Validate finish button is visible on order overview", async ({ checkoutPage }) => {
            await expect(checkoutPage.finishButton).toBeVisible();
        });

        test("Validate cancel button on order overview returns to cart", async ({ page, checkoutPage }) => {
            await checkoutPage.cancel();
            expect(page.url()).toContain("/inventory");
        });
    });

    test.describe("Checkout Complete", { tag: "@regression" }, () => {
        test("Validate successful order completion", async ({ page, cartPage, checkoutPage }) => {
            // Navigate through checkout
            await cartPage.checkout();
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            await checkoutPage.finish();

            // Verify completion page
            expect(page.url()).toContain("/checkout-complete");
        });

        test("Validate order confirmation heading is displayed", async ({ page, cartPage, checkoutPage }) => {
            // Navigate through checkout
            await cartPage.checkout();
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            await checkoutPage.finish();

            // Verify confirmation text
            const confirmationLocator = page.locator('[data-test="complete-header"]');
            await expect(confirmationLocator).toContainText(CheckoutExpectedValues.completeHeaderText);
        });
    });

    test.describe("Full Checkout Journey", { tag: "@smoke" }, () => {
        test("Complete end-to-end checkout with standard user", async ({ page, cartPage, checkoutPage }) => {
            // Step 1: Verify cart
            await expect(cartPage.cartItems).toHaveCount(2);

            // Step 2: Proceed to checkout
            await cartPage.checkout();
            expect(page.url()).toContain("/checkout-step-one");

            // Step 3: Fill customer info and continue
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            expect(page.url()).toContain("/checkout-step-two");

            // Step 4: Verify order overview
            await expect(checkoutPage.cartItems).toHaveCount(2);

            // Step 5: Complete order
            await checkoutPage.finish();
            expect(page.url()).toContain("/checkout-complete");
            await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
        });
    });
});
