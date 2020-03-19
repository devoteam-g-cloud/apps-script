function getUsersOfDomain() {
  var output = [];
  output.push(['EMAIL','FIRST_NAME','LAST_NAME','PHONE','WORK_PHONE'])
  var pageToken ;
  do{
    var page = AdminDirectory.Users.list({
      orderBy: 'givenName',
      customer : 'my_customer',
      viewType : 'domain_public',
      maxResults: 100,
      pageToken: pageToken
    });
    
    if (page.users && page.users.length > 0) {
      for (var i = 0; i < page.users.length; i++) {
        var user = page.users[i];
        output.push([user.primaryEmail,user.name.givenName,user.name.familyName,getPhone (user.phones ,'mobile'),getPhone (user.phones ,'work')]);
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  }while(pageToken)
  
  var ss = SpreadsheetApp.create('SMS Sheets Sender');
  var sheet = ss.getSheets()[0];
  sheet.setName('DIRECTORY');
  sheet.getRange(1,1,output.length,output[0].length).setValues(output);
  
  return ss;
}

function getPhone (phones ,phoneType) {
  if(phones){
    for(var i in phones){
      var phone = phones[i];
      if(phone.type == phoneType){
        return "'"+phone.value;
      }
    }
  }
  return "";
}
