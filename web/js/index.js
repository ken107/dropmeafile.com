
serviceUrl = location.hostname == "localhost" ? "http://localhost:30112/dropmeafile" : "https://support2.lsdsoftware.com/dropmeafile";
bucket = null;

$(window).one("load", function() {
  setTimeout(function() {
if (location.hash && location.hash != "#pickup") openBucket(location.hash.substr(1));
else createBucket();
  }, 100)
})


function openBucket(bucketId) {
  $.get({
    url: serviceUrl + "/" + bucketId,
    success: function(result) {
      bucket = result;
      alertPopup.show("ATTENTION: only open files from people you know")
    },
    error: function(xhr) {
      alertModal.show(xhr.responseText, function() {
        location.href = "/";
      })
    }
  })
}

function createBucket() {
  $.post(serviceUrl, function(result) {
    bucket = result;
    bucket.isNew = true;
  })
}

function setExpiration(expire) {
  $.post({
    url: serviceUrl + "/" + bucket.id + "/expiration",
    contentType: "application/json",
    data: JSON.stringify({seconds: expire.value}),
    success: function() {
      var whenExpires = moment().add(expire.value, "seconds");
      alertPopup.show("Bucket will expire on " + whenExpires.format("MM/DD") + " at " + whenExpires.format("hh:mm a"), "success");
    },
    error: function(xhr) {
      alertPopup.show(xhr.responseText);
    }
  })
}

pickupDialog = new function() {
  this.visible = location.hash == "#pickup";

  this.show = function() {
    this.visible = true;
  }
  this.hide = function() {
    this.visible = false;
  }
}

setPassphraseDialog = new function() {
  this.visible = false;
  this.formData = null;

  this.show = function() {
    this.visible = true;
    this.formData = $.extend({name: '', passphrase: ''}, bucket.key);
  }
  this.hide = function() {
    this.visible = false;
  }
}

function pickup(data) {
  if (!data.name || !data.passphrase) {
    alertPopup.show("Please enter name and passphrase");
    return;
  }
  $.get({
    url: serviceUrl + "/pickup/" + encodeURIComponent(data.name) + "/" + encodeURIComponent(data.passphrase),
    success: function(result) {
      bucket = result;
      pickupDialog.hide();
    },
    error: function(xhr) {
      alertPopup.show(xhr.responseText);
    }
  })
}

function setPassphrase() {
  var data = setPassphraseDialog.formData;
  if (!data.name || !data.passphrase) {
    alertPopup.show("Please enter name and passphrase");
    return;
  }
  $.post({
    url: serviceUrl + "/" + bucket.id + "/key",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function() {
      bucket.key = data;
      alertPopup.show("Passphrase set", "success");
      setPassphraseDialog.hide();
    },
    error: function(xhr) {
      alertPopup.show(xhr.responseText);
    }
  })
}

function copyUrl() {
  var txtCopy = $('#copy-to-clipboard');
  if (!txtCopy.length) txtCopy = $("<textarea id='copy-to-clipboard'></textarea>").appendTo(document.body);
  txtCopy.val(location.href);
  txtCopy.get(0).select();

  try {
    if (!document.execCommand('copy')) throw "fail";
    alertPopup.show("This page's URL has been copied to your clipboard.", "success");
  }
  catch (err) {
    alertPopup.show("Oops, unable to copy. You'll have to do it manually.");
  }
}

alertPopup = new function() {
  this.message = null;
  this.context = null;
  this.visible = false;
  var timer;

  this.show = function(message, context) {
    this.message = message;
    this.context = context;
    this.visible = true;
    clearTimeout(timer);
    timer = setTimeout(this.hide.bind(this), 5000);
  }
  this.hide = function() {
    this.visible = false;
  }
}

alertModal = new function() {
  this.message = null;
  this.visible = false;
  this.onHide = null;

  this.show = function(message, onHide) {
    this.message = message;
    this.visible = true;
    this.onHide = onHide;
  }
  this.hide = function() {
    this.visible = false;
    if (this.onHide) this.onHide();
  }
}
