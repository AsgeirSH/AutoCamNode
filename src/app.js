var ATEM = require('applest-atem');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const AutoCam = require('./autocamparser');

console.log("Started AutoCamNode MiniStudio");

const port = new SerialPort('/dev/ttyS1', {
    baudRate: 115200
}, function (err) {
    if(err) 
        return console.log("Error:" , err.message)
})

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', function(data) {
    AutoCam.parse(data, function(camera) {
        // TODO: ATEM command here
        console.log("Camera: "+camera);
    });
});

// The open event is always emitted
port.on('open', function() {
    console.log("Opened serial port");    
})
