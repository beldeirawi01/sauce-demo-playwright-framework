import { test, expect } from './fixtures';


test.describe("Inventory Page Functionality", () => {

    test.describe("Validate Inventory Page Screen", { tag: "@smoke" }, () => {
        test("Validate Products Title", async ({ inventoryPage }) => {
            await expect (inventoryPage.pageTitle).toContainText("Products")
            await expect (inventoryPage.productInventory).toHaveCount(6)
        })
    });

    test.describe("Validate Adding to Cart", { tag: "@smoke" }, () =>{
        test("Validate Cart", async ({ inventoryPage }) => {
            await inventoryPage.addToCart('sauce-labs-backpack')
            await expect (inventoryPage.cartNumber).toContainText('1')
        })
    })

    test.describe("Validate Adding Multiple Items in Cart", { tag: "@regression" }, () => {
        test("Validate Items in Cart", async ({ inventoryPage }) => {
            const productsToAdd = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)'];

            for (const slug of productsToAdd) {
                await inventoryPage.addToCart(slug)
            }

            await expect (inventoryPage.cartNumber).toContainText(String(productsToAdd.length))
        })
    })

    test.describe("Validate Removal of Item From Cart", { tag: "@regression" }, () => {
        test("Validate Deletion From Cart", async ({ inventoryPage }) => {
            await inventoryPage.addToCart('sauce-labs-bike-light')
            await expect (inventoryPage.cartNumber).toContainText('1')

            await inventoryPage.removeFromCart('sauce-labs-bike-light')
            await expect (inventoryPage.cartNumber).not.toBeVisible()
        })
    })

    test.describe("Validate Cart Navigation", { tag: "@regression" }, () => {
        test("Navigation To Cart", async({ page, inventoryPage }) => {
            await inventoryPage.cartIcon.click()
            expect (page.url()).toContain('/cart')
        })
    })

    test.describe("Sort Items From A-Z and Z-A", { tag: "@regression" }, () => {
        test("Validate Sorting A-Z", async ({ inventoryPage }) => {
            await inventoryPage.sortBy('za')
            await inventoryPage.sortBy('az')
            const itemNames = await inventoryPage.getItemNames();
            const sortedNames = [...itemNames].sort((a, b) => a.localeCompare(b));
            expect(itemNames).toEqual(sortedNames);
        })

        test("Validate Sorting Z-A", async ({ inventoryPage }) => {
            await inventoryPage.sortBy('za')
            const itemNames = await inventoryPage.getItemNames();
            const sortedNames = [...itemNames].sort((a, b) => b.localeCompare(a));
            expect(itemNames).toEqual(sortedNames);
        })
    })
})