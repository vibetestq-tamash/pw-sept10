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

  test('Add multiple employees in rapid succession', async ({ App }) => {
    const rapid = edgeCases.rapidAdditions;

    // Step 1: Create the first employee
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.enterFirstName(rapid.firstName1);
    await App.addEmployeePage.enterLastName(rapid.lastName1);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 2: Verify the first employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 3: Create the second employee straight after
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.enterFirstName(rapid.firstName2);
    await App.addEmployeePage.enterLastName(rapid.lastName2);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the second employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Rapid successive employee additions', async ({ App }) => {
    const rapid = edgeCases.rapidAdditions;

    // Steps 1-3 (repeated): Add an employee and verify the save each time
    for (let i = 0; i < rapid.loopCount; i++) {
      await App.dashboardPage.clickOnPIMLink();
      await App.pimPage.VerifyPIMDisplayed();
      await App.pimPage.clickOnAddEmployeeLink();
      await App.addEmployeePage.VerifyAddEmployeeDisplayed();

      await App.addEmployeePage.enterFirstName(`${rapid.firstNamePrefix}${i}`);
      await App.addEmployeePage.enterLastName(`${rapid.lastNamePrefix}${i}`);
      await App.addEmployeePage.clickOnSaveButton();
      await App.addEmployeePage.verifySuccessMessageDisplayed();
    }
  });
});
