import {Locator, Page, expect} from "@playwright/test"

export class BasePage {
    protected page: Page; // page extends to subclasses like LoginPage

    // public: accessible from other places
    // private: accessible only within the class itself
    // protected: accessible within the class and its subclasses
    
    constructor(page: Page) {
        this.page = page;
    }

    public getPage() {
        return this.page;
    }

    public async navigateTo(url: string) {
        await this.page.goto(url);
        console.log("Navigated to URL: " + url);
    }

    public async getPageTitle() {
        return await this.page.title();
    }
    public async getCurrentUrl() {
        return this.page.url();
    }
}