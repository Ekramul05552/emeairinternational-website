function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var customer_name = data.customer_name;
    var customer_mobile = data.customer_mobile;
    var customer_email = data.customer_email;
    var customer_passport_number = data.customer_passport_number;
    var files = data.files;

    var emailBody = "A new B2B file submission has been received.<br><br>" +
                    "<b>Customer Name:</b> " + customer_name + "<br>" +
                    "<b>Customer Mobile:</b> " + customer_mobile + "<br>" +
                    "<b>Customer Email:</b> " + customer_email + "<br>" +
                    "<b>Customer Passport Number:</b> " + customer_passport_number + "<br><br>" +
                    "Please find the attached files.";

    var blobs = [];
    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var decodedContent = Utilities.base64Decode(file.content);
        var blob = Utilities.newBlob(decodedContent, file.mimeType, file.name);
        blobs.push(blob);
      }
    }

    var zip = Utilities.zip(blobs, "SubmittedFiles_" + customer_passport_number + ".zip");

    MailApp.sendEmail({
      to: "emeairinternational@gmail.com",
      subject: "New B2B File Submission from " + customer_name,
      htmlBody: emailBody,
      attachments: [zip]
    });

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}