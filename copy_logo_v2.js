const fs = require('fs');
const path = require('path');

const srcPng = path.resolve('dist/roonganan_newlogo.png');
const destPng = path.resolve('src/assets/roonganan_newlogo.png');
const srcSvg = path.resolve('dist/roonganan_newlogo.svg');
const destSvg = path.resolve('src/assets/roonganan_newlogo.svg');

try {
    if (fs.existsSync(srcPng)) {
        if (fs.existsSync(destPng)) {
            fs.unlinkSync(destPng);
        }
        // Try copy first, then move if copy fails is not really atomic, just try copyfile
        fs.copyFileSync(srcPng, destPng);
        console.log('Copied PNG');
    } else {
        console.log('Source PNG missing');
    }
} catch (e) {
    console.error('PNG error:', e);
}

try {
    if (fs.existsSync(srcSvg)) {
        if (fs.existsSync(destSvg)) {
            fs.unlinkSync(destSvg);
        }
        fs.copyFileSync(srcSvg, destSvg);
        console.log('Copied SVG');
    } else {
        console.log('Source SVG missing');
    }
} catch (e) {
    console.error('SVG error:', e);
}
