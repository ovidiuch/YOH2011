function curveGenerator(start, stop, steps, type) {
    var i, res = [];
    var lin_incr = (stop - start) / steps;
    var ninty = Math.PI/2; /* ninty degrees */
    var ninty = Math.PI/2; /* ninty degrees */
    for(i = 0; i<=steps; i++) {
        switch(type) {
        case 'deccel':
            res.push((stop - start) * Math.sin(ninty * i/steps) + start);
            break;
        case 'accel':
            res.push((stop - start) * -Math.sin(ninty * (steps - i)/steps) + stop);
            break;
        case 'linear': default:
            res.push(lin_incr * i + start);
            break;
        }
    }
    return res;
}

document.documentElement.className = "yui-pe";
YAHOO.namespace("userdata.container");

YAHOO.util.Event.onDOMReady(function () {

    document.getElementById('query').onsubmit = function() {
        var fieldValue = this.getElementsByTagName('input')[0].value;
        var response =
        {
            type: 'wordInput',
            content: { word: fieldValue }
        };
        Server.socket.send(JSON.stringify(response));
        return false;
    }

    // Define various event handlers for Dialog
    var handleSubmit = function() {
        return false;
    };
    var handleCancel = function() {
        this.cancel();
    };
    var handleSuccess = function(o) {
        Server.actions.nameRequest2(document.getElementById('name-input').value);
        return false;
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
                                                                constraintoviewport : true
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

function animateValue(container, to_value, timeout) {
    var total_steps = timeout * 10;
    var step = 0;
    var vals = curveGenerator(parseInt(container.innerHTML), to_value, total_steps, 'deccel');
    var repeat = setInterval(function() {
      if(step > total_steps) {
        clearInterval(repeat);
        return;
      }
      container.innerHTML = parseInt(vals[step++]);
    }, 50);
}

function curveGenerator(start, stop, steps, type) {
    var i, res = [];
    var lin_incr = (stop - start) / steps;
    var ninty = Math.PI/2; /* ninty degrees */
    for(i = 0; i<=steps; i++) {
        switch(type) {
        case 'deccel':
            res.push((stop - start) * Math.sin(ninty * i/steps) + start);
            break;
        case 'accel':
            res.push((stop - start) * -Math.sin(ninty * (steps - i)/steps) + stop);
            break;
        case 'linear': default:
            res.push(lin_incr * i + start);
            break;
        }
    }
    return res;
}

