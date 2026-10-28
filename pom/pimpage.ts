import {Locator, Page, expect} from "@playwright/test"
import { BasePage } from "./basepage";

export class PIMPage extends BasePage {

    private hdrPIM:Locator;
    private lnkAddEmployee:Locator;

    constructor(page:Page){
        super(page);
        this.hdrPIM = page.getByRole('heading', { name: 'PIM' }).describe("PIM Header");
        this.lnkAddEmployee = page.getByRole('link', { name: 'Add Employee' }).describe("Add Employee Link")
    }

    public async VerifyPIMDisplayed(){
        await expect(this.hdrPIM).toBeVisible();
        console.log("PIM page is visible")
    }

    public async clickOnAddEmployeeLink(){
        await this.lnkAddEmployee.click();
        console.log("Clicked on "+ this.lnkAddEmployee.description())
    }
}