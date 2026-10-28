import { test as base } from "@playwright/test";

import * as pages from "../pom"
import * as testData from "../testdata/credentials.json";

type tPages = {
    loginPage: pages.LoginPage;
    basePage: pages.BasePage;
    addEmployeePage: pages.AddEmployeePage;
    personalDetailsPage: pages.PersonalDetailsPage;
    dashboardPage: pages.DashboardPage;
    pimPage: pages.PIMPage;
};

export let test = base.extend<{ testData: typeof testData, App: tPages, baTest: void }, { bAll: void }>({
    App: async ({ page }, use) => {
        await use({
            loginPage: new pages.LoginPage(page),
            basePage: new pages.BasePage(page),
            addEmployeePage: new pages.AddEmployeePage(page),
            personalDetailsPage: new pages.PersonalDetailsPage(page),
            dashboardPage: new pages.DashboardPage(page),
            pimPage: new pages.PIMPage(page),
        });
    },
    testData: async ({ }, use, testInfo) => {
        console.log("Test data used for test:", testInfo.title, testData);
        await use(testData);

    },
    baTest: [async ({ }, use, testInfo) => {
        //Before calling use() will be before the test has executed
        console.log("Executing before each hook for test:" + testInfo.title);
        if (testInfo.title.includes("Valid Login")) {
            console.log("This is special handling for Valid Login test");
        }

        await use(); //test execution happens here

        //After calling use() will be after the test has executed
        //Update test status to Jira
        console.log("Updating test status to Jira for test:" + testInfo.title);
    }, { auto: true }],
    bAll: [async ({ }, use, workerInfo) => {
        console.log("********Executing before all hook" + workerInfo.workerIndex);
        await use();
        console.log("********Executing after all hook" + workerInfo.workerIndex);
    }, { scope: "worker", auto: true }]


});

// export { test };