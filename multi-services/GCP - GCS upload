/* Written by Amit Agarwal */
/* Email: amit@labnol.org   Web: ctrlq.org */
// https://www.labnol.org/code/20074-upload-files-to-google-cloud-storage

var params = {
  CLIENT_ID: 'xxx.apps.googleusercontent.com',
  CLIENT_SECRET: 'xyz',
  BUCKET_NAME: 'ctrlq-bucket',
  FILE_PATH: 'folder_name/filename',
  DRIVE_FILE: 'fileID',
};




function uploadFileToGCS() {
  var service = getService();
  if (!service.hasAccess()) {
    Logger.log('Please authorize %s', service.getAuthorizationUrl());
    return;
  }

  var blob = DriveApp.getFileById(params.DRIVE_FILE).getBlob();
  var bytes = blob.getBytes();

  var url = 'https://www.googleapis.com/upload/storage/v1/b/BUCKET/o?uploadType=media&name=FILE'
    .replace('BUCKET', params.BUCKET_NAME)
    .replace('FILE', encodeURIComponent(params.FILE_PATH));

  var response = UrlFetchApp.fetch(url, {
    method: 'POST',
    contentLength: bytes.length,
    contentType: blob.getContentType(),
    payload: bytes,
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
    },
  });

  var result = JSON.parse(response.getContentText());
  Logger.log(JSON.stringify(result, null, 2));
}

function getService() {
  return OAuth2.createService('ctrlq')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(params.CLIENT_ID)
    .setClientSecret(params.CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/devstorage.read_write')
    .setParam('access_type', 'offline')
    .setParam('approval_prompt', 'force')
    .setParam('login_hint', Session.getActiveUser().getEmail());
}

function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Connected to Google Cloud Storage');
  } else {
    return HtmlService.createHtmlOutput('Access Denied');
  }
}
