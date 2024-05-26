const scriptElement = window.document.querySelector("#w-json-ldwistia_54");
let script = scriptElement.innerHTML.substring(
  scriptElement.innerHTML.indexOf()
);
const startIndex = script.indexOf('"transcript":"');
script = script.substring(startIndex).replace('"transcript":"', "");
const endIndex = script.indexOf('","potentialAction":');
script = script.substring(0, endIndex);
script = script.replaceAll("\\n\\n", "\r\n\r\n");
console.log(script);
