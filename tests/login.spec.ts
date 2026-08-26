import { test, expect } from '@playwright/test';
import { ValidLoginData, InvalidLoginData } from '../test-data/LoginData';
import { LoginPage } from '../pages/LoginPage';


test.describe("Login Page Functionality", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test.describe("Successful Login", () => {
        test("Validate login and URL", async( { page }) => {
            await loginPage.login(ValidLoginData.standardUser.username, ValidLoginData.standardUser.password);
            expect (page.url()).toContain("/inventory")
        });
    });

    test.describe("Locked Out User", () => {
        test("Validate that the locked user can't enter", async ({ page }) => {
            await loginPage.login(InvalidLoginData.lockedOutUser.username, InvalidLoginData.lockedOutUser.password);
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.lockedOutUser.expectedError)
        })
    })

    test.describe("Wrong Password", () => {
        test("Validate that Login isn't successful with wrong password", async ({ page }) => {
            await loginPage.login(InvalidLoginData.wrongPassword.username, InvalidLoginData.wrongPassword.password)
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.wrongPassword.expectedError)
        })
    })

    test.describe("Empty Username", () => {
        test("Validate wrong credentials with empty username", async ({ page }) => {
            await loginPage.login(InvalidLoginData.emptyUsername.username, InvalidLoginData.emptyUsername.password);
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.emptyUsername.expectedError)
        })
    })

    test.describe("Empty Password", () => {
        test("Validate wronf credentials with empty password", async ({ page }) => {
            await loginPage.login(InvalidLoginData.emptyPassword.username, InvalidLoginData.emptyPassword.password)
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.emptyPassword.expectedError)
        })
    })
});



