const ble_address = "fe:89:d1:67:8b:5f random";
const ftms_service = "1826";
const bike_char = "2AD2";

const chainrings = [39,53];
const cogs = [11,12,13,14,15,17,19,22,25,28];
const wheelCircumference = 2.096;

let gPos = 0;
function writeLine(text) {
	// Write text to screen
	g.drawString(text, 0, gPos);
	g.flip();

	// Move cursor
	gPos += 10;
}

function updateScreen(cog1, cog2) {
	g.clear();
	g.drawRect(63, 0, 64, 63);

	g.setFontVector(50);
	g.drawString(cog1, 2, 10);
	g.drawString(cog2, 70, 10);

	g.flip();
}

function getClosestCog(speed, cadence, chainring) {
	// calculate expected cog
	const expectedCog = (chainring / speed) * wheelCircumference * (60 / 1000);

	// find closest actual cog
	let diff = 100;
	let actualCog = 0;
	for (let cog in cogs) {
		if (Math.abs(cog - expectedCog) < diff) {
			diff = Math.abs(cog - expectedCog);
			actualCog = cog;
		}
	}

	return actualCog;
}

function onNotify(event) {
	const data = event.target.value.buffer;
	const speed = data[1] / 100;
	const cadence = data[3] / 2;

	const cog1 = getClosestCog(speed, cadence, chainrings[0]);
	const cog2 = getClosestCog(speed, cadence, chainrings[1]);

	updateScreen(cog1, cog2);
}

g.clear();
writeLine("Connecting to fitness machine...");
NRF.connect(ble_address).then(function(gatt) {
	writeLine("Connected.");
	writeLine("Getting FTMS service...");
	return gatt.getPrimaryService(ftms_service);
}).then(function(service) {
	writeLine("Got service.");
	writeLine("Getting indoor bike characteristic...");
	return service.getCharacteristic(bike_char);
}).then(function(characteristic) {
	writeLine("Got characteristic.");
	characteristic.on("characteristicvaluechanged", onNotify);
	return characteristic.startNotifications();
}).then(function() {
	writeLine("Started.");
});
