//click
//double click : dblclick
//right click : click({ button: 'right' })
//hover : hover()
//drag and drop : source.dragTo()
//scroll: scrollintoviewifneeded()

// Iframe is useful to render content from another HTML document within the current page.
// To interact with elements inside an iframe, you need to first get the iframe element and then use frameLocator to access its content.

// in test automation, the tool by default find elements in parent web page
// to interact elements in frames, find frame first and then use frameLocator to access its content.
// let frame = page.framelocator(<iframe_selector>)
// frame.locator(<element_selector>) to interact with elements inside the iframe.

import { test, expect } from '@playwright/test';

test('mouse scroll and double click actions example', async ({ page }) => {

    await page.goto("https://api.jquery.com/dblclick/");

    await page.waitForTimeout(2000);

    await page.locator("div.demo.code-demo").scrollIntoViewIfNeeded()
    
    //find the iframe element
    let frmLoc = page.frameLocator("div.demo.code-demo iframe");
    //div[class='demo code-demo'] iframe
    //div[@class='demo code-demo']/iframe
    await page.waitForTimeout(2000);

    // use frame locator to perform actions 
    await frmLoc.locator("div").dblclick();
    await page.waitForTimeout(2000);
    await frmLoc.locator("div").dblclick();

    //100 items
    // 30 items

    // Right click example
    await page.goto("https://swisnl.github.io/jQuery-contextMenu/demo.html")

    await page.locator("//span[text()='right click me']").click({button:'right'});
    await page.waitForTimeout(2000)


});

test('hover action example', async ({ page }) => {

    await page.goto("https://api.jquery.com/hover/");

    //locator('#example-1-0 iframe').contentFrame().getByText('Milk')
    let frm = page.frameLocator("#entry-examples-1 iframe");
    await frm.getByText("Milk").hover();
    await expect(frm.getByText("White")).toBeVisible();
});

test("Drag and drop", async ({page})=>{

    await page.goto("https://jqueryui.com/droppable/");
    let frm = page.frameLocator("iframe.demo-frame");
    await frm.locator("#draggable").dragTo(frm.locator("#droppable"))

    // page.mouse.move(0, 0); // Move the mouse to the top-left corner of the page
    // page.keyboard.press('Escape'); // Example of pressing the Escape key
})