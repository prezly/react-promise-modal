const reactModal = require("../dist/index.js");

if (typeof reactModal !== "function") {
  throw Error("Broken default export");
}