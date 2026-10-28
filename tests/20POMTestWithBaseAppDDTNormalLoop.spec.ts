import { test } from "../fixtures/appbase";
import { employees } from "../testData/emp.json";

test.describe('Data Driven Tests', () => {

    test(`Add Employee Test`,{tag: ['@smoke']}, async ({ App, testData }) => {
        await test.step('Navigate to login page and login', async () => {
            
            await App.basePage.navigateTo("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
            await App.loginPage.verifyLoginPageDisplayed();
        },{box: true});

        await test.step('Login to the application', async () => {
            await App.loginPage.enterUserName(testData.username);
            await App.loginPage.enterPassword(testData.password);
            await App.loginPage.clickOnLogin();
            await App.dashboardPage.VerifyDashboardDisplayed();
        },{box: true});

        for (const employee of employees) {
            await test.step("navigate to PIM page", async () => {
                await App.dashboardPage.clickOnPIMLink();
                await App.pimPage.VerifyPIMDisplayed();

            },{box: true});

            await test.step("Click on Add Employee link", async () => {
                await App.pimPage.clickOnAddEmployeeLink();
                await App.addEmployeePage.VerifyAddEmployeeDisplayed();

            },{box: true});

            await test.step(`Add employee: ${employee.firstName} ${employee.lastName}`, async () => {

                await App.addEmployeePage.enterFirstName(employee.firstName);
                await App.addEmployeePage.enterLastName(employee.lastName);
                await App.addEmployeePage.enterUniqueEmployeeId();
                await App.addEmployeePage.clickOnSaveButton();

                await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
            },{box: true});
        }

    });
});