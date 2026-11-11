// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from '../../../fixtures/appbase';
import { appUrl } from '../../../testdata/app';

test.describe('Add Employee - Field Validation Scenarios', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Validation error when all name fields are empty', async ({ App }) => {
    // Step 1: Navigate to the Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Attempt to save without filling any name fields
    await App.addEmployeePage.clickOnSaveButton();

    // Step 3: Verify the validation error is displayed
    await App.addEmployeePage.verifyErrorMessageDisplayed();

    // Step 4: Verify the form did not submit (still on Add Employee page)
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
  });
});
