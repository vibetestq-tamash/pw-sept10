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

  test('Middle Name is optional', async ({ App }) => {
    // Step 1: Navigate to the Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill the required fields and leave Middle Name empty
    await App.addEmployeePage.enterFirstName(validation.middleNameOptional.firstName);
    await App.addEmployeePage.enterLastName(validation.middleNameOptional.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save the employee without a Middle Name
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the employee was created (Personal Details page opens)
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
