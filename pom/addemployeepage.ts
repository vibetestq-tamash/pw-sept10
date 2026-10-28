import { Locator, Page, expect } from "@playwright/test"

import { BasePage } from "./basepage";

export class AddEmployeePage extends BasePage {

    private hdrAddEmployee: Locator;
    private txtFirstName: Locator;
    private txtLastName: Locator;
    private txtEmployeeId: Locator;
    private btnSave: Locator;
    private elmInvalidCreds: Locator;
    
    constructor(page: Page) {
        super(page);
        this.hdrAddEmployee = page.getByRole('heading', { name: 'Add Employee' }).describe("Add Employee Header");
        this.txtFirstName = page.getByRole("textbox", { name: "First Name" }).describe("First Name Textbox");
        this.txtLastName = page.getByRole("textbox", { name: "Last Name" }).describe("Last Name Textbox");
        this.txtEmployeeId = page.getByRole('textbox').within(page.getByText("Employee Id").locator('..').locator('..')).describe("Employee Id Textbox");;
        this.btnSave = page.getByRole('button', { name: 'Save' }).describe("Save Button");
        this.elmInvalidCreds = page.getByText("Invalid Credentials").describe("Invalid Credentials Message");
    }

    public async VerifyAddEmployeeDisplayed() {

        // Hard Asertion
        // If expect fail, the test will stop execution here due to hard assertion
        await expect(this.hdrAddEmployee).toBeVisible();
        console.log("Add Employee page is visible");
    }

    public async enterFirstName(firstName: string) {
        await this.txtFirstName.fill(firstName);
        console.log("Entered First Name: " + firstName);
    }

    public async enterLastName(lastName: string) {
        await this.txtLastName.fill(lastName);
        console.log("Entered Last Name: " + lastName);
    }

    public async clickOnSaveButton() {
        await this.btnSave.click();
        console.log("Clicked on " + this.btnSave.description());
    }

    public async enterEmployeeId(employeeId: string) {
        await this.txtEmployeeId.fill(employeeId);
        console.log("Entered Employee Id: " + employeeId);
    }
    //Enter Unique Employee Id
    public async enterUniqueEmployeeId() {
        //create random with max of 10 digits
        const randomTenDigits = Math.floor(1000000000 + Math.random() * 90000).toString();
        await this.txtEmployeeId.fill(randomTenDigits);
        console.log("Entered Unique Employee Id: " + randomTenDigits);
    }

    public async verifyInvalidCredentialsMessageDisplayed() {
        //Soft Assertion
        // If expect.soft fails, the test will continue execution but will be marked as failed
        await expect.soft(this.elmInvalidCreds).toBeVisible();
        console.log("Invalid Credentials message is displayed");
    }
}