import {Locator, Page, expect} from "@playwright/test"
import { BasePage } from "./basepage"

export class LoginPage extends BasePage {

    private txtUserName:Locator;
    private txtPassword:Locator;
    private btnLogin:Locator;
    private hdrLogin:Locator;

    // private page: Page;
    
    constructor(page:Page){
        super(page);
        // this.page = page;

        this.txtUserName = page.getByRole('textbox', { name: 'Username' }).describe("Username Textbox")
        this.txtPassword = page.getByRole('textbox', { name: 'Password' }).describe("Password Textbox")
        this.btnLogin = page.getByRole('button', { name: 'Login' }).describe("Login Button")
        this.hdrLogin = page.getByRole('heading', { name: 'Login' }).describe("Login Header")
    }

    public async enterUserName(userName:string){
        await this.txtUserName.fill(userName);
        console.log(userName+" entered on "+ this.txtUserName.description());
    }

    public async enterPassword(password:string){
        
        await this.txtPassword.fill(password);
        console.log(`${password} entered on ${this.txtPassword.description()}`)
    }

    public async clickOnLogin(){
        await this.btnLogin.click();
        console.log("Clicked on "+ this.btnLogin.description());
    }

    public async verifyLoginPageDisplayed(){
        await expect(this.hdrLogin).toBeVisible();
        console.log("Login Page is displayed");
    }
}

