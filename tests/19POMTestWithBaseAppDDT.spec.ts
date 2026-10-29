import { test } from "../fixtures/appbase";
import { employees } from "../testdata/emp.json";

test.describe.configure({ mode: 'serial' });

test.describe('Data Driven Tests', () => {

    test.beforeEach(async ({ App, testData }) => {
        await App.basePage.navigateTo("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
        await App.loginPage.verifyLoginPageDisplayed();
        await App.loginPage.enterUserName(testData.username);
        await App.loginPage.enterPassword(testData.password);
        await App.loginPage.clickOnLogin();
        await App.dashboardPage.VerifyDashboardDisplayed();

    });

    for (const employee of employees) {
        test(`Add Employee Test - ${employee.firstName} ${employee.lastName}`, async ({ App }) => {

            await App.dashboardPage.clickOnPIMLink();

            await App.pimPage.VerifyPIMDisplayed();
            await App.pimPage.clickOnAddEmployeeLink();

            await App.addEmployeePage.VerifyAddEmployeeDisplayed();
            await App.addEmployeePage.enterFirstName(employee.firstName);
            await App.addEmployeePage.enterLastName(employee.lastName);
            await App.addEmployeePage.enterUniqueEmployeeId();
            await App.addEmployeePage.clickOnSaveButton();

            await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

        });
    }
});