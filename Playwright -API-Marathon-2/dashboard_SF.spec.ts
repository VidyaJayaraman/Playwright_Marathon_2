import { expect, test } from "@playwright/test"
import fs from 'fs'
import path from 'path'



test(`Sales Force DashBoard API`, async ({ page }) => {

    // Log in to Salesforce application  & click Apps launcher

    await page.goto("https://login.salesforce.com/");
    await page.fill("#username", "viddhu.j@gmail.com");
    await page.fill("#password", "Testcrm@789!");
    await page.locator("#Login").click();
    await page.waitForLoadState('load');

    await page.locator("//div[@class='slds-icon-waffle']").click();
    await page.waitForSelector("//button[text()='View All']")
    await page.locator("//button[text()='View All']").click();
    await page.waitForLoadState('load');

    // To search for Dashboards

    await page.getByPlaceholder("Search apps or items...").fill("Dashboards");
    await page.getByPlaceholder("Search apps or items...").focus()
    await page.keyboard.press("Enter");
    await page.click('//mark[text()="Dashboards"]');


    // Click on New Dashboard


    await page.click("//div[@title='New Dashboard']");
    const frameElement = page.frameLocator("//iframe[@title='dashboard']");
    await frameElement.locator("//input[@id='dashboardNameInput']").fill("SalesForce Automation by Vidya");
    await frameElement.locator("//input[@id='dashboardDescriptionInput']").fill("Automation using Playwright");
    await frameElement.locator("//button[text()='Create']").click();
    
    //To save the Dashboard

    await frameElement.locator("//button[text()='Save']").click();
    await page.waitForLoadState('load');
    
    // Verify the "Created DashBoard"

    await page.locator("//a[@title='Dashboards']/span").click();
    const dashName = await page.locator("//a[@title='SalesForce Automation by Vidya']").first().innerText();
    console.log(dashName);
    expect(dashName).toContain("Vidya")
    await page.waitForTimeout(5000);

})
