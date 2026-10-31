import {test, expect} from './fixtures';
import { ValidLoginData} from '../test-data/LoginData';
import { InventoryPage } from '../pages/InventoryPage';




test.describe("Performance Glitch User", { tag: "@regression" }, () => {
    test("Validate Performance Glitch User Login", async ({ page, loginPage }) => {
        await loginPage.login(
            ValidLoginData.performanceGlitchUser.username,
            ValidLoginData.performanceGlitchUser.password
        );

        await expect(page).toHaveURL(/inventory/, { timeout: 15000 });

        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.pageTitle).toContainText("Products", { timeout: 15000 });
        await expect(inventoryPage.productInventory).toHaveCount(6, { timeout: 15000 });

    })
})


test.describe("Problem User", { tag: "@regression" }, () => {
    test("Validate Problem User Login", async ({ page, loginPage }) => {
        await loginPage.login(
            ValidLoginData.problemUser.username,
            ValidLoginData.problemUser.password
        );
        
        await expect(page).toHaveURL(/inventory/, { timeout: 20000 });
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.pageTitle).toContainText("Products", { timeout: 20000 });
        await expect(inventoryPage.productInventory).toHaveCount(6, { timeout: 20000 });
    });

    const products = [
        { name: "Sauce Labs Backpack", slug: "sauce-labs-backpack" },
        { name: "Sauce Labs Bike Light", slug: "sauce-labs-bike-light" },
        { name: "Sauce Labs Bolt T-Shirt", slug: "sauce-labs-bolt-t-shirt" },
        { name: "Sauce Labs Fleece Jacket", slug: "sauce-labs-fleece-jacket" },
        { name: "Sauce Labs Onesie", slug: "sauce-labs-onesie" },
        { name: "Red T-Shirt", slug: "test.allthethings()-t-shirt-(red)" },
    ];

    const brokenProducts: string[] = [
        "sauce-labs-bolt-t-shirt",
        "sauce-labs-fleece-jacket",
        "test.allthethings()-t-shirt-(red)",
        "sauce-labs-onesie",
        "sauce-labs-bike-light",
        "sauce-labs-backpack"
    ];

    for (const product of products) {
        test(`Add and remove for ${product.name}`, async ({ page, loginPage }) => {
            test.fail(
                brokenProducts.includes(product.slug),
                "Known defect: problem_user Add/Remove button does not work for this product"
            );

            await loginPage.login(
                ValidLoginData.problemUser.username,
                ValidLoginData.problemUser.password
            );

            const inventoryPage = new InventoryPage(page);

            await test.step(`Add to cart`, async () => {
                await inventoryPage.addToCart(product.slug);
                await expect(inventoryPage.cartNumber).toHaveText("1");
            })

            await test.step(`Remove from cart`, async () => {
                await inventoryPage.removeFromCart(product.slug);
                await expect(inventoryPage.cartNumber).toHaveText("0");
            })
        })
    }


})