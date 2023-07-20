const s =
  "Mein Geheimnis ist, dass die Katzen das Wort Schmock für Papi gar nicht eingeführt haben sondern ich";
const lines = s.match(/(.{1,48}(\s|$))\s*/g);
lines.forEach((line) => {
  console.log(line.trim());
});
