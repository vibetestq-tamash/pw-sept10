// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from '../../../fixtures/appbase';
import { appUrl } from '../../../testdata/app';
import { validation } from '../../../testdata/add-employee.json';

test.describe('Add Employee - Field Validation Scenarios', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Validation error when Last Name is empty', async ({ App }) => {
    // Step 1: Navigate to the Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill First Name only, leave Last Name empty
    await App.addEmployeePage.enterFirstName(validation.lastNameRequired.firstName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Attempt to save without Last Name
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the validation error is displayed
    await App.addEmployeePage.verifyErrorMessageDisplayed();

    // Step 5: Verify the form did not submit (still on Add Employee page)
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
  });
});
