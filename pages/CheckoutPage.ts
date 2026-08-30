import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;

    // Checkout Step One - Customer Information
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly postalCodeField: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    // Checkout Step Two - Order Overview
    readonly cartItems: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Checkout Step One
        this.firstNameField = this.page.locator('[data-test="firstName"]');
        this.lastNameField = this.page.locator('[data-test="lastName"]');
        this.postalCodeField = this.page.locator('[data-test="postalCode"]');
        this.continueButton = this.page.locator('[data-test="continue"]');
        this.cancelButton = this.page.locator('[data-test="cancel"]');
        this.errorMessage = this.page.locator('[data-test="error"]');

        // Checkout Step Two
        this.cartItems = this.page.locator('[data-test="inventory-item"]');
        this.subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
        this.taxLabel = this.page.locator('[data-test="tax-label"]');
        this.totalLabel = this.page.locator('[data-test="total-label"]');
        this.finishButton = this.page.locator('[data-test="finish"]');
    }

    // Checkout Step One Methods
    async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.postalCodeField.fill(postalCode);
    }

    async enterFirstName(firstName: string) {
        await this.firstNameField.fill(firstName);
    }

    async enterLastName(lastName: string) {
        await this.lastNameField.fill(lastName);
    }

    async enterPostalCode(postalCode: string) {
        await this.postalCodeField.fill(postalCode);
    }

    async continue() {
        await this.continueButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || "";
    }

    // Checkout Step Two Methods
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getSubtotal(): Promise<string> {
        return await this.subtotalLabel.textContent() || "";
    }

    async getTax(): Promise<string> {
        return await this.taxLabel.textContent() || "";
    }

    async getTotal(): Promise<string> {
        return await this.totalLabel.textContent() || "";
    }

    async finish() {
        await this.finishButton.click();
    }
}
