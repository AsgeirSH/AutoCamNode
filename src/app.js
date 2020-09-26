var ATEM = require('applest-atem');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const AutoCam = require('./autocamparser');

console.log("Started AutoCamNode MiniStudio");

var atem = new ATEM();
var connected = false;
atem.connect('10.8.0.10'); 

atem.on('connect', function() {
    connected = true;
});
        
atem.on('disconnect', function() {
    connected = false;
});

const port = new SerialPort('/dev/tty.usbmodem144201', {
    baudRate: 115200
}, function (err) {
    if(err) 
        return console.log("Error:" , err.message)
})

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', function(data) {
    AutoCam.parse(data, function(camera) {
        //console.log("Camera: "+camera);
        if(connected) {
            atem.changeProgramInput(camera);
        } else {
            console.log("Not connected - not sending request.");
        }
    });
});

// The open event is always emitted
port.on('open', function() {
    console.log("Opened serial port");    
})
