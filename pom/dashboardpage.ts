import {Locator, Page, expect} from "@playwright/test"
import { BasePage } from "./basepage"

export class DashboardPage extends BasePage {
    
    private hdrDashboard:Locator;
    private lnkPIM:Locator;
    private lnkAdmin:Locator;

    constructor(page:Page){
        super(page);
        this.hdrDashboard = page.getByRole('heading', { name: 'Dashboard' }).describe("Dashboard Header");
        this.lnkPIM = page.getByRole('link', { name: 'PIM' }).describe("PIM Link");
        this.lnkAdmin = page.getByRole('link', { name: 'Admin' }).describe("Admin Link");
    }

    public async VerifyDashboardDisplayed(){
        await expect(this.hdrDashboard).toBeVisible();
        console.log("Dashboard is visible")
    }

    public async clickOnPIMLink(){
        await this.lnkPIM.click();
        console.log("Clicked on "+ this.lnkPIM.description())
    }

    public async clickOnAdminLink(){
        await this.lnkAdmin.click();
        console.log("Clicked on "+ this.lnkAdmin.description())
    }
}