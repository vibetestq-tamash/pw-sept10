// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { loginCredentials } from "../../../testdata/add-employee-login-nav.json";

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Create login details for new employee', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter employee details
    await App.addEmployeePage.enterFirstName(loginCredentials.validCredentials.firstName);
    await App.addEmployeePage.enterLastName(loginCredentials.validCredentials.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Check Create Login Details and verify the login fields appear
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.verifyCreateLoginDetailsCheckboxChecked();
    await App.addEmployeePage.verifyLoginDetailsFieldsDisplayed();

    // Step 4: Fill login details
    await App.addEmployeePage.enterUsername(loginCredentials.validCredentials.username);
    await App.addEmployeePage.enterPassword(loginCredentials.validCredentials.password);

    // Step 5: Save employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 6: Verify employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
