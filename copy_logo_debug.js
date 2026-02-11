const fs = require('fs');
const path = require('path');

const logFile = 'copy_log.txt';
function log(msg) {
    try { fs.appendFileSync(logFile, msg + '\n'); } catch (e) { }
    console.log(msg);
}

const srcPng = path.resolve('dist/roonganan_newlogo.png');
const destPng = path.resolve('src/assets/roonganan_newlogo.png');
const srcSvg = path.resolve('dist/roonganan_newlogo.svg');
const destSvg = path.resolve('src/assets/roonganan_newlogo.svg');

try {
    log(`Checking src PNG: ${srcPng}`);
    if (fs.existsSync(srcPng)) {
        log('Source PNG exists.');
        fs.copyFileSync(srcPng, destPng);
        log(`Copied PNG to ${destPng}`);
    } else {
        log('Source PNG NOT found!');
    }

    log(`Checking src SVG: ${srcSvg}`);
    if (fs.existsSync(srcSvg)) {
        log('Source SVG exists.');
        fs.copyFileSync(srcSvg, destSvg);
        log(`Copied SVG to ${destSvg}`);
    } else {
        log('Source SVG NOT found!');
    }

} catch (error) {
    log(`Error: ${error.message}`);
}
