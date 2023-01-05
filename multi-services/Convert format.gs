/**
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



/**
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



/**
 * Génération du PDF à partir d'une url Google Sheets dans un dossier particulier
 */
function genratePdf(idSS, gidTab, urlFolder, name) {
  // Options pour UrlFetch
  var options = {
    // muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  };

  // Génération de l'url permettant l'export en PDF
  templateExportToPdfUrl = 'https://docs.google.com/spreadsheets/d/' + idSS + '/export?format=pdf&gid=' + gidTab;

  // Génération du PDF
  let pdfBlob = UrlFetchApp.fetch(templateExportToPdfUrl, options).getBlob();
  const FOLDER_DESTINATION = DriveApp.getFolderById(getIdFromUrl(urlFolder));

  let pdfFile = FOLDER_DESTINATION.createFile(pdfBlob);

  pdfFile.setName(name + '.pdf');
  let pdfUrl = pdfFile.getUrl();
  pdfUrl = pdfUrl.split('?')[0];
  return pdfUrl;
}
