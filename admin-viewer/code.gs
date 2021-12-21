/*
 * Main function to list all admin of domain
 */

function listRolesAndAdmins() {
  var sheetTB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TB');
  sheetTB.getRange('B3').setValue('Running...');
  SpreadsheetApp.flush()
  var pageToken; 
  var roles = {};
  do{
    var page = AdminDirectory.Roles.list('my_customer',{pageToken:pageToken});
    for(var i = 0; i < page.items.length ; i++){
      var item = page.items[i]
      var roleId = item.roleId;
      var roleName = item.roleName;
      roles[roleId]={id:roleId,name:roleName,users:[]}
    }
    pageToken = page.nextPageToken;
  }while(pageToken)

  var pageToken; var tabusers = {}
  do{
    var page = AdminDirectory.RoleAssignments.list('my_customer',{pageToken:pageToken});
    for(var i = 0 ; i < page.items.length ; i++){
      var item = page.items[i];
      // console.log(item)
      var userId = item.assignedTo;
      if(!tabusers[userId]){
        try{
          var user = AdminDirectory.Users.get(userId);
          
        }catch(e){
          var user = {primaryEmail:'system'}
        }
        tabusers[userId] = {email:user.primaryEmail,id:userId};
        var roleId = item.roleId;
        roles[roleId].users.push(tabusers[userId])
      }
      
      
    }
    pageToken = page.nextPageToken;
  }while(pageToken)

  var start = 0;
  sheetTB.getRange('6:100').clearContent();
  for( var key in roles){
    var role = roles[key];
    var tab = [];
    if(role.users.length > 0){
      var users = role.users;
      tab.push([role.name])
      for(var i = 0; i < users.length;i++){
        var user = users[i];
        tab.push([user.email])
      }
      sheetTB.getRange(6,start+1,tab.length,tab[0].length).setValues(tab);
      sheetTB.getRange(6,start+1,tab.length,tab[0].length).setBorder(true,true,true,true,true,true,'#efefef',SpreadsheetApp.BorderStyle.SOLID)

      start++;
    }
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PARAMS');
  var tab = [];
  for(var k in tabusers){
    var user = tabusers[k]
    tab.push([user.email]);
  }
  sheet.getRange(2,1,tab.length,tab[0].length).setValues(tab)
  sheetTB.getRange('B3').clearContent()

  
}
