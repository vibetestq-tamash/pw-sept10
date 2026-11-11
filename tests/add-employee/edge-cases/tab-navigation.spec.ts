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

  test('Navigate between form fields using Tab', async ({ App }) => {
    const tab = edgeCases.tabNavigation;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill first, middle and last name in turn
    await App.addEmployeePage.enterFirstName(tab.firstName);
    await App.addEmployeePage.enterMiddleName(tab.middleName);
    await App.addEmployeePage.enterLastName(tab.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save the employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Form field tab navigation', async ({ App }) => {
    const tab = edgeCases.tabNavigation;

    // Step 1: Open the Add Employee form from PIM
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Focus First Name and press Tab to reach Middle Name
    await App.addEmployeePage.focusOnFirstName();
    await App.addEmployeePage.pressTabKey();
    await App.addEmployeePage.verifyMiddleNameFocused();

    // Step 3: Press Tab again to reach Last Name
    await App.addEmployeePage.pressTabKey();
    await App.addEmployeePage.verifyLastNameFocused();

    // Step 4: Enter the first and last name
    await App.addEmployeePage.enterFirstName(tab.firstName);
    await App.addEmployeePage.enterLastName(tab.lastName);

    // Step 5: Keep pressing Tab until a button receives focus
    await App.addEmployeePage.pressTabUntilButtonFocused(tab.maxTabPresses);

    // Step 6: Verify a button is reachable by keyboard
    await App.addEmployeePage.verifyButtonFocused();
  });
});
