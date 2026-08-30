import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ValidLoginData } from '../test-data/LoginData';
import { ValidCheckoutData, InvalidCheckoutData, CheckoutExpectedValues } from '../test-data/CheckoutData';

test.describe("Checkout Process", () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Login and add items to cart
        await loginPage.goto();
        await loginPage.login(ValidLoginData.standardUser.username, ValidLoginData.standardUser.password);
        await inventoryPage.addToCart('sauce-labs-backpack');
        await inventoryPage.addToCart('sauce-labs-bike-light');
        
        // Navigate to cart
        await inventoryPage.cartIcon.click();
    });

    test.describe("Cart Page Navigation", () => {
        test("Validate cart page displays correct number of items", async ({ page }) => {
            const cartItemCount = await cartPage.getCartItemCount();
            expect(cartItemCount).toBe(2);
        });

        test("Validate checkout button is visible on cart page", async ({ page }) => {
            await expect(cartPage.checkoutButton).toBeVisible();
        });

        test("Validate continue shopping button is visible", async ({ page }) => {
            await expect(cartPage.continueShoppingButton).toBeVisible();
        });

        test("Navigate back to inventory from cart", async ({ page }) => {
            await cartPage.continueShopping();
            expect(page.url()).toContain("/inventory");
        });
    });

    test.describe("Checkout Step One - Customer Information", () => {
        test.beforeEach(async ({ page }) => {
            // Navigate to checkout
            await cartPage.checkout();
        });

        test("Validate successful checkout with valid customer info", async ({ page }) => {
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
            expect(page.url()).toContain("/checkout-step-two");
        });

        test("Validate error message when first name is empty", async ({ page }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyFirstName.firstName,
                InvalidCheckoutData.emptyFirstName.lastName,
                InvalidCheckoutData.emptyFirstName.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyFirstName.expectedError);
        });

        test("Validate error message when last name is empty", async ({ page }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyLastName.firstName,
                InvalidCheckoutData.emptyLastName.lastName,
                InvalidCheckoutData.emptyLastName.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyLastName.expectedError);
        });

        test("Validate error message when postal code is empty", async ({ page }) => {
            await checkoutPage.fillCustomerInfo(
                InvalidCheckoutData.emptyPostalCode.firstName,
                InvalidCheckoutData.emptyPostalCode.lastName,
                InvalidCheckoutData.emptyPostalCode.postalCode
            );
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.emptyPostalCode.expectedError);
        });

        test("Validate error message with all fields empty", async ({ page }) => {
            await checkoutPage.continue();
            await expect(checkoutPage.errorMessage).toContainText(InvalidCheckoutData.allFieldsEmpty.expectedError);
        });

        test("Validate cancel button returns to cart", async ({ page }) => {
            await checkoutPage.cancel();
            expect(page.url()).toContain("/cart");
        });

        test("Validate checkout with alternative customer data", async ({ page }) => {
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.alternativeCustomer.firstName,
                ValidCheckoutData.alternativeCustomer.lastName,
                ValidCheckoutData.alternativeCustomer.postalCode
            );
            await checkoutPage.continue();
            expect(page.url()).toContain("/checkout-step-two");
        });
    });

    test.describe("Checkout Step Two - Order Overview", () => {
        test.beforeEach(async ({ page }) => {
            // Navigate to checkout and fill customer info
            await cartPage.checkout();
            await checkoutPage.fillCustomerInfo(
                ValidCheckoutData.standardCustomer.firstName,
                ValidCheckoutData.standardCustomer.lastName,
                ValidCheckoutData.standardCustomer.postalCode
            );
            await checkoutPage.continue();
        });

        test("Validate order overview page displays cart items", async ({ page }) => {
            const itemCount = await checkoutPage.getCartItemCount();
            expect(itemCount).toBeGreaterThan(0);
        });

        test("Validate subtotal is displayed on order overview", async ({ page }) => {
            const subtotal = await checkoutPage.getSubtotal();
            expect(subtotal).toContain("Item total");
        });

        test("Validate tax is displayed on order overview", async ({ page }) => {
            const tax = await checkoutPage.getTax();
            expect(tax).toContain("Tax");
        });

        test("Validate total is displayed on order overview", async ({ page }) => {
            const total = await checkoutPage.getTotal();
            expect(total).toContain("Total");
        });

        test("Validate finish button is visible on order overview", async ({ page }) => {
            await expect(checkoutPage.finishButton).toBeVisible();
        });

        test("Validate cancel button on order overview returns to cart", async ({ page }) => {
            await checkoutPage.cancel();
            expect(page.url()).toContain("/inventory");
        });
    });

    test.describe("Checkout Complete", () => {
        test("Validate successful order completion", async ({ page }) => {
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

        test("Validate order confirmation heading is displayed", async ({ page }) => {
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

    test.describe("Full Checkout Journey", () => {
        test("Complete end-to-end checkout with standard user", async ({ page }) => {
            // Step 1: Verify cart
            const cartItems = await cartPage.getCartItemCount();
            expect(cartItems).toBe(2);

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
            const overviewItems = await checkoutPage.getCartItemCount();
            expect(overviewItems).toBeGreaterThan(0);

            // Step 5: Complete order
            await checkoutPage.finish();
            expect(page.url()).toContain("/checkout-complete");
            await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
        });
    });
});
