function googlePlusActiveUsers() {
  var nb_days = 100 ; // Nb of days to retrieve data, max 180
  var now = new Date();
  var oneWeekAgo = new Date(now.getTime() - nb_days * 24 * 60 * 60 * 1000);
  var startTime = oneWeekAgo.toISOString();
  var endTime = now.toISOString();

  var rows = {};
  var pageToken;
  var page;
  do {
    page = AdminReports.Activities.list('all', 'gplus', {
      startTime: startTime,
      endTime: endTime,
      maxResults: 500,
      pageToken: pageToken,
    });
    var items = page.items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var iduser = item.actor.email.replace(/@/,'');
        if(!rows[iduser]){
          rows[iduser] = [item.actor.email,1]
        }else{
          rows[iduser][1]++
        }
      }
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  
    var spreadsheet = SpreadsheetApp.create('GPlus report');
    var sheet = spreadsheet.getSheets()[0];

    var output = []
    output.push(['User', 'Count']);
    for(var key in rows){
      output.push(rows[key]);
    }
    sheet.getRange(1, 1, output.length, output[0].length).setValues(output);
    
    // Click CTRL + Enter or menu View > Logs
    // Or go to your Google Drive, the file will be created on the root
    Logger.log('*** Report on this url ***');
    Logger.log(spreadsheet.getUrl());
  
}
