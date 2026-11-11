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

  test('Navigate back using browser back button', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);

    // Step 3: Navigate back (simulated by going to PIM)
    await App.dashboardPage.clickOnPIMLink();

    // Step 4: Verify we're on PIM page
    await App.pimPage.VerifyPIMDisplayed();
  });

  test('Back button behavior', async ({ App }) => {
    // Step 1: Navigate to PIM and Add Employee
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill some information
    await App.addEmployeePage.enterFirstName(navigation.backButton.firstName);
    await App.addEmployeePage.enterLastName(navigation.backButton.lastName);

    // Step 3: Use the browser back button
    await App.basePage.navigateBack();

    // Step 4: Verify navigation back to the PIM page
    await App.pimPage.VerifyPIMDisplayed();
  });
});
