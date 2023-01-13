/*
* Sending an email from the email.html template, personalizig it with some fields and attaching the 2 proper files
*/
function sendEmail(data){
  let emailHtmlTemplate = HtmlService.createTemplateFromFile("email");
  emailHtmlTemplate.fname = data.fname;
  emailHtmlTemplate.lname = data.lname;
  emailHtmlTemplate.title = data.title;

  let emailBody = emailHtmlTemplate.evaluate().getContent();

  GmailApp.sendEmail(data.email, EMAIL_SUBJECT, "", {
    htmlBody: emailBody,
    cc: EMAIL_COPY_ADRESS,
    // attachments: [data.certificationPdfFile]
    attachments: [data.certificationPdfFile, DriveApp.getFileById(data.badgeId)]
  });
}
