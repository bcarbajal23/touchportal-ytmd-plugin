const fs = require("fs");
const path = require("path");

// Read package.json and extract version to be bumped
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJSON = require(packageJsonPath);
const packageVersion = packageJSON.version.split('.').map(Number);

// generate version for entry.tp using package.json version to match into whole numbers
// i.e. 1.0.1 (package.json verion) -> 101 (entry.tp version)
const tpEntryVersion =
  (packageVersion[ 0 ] * 10000) + (packageVersion[ 1 ] * 100) + packageVersion[ 2 ];

console.log(
  `Sycning package,json version ${packageVersion} with entry.tp version ${tpEntryVersion}`
);

// sync version to entry.tp
const entryPath = path.resolve(__dirname, '../config/entry.tp');
const entryFile = fs.readFileSync(entryPath, 'utf-8');
const entryFileJSON = JSON.parse(entryFile);

entryFileJSON.version = tpEntryVersion;
fs.writeFileSync(entryPath, JSON.stringify(entryFileJSON, null, 2));