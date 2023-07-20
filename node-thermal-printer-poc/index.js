const {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} = require("node-thermal-printer");

async function example() {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // 'star' or 'epson'
    interface: "printer:EPSON_TM-T20",
    options: {
      timeout: 1000,
    },
    width: 48, // Number of characters in one line - default: 48
    driver: require("@thiagoelg/node-printer"),
  });

  const isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);

  printer.alignCenter();
  await printer.printImage("./assets/logo.png");

  printer.alignCenter();
  printer.newLine();
  printer.setTextDoubleHeight();
  const message = "Mein Geheimnis ist, dass ich Problembär genannt werde.";
  const lines = message.match(/(.{1,48}(\s|$))\s*/g);
  lines.forEach((line) => printer.println(line.trim()));

  printer.cut();

  console.log(printer.getText());

  try {
    await printer.execute();
    console.log("Print success.");
  } catch (error) {
    console.error("Print error:", error);
  }
}

example().catch((err) => {
  console.error(err);
});

function splitter(str, l) {
  var strs = [];
  while (str.length > l) {
    var pos = str.substring(0, l).lastIndexOf(" ");
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    var i = str.indexOf(" ", pos) + 1;
    if (i < pos || i > pos + l) i = pos;
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}
