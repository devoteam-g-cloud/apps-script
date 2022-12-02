/*
* Convert Google Sheets to Excel
*/
function excelFileGeneration(ss) {

  let id = getIdFromUrl(ss.getUrl());
  fileName = 'test';


  var url = 'https://docs.google.com/feeds/download/spreadsheets/Export?key=' + id + '&exportFormat=xlsx';

  var params = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };

  var excelFile = UrlFetchApp.fetch(url, params).getBlob();

  excelFile.setName(fileName + '.xlsx');

  // MailApp.sendEmail(EMAIL_NOTIFICATION, 'Google Sheet to Excel', 'The XLSX file is attached', { attachments: [excelFile] }); // TODO delete
}



/*
* Convert one google Slide to PDF
*/
function convert(){
  // Options pour UrlFetch
  var options = {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  };

  // Génération de l'url permettant l'export en PDF
  templateExportToPdfUrl = 'https://docs.google.com/presentation/d/' + '{{id drive source}}' +
  '/export/pdf?id=' + '{{id drive source}}' + '&pageid=' + '{{slideId}}';

  // console.log(templateExportToPdfUrl);

  // Génération du PDF
  certificationPdfResponse = UrlFetchApp.fetch(templateExportToPdfUrl, options).getBlob();
  // Logger.log(certificationPdfResponse);
  certificationPdfFile = FOLDER_DESTINATION.createFile(certificationPdfResponse);
}




