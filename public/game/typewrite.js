// Int Objects
typewrite = {}; // Int app
typewrite.tool = {}; // Int tools
typewrite.lib = {}; // Int Lib

// Start Que
var _Queue = function() {
    var queue = [];
    var offset = 0;

    this.getLength = function() {
        return (queue.length - offset);
    }
    this.isEmpty = function() {
        return (queue.length == 0);
    }
    this.enqueue = function(item) {
        queue.push(item);
    }
    this.dequeue = function() {
        if (queue.length == 0) return undefined;
        var item = queue[offset];
        if (++offset * 2 >= queue.length) {
            queue = queue.slice(offset);
            offset = 0;
        }
        return item;
    }
    this.peek = function() {
        return (queue.length > 0 ? queue[offset] : undefined);
    }
}
typewrite.lib.Queue = _Queue;
// End Que

// Start Console
var _Console = function() {
    this.isTypeing = false;
    // Queue's
    this.Queue = new typewrite.lib.Queue();
    this.TQueue = new typewrite.lib.Queue();

    setInterval(function() {
        if (!typewrite.Console.Queue.isEmpty() && !typewrite.Console.TQueue.isEmpty() && !typewrite.Console.isTypeing) {
            typewrite.Console.isTypeing = true;
            var message = typewrite.Console.Queue.dequeue();
            var speed = typewrite.Console.TQueue.dequeue();
            $.each(message.split(''), function(i, letter) {
                setTimeout(function() {
                    $('#Notice').html($('#Notice').html() + letter);
                }, speed * i);
            });
            setTimeout(function() {
                $('#Notice').html($('#Notice').html() + "<br>");
                if (message == ".c") {
                    $('#Notice').html("");
                };
                typewrite.Console.isTypeing = false;
            }, speed * message.length);
        }
    }, 10);
}

_Console.prototype = {
    writeline: function(message, speed) {
        speed = typeof speed !== 'undefined' ? speed : 30;
        this.Queue.enqueue(message);
        this.TQueue.enqueue(speed);
    },
    clear: function() {
        this.writeline(".c", 1);
    },
};
// End console

// Start App
var _App = function() {
    this.tool = typewrite.tool;
    this.lib = typewrite.lib;
    this.Console = new _Console();
}
typewrite = new _App();