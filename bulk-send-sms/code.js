/*
 * Send SMS in bulk with apps Script and Twilio
 * 
  # # # Prerequisite # # # 
  *
  * You need a Twilio account : https://www.twilio.com/
  * For testing you can use the test number from Twilio with your Test SID/Token
  *
  # # # Find test SID/Token # # # 
  *
  * Go there : https://www.twilio.com/console/project/settings
  * They are on the right of the page.
  *
  # # # Test number # # # 
  *
  * They are all in the var testFromPhone.
  * example : sendSMS('+33612324567','Apps Script Rocks',true,testFromPhone.no_error)
  *
  # # # How it works # # # 
  *
  * 1. If you want to extract data from your directory you can launch getAllUsersFromDirectory()
  *    This will generate a Google Sheets, copy paste the ID of the sheet in the var sheetId
  * 2. Run the function setupSheet()
  *    It will add a sheet DATA to your Google Sheets with proper Columns.
  * 3. Add your credentials to vars ACCOUNT_SID & AUTH_TOKEN
  * 4. Add your phone number from Twilio to the FROM var
  * 5. Fill out the sheet
  *    WARNING : phone number must be like +336xxxxx in the cell enter the value like that '+336xxxxx
  *    Dont forget the '
  * 6. Run the function bulkSendSMS()
  *
  # # # For testing # # # 
  *
  * Replace your credentials with your testing credentials
  * Use magic phone numbers from twilio and activate test mode for the sendSMS() function
  * Normal request : sendSMS('+33612324567','Apps Script Rocks')
  * Test request : sendSMS('+33612324567','Apps Script Rocks',true,testFromPhone.no_error)
 */


const sheetId = '1Bbt-xxxxxxxxxxxx';
const FROM = '+331xxxxxxx'; // Your number from Twilio
const testFromPhone = {
    'invalid':'+15005550001',// This phone number is invalid. Error : 21212
    'not_capable':'+15005550007', //This phone number is not owned by your account or is not SMS-capable.	Error : 21606
    'full':'+15005550008', //This number has an SMS message queue that is full.	Error : 21611
    'no_error':'+15005550006'//This number passes all validation.	No error
  }
const ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxx";
const AUTH_TOKEN = "a0xxxxxxxxxxxxxxxxxxxxxxxxxx";
 
/*
 * Extract information from your directory
 * Work also if you are not admin of the domain as we get data from public directory
 */

function getAllUsersFromDirectory() {
  var ss = getUsersOfDomain();
  Logger.log('Link to spreadsheet : '+ ss.getUrl())
  Logger.log('ID to copy/paste below : '+ ss.getId())
}

/*
 * Setup the Sheet DATA in your file for sending SMS.
 */
 
function setupSheet(){  
  var ss = getSheet();
  var sheet = ss.getSheetByName('DATA');
  if(!sheet){
    sheet = ss.insertSheet('DATA',0);
    sheet.appendRow(['PHONE','MESSAGE','STATUS','LOG'])
  }
  
}

/*
 * Bulk send SMS
 */
 
function bulkSendSMS(){
  var ss = getSheet();
  // ss = SpreadsheetApp.getActiveSpreadsheet() 
  // We just add this reference to ease auto completion in the rest of the code
  var sheet = ss.getSheetByName('DATA');
  var data = sheet.getDataRange().getValues()
  var header = data.shift();
  var rep = []
  for(let i = 0 ; i< data.length ; i++){
    var row = data[i];
    var result = sendSMS(row[0],row[1],true,testFromPhone.no_error) // For Testing
//    var result = sendSMS(row[0],row[1],true,testFromPhone.no_error) // For Production
    if(result.success){
      rep.push(['Success',JSON.stringify(result.response)])
    }else{
      rep.push(['Error',JSON.stringify(result.response)])
    }
    
    if((i/1) % 1 === 0){
      sheet.getRange(2,3,rep.length,rep[0].length).setValues(rep);
      SpreadsheetApp.flush();
    }
  }
}


/*
 * Helper to get Sheet
 */
 
function getSheet(){
  if(!sheetId){
    Logger.log('There is no sheeId setup, please set an ID.')
    throw 'Please setup a sheetId';
  }
  return SpreadsheetApp.openById(sheetId);
}

/*
 * Helper to test to send a SMS
 */
 
function sendTestSMS(){
  var sms = sendSMS('+33612324567','Apps Script Rocks',true,testFromPhone.no_error)
  Logger.log(sms)
}

/*
 * Function to send SMS with Twilio
 */

function sendSMS(to,body,testing,fromPhone){
if(testing){
  var from = fromPhone
}else{
  var from = FROM;
}
Logger.log(from)
var payload = {
    "To": to,
    "Body" : body,
    "From" : from
  };
  Logger.log(payload)
  var options = {
    "method" : "post",
    "payload" : payload
  };
  
   options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(ACCOUNT_SID+":"+AUTH_TOKEN)
  };
  try{
    var req = UrlFetchApp.fetch("https://api.twilio.com/2010-04-01/Accounts/"+ACCOUNT_SID+"/Messages.json", options)
    var rep = {
      'success':true,
      'response':JSON.parse(req.getContentText())
    }
  }catch(e){
    var rep = {
      'success':false,
      'response':e.message
    }
  }
  return rep;
  
}
