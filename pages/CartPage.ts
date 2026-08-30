import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartTitle: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartTitle = this.page.locator('[data-test="title"]');
        this.cartItems = this.page.locator('[data-test="inventory-item"]');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
        this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItemByName(itemName: string): Promise<Locator> {
        return this.page.locator(`[data-test="inventory-item"] :text("${itemName}")`);
    }

    async removeItemFromCart(productSlug: string) {
        await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }
}
