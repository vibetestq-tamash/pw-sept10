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

  test('Cancel unsaved changes when navigating away', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);

    // Step 3: Navigate away without saving (click Cancel)
    await App.addEmployeePage.clickOnCancelButton();

    // Step 4: Verify unsaved changes were discarded and we're back on PIM
    await App.pimPage.VerifyPIMDisplayed();
  });

  test('Cancel with unsaved changes confirmation', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter employee information
    await App.addEmployeePage.enterFirstName(navigation.cancelUnsavedChanges.firstName);
    await App.addEmployeePage.enterLastName(navigation.cancelUnsavedChanges.lastName);

    // Step 3: Click Cancel
    await App.addEmployeePage.clickOnCancelButton();

    // Step 4: Verify the cancelled navigation left the Add Employee form
    await App.addEmployeePage.verifyAddEmployeeNotDisplayed();
  });
});
