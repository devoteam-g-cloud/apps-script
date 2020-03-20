# Bullk Send SMS with Apps Script and Twilio

## Purpose of the script

If you need to send SMS to people of your company or external persons we can automate this task with Google Apps Script and theTwilio API.

It is really simple fill a column with the phone numbers and a second one with the text and then send all SMS in one click.

## Prerequisite

A Twilio account : https://www.twilio.com/

Here a good introdution help article : https://www.twilio.com/docs/sms/tutorials/automate-testing

Here the global documentation : https://www.twilio.com/docs/iam/test-credentials#test-sms-messages


You don't need to go through this documentation for our script but if you have questions it is the articles to read.

## Testing

Check the function sendTestSMS() it is ready for testing.

If you want to use test phone number use : sendSMS('+33612324567','Apps Script Rocks',true,testFromPhone.no_error)

In production just use : sendSMS('+33612324567','Apps Script Rocks')

## How it works

 0. (OPTIONAL) If you want to extract data from your directory you can launch getAllUsersFromDirectory()
 
    This will generate a Google Sheets, copy paste the ID of the sheet in the var sheetId
    
 1. Enter the sheet ID you want to use in the var **sheetId**
 2. Run the function setupSheet()
    It will add a sheet DATA to your Google Sheets with proper Columns.
 3. Add your credentials to vars **ACCOUNT_SID** & **AUTH_TOKEN**
 4. Add your phone number from Twilio to the **FROM** var
 5. Fill out the sheet with phone number and message.
 
    **WARNING** : phone number must be like +336xxxxx (International fomrat) in the cell enter the value like that '+336xxxxx
    
    **Dont forget the '**
 6. Run the function bulkSendSMS()
 
 ## Test phone number
 
 You can use them for your testing by using them in the **To** field. They are all in the var testFromPhone.
 
  example : sendSMS('+33612324567','Apps Script Rocks',true,testFromPhone.no_error)
  
## Find test SID/Token

Go there : https://www.twilio.com/console/project/settings

Test are on the right of the page.

Production are on the left, you can also create a specific SID/Token for this app.

Old article from twilio : https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them
