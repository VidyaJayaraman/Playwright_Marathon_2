import { chromium } from "@playwright/test";

async function generateToken(){
 
    const browser =await chromium.launch();
    const browserContext=await browser.newContext();
    const request= browserContext.request;
    const response=await request.post("https://login.salesforce.com/services/oauth2/token",{
        headers:{
          "Content-Type":"application/x-www-form-urlencoded",
          "Connection":"Keep-alive"
        },
        form: {
            "grant_type": "password",
            "client_id": "3MVG94Jqh209Cp4QSk9Ar9R9auADjq0P1dreOKJPjloNEipH5k4yImzto_.NvtH2n0YX2GKQihaeKD1KUHu0n",
            "client_secret": "AA4BD9AA037EC2C693F853334A8E26DAE5E981A2F58D4F09C7EBB11B99BCAEEB",
            "username": "viddhu.j@gmail.com",
            "password": "Testcrm@789!"
        }
        })

         const authtoken=await response.json();

         return {
            accessToken: authtoken.access_token,
            instanceUri:authtoken.instance_url
         }
  
}

export {generateToken};