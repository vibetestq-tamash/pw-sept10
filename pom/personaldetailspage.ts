import {Locator, Page, expect} from "@playwright/test"
import { BasePage } from "./basepage";
export class PersonalDetailsPage extends BasePage {

    private hdrPersonalDetails:Locator;

    constructor(page:Page){
        super(page);
        this.hdrPersonalDetails = page.getByRole('heading', { name: 'Personal Details' }).describe("Personal Details Header");
    }

    public async VerifyPersonalDetailsDisplayed(){
        await expect(this.hdrPersonalDetails).toBeVisible();
        console.log("Personal Details page is visible")
    }
}