
files = [];
expireList = [
  { value: 5*60, desc: "5 minutes" },
  { value: 30*60, desc: "30 minutes" },
  { value: 2*3600, desc: "2 hours" },
  { value: 24*3600, desc: "1 day" },
  { value: 72*3600, desc: "3 days" },
]
expireIndex = 4;

$(function () {
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, data) {
      files.push.apply(files, data.result.result);
    }
  });
});
