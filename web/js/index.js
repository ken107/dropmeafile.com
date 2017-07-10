
serviceUrl = "http://localhost:30112/dropmeafile";
bucket = null;
extensions = {
  ai: { icon: "file_ai.png" },
  avi: { icon: "file_avi.png" },
  css: { icon: "file_css.png" },
  doc: { icon: "file_doc.png" },
  docx: { icon: "file_doc.png" },
  eps: { icon: "file_eps.png" },
  gif: { icon: "file_gif.png" },
  html: { icon: "file_html.png" },
  htm: { icon: "file_html.png" },
  jpg: { icon: "file_jpg.png" },
  mov: { icon: "file_mov.png" },
  mp4: { icon: "file_mov.png" },
  mp3: { icon: "file_mp3.png" },
  pdf: { icon: "file_pdf.png" },
  png: { icon: "file_png.png" },
  ppt: { icon: "file_ppt.png" },
  pptx: { icon: "file_ppt.png" },
  psd: { icon: "file_psd.png" },
  txt: { icon: "file_txt.png" },
  wav: { icon: "file_wav.png" },
  xls: { icon: "file_xls.png" },
  xlsx: { icon: "file_xls.png" },
  zip: { icon: "file_zip.png" },
  "7z": { icon: "file_zip.png" },
  other: { icon: "file_other.png" }
}
expireList = [
  { value: 5*60, desc: "5 minutes" },
  { value: 30*60, desc: "30 minutes" },
  { value: 2*3600, desc: "2 hours" },
  { value: 24*3600, desc: "1 day" },
  { value: 72*3600, desc: "3 days" },
]
expireIndex = 4;


function onUploadDone(e, data) {
  bucket = data.result;
}

function selectFile(file) {
  window.open(serviceUrl + "/" + bucket.id + "/" + file.id);
}

function openBucket(bucketId) {
  $.get(serviceUrl + "/" + bucketId, function(result) {
    bucket = result;
  })
}

function getExtension(filename) {
  var index = filename.lastIndexOf(".");
  return index != -1 ? filename.substr(index+1).toLowerCase() : null;
}

function setExpiration(expire) {
  $.post({
    url: serviceUrl + "/" + bucket.id + "/expiration",
    contentType: "application/json",
    data: JSON.stringify({seconds: expire.value}),
    success: function() {
      var whenExpires = moment().add(expire.value, "seconds");
      showAlert("Bucket will expire on " + whenExpires.format("MM/DD") + " at " + whenExpires.format("HH:mm a"));
    }
  })
}

function showAlert(message) {
  console.log(message);
}
