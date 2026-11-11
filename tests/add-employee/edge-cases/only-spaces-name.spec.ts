// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from '../../../fixtures/appbase';
import { appUrl } from '../../../testdata/app';
import { edgeCases } from '../../../testdata/add-employee-data-persistence-edge.json';

test.describe('Add Employee - Edge Cases', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Reject name with only spaces', async ({ App }) => {
    const employee = edgeCases.onlySpaces;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in names made only of spaces
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(employee.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the validation error is shown and nothing was saved
    await App.addEmployeePage.verifyErrorMessageDisplayed();
    await App.addEmployeePage.verifySuccessMessageNotDisplayed();
  });

  test('Add employee with only spaces in name', async ({ App }) => {
    const employee = edgeCases.onlySpaces;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in names made only of spaces
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(employee.lastName);

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the form stays open and nothing was saved
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.verifySuccessMessageNotDisplayed();
  });
});
