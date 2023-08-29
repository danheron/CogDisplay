const ble_address = "fe:89:d1:67:8b:5f random";
const service_uuid = "180D";
const char_uuid = "2A37";

let gPos = 0;
function writeLine(text) {
	// Write text to screen
	g.drawString(text, 0, gPos);
	g.flip();

	// Move cursor
	gPos += 10;
}

function onNotify(data) {
	var hr = data[1];
	
	g.clear();
	g.setFontBitmap();
	g.drawString("Heart Rate");
	g.setFontVector(60);
	g.drawString(hr, (g.getWidth()-g.stringWidth(hr))/2,10);
	g.flip();
}

g.clear();
writeLine("Connecting to heart rate monitor...");
NRF.connect(ble_address).then(function(gatt) {
  	writeLine("Connected.");
	writeLine("Getting HR service...");
  	return gatt.getPrimaryService(service_uuid);
}).then(function(service) {
	writeLine("Got service.");
	writeLine("Getting heart rate characteristic...");
  	return service.getCharacteristic(char_uuid);
}).then(function(characteristic) {
	writeLine("Got characteristic.");
  	characteristic.on("characteristicvaluechanged", function(event) {
    var data = event.target.value.buffer;
    onNotify(data);
  });
  return characteristic.startNotifications();
}).then(function() {
	writeLine("Started.");
});
