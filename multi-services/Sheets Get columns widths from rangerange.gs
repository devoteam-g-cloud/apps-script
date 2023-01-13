/*
* For sheet and an alphanumeric range, returns an array of the width of each column that it contains
*/
function getColumnWidthsOfAnAlphanumericRange(sheet, alphaNumericRange) {
  let ranges = alphaNumericRange.split(':');
  let startingColumnIndex = ranges[0].match(/(\d+)/)[0];
  let endingColumnIndex = ranges[1].match(/(\d+)/)[0];

  if (endingColumnIndex < startingColumnIndex) {return}

  let widths = [];
  for (let i = startingColumnIndex; i <= endingColumnIndex; i++){
    widths.push(sheet.getColumnWidth(i));
  }

  return widths;
}
