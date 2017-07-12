
$("<div/>").load("components.html", function() {
  $(this).children().each(function() {
    var className = $(this).data("class");
    if (!window[className]) throw new Error("Missing class " + className);
    else dataBinder.views[className] = {template: this, controller: window[className]};
  })
})

function File() {
  var icons = {
    ai: "file_ai.png",
    avi: "file_avi.png",
    css: "file_css.png",
    doc: "file_doc.png",
    docx: "file_doc.png",
    eps: "file_eps.png",
    gif: "file_gif.png",
    html: "file_html.png",
    htm: "file_html.png",
    jpg: "file_jpg.png",
    mov: "file_mov.png",
    mp4: "file_mov.png",
    mp3: "file_mp3.png",
    pdf: "file_pdf.png",
    png: "file_png.png",
    ppt: "file_ppt.png",
    pptx: "file_ppt.png",
    psd: "file_psd.png",
    txt: "file_txt.png",
    wav: "file_wav.png",
    xls: "file_xls.png",
    xlsx: "file_xls.png",
    zip: "file_zip.png",
    "7z": "file_zip.png",
    other: "file_other.png"
  };
  this.getExtension = function(filename) {
    var index = filename.lastIndexOf(".");
    return index != -1 ? filename.substr(index+1).toLowerCase() : null;
  };
  this.getIconUrl = function(ext) {
    return 'img/' + (icons[ext] || icons.other);
  };
  this.shouldOverlayExt = function(ext) {
    return !icons[ext];
  };
}

function AlertPopup() {
}

function AlertModal() {
}

function PickupDialog() {
}

function SetPassphraseDialog() {
}

function NavBar() {
  this.expireList = [
    { value: 5*60, desc: "5 minutes" },
    { value: 30*60, desc: "30 minutes" },
    { value: 2*3600, desc: "2 hours" },
    { value: 24*3600, desc: "1 day" },
    { value: 72*3600, desc: "3 days" },
  ];
  this.expireIndex = 4;
}

function FileUpload(viewRoot) {
  var options = {
    dataType: 'json',
    singleFileUploads: true,
    sequentialUploads: true,
    add: onUploadAdd.bind(this),
    progress: onUploadProgress.bind(this),
    done: onUploadDone.bind(this),
    _maxFileSize: 200,
  };

  this.init = function(fileInput) {
    $(fileInput).fileupload(options);
  };

  this.setUploadUrl = function(fileInput, url) {
    $(fileInput).fileupload('option', 'url', url);
  };

  function onUploadAdd(e, data) {
    var files = [];
    for (var i=0; i<data.files.length; i++) {
      var f = data.files[i];
      if (f.size > options._maxFileSize*1024*1024) $(viewRoot).triggerHandler('error', "File '" + f.name + "' is too big, must be less than " + options._maxFileSize + "MB");
      else files.push(f);
    }
    if (files.length == 0) return;
    data.files = files;
    var pendingFiles = data.files.map(function(f) {return {name: f.name}});
    this.bucket.files.push.apply(this.bucket.files, pendingFiles);
    data.context = pendingFiles;
    data.submit();
  }

  function onUploadProgress(e, data) {
    var pendingFiles = data.context;
    for (var i=0; i<pendingFiles.length; i++) pendingFiles[i].progress = data.loaded / data.total;
  }

  function onUploadDone(e, data) {
    var pendingFiles = data.context;
    var files = data.result;
    for (var i=0; i<pendingFiles.length; i++) {
      pendingFiles[i].progress = null;
      $.extend(pendingFiles[i], files[i]);
    }
  }
}
