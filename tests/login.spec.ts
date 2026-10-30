import { test, expect } from './fixtures';
import { ValidLoginData, InvalidLoginData } from '../test-data/LoginData';


test.describe("Login Page Functionality", () => {

    test.describe("Successful Login", { tag: "@smoke" }, () => {
        test("Validate login and URL", async( { page, loginPage }) => {
            await loginPage.login(ValidLoginData.standardUser.username, ValidLoginData.standardUser.password);
            expect (page.url()).toContain("/inventory")
        });
    });

    test.describe("Locked Out User", { tag: "@smoke" }, () => {
        test("Validate that the locked user can't enter", async ({ page, loginPage }) => {
            await loginPage.login(InvalidLoginData.lockedOutUser.username, InvalidLoginData.lockedOutUser.password);
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.lockedOutUser.expectedError)
        })
    })

    test.describe("Wrong Password", { tag: "@regression" }, () => {
        test("Validate that Login isn't successful with wrong password", async ({ page, loginPage }) => {
            await loginPage.login(InvalidLoginData.wrongPassword.username, InvalidLoginData.wrongPassword.password)
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.wrongPassword.expectedError)
        })
    })

    test.describe("Empty Username", { tag: "@regression" }, () => {
        test("Validate wrong credentials with empty username", async ({ page, loginPage }) => {
            await loginPage.login(InvalidLoginData.emptyUsername.username, InvalidLoginData.emptyUsername.password);
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.emptyUsername.expectedError)
        })
    })

    test.describe("Empty Password", { tag: "@regression" }, () => {
        test("Validate wrong credentials with empty password", async ({ page, loginPage }) => {
            await loginPage.login(InvalidLoginData.emptyPassword.username, InvalidLoginData.emptyPassword.password)
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.emptyPassword.expectedError)
        })
    })

    test.describe("Unknown Username", { tag: "@regression" }, () => {
        test("Validate wrong credentials with unknown username", async ({ page, loginPage }) => {
            await loginPage.login(
                InvalidLoginData.unknownUser.username, 
                InvalidLoginData.unknownUser.password
            )
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.unknownUser.expectedError)
            await expect (page).not.toHaveURL(/inventory/)
        })
    })

    test.describe("Wrong Case Username", { tag: "@regression" }, () => {
        test("Validate wrong credentials with wrong-case username", async ({ page, loginPage }) => {
            await loginPage.login(
                InvalidLoginData.wrongCaseUsername.username,
                InvalidLoginData.wrongCaseUsername.password
            )
            await expect (loginPage.errorMessage).toContainText(InvalidLoginData.wrongCaseUsername.expectedError)
            await expect (page).not.toHaveURL(/inventory/)
        })
    })

    test.describe("Dismiss Error Banner", { tag: "@regression" }, () => {
        test("Validate that the error message can be dismissed", async ({ loginPage }) => {
            await loginPage.login(
                InvalidLoginData.emptyUsername.username,
                InvalidLoginData.emptyUsername.password
            )
            await expect (loginPage.errorMessage).toBeVisible()
            await loginPage.errorDismissButton.click()
            await expect (loginPage.errorMessage).toHaveCount(0)
        })
    })

    test.describe("Access without Login", { tag: "@regression" }, () => {
        test("Validate that the user can't access the inventory page without login", async ({ page, loginPage }) => {
            await page.goto("/inventory.html")
            await expect (loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in.")
            await expect (page).not.toHaveURL(/inventory/)
        })
    })

});




