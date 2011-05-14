  var counter = 10;

  function countDown() {
      document.getElementById("countdown").value = counter-- + ' seconds left';
      if (counter != -1)
          setTimeout('countDown()',1000);
      else
         document.getElementById("countdown").value =' Tough luck.';
  }

  countDown();

  document.documentElement.className = "yui-pe";
  YAHOO.namespace("userdata.container");
   
  YAHOO.util.Event.onDOMReady(function () {
    
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
   
      // Remove progressively enhanced content class, just before creating the module
      YAHOO.util.Dom.removeClass("dialog", "yui-pe-content");
   
    // Instantiate the Dialog
    YAHOO.userdata.container.dialog = new YAHOO.widget.Dialog("dialog", 
                { width : "30em",
                  fixedcenter : true,
                  visible : false, 
                  constraintoviewport : true,
                  buttons : [ { text:"Submit", handler:handleSubmit, isDefault:true },
                        { text:"Cancel", handler:handleCancel } ]
                });
   
    // Validate the entries in the form to require that both first and last name are entered
    YAHOO.userdata.container.dialog.validate = function() {
      var data = this.getData();
      if (data.firstname == "" || data.lastname == "") {
        alert("Please enter your first and last names.");
        return false;
      } else {
        return true;
      }
    };
   
    // Wire up the success and failure handlers
    YAHOO.userdata.container.dialog.callback = { success: handleSuccess,
                   failure: handleFailure };
    
    // Render the Dialog
    YAHOO.userdata.container.dialog.render();
   
    YAHOO.util.Event.addListener("show", "click", YAHOO.userdata.container.dialog.show, YAHOO.userdata.container.dialog, true);
    YAHOO.util.Event.addListener("hide", "click", YAHOO.userdata.container.dialog.hide, YAHOO.userdata.container.dialog, true);
  });