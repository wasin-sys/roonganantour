const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/App.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Remove lines 4665 to 4736 (1-indexed)
// Index: 4664
// Count: 4736 - 4665 + 1 = 72
lines.splice(4664, 72);

console.log(`Removed ${72} lines starting at index 4664`);

fs.writeFileSync(filePath, lines.join('\n'));
