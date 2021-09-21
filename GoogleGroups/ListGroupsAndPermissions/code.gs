/*** Hello! This script extracts in a spreadsheet all the groups of the Google Workspace Plateform, and lists the pricipal permissions of each. A link to the spreadsheet will be generated at the end of the execution. ***/


/**************************************************************************
 * Extracts the domain name from the email address of the user.
 */
var email = Session.getEffectiveUser().getEmail();          
var domainName = email.substring(email.lastIndexOf("@") +1);


/**************************************************************************
 * Lists all the groups in the domain.
 */
function listAllGroups() {
  var pageToken;
  var page;
  var response = [];
  response.push(['Email',"WhoCanContactOwner", "WhoCanViewMembership", "WhoCanMoveTopicsIn", "WhoCanMoveTopicsOut", "WhoCanPostMessage", "WhoCanModerateMembers", "whoCanModifyMembers", "WhoCanJoin", "AllowExternalMembers"])
  
  do {
    page = AdminDirectory.Groups.list({
      domain: domainName,
      maxResults: 100,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var settings = getGroupSettings(group.email);
        response.push([group.email, settings.whoCanContactOwner, settings.whoCanViewMembership, settings.whoCanMoveTopicsIn, settings.whoCanMoveTopicsOut, settings.whoCanPostMessage, settings.whoCanModerateMembers, settings.whoCanModifyMembers, settings.whoCanJoin, settings.allowExternalMembers]);
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

var url = spreadsheet_Part(response);
console.log(url);
}


/****************************************************************
 * Gets a group's settings.
 */
function getGroupSettings(groupId) {
    var group = AdminGroupsSettings.Groups.get(groupId);
    return group;
} 


/****************************************************************
 * Create the spreadsheet, add a conditional format rule, resizes columns and returns spreadsheet's URL.
 */
function spreadsheet_Part(response)  {
var new_Spreadsheet = SpreadsheetApp.create('Groups and permissions List');
  var columns = response[0].length;
  new_Spreadsheet.getSheets()[0].getRange(1,1,response.length,response[0].length).setValues(response)
  var sheet = new_Spreadsheet.getActiveSheet();
  var conditionalFormatRules = new_Spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([new_Spreadsheet.getCurrentCell().offset(0, 0, 1, 26)])
  .whenCellNotEmpty()
  .setBackground('#B7E1CD')
  .build());
  new_Spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);
  conditionalFormatRules = new_Spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.splice(conditionalFormatRules.length - 1, 1, SpreadsheetApp.newConditionalFormatRule()
  .setRanges([new_Spreadsheet.getCurrentCell().offset(0, 0, 1, 26)])
  .whenCellNotEmpty()
  .setBackground('#b6d7a8')
  .build());
  new_Spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);
  new_Spreadsheet.getActiveSheet().autoResizeColumns(1,response[0].length);

  return new_Spreadsheet.getUrl();
}


