const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const PLUGIN_ID = 'ytmd_plugin_v2';
const ENTRY_POINT = "./dist/index.js";
const OUTPUT_FILE = `./${PLUGIN_ID}.tpp`;
const BUILD_DIR = './temp_build';
const SCRIPT_NAME = 'ytmd-tpplugin';

(async () => {
  console.log(`Start Building: ${PLUGIN_ID}`);
  
  // Run npm build command
  console.log("Running 'npm run build'...");
  try {
    execSync('npm run build', { stdio: 'inherit'});
  } catch (error) {
    console.error("Build failed! Check above for errors.");
    process.exit(1);
  }
  
  // Preparing temp directory 
  console.log('Priming temp directory...');
  if (fs.existsSync(BUILD_DIR)) fs.removeSync(BUILD_DIR);
  if (fs.existsSync(OUTPUT_FILE)) fs.removeSync(OUTPUT_FILE);
  fs.ensureDirSync(path.join(BUILD_DIR, 'bin'));
  
  console.log('Packing binaries (NodeJS 20)...');
  try {
    execSync(`pkg . --targets node20-linux-x64,node20-win-x64,node20-macos-x64 --output ${BUILD_DIR}/${SCRIPT_NAME}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Packaging failed! Check for errors and try again.', error);
    process.exit(1);
  }
  
  
  // Copying required Touch Portal assets (entry.tp, icon.png).
  console.log('Copying Touch Portal assets...');
  const filesToCopy = ['./config/entry.tp', './assets/icon.png', 'start.sh'];
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      const fileName = path.basename(file);
      fs.copySync(file, path.join(BUILD_DIR, fileName));
    } else {
      console.warn(`Warning: '${file}' not found!`);
    }
  });
  
  //Creating Archive...
  console.log(`Zipping into archive ${OUTPUT_FILE}...`);
  const outputFile = fs.createWriteStream(OUTPUT_FILE);
  const archive = archiver('zip', { zlib: { level: 9 }})
  outputFile.on('close', () => {
    console.log('\n Build Complete!');
    console.log(`File ready: ${path.resolve(OUTPUT_FILE)}`);
    console.log(`File Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    
    fs.removeSync(BUILD_DIR);
  });
  
  archive.on('error', (err) => { throw err; });
  archive.pipe(outputFile);
  
  archive.directory(BUILD_DIR, PLUGIN_ID);
  
  await archive.finalize();
})();
