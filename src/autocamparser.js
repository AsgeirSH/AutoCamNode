var debug = false;

exports.callbacks = [];

exports.parse = function(line, callback) {
    // AC for commands sent to Arduino, ACR for responses sent from Arduino
    if(line.startsWith("$ACR,")) {
        // Find protocol functions
        var elements = line.split(',');
        var index = 1;
        while (index < elements.length) {
            switch(elements[index]) {
               case 'STATUS': RX_STATUS(); break;
                case 'CUT': index++; callback(elements[index]); break; // Add to index for every parameter
                case 'INPUTS': index++; RX_INPUTS(elements[index]); break;
                default: console.log("Unsupported $AC-command received: "+elements[index]+". Full cmd: "+line); break;
            }
            // Add index by one
            index++;
        }
    } else {
        // Debug-output or not-supported command
        if(debug) 
            console.log("Unrecognized cmd: "+line);
    }
}

exports.addCallback = function(command, callback) {
    this.callbacks[command] = callback;
}

exports.removeCallback = function(command) {
    delete this.callbacks[command];
}

function test_callback(camera) {
    console.log(camera);
}

function test() {
    debug = true;
    console.log("Starting parser-tests");
    exports.parse("$ACR,CUT,2", test_callback);
    exports.parse("blank", test_callback);
    exports.parse("$ACR,CUT,1", test_callback);
    exports.parse("$ACR,STATUS");
    exports.parse("$ACR,STATUS,INPUTS,3");

    exports.addCallback("STATUS", function() {console.log("Status Callback OK")});
}

// Returned on POLLSTATUS transmission
function RX_STATUS(split_line) {
    console.log("STATUS packet received");
}

function RX_INPUTS(val) {
    console.log("INPUTS packet received, value "+val);
}

// Uncomment this and run `node src/autocamparser.js` to run tests.
test();
