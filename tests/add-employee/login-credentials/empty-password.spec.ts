// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { loginCredentials } from "../../../testdata/add-employee-login-nav.json";

test.describe('Add Employee - Login Credentials Validation', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Validation error when password is empty', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details and login username, leave password empty
    await App.addEmployeePage.enterFirstName(loginCredentials.emptyPassword.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.emptyPassword.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.enterUsername(loginCredentials.emptyPassword.username);

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify password is required
    await App.addEmployeePage.verifyErrorMessageDisplayed();
  });

  test('Password validation - empty password', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details with empty password
    await App.addEmployeePage.enterFirstName(loginCredentials.emptyPassword.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.emptyPassword.lastName);
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.enterUsername(loginCredentials.emptyPassword.username);
    // Password left empty intentionally

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify validation prevented save and the form is still open
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
  });
});
