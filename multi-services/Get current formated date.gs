/*
* Getting the currend date formated yyy-MM-dd HH:mm:ss
*/
let dateFormated = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'").replace("T", " ").replace("Z", "");
