const fs = require("node:fs");
const path = require("path");
const os = require("os");

console.log("Nodejs: ", process.versions.node);
console.log("V8: ", process.versions.v8);
console.log("libUV: ", process.versions.uv);
console.log("-+++++++++++++++++++++++++-");

console.log("Platform: ", process.platform);
console.log("CPUs: ", os.cpus().length);

console.log(typeof global); // node specific global function
console.log(typeof globalThis); // universal global function (node, browser, web workers)

console.log(global === globalThis); // true

