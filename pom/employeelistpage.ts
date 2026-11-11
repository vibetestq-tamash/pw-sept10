import { Locator, Page, expect } from "@playwright/test"
import { BasePage } from "./basepage";

export class EmployeeListPage extends BasePage {

    private hdrEmployeeList: Locator;
    private lnkAddEmployee: Locator;
    private tblEmployeeList: Locator;
    private txtSearchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.hdrEmployeeList = page.getByRole('heading', { name: 'Employee List' }).describe("Employee List Header");
        this.lnkAddEmployee = page.getByRole('link', { name: 'Add Employee' }).describe("Add Employee Link");
        this.tblEmployeeList = page.locator('table').describe("Employee List Table");
        this.txtSearchInput = page.getByPlaceholder(/search/i).describe("Search Input");
    }

    public async VerifyEmployeeListDisplayed() {
        await expect(this.hdrEmployeeList).toBeVisible();
        console.log("Employee List page is visible");
    }

    public async verifyEmployeeInList(firstName: string, lastName: string = "") {
        let searchText = firstName;
        if (lastName) {
            searchText = `${firstName} ${lastName}`;
        }
        await expect(this.tblEmployeeList.locator(`text=${searchText}`)).toBeVisible();
        console.log(`Employee ${searchText} found in list`);
    }

    public async searchEmployee(searchTerm: string) {
        await this.txtSearchInput.fill(searchTerm);
        console.log(`Searched for employee: ${searchTerm}`);
    }

    public async clickOnAddEmployeeLink() {
        await this.lnkAddEmployee.click();
        console.log("Clicked on " + this.lnkAddEmployee.description());
    }

    public async getEmployeeListRowCount(): Promise<number> {
        const rows = this.tblEmployeeList.locator('tbody tr');
        return await rows.count();
    }

    public async verifyEmployeeNotInList(firstName: string, lastName: string = "") {
        let searchText = firstName;
        if (lastName) {
            searchText = `${firstName} ${lastName}`;
        }
        const employeeRow = this.tblEmployeeList.locator(`text=${searchText}`);
        await expect(employeeRow).not.toBeVisible();
        console.log(`Employee ${searchText} not found in list`);
    }

    public async clickOnEmployeeInList(name: string) {
        await this.tblEmployeeList.locator(`text=${name}`).first().click();
        console.log(`Clicked on employee ${name} in list`);
    }

    public async verifyEmployeeCountInList(name: string, expectedCount: number) {
        await expect(this.tblEmployeeList.locator(`text=${name}`)).toHaveCount(expectedCount);
        console.log(`Found ${expectedCount} row(s) for ${name} in list`);
    }
}
