function getCSVFileAsData() {

  const FOLDER_CSV = DriveApp.getFolderById(getIdFromUrl(CSV_FOLDER_URL));
  const CSV_FILES = FOLDER_CSV.getFilesByType(MimeType.CSV);

  csvFile = '';

  while (CSV_FILES.hasNext()) {
    let file = CSV_FILES.next();
    let csvFileName = file.getName();

    if (csvFileName.indexOf("FISVCR_EVO_" + globalVariable.dateSetup + "_") >= 0) {
      csvFile = file;

    }
  }

  data = Utilities.parseCsv(csvFile.getBlob().getDataAsString());
  console.log(data);


}
