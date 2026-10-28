import { test } from "@playwright/test";
import { LoginPage, 
    AddEmployeePage, 
    PersonalDetailsPage, 
    BasePage, 
    DashboardPage, 
    PIMPage } from "../pom";

// import {LoginPage } from "../pom/loginpage";
// import {AddEmployeePage } from "../pom/addemployeepage";
// import {PersonalDetailsPage } from "../pom/personaldetailspage";
// import {BasePage } from "../pom/basepage";
// import { DashboardPage } from "../pom/dashboardpage";
// import { PIMPage } from "../pom/pimpage";

test('Login Test', async ({ page }) => {

    const basePage:BasePage = new BasePage(page);
    await basePage.navigateTo("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    
    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.verifyLoginPageDisplayed();
    await loginPage.enterUserName('testadmin');
    await loginPage.enterPassword('Vibetestq@123#');
    await loginPage.clickOnLogin();

    const dashboardPage:DashboardPage = new DashboardPage(page);
    await dashboardPage.VerifyDashboardDisplayed();
    await dashboardPage.clickOnPIMLink();

    const pimPage:PIMPage = new PIMPage(page);
    await pimPage.VerifyPIMDisplayed();
    await pimPage.clickOnAddEmployeeLink();
    
    const addEmployeePage:AddEmployeePage = new AddEmployeePage(page);
    await addEmployeePage.VerifyAddEmployeeDisplayed();
    await addEmployeePage.enterFirstName('John');
    await addEmployeePage.enterLastName('Doe');
    await addEmployeePage.enterUniqueEmployeeId();
    await addEmployeePage.clickOnSaveButton();

    const personalDetailsPage:PersonalDetailsPage = new PersonalDetailsPage(page);
    await personalDetailsPage.VerifyPersonalDetailsDisplayed();
});