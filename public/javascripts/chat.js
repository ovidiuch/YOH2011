var Chat = {
    socket: false,
    lastMessage: false,
    init: function(where) {
        var self = this;
        try {
            this.socket = new WebSocket('ws://' + where);
            self.toChat('<span style="color: red">connecting to ' + where + "</span>");
            this.socket.onopen = function () {
                self.toChat('Connected.');
            }
            this.socket.onmessage = function(response) {
                var parsedData = JSON.parse(response.data);
                self.actions[parsedData.type](parsedData.content);
                self.toChat('Received: ' + response.data);
            }
            this.socket.onerror = function(m) {
                self.toChat('Error: ' + m.data);
            }
        } catch(e) {
            msg("Exception!!");
        }
    },
    actions: {
        nameRequest: function() {
            var name = prompt("Enter your name:");
            var response = {
                type: "nameResponse",
                content: {
                    name: name
                }
            };
            Chat.socket.send(JSON.stringify(response));
        },
        nameValidation: function(data) {
            if(!data.valid) {
                this.nameRequest();
            }
        },
        interfaceUpdate: function(data) {
            console.log(data.players);
        }
    },
    toChat: function(message) {
        $('#chat').append('<p>' + message + '</p>');
        $('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
    }
};

$(function() {
    $('#go').click(function() {
        Chat.init($('#conn').val());
    });
    $('#line').submit(function() {
        var msg = $(this).find('input').val();
        Chat.toChat('Sent> ' + msg);
        Chat.socket.send(msg);
        $(this).find('input').val('');
        return false;
    });


    $('#go').click();
    $('#line input').focus();
});