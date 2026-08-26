import { Locator, Page } from "@playwright/test";


export class LoginPage{
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page
        this.usernameField = this.page.locator('[data-test = "username"]')
        this.passwordField = this.page.locator('[data-test = "password"]')
        this.submitButton = this.page.locator('[data-test = "login-button"]')
        this.errorMessage = this.page.locator('[data-test = "error"]')
    }

    async goto() {
        await this.page.goto("/");
    }

    async enterUsername(username: string) {
        await this.usernameField.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.submitButton.click();
    }
}