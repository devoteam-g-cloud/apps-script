const label = 'INVOICE' ;  // Set to false f you want to treat from the inbox
const labelTreated = 'INVOICE_DONE'
const sheetId = 'YOUR_SHEET_ID';
const folderId = 'YOUR_FOLDER_ID' ;
const url_document_ai = 'https://us-documentai.googleapis.com/v1/projects/123456:process';

function main() {
  var res = [];
  var header = ["Timestamp","Sender","Date","Subject","Invoice Name","File Tyep","File Link"];
  var extracts = ["invoice_id","invoice_date","receiver_name","supplier_name","supplier_tax_id","total_amount","total_tax_amount","due_date"]
  extracts.forEach(function (item){
    header.push(item)
    header.push('confidence_'+item)
  })
  res.push(header);
  if(label){
    var threads = GmailApp.getUserLabelByName(label).getThreads()
  }else{
    var threads = GmailApp.getInboxThreads();
  }
  // Check Label treated
  let treated = GmailApp.getUserLabelByName(labelTreated);
  if(!treated){
    treated = GmailApp.createLabel(labelTreated);
  }

  for(let i = 0 ; i < threads.length ; i++){
    let thread = threads[i];
    let msgs = thread.getMessages();
    for( let j = 0 ; j < msgs.length ; j++){
      let msg = msgs[j];
      let sender = msg.getFrom();
      let date = msg.getDate();
      let subject = msg.getSubject();

      let attachs = msg.getAttachments();
      if(attachs.length > 0){
        for(let key in attachs){
          let attach = attachs[key];
          console.log(attach.getName())
          let bytes = attach.getBytes();
          try{
            let rep = queryDocumentAI(bytes,attach.getContentType())
            let file = DriveApp.createFile(Utilities.newBlob(bytes,attach.getContentType(),attach.getName()));
            DriveApp.getFolderById(folderId).addFile(file);
            let entities = formatEntities(rep.document.entities)
            let out = [new Date(),sender,date,subject,attach.getName(),attach.getContentType(),file.getUrl()];
            
            extracts.forEach(function(item){
              if(!entities[item]){
                out.push('Not available');
                out.push(0)
              }else{
                out.push(entities[item].mentionText);
                out.push(entities[item].confidence)
              }
            })
            console.log('out length : '+out.length)
            res.push(out)
            console.log('OUT : '+out)
          }catch(e){
            console.log(e.message)
            res.push([new Date(),sender,date,subject,attach.getName(),'Issue to extract information','','','','','','','','','','','','','','','','',''])
          }
        }
      }else{
        res.push([new Date(),sender,date,subject,'No file','','','','','','','','','','','','','','','','','',''])
      }

    }
    thread.addLabel(treated);
    if(label){
      thread.removeLabel(GmailApp.getUserLabelByName(label))
    }
    thread.moveToArchive();
  }
  if(res.length > 1){
    let sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.insertRowsBefore(2,res.length-1)
    sheet.getRange(1,1,res.length,res[1].length).setValues(res);
  }
}

function formatEntities(entities){
  let json = {};
  for(let key in entities){
    let entity = entities[key]
    json[entity.type] = {
      "type":entity.type,
      "mentionText":entity.mentionText,
      "confidence":entity.confidence
    }
  }
  return json;
}

function queryDocumentAI(bytes,contentType){
  const encoded = Utilities.base64Encode(bytes);
  let body = {
  "skipHumanReview": true,
  "fieldMask": "entities",
  "rawDocument": {
    "content": encoded,
    "mimeType": contentType
    } 
  }
  var param = {
    method      : "POST",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    "contentType" : "application/json",
      "payload":JSON.stringify(body, null, 2),
    muteHttpExceptions:true,
  };
  var txt = UrlFetchApp.fetch(url_document_ai,param).getContentText();
  return JSON.parse(txt)
}
