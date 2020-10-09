var FILE_ID = '';

function setFileLock(){
  var fileId = FILE_ID;
  var reason = 'We lock this file for testing ;-)'
  
  var resource = {
    contentRestrictions : [{readOnly:true,reason:reason}]
  }
  
  var file = Drive.Files.patch(resource, fileId);
  getFileLock(fileId)
}


function deleteFileLock(){
  var fileId = FILE_ID;
  
  var resource = {
    contentRestrictions : [{readOnly:false}]
  }

  var file = Drive.Files.patch(resource, fileId);
  getFileLock(fileId)
}


function getFileLock(id) {
  var fileId = id || FILE_ID;
  var file = Drive.Files.get(fileId,{"fields":"contentRestrictions"});
//  Logger.log(file.contentRestrictions)
  if(!file.contentRestrictions){
//    No restriction set
    Logger.log('File is not locked.')
  }else{
    var locks = file.contentRestrictions;
    for( var i = 0 ; i < locks.length ; i++ ){
      var lock = locks[i];
      if(lock.readOnly){
//        File is locked.
        Logger.log('File is locked by '+lock.restrictingUser.displayName + ' since ' + lock.restrictionDate)
        Logger.log('Reason : ' + lock.reason)
      }else{
        Logger.log('File is not locked')
      }
    }
  }
}
