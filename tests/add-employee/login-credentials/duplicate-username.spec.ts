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

  test('Duplicate username prevention', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter employee details
    await App.addEmployeePage.enterFirstName(loginCredentials.duplicateUsername.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.duplicateUsername.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Check Create Login Details and enter an existing username
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.enterUsername(loginCredentials.duplicateUsername.username);
    await App.addEmployeePage.enterPassword(loginCredentials.duplicateUsername.password);

    // Step 4: Try to save
    await App.addEmployeePage.clickOnSaveButton();

    // Step 5: Verify the duplicate username is rejected and the form stays open
    await App.addEmployeePage.verifyErrorMessageDisplayed();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
  });
});
