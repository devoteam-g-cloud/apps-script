/*
 * Find all items on your Drive with multiple parents folders
 */

function itemsWithMultipleParents() {
  var query = '"'+Session.getEffectiveUser().getEmail()+'" in owners ';
  var files; var output =[];
  var pageToken;
  do {
    files = Drive.Files.list({
      q: query,
      maxResults: 100,
      pageToken: pageToken
    });
    if (files.items && files.items.length > 0) {
      for (var i = 0; i < files.items.length; i++) {
        var item = files.items[i];
        output.push([item.title,item.id,item.alternateLink,item.parents.length])
      }
    } else {
      Logger.log('No files found.');
    }
    pageToken = files.nextPageToken;
  } while (pageToken);
  var ss = SpreadsheetApp.create('Multi Folder Items')
  var sheet = ss.getSheets()[0];
  sheet.getRange(1,1,output.length,output[0].length).setValues(output)
  Logger.log(ss.getUrl())
}
