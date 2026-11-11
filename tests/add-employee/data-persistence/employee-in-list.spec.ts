// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from '../../../fixtures/appbase';
import { appUrl } from '../../../testdata/app';
import { dataPersistence } from '../../../testdata/add-employee-data-persistence-edge.json';

test.describe('Add Employee - Data Persistence', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Verify employee appears in employee list', async ({ App }) => {
    const employee = dataPersistence.requiredFieldsEmployee;
    // A unique last name lets the list check match exactly one row
    const lastName = `${employee.lastName}${Date.now()}`;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the employee and save
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 3: Open Employee List from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnEmployeeListLink();
    await App.employeeListPage.VerifyEmployeeListDisplayed();

    // Step 4: Verify the new employee appears in the list
    await App.employeeListPage.verifyEmployeeCountInList(lastName, 1);
  });

  test('Verify employee appears in employee list after creation', async ({ App }) => {
    const employee = dataPersistence.listEmployee;
    const lastName = `${employee.lastNamePrefix}${Date.now()}`;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Create the employee with a unique last name and save
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(lastName);
    await App.addEmployeePage.clickOnSaveButton();

    // Step 3: Verify the save succeeded
    await App.addEmployeePage.verifySuccessMessageDisplayed();

    // Step 4: Open Employee List from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnEmployeeListLink();
    await App.employeeListPage.VerifyEmployeeListDisplayed();

    // Step 5: Verify the new employee appears in the list
    await App.employeeListPage.verifyEmployeeCountInList(lastName, 1);
  });
});
