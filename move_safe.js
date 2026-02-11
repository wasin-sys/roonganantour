const fs = require('fs');
const path = require('path');

const targetDir = 'src/assets';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Starting move...');

// PNG
try {
    const src = 'dist/roonganan_newlogo.png';
    const dest = 'src/assets/roonganan_newlogo.png';
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log('Copied PNG successfully');
    } else {
        console.log('Source PNG not found at ' + src);
    }
} catch (e) {
    console.error('Error copying PNG:', e);
}

// SVG
try {
    const src = 'dist/roonganan_newlogo.svg';
    const dest = 'src/assets/roonganan_newlogo.svg';
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log('Copied SVG successfully');
    } else {
        console.log('Source SVG not found at ' + src);
    }
} catch (e) {
    console.error('Error copying SVG:', e);
}
