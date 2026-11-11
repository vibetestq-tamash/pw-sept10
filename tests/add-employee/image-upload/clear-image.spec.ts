// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { imageUpload } from "../../../testdata/add-employee.json";
import { imageUpload as imageUploadInput } from "../../../testdata/add-employee-image-input.json";

test.describe('Add Employee - Image Upload', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Clear profile picture after upload', async ({ App }) => {
    // Step 1: Open the Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the required names
    await App.addEmployeePage.enterFirstName(imageUpload.validImage.firstName);
    await App.addEmployeePage.enterLastName(imageUpload.validImage.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Upload a profile picture
    await App.addEmployeePage.uploadProfilePicture(imageUpload.validImage.imagePath);

    // Step 4: Verify the remove control appears and clear the picture
    await App.addEmployeePage.verifyRemoveProfilePictureButtonDisplayed();
    await App.addEmployeePage.clickOnRemoveProfilePictureButton();

    // Step 5: Verify the picture was cleared
    await App.addEmployeePage.verifyRemoveProfilePictureButtonNotDisplayed();

    // Step 6: Save the employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 7: Verify the employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});

test.describe('Add Employee - Image Upload Scenarios', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Clear uploaded image', async ({ App }) => {
    // Step 1: Open the Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the required names
    await App.addEmployeePage.enterFirstName(imageUploadInput.clearImageWithoutUpload.firstName);
    await App.addEmployeePage.enterLastName(imageUploadInput.clearImageWithoutUpload.lastName);

    // Step 3: With no image uploaded, the remove control should not be shown
    await App.addEmployeePage.verifyRemoveProfilePictureButtonNotDisplayed();

    // Step 4: Save the employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 5: Verify the save succeeded
    await App.addEmployeePage.verifySuccessMessageDisplayed();
  });
});
