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

  test('Edit employee after creation', async ({ App }) => {
    const employee = dataPersistence.editEmployee;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Create the employee and save
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(employee.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 3: Verify the employee is shown on Personal Details
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 4: Open edit mode
    await App.employeeDetailsPage.clickOnEditButton();

    // Step 5: Change the first name and save
    await App.addEmployeePage.clearFirstName();
    await App.addEmployeePage.enterFirstName(employee.updatedFirstName);
    await App.addEmployeePage.clickOnSaveButton();

    // Step 6: Verify the updated first name is stored
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
    await App.employeeDetailsPage.verifyEmployeeFirstName(employee.updatedFirstName);
  });

  test('Find and edit employee from Employee List', async ({ App }) => {
    const employee = dataPersistence.editListEmployee;
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

    // Step 4: Open Employee List from PIM and search for the employee
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnEmployeeListLink();
    await App.employeeListPage.VerifyEmployeeListDisplayed();
    await App.employeeListPage.searchEmployee(lastName);

    // Step 5: Open the employee's details from the list
    await App.employeeListPage.clickOnEmployeeInList(lastName);
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 6: Edit the last name and save
    await App.employeeDetailsPage.clickOnEditButton();
    await App.addEmployeePage.clearLastName();
    await App.addEmployeePage.enterLastName(employee.modifiedLastName);
    await App.addEmployeePage.clickOnSaveButton();

    // Step 7: Verify the updated last name is stored
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
    await App.employeeDetailsPage.verifyEmployeeLastName(employee.modifiedLastName);
  });
});
