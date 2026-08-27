import { Locator, Page } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartIcon: Locator;
    readonly cartNumber: Locator;
    readonly productInventory: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.cartIcon = this.page.locator('[data-test="shopping-cart-link"]');
        this.cartNumber = this.page.locator('[data-test="shopping-cart-badge"]');
        this.productInventory = this.page.locator('[data-test="inventory-item"]');
    }

    async addToCart(productSlug: string) {
        await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click()
    }

    async removeFromCart(productSlug: string) {
        await this.page.locator(`[data-test="remove-${productSlug}"]`).click()
    }

    
}

