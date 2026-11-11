// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { happyPath, navigation } from "../../../testdata/add-employee-login-nav.json";

test.describe('Add Employee - Navigation', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Navigate away to different menu section', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);

    // Step 3: Navigate away to a different menu section
    await App.dashboardPage.clickOnPIMLink();

    // Step 4: Verify we're on PIM page
    await App.pimPage.VerifyPIMDisplayed();
  });

  test('Navigate away from Add Employee page', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter employee information
    await App.addEmployeePage.enterFirstName(navigation.navigateAway.firstName);
    await App.addEmployeePage.enterLastName(navigation.navigateAway.lastName);

    // Step 3: Click Employee List link to leave the form
    await App.pimPage.clickOnEmployeeListLink();

    // Step 4: Verify navigation to Employee List
    await App.employeeListPage.VerifyEmployeeListDisplayed();
  });
});
