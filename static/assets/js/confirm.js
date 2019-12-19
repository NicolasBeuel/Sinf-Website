var intervalID = window.setInterval(updateScreen, 200);
var c = document.getElementById("console");

var txt = [
  "$ cd SinfStudent",
  "$ sudo Download data",
  "$ import website",
  "> Data founded",
  "RESOLVE BUGS",
  "Priority 1 // local / scanning...",
  "scanning bugs...",
  "BUG FOUND (ln(0) = 0)",
  "BUG FOUND (.log not found)",
  "BUG FOUND (APP0)",
  "$ sudo debbug",
  "ERROR",
  "DEBUGGER.EXE -r -z",
  "...locating bugs...",
  "...BUGS found...",
  "MCP/> DEPLOY CLU",
  "SCAN: __ 0100.0000.0554.0080",
  "SCAN: __ 0020.0000.0553.0080",
  "$ bash goto StackOverflow",
  "ERROR",
  "$ bash goto MoodleOverflow",
  "RESOLVE",
]

var docfrag = document.createDocumentFragment();

function updateScreen() {
  //Shuffle the "txt" array
  txt.push(txt.shift());
  //Rebuild document fragment
  txt.forEach(function(e) {
    var p = document.createElement("p");
    p.textContent = e;
    docfrag.appendChild(p);
  });
  //Clear DOM body
  while (c.firstChild) {
    c.removeChild(c.firstChild);
  }
  c.appendChild(docfrag);
}
