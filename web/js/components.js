
$("<div/>").load("components.html", function() {
  $(this).children().each(function() {
    var className = $(this).data("class");
    if (!window[className]) throw new Error("Missing class " + className);
    else dataBinder.views[className] = {template: this, controller: window[className]};
  })
})

function File() {
}
