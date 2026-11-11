import { Locator, Page, expect } from "@playwright/test"
import { BasePage } from "./basepage";

export class EmployeeDetailsPage extends BasePage {

    private hdrEmployeeDetails: Locator;
    private txtFirstName: Locator;
    private txtLastName: Locator;
    private txtEmployeeId: Locator;
    private imgProfilePicture: Locator;
    private lnkEditEmployee: Locator;
    private btnEdit: Locator;
    private btnSave: Locator;
    private txtMiddleName: Locator;

    constructor(page: Page) {
        super(page);
        this.hdrEmployeeDetails = page.getByRole('heading', { name: 'Employee Details' }).or(page.getByRole('heading', { name: /Personal Details/i })).describe("Employee Details Header");
        this.txtFirstName = page.getByRole('textbox', { name: 'First Name' }).describe("First Name Field");
        this.txtLastName = page.getByRole('textbox', { name: 'Last Name' }).describe("Last Name Field");
        this.txtEmployeeId = page.getByRole('textbox').filter({ has: page.getByText("Employee Id") }).describe("Employee ID Field");
        this.imgProfilePicture = page.locator('img[alt*="profile"], img[alt*="employee"]').describe("Profile Picture");
        this.lnkEditEmployee = page.getByRole('link', { name: /Edit/i }).describe("Edit Employee Link");
        this.btnEdit = page.getByRole('button', { name: /Edit/i }).describe("Edit Button");
        this.btnSave = page.getByRole('button', { name: 'Save' }).describe("Save Button");
        this.txtMiddleName = page.getByRole('textbox', { name: 'Middle Name' }).describe("Middle Name Field");
    }

    public async VerifyEmployeeDetailsDisplayed() {
        await expect(this.hdrEmployeeDetails).toBeVisible();
        console.log("Employee Details page is visible");
    }

    public async verifyEmployeeFirstName(expectedFirstName: string) {
        await expect(this.txtFirstName).toHaveValue(expectedFirstName);
        console.log(`Verified First Name: ${expectedFirstName}`);
    }

    public async verifyEmployeeLastName(expectedLastName: string) {
        await expect(this.txtLastName).toHaveValue(expectedLastName);
        console.log(`Verified Last Name: ${expectedLastName}`);
    }

    public async verifyEmployeeId(expectedEmployeeId: string) {
        await expect(this.txtEmployeeId).toHaveValue(expectedEmployeeId);
        console.log(`Verified Employee ID: ${expectedEmployeeId}`);
    }

    public async verifyProfilePictureExists() {
        await expect(this.imgProfilePicture).toBeVisible();
        console.log("Profile picture is visible");
    }

    public async clickOnEditButton() {
        // Try both link and button
        const editButton = this.lnkEditEmployee.or(this.btnEdit);
        await editButton.click();
        console.log("Clicked on Edit button");
    }

    public async getFirstNameValue(): Promise<string> {
        return await this.txtFirstName.inputValue();
    }

    public async getLastNameValue(): Promise<string> {
        return await this.txtLastName.inputValue();
    }

    public async getEmployeeIdValue(): Promise<string> {
        return await this.txtEmployeeId.inputValue();
    }

    public async verifyEmployeeMiddleName(expectedMiddleName: string) {
        await expect(this.txtMiddleName).toHaveValue(expectedMiddleName);
        console.log(`Verified Middle Name: ${expectedMiddleName}`);
    }
}
