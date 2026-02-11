const fs = require('fs');
const path = require('path');

console.log('Starting copy...');

try {
    const src = path.resolve('dist/roonganan_newlogo.png');
    const dest = path.resolve('src/assets/roonganan_newlogo.png');
    console.log(`Reading from ${src}`);
    const data = fs.readFileSync(src);
    console.log(`Read ${data.length} bytes. Writing to ${dest}`);
    fs.writeFileSync(dest, data);
    console.log('Success PNG');
} catch (e) {
    console.error('Error PNG:', e.message);
}

try {
    const src = path.resolve('dist/roonganan_newlogo.svg');
    const dest = path.resolve('src/assets/roonganan_newlogo.svg');
    console.log(`Reading from ${src}`);
    const data = fs.readFileSync(src);
    console.log(`Read ${data.length} bytes. Writing to ${dest}`);
    fs.writeFileSync(dest, data);
    console.log('Success SVG');
} catch (e) {
    console.error('Error SVG:', e.message);
}
