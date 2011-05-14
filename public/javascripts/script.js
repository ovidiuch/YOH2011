var counter = 10;

function countDown() {
    document.getElementById("countdown").value = counter-- + ' seconds left';
    if (counter != -1)
        setTimeout('countDown()',1000);
    else
        document.getElementById("countdown").value =' Tough luck.';
}

// Define various event handlers for Dialog
var handleSubmit = function() {
    this.submit();
};
var handleCancel = function() {
    this.cancel();
};
var handleSuccess = function(o) {
    var response = o.responseText;
    response = response.split("<!")[0];
    document.getElementById("resp").innerHTML = response;
};
var handleFailure = function(o) {
    alert("Submission failed: " + o.status);
};

YUI().use('event', 'gallery-dialog', function(Y) {

    countDown();

    document.documentElement.className = "yui-pe";
    // Y.namespace("userdata.container");

    console.log(Y);

    Y.on("domready", function () {

        // Remove progressively enhanced content class, just before creating the module
        Y.all('#dialog').removeClass('yui-pe-content');

        // Instantiate the Dialog
        var dialog = new Y.Dialog({
            width : "30em",
            fixedcenter : true,
            visible : false,
            constraintoviewport : true,
            buttons : [ { text:"Submit", handler:handleSubmit, isDefault:true },
                        { text:"Cancel", handler:handleCancel } ]
        });

        // Validate the entries in the form to require that both first and last name are entered
        dialog.validate = function() {
            var data = this.getData();
            if (data.firstname == "" || data.lastname == "") {
                alert("Please enter your first and last names.");
                return false;
            } else {
                return true;
            }
        };

        // Wire up the success and failure handlers
        dialog.callback = { success: handleSuccess,
                            failure: handleFailure };

        // Render the Dialog
        dialog.render();
        Y.on("click", dialog.show, "#show");
        Y.on("click", dialog.hide, "#hide");

        // Y.util.Event.addListener("show", "click", dialog.show, dialog, true);
        // Y.util.Event.addListener("hide", "click", dialog.hide, dialog, true);
    });
});
