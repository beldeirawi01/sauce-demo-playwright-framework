import { Locator, Page } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartIcon: Locator;
    readonly cartNumber: Locator;
    readonly productInventory: Locator;
    readonly sortDropdown: Locator;
    readonly itemsNames: Locator;
    readonly itemPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.cartIcon = this.page.locator('[data-test="shopping-cart-link"]');
        this.cartNumber = this.page.locator('[data-test="shopping-cart-badge"]');
        this.productInventory = this.page.locator('[data-test="inventory-item"]');
        this.sortDropdown = this.page.locator('[data-test="product-sort-container"]');
        this.itemsNames = this.page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = this.page.locator('[data-test="inventory-item-price"]');
    }

    async addToCart(productSlug: string) {
        await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click()
    }

    async removeFromCart(productSlug: string) {
        await this.page.locator(`[data-test="remove-${productSlug}"]`).click()
    }

    async sortBy(option: string) {
        await this.sortDropdown.selectOption(option)
    }

    async getItemNames(): Promise<string[]> {
        return await this.itemsNames.allTextContents();
    }

    async getItemPrices(): Promise<string[]> {
        return (await this.itemPrices.allTextContents()).map(price => price.replace('$', ''));
    }
}

