const fs = require('fs');
const path = require('path');

const srcPng = path.resolve('dist/roonganan_newlogo.png');
const destPng = path.resolve('src/assets/roonganan_newlogo.png');
const srcSvg = path.resolve('dist/roonganan_newlogo.svg');
const destSvg = path.resolve('src/assets/roonganan_newlogo.svg');

try {
    fs.copyFileSync(srcPng, destPng);
    console.log(`Copied ${srcPng} to ${destPng}`);
} catch (err) {
    console.error(`Error copying PNG: ${err.message}`);
}

try {
    fs.copyFileSync(srcSvg, destSvg);
    console.log(`Copied ${srcSvg} to ${destSvg}`);
} catch (err) {
    console.error(`Error copying SVG: ${err.message}`);
}
