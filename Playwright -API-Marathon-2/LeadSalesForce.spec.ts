
import { expect, test } from "@playwright/test"
import { generateToken } from "./oauthGenerator";

let oauthTokenNew: any;
let leadId: any;
let instanceUri: any;
let name:string = "Vidya"
let lname:string = "Testing"

test(`Generate AuthToken`, async () => {

    const authtoken = await generateToken();
    oauthTokenNew = authtoken.accessToken;
    instanceUri = authtoken.instanceUri;
})


//****************************API and UI********************************/

//*****************************Created a new Lead using Post*****************************************

test('Create new Lead using POST', async ({ request }) => {

    const respLead = await request.post(`${instanceUri}/services/data/v60.0/sobjects/Lead`, {

        headers: {

            "Content-Type": "application/json",
            "Authorization": "Bearer " + oauthTokenNew
        },
        data: {
            "Salutation": "Mrs.",
            "LastName": lname,
            "Company": "Testleaf"
        }
    })

    const respLeadId = await respLead.json();
    console.log(respLeadId);
    leadId = respLeadId.id;
    console.log(`Created Lead Id is  ${leadId}`)
    const respCreateLeadStatus = respLead.status()
    expect(respCreateLeadStatus).toBe(201);
    console.log(`resp statuscode post req is  ${respCreateLeadStatus}`)

})

//*****************************Modify the Lead using Patch*****************************************

test('Modify the Lead Using Patch', async ({ request }) => {

    const respPatchLead = await request.patch(`${instanceUri}/services/data/v60.0/sobjects/Lead/${leadId}`, {

        headers: {

            "Content-Type": "application/json",
            "Authorization": "Bearer " + oauthTokenNew
        },
        data: {
            "FirstName":name,
            "Title": "Testing through Postman"
        }
    })


    const respPatchLeadStatus = respPatchLead.status()
    expect(respPatchLeadStatus).toBe(204);
    console.log(`resp statuscode patch req is  ${respPatchLeadStatus}`)
})



//********************Delete the Lead created by API using UI**************************************

test(`Delete the Lead which is Created by API Request`,async({page})=>{




 // Log in to Salesforce application  & click Apps launcher

 await page.goto("https://login.salesforce.com/");
 await page.fill("#username", "viddhu.j@gmail.com");
 await page.fill("#password", "Testcrm@789!");
 await page.locator("#Login").click();
 await page.waitForLoadState('load');

 await page.locator("//div[@class='slds-icon-waffle']").click();
 await page.waitForSelector("//button[text()='View All']")
 await page.locator("//button[text()='View All']").click();
 await page.waitForLoadState('domcontentloaded');

 // To search and click the Leads

 await page.getByPlaceholder("Search apps or items...").fill("Leads");
 await page.getByPlaceholder("Search apps or items...").focus()
 await page.keyboard.press("Enter");
 await page.click('//mark[text()="Leads"]');
 page.waitForLoadState('load'); 

// Delete the Created Lead by API by searching with Name 

const nameis =name+" "+lname
await page.locator("input[name='Lead-search-input']").fill(name+" "+ lname)
await page.locator("input[name='Lead-search-input']").focus()
await page.keyboard.press("Enter");
await page.locator(`(//a[@title='${nameis}']/following::a[@role='button'])[1]`).click()
await page.waitForTimeout(3000);
await page.locator("//a[@title='Delete']").click();
await page.locator("//span[text()='Delete']").click();

// Verify Toast Message upon Deletion

const outputDeletion = await page.locator(" //span[contains( @class,'toastMessage')]").innerText();
console.log(outputDeletion);



})

