/** 
 * Extraction of the Google Id from an URL
 */
function getIdFromUrl(url) {
  try {
    let id = url.match(/[-\w]{25,}/);
    return id[0];
  } catch (err) {
    console.log(err.message);
    return false;
  }
}





/**
 * Returns a list (array) of unique values, to be used as an argument of a filter method
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}





/**
 * Removes the spaces from a string
 */
function removeSpacesFromString(string){
  return string.replace(/\s/g, '');
}





/**
 * Récupération de l'url du dossier parent
 */
function getParentFolderUrl(id) {
  const SS_DRIVEAPP = DriveApp.getFileById(id);
  const SS_PARENT_FOLDERS = SS_DRIVEAPP.getParents();
  let urlParentFolder = '';

  while (SS_PARENT_FOLDERS.hasNext() && urlParentFolder.length == 0) {
    let parent = SS_PARENT_FOLDERS.next();
    urlParentFolder = parent.getUrl();
  }
  return urlParentFolder;
}





/**
 * Removes the spaces from a string
 */
function removeSpacesFromString(string) {
  return string.replace(/\s/g, '');
}





/**
 * Gets a 2 dimensional array (table) and returns it with all of its elements stringified
 */
function stringyfyTable(table) {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      table[i][j] = table[i][j].toString();
    }
  }
  return table;
}





/**
 * Returns a list (array) of the RGB values from a long color
 */
function convertColorFromLongToRGB(longColor) {
  let red = Math.round(longColor % 256);
  let green = Math.round((longColor / 256) % 256);
  let blue = Math.round((longColor / 65536) % 256);
  let rgb = [red, green, blue];
  return rgb;
}





/**
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}





/**
 * Returns the Hexadecimal value of a RGB color
 */
function rgbToHex(rgbList) {
  let r = rgbList[0];
  let g = rgbList[1];
  let b = rgbList[2];
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
