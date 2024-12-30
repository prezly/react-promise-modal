const { usePromiseModal } = require("../dist/index.js");

if (typeof usePromiseModal !== "function") {
    throw Error("Broken default export");
}
