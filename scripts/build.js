const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const PLUGIN_ID = 'ytmd_plugin_v2';
const OUTPUT_FILE = `./${PLUGIN_ID}.tpp`;
const BUILD_DIR = './temp_build';
const SCRIPT_NAME = 'ytmd-tpplugin';

(async () => {
  console.log(`Start Building: ${PLUGIN_ID}`);
  
  // Run npm build command
  try {
    execSync('npm run build', { stdio: 'inherit'});
  } catch (error) {
    console.error("Build failed! Might need to run 'npm install' first.");
    process.exit(1);
  }
  
  /**
   * Preparing temp directory for packaging up the binary.
   * If the directory or files already exist, delete them,
   **/ 
  if (fs.existsSync(BUILD_DIR)) fs.removeSync(BUILD_DIR);
  if (fs.existsSync(OUTPUT_FILE)) fs.removeSync(OUTPUT_FILE);
  fs.ensureDirSync(path.join(BUILD_DIR, 'bin'));
  
  /**
   * Build the binary linux, windows and macos.
   * Will need to revisit this for Macs that are M3 and new because of Apples ad-hoc signing
   * for apps. (I don't own an Apple Computer for signing).
   * @see {@link https://www.npmjs.com/package/@yao-pkg/pkg#targets}
   */
  try {
    execSync(`pkg . --targets node20-linux-x64,node20-win-x64,node20-macos-x64 --output ${BUILD_DIR}/${SCRIPT_NAME}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Packaging failed! Check for errors and try again.', error);
    process.exit(1);
  }
  
  
  /** 
   * Copying required Touch Portal assets (entry.tp, icon.png, and start.sh).
   * @see {@link https://www.touch-portal.com/api/index.php?section=intro_plugin_file}
   */ 
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
  const outputFile = fs.createWriteStream(OUTPUT_FILE);
  const archive = archiver('zip', { zlib: { level: 9 }})
  outputFile.on('close', () => {
    console.log('Build Complete!');
    console.log(`File ready: ${path.resolve(OUTPUT_FILE)}`);
    console.log(`File Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    
    fs.removeSync(BUILD_DIR);
  });
  
  archive.on('warning', (error) => {
    if (error.code === 'ENOENT') {
      console.warn('Warning: File and/or directory not found!', error);
      process.exit(1);
    } else {
      throw error;
    }
  });
  archive.on('error', (error) => {
    console.error('Something bad happened while creating the archive:', error);
    throw error;
  });
  
  archive.pipe(outputFile);
  
  archive.directory(BUILD_DIR, PLUGIN_ID);
  
  await archive.finalize();
})();
