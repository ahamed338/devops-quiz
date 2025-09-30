const fs = require("fs");
const path = require("path");

const buildTime = new Date().toISOString();
const envFile = path.join(__dirname, ".env");

fs.writeFileSync(envFile, `REACT_APP_BUILD_TIME=${buildTime}\n`);
console.log("Updated build time:", buildTime);
