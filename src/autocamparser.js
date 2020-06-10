var debug = false;

exports.parse = function(line, callback) {
    if(line.startsWith("#CUT,")) {
        var elements = line.split(',');
        var newCamera = elements[1];
        if(debug)
            console.log("Switching to cam "+newCamera);
        callback(newCamera);
    } else {
        // Debug-output or not-supported command
        if(debug) 
            console.log("Unrecognized cmd: "+line);
    }
}

function test_callback(camera) {
    console.log(camera);
}

function test() {
    debug = true;
    console.log("Starting parser-tests");
    exports.parse("#CUT,2", test_callback);
    exports.parse("blank", test_callback);
    exports.parse("#CUT,1", test_callback);
}

