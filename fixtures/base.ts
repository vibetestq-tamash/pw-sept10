import { test as base } from "@playwright/test";

import {BasePage, LoginPage, AddEmployeePage, PersonalDetailsPage, DashboardPage, PIMPage} from "../pom"


let testData: tData = { username: "testadmin", password: "Vibetestq@123#" };

type tData = {
    username: string;
    password: string;
};

let test = base.extend<{testData: tData, loginPage: LoginPage, basePage: BasePage, addEmployeePage: AddEmployeePage, personalDetailsPage: PersonalDetailsPage, dashboardPage: DashboardPage, pimPage: PIMPage}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    addEmployeePage: async ({ page }, use) => {
        await use(new AddEmployeePage(page));
    },
    personalDetailsPage: async ({ page }, use) => {
        await use(new PersonalDetailsPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    pimPage: async ({ page }, use) => {
        await use(new PIMPage(page));
    },
    testData: async ({}, use) => {
        await use(testData);
    }
});

export { test };