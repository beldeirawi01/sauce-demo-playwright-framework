import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { ValidLoginData, InvalidLoginData } from '../test-data/LoginData';


test.describe("Inventory Page Functionality", () => {
    let inventoryPage: InventoryPage;
    let loginPage: LoginPage;

    test.beforeEach(async({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        
        await loginPage.goto();

        await loginPage.login(ValidLoginData.standardUser.username, ValidLoginData.standardUser.password)

    });

    test.describe("Validate Inventory Page Screen", () => {
        test("Validate Products Title", async ({ page }) => {
            await expect (inventoryPage.pageTitle).toContainText("Products")
            await expect (inventoryPage.productInventory).toHaveCount(6)
        })
    });

    test.describe("Validate Adding to Cart", () =>{
        test("Validate Cart", async ({ page}) => {
            await inventoryPage.addToCart('sauce-labs-backpack')
            await expect (inventoryPage.cartNumber).toContainText('1')
        })
    })

    test.describe("Validate Adding Multiple Items in Cart", () => {
        test("Validate Items in Cart", async ({ page }) => {
            const productsToAdd = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)'];

            for (const slug of productsToAdd) {
                await inventoryPage.addToCart(slug)
            }

            await expect (inventoryPage.cartNumber).toContainText(String(productsToAdd.length))
        })
    })

    test.describe("Validate Removal of Item From Cart", () => {
        test("Validate Deletion From Cart", async ({ page }) => {
            await inventoryPage.addToCart('sauce-labs-bike-light')
            await expect (inventoryPage.cartNumber).toContainText('1')

            await inventoryPage.removeFromCart('sauce-labs-bike-light')
            await expect (inventoryPage.cartNumber).not.toBeVisible()
        })
    })

    test.describe("Validate Cart Navigation", () => {
        test("Navigation To Cart", async({ page }) => {
            await inventoryPage.cartIcon.click()
            expect (page.url()).toContain('/cart')
        })
    })
})