import {test, expect} from './fixtures';

test.describe("Cart", { tag: "@regression" }, () => {

    test.describe("Validate Cart With 2 Items", () => {
        test.beforeEach(async ({ inventoryPage }) => {
            await inventoryPage.addToCart('sauce-labs-backpack')
            await inventoryPage.addToCart('sauce-labs-bike-light')
            await inventoryPage.cartIcon.click()
        })

        test("Cart lists items added to cart", async ({ cartPage }) => {
            await expect (cartPage.cartItems).toHaveCount(2)
            await expect (cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light'])
        })

        test("Validate Removal of Item From Cart", async ({ cartPage, inventoryPage }) => {
            await cartPage.removeItemFromCart('sauce-labs-backpack')
            await expect (cartPage.cartItems).toHaveCount(1)
            await expect (inventoryPage.cartNumber).toHaveText('1')
            await expect (cartPage.itemNames).toHaveText(['Sauce Labs Bike Light'])
        })

        test("Validate removing items empties the cart", async ({ cartPage, inventoryPage }) => {
            await cartPage.removeItemFromCart('sauce-labs-backpack')
            await cartPage.removeItemFromCart('sauce-labs-bike-light')
            await expect (cartPage.cartItems).toHaveCount(0)
            await expect (inventoryPage.cartNumber).toHaveCount(0)
        })

        test("Validate Cart Items Count after reload", async ({ page, cartPage, inventoryPage }) => {
            await page.reload()
            await expect (cartPage.cartItems).toHaveCount(2)
            await expect (inventoryPage.cartNumber).toHaveText('2')
        })
        
    })

    test.describe("Validate Empty Cart", () => {
        test("Validate cart page shows no items when no items are added to cart", async ({ inventoryPage, cartPage }) => {
            await inventoryPage.cartIcon.click()
            await expect (cartPage.cartItems).toHaveCount(0)
            await expect (inventoryPage.cartNumber).not.toBeVisible()
        })
    })

})