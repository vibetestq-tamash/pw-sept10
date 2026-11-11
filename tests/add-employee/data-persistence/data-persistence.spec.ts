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

  test('Employee data persists after creation', async ({ App }) => {
    const employee = dataPersistence.requiredFieldsEmployee;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the required fields and save
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(employee.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 3: Verify the saved first and last name on Personal Details
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
    await App.employeeDetailsPage.verifyEmployeeFirstName(employee.firstName);
    await App.employeeDetailsPage.verifyEmployeeLastName(employee.lastName);
  });

  test('Verify employee data is persisted in database', async ({ App, testData }) => {
    const employee = dataPersistence.databaseEmployee;
    const lastName = `${employee.lastNamePrefix}${Date.now()}`;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Create an employee with a unique last name and save
    await App.addEmployeePage.enterFirstName(employee.firstName);
    await App.addEmployeePage.enterLastName(lastName);
    await App.addEmployeePage.clickOnSaveButton();

    // Step 3: Verify the save succeeded
    await App.addEmployeePage.verifySuccessMessageDisplayed();

    // Step 4: Logout, so the record has to come back from the server on the next login
    await App.dashboardPage.clickOnProfilePicture();
    await App.dashboardPage.clickOnLogoutLink();
    await App.loginPage.verifyLoginPageDisplayed();

    // Step 5: Log in again
    await App.loginPage.performLogin(testData.username, testData.password);
    await App.dashboardPage.VerifyDashboardDisplayed();

    // Step 6: Open Employee List from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnEmployeeListLink();
    await App.employeeListPage.VerifyEmployeeListDisplayed();

    // Step 7: Verify the employee is still stored after re-login
    await App.employeeListPage.verifyEmployeeCountInList(lastName, 1);
  });
});
