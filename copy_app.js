const fs = require('fs');
const path = require('path');
const src = 'src/App.tsx';
const dest = 'src/pages/StaffDashboard.tsx';

try {
    const content = fs.readFileSync(src, 'utf8');
    fs.writeFileSync(dest, content);
    console.log('Success copy');
} catch (e) {
    console.error('Fail copy: ' + e.message);
}
