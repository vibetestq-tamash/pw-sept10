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

  test('Multiple rapid Save button clicks', async ({ App }) => {
    const employee = edgeCases.multipleSaveClicks;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the employee details
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(`${employee.lastNamePrefix}${Date.now()}`);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Click Save once
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Save button multiple clicks', async ({ App }) => {
    const employee = edgeCases.multipleSaveClicks;
    const lastName = `${employee.lastNamePrefix}${Date.now()}`;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the employee details
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(lastName);

    // Step 3: Click Save several times in quick succession
    await App.addEmployeePage.clickOnSaveButtonMultipleTimes(employee.saveClickCount);

    // Step 4: Verify the save succeeded
    await App.addEmployeePage.verifySuccessMessageDisplayed();
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 5: Open Employee List from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnEmployeeListLink();
    await App.employeeListPage.VerifyEmployeeListDisplayed();

    // Step 6: Verify only ONE record was created, not duplicates
    await App.employeeListPage.verifyEmployeeCountInList(lastName, 1);
  });
});
