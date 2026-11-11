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

  test('Employee ID auto-generation at boundary', async ({ App }) => {
    const employee = edgeCases.employeeIdBoundary;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the names and read the auto-generated Employee ID
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(employee.lastName);
    const employeeId = await App.addEmployeePage.getEmployeeIdValue();

    // Step 3: Save and verify the employee was created
    await App.addEmployeePage.clickOnSaveButton();
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Employee IDs increase across repeated additions', async ({ App }) => {
    const employee = edgeCases.idSequenceEmployee;
    const employeeIds: number[] = [];

    // Steps 1-3 (repeated): Add an employee, capture its auto-generated ID, and save
    for (let i = 0; i < employee.loopCount; i++) {
      await App.dashboardPage.clickOnPIMLink();
      await App.pimPage.VerifyPIMDisplayed();
      await App.pimPage.clickOnAddEmployeeLink();
      await App.addEmployeePage.VerifyAddEmployeeDisplayed();

      const employeeId = await App.addEmployeePage.getEmployeeIdValue();
      employeeIds.push(Number(employeeId ?? 0));

      await App.addEmployeePage.enterFirstName(`${employee.firstNamePrefix}${i}`);
      await App.addEmployeePage.enterLastName(`${employee.lastNamePrefix}${i}`);
      await App.addEmployeePage.clickOnSaveButton();
      await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
    }

    // Step 4: Verify the captured IDs increase with each addition
    await App.addEmployeePage.verifyEmployeeIdsAreSequential(employeeIds);
  });
});
