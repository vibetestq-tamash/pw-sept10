import { Locator, Page, expect } from "@playwright/test"

import { BasePage } from "./basepage";

export class AddEmployeePage extends BasePage {

    private hdrAddEmployee: Locator;
    private txtFirstName: Locator;
    private txtMiddleName: Locator;
    private txtLastName: Locator;
    private txtEmployeeId: Locator;
    private fileProfilePicture: Locator;
    private btnChooseFile: Locator;
    private chkCreateLoginDetails: Locator;
    private txtUsername: Locator;
    private txtPassword: Locator;
    private btnSave: Locator;
    private btnCancel: Locator;
    private elmSuccessMessage: Locator;
    private elmInvalidCreds: Locator;
    private elmErrorMessage: Locator;
    private btnRemoveProfilePicture: Locator;
    
    constructor(page: Page) {
        super(page);
        this.hdrAddEmployee = page.getByRole('heading', { name: 'Add Employee' }).describe("Add Employee Header");
        this.txtFirstName = page.getByRole("textbox", { name: "First Name" }).describe("First Name Textbox");
        this.txtMiddleName = page.getByRole("textbox", { name: "Middle Name" }).describe("Middle Name Textbox");
        this.txtLastName = page.getByRole("textbox", { name: "Last Name" }).describe("Last Name Textbox");
        this.txtEmployeeId = page.getByRole('textbox').within(page.getByText("Employee Id").locator('..').locator('..')).describe("Employee Id Textbox");
        this.fileProfilePicture = page.locator('input[type="file"]').describe("Profile Picture File Input");
        this.btnChooseFile = page.locator('text=Choose File').describe("Choose File Button");
        this.chkCreateLoginDetails = page.locator('input[type="checkbox"]').describe("Create Login Details Checkbox");
        this.txtUsername = page.getByPlaceholder(/username/i).describe("Username Textbox");
        this.txtPassword = page.locator('input[type="password"]').describe("Password Textbox");
        this.btnSave = page.getByRole('button', { name: 'Save' }).describe("Save Button");
        this.btnCancel = page.getByRole('button', { name: 'Cancel' }).describe("Cancel Button");
        this.elmSuccessMessage = page.getByText("Successfully Saved").describe("Success Message");
        this.elmInvalidCreds = page.getByText("Invalid Credentials").describe("Invalid Credentials Message");
        this.elmErrorMessage = page.getByText(/error|failed/i).describe("Error Message");
        this.btnRemoveProfilePicture = page.locator('button[class*="remove"]').or(page.locator('button:has-text("×")')).describe("Remove Profile Picture Button");
    }

    public async VerifyAddEmployeeDisplayed() {
        await expect(this.hdrAddEmployee).toBeVisible();
        console.log("Add Employee page is visible");
    }

    public async enterFirstName(firstName: string) {
        await this.txtFirstName.fill(firstName);
        console.log("Entered First Name: " + firstName);
    }

    public async enterMiddleName(middleName: string) {
        await this.txtMiddleName.fill(middleName);
        console.log("Entered Middle Name: " + middleName);
    }

    public async enterLastName(lastName: string) {
        await this.txtLastName.fill(lastName);
        console.log("Entered Last Name: " + lastName);
    }

    public async enterEmployeeId(employeeId: string) {
        await this.txtEmployeeId.fill(employeeId);
        console.log("Entered Employee Id: " + employeeId);
    }

    public async enterUniqueEmployeeId() {
        const randomTenDigits = Math.floor(1000000000 + Math.random() * 9000000).toString();
        await this.txtEmployeeId.fill(randomTenDigits);
        console.log("Entered Unique Employee Id: " + randomTenDigits);
    }

    public async uploadProfilePicture(filePath: string) {
        await this.fileProfilePicture.setInputFiles(filePath);
        console.log("Uploaded profile picture: " + filePath);
    }

    public async checkCreateLoginDetailsCheckbox() {
        await this.chkCreateLoginDetails.check();
        console.log("Checked Create Login Details checkbox");
    }

    public async isCreateLoginDetailsCheckboxChecked(): Promise<boolean> {
        return await this.chkCreateLoginDetails.isChecked();
    }

    public async enterUsername(username: string) {
        await this.txtUsername.fill(username);
        console.log("Entered Username: " + username);
    }

    public async enterPassword(password: string) {
        await this.txtPassword.fill(password);
        console.log("Entered Password: " + password);
    }

    public async clickOnSaveButton() {
        await this.btnSave.click();
        console.log("Clicked on " + this.btnSave.description());
    }

    public async clickOnCancelButton() {
        await this.btnCancel.click();
        console.log("Clicked on " + this.btnCancel.description());
    }

    public async verifySuccessMessageDisplayed() {
        await expect(this.elmSuccessMessage).toBeVisible();
        console.log("Success message is displayed");
    }

    public async verifyInvalidCredentialsMessageDisplayed() {
        await expect.soft(this.elmInvalidCreds).toBeVisible();
        console.log("Invalid Credentials message is displayed");
    }

    public async verifyErrorMessageDisplayed() {
        await expect(this.elmErrorMessage).toBeVisible();
        console.log("Error message is displayed");
    }

    public async getEmployeeIdValue(): Promise<string | null> {
        return await this.txtEmployeeId.inputValue();
    }

    public async clearFirstName() {
        await this.txtFirstName.clear();
        console.log("Cleared First Name field");
    }

    public async clearLastName() {
        await this.txtLastName.clear();
        console.log("Cleared Last Name field");
    }

    public async verifyChooseFileButtonDisplayed() {
        await expect(this.btnChooseFile).toBeVisible();
        console.log("Choose File button is displayed");
    }

    public async clickOnChooseFileButton() {
        await this.btnChooseFile.click();
        console.log("Clicked on " + this.btnChooseFile.description());
    }

    public async verifyProfilePictureHintDisplayed(hintText: string) {
        await expect(this.page.getByText(hintText)).toBeVisible();
        console.log("Profile picture hint is displayed: " + hintText);
    }

    public async verifyRemoveProfilePictureButtonDisplayed() {
        await expect(this.btnRemoveProfilePicture).toBeVisible();
        console.log("Remove profile picture button is displayed");
    }

    public async clickOnRemoveProfilePictureButton() {
        await this.btnRemoveProfilePicture.click();
        console.log("Clicked on " + this.btnRemoveProfilePicture.description());
    }

    public async verifyRemoveProfilePictureButtonNotDisplayed() {
        await expect(this.btnRemoveProfilePicture).not.toBeVisible();
        console.log("Remove profile picture button is not displayed");
    }

    public async verifyCreateLoginDetailsCheckboxChecked() {
        await expect(this.chkCreateLoginDetails).toBeChecked();
        console.log("Create Login Details checkbox is checked");
    }

    public async verifyCreateLoginDetailsCheckboxNotChecked() {
        await expect(this.chkCreateLoginDetails).not.toBeChecked();
        console.log("Create Login Details checkbox is not checked");
    }

    public async verifyLoginDetailsFieldsDisplayed() {
        await expect(this.txtUsername).toBeVisible();
        await expect(this.txtPassword).toBeVisible();
        console.log("Username and Password fields are displayed");
    }

    public async verifyAddEmployeeNotDisplayed() {
        await expect(this.hdrAddEmployee).not.toBeVisible();
        console.log("Add Employee page is no longer displayed");
    }

    public async verifyFirstNameValue(expectedFirstName: string) {
        await expect(this.txtFirstName).toHaveValue(expectedFirstName);
        console.log("First Name retains value: " + expectedFirstName);
    }

    public async verifyEmployeeIdIsNumeric() {
        await expect(this.txtEmployeeId).toHaveValue(/^d+$/);
        const employeeId = await this.txtEmployeeId.inputValue();
        console.log("Auto-generated Employee Id is numeric: " + employeeId);
    }

    public async verifyEmployeeIdGreaterThan(previousEmployeeId: string) {
        await expect(this.txtEmployeeId).toHaveValue(/^d+$/);
        const currentEmployeeId = await this.txtEmployeeId.inputValue();
        expect(Number(currentEmployeeId)).toBeGreaterThan(Number(previousEmployeeId));
        console.log("Employee Id " + currentEmployeeId + " is greater than " + previousEmployeeId);
    }

    public async verifyCreateLoginDetailsFieldsDisplayed() {
        await expect(this.txtUsername).toBeVisible();
        await expect(this.txtPassword).toBeVisible();
        console.log("Login details fields are displayed");
    }

    public async verifyExpectedMessageDisplayed(message: string) {
        await expect(this.page.getByText(message).first()).toBeVisible();
        console.log("Message is displayed: " + message);
    }

    public async verifySessionTimeoutHandled() {
        const loginHeader = this.page.getByRole('heading', { name: 'Login' });
        await expect.poll(async () => (await loginHeader.isVisible()) || this.page.url().includes('login'), { timeout: 10000 }).toBeTruthy();
        console.log("Session timeout handled: login page is shown");
    }

    public async simulateOfflineMode() {
        await this.page.context().setOffline(true);
        console.log("Network set to offline");
    }

    public async restoreOnlineMode() {
        await this.page.context().setOffline(false);
        console.log("Network restored to online");
    }

    public async blockApiPostRequests() {
        await this.page.route('**/api/**', route => {
            if (route.request().method() === 'POST') {
                console.log("Aborting POST request to simulate server error");
                route.abort('failed');
            } else {
                route.continue();
            }
        });
        console.log("API POST requests are blocked to simulate server error");
    }

    public async unblockApiRequests() {
        await this.page.unroute('**/api/**');
        console.log("API route mock removed");
    }

    public async clearSessionCookies() {
        const context = this.page.context();
        const cookies = await context.cookies();
        for (const cookie of cookies) {
            const name = cookie.name.toLowerCase();
            if (name.includes('session') || name.includes('auth') || name.includes('cookie')) {
                await context.clearCookies({ name: cookie.name });
                console.log("Cleared cookie: " + cookie.name);
            }
        }
    }

    public async clickOnSaveButtonMultipleTimes(clickCount: number) {
        // Fire all clicks in the same tick, the way a double or triple submit happens in the browser
        await this.btnSave.evaluate((button, times) => {
            for (let i = 0; i < times; i++) {
                (button as HTMLElement).click();
            }
        }, clickCount);
        console.log(`Clicked on ${this.btnSave.description()} ${clickCount} times in quick succession`);
    }

    public async verifyEmployeeIdsAreSequential(employeeIds: number[]) {
        for (let i = 1; i < employeeIds.length; i++) {
            expect(employeeIds[i]).toBeGreaterThan(employeeIds[i - 1]);
        }
        console.log(`Employee IDs are increasing: ${employeeIds.join(", ")}`);
    }

    public async verifySuccessMessageNotDisplayed() {
        await expect(this.elmSuccessMessage).toBeHidden();
        console.log("Success message is not displayed");
    }

    public async focusOnFirstName() {
        await this.txtFirstName.focus();
        console.log("Focused on First Name textbox");
    }

    public async pressTabKey() {
        await this.page.keyboard.press("Tab");
        console.log("Pressed Tab key");
    }

    public async verifyMiddleNameFocused() {
        await expect(this.txtMiddleName).toBeFocused();
        console.log("Middle Name textbox has focus");
    }

    public async verifyLastNameFocused() {
        await expect(this.txtLastName).toBeFocused();
        console.log("Last Name textbox has focus");
    }

    public async pressTabUntilButtonFocused(maxPresses: number) {
        for (let i = 1; i <= maxPresses; i++) {
            await this.page.keyboard.press("Tab");
            const focusedTag = await this.page.evaluate(() => document.activeElement?.tagName ?? "");
            console.log(`Tab ${i}: focused element is ${focusedTag}`);
            if (focusedTag === "BUTTON") {
                console.log("Reached a button element with Tab navigation");
                return;
            }
        }
        console.log(`No button reached within ${maxPresses} Tab presses`);
    }

    public async verifyButtonFocused() {
        await expect(this.page.locator("button:focus")).toHaveCount(1);
        console.log("A button has keyboard focus");
    }
}