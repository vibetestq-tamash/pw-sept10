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

  test('Cancel employee creation', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);

    // Step 3: Click Cancel to exit without saving
    await App.addEmployeePage.clickOnCancelButton();

    // Step 4: Verify we're back on PIM page
    await App.pimPage.VerifyPIMDisplayed();
  });

  test('Cancel from Add Employee form leaves the form', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter some employee information
    await App.addEmployeePage.enterFirstName(navigation.cancelCreation.firstName);
    await App.addEmployeePage.enterLastName(navigation.cancelCreation.lastName);

    // Step 3: Click Cancel
    await App.addEmployeePage.clickOnCancelButton();

    // Step 4: Verify we have left the Add Employee page
    await App.addEmployeePage.verifyAddEmployeeNotDisplayed();
  });
});
