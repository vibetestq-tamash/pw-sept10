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

  test('Validation error when username is empty', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details and password, leave username empty
    await App.addEmployeePage.enterFirstName(loginCredentials.emptyUsername.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.emptyUsername.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.enterPassword(loginCredentials.emptyUsername.password);

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify username is required
    await App.addEmployeePage.verifyErrorMessageDisplayed();
  });

  test('Username validation - empty username', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details with password only, username left empty
    await App.addEmployeePage.enterFirstName(loginCredentials.emptyUsername.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.emptyUsername.lastName);
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.enterPassword(loginCredentials.emptyUsername.password);
    // Username left empty intentionally

    // Step 3: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify validation prevented save and the form is still open
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
  });
});
