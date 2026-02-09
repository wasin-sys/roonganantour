const fs = require('fs');
const content = fs.readFileSync('c:/Users/m41c1/.gemini/antigravity/scratch/tour-system-prototype/src/App.tsx', 'utf8');

function checkBalanced(str) {
    let stack = [];
    let lines = str.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        for (let j = 0; j < line.length; j++) {
            let char = line[j];
            if (char === '{' || char === '(' || char === '[') {
                stack.push({ char, line: i + 1 });
            } else if (char === '}' || char === ')' || char === ']') {
                if (stack.length === 0) {
                    console.log(`Unmatched closing ${char} at line ${i + 1}`);
                } else {
                    let last = stack.pop();
                    if ((char === '}' && last.char !== '{') ||
                        (char === ')' && last.char !== '(') ||
                        (char === ']' && last.char !== '[')) {
                        console.log(`Mismatch: ${last.char} at line ${last.line} with ${char} at line ${i + 1}`);
                    }
                }
            }
        }
    }
    if (stack.length > 0) {
        stack.forEach(s => console.log(`Unclosed ${s.char} from line ${s.line}`));
    } else {
        console.log('Brackets are Balanced!');
    }
}

// Simple tag checker
function checkTags(str) {
    let stack = [];
    let tagRegex = /<\/?[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+(?:=(?:'[^']*'|"[^"]*"|[^\s>]+))?)*\s*\/?>/g;
    let match;
    while ((match = tagRegex.exec(str)) !== null) {
        let tag = match[0];
        if (tag.endsWith('/>') || tag.startsWith('<!--')) continue;
        if (tag.startsWith('</')) {
            let tagName = tag.substring(2, tag.length - 1).split(' ')[0];
            if (stack.length === 0) {
                console.log(`Unmatched closing tag ${tag}`);
            } else {
                let last = stack.pop();
                if (last.name !== tagName) {
                    console.log(`Tag mismatch: <${last.name}> from line ${last.line} with </${tagName}> at pos ${match.index}`);
                }
            }
        } else {
            let tagName = tag.substring(1, tag.length - 1).split(' ')[0];
            // Skip void tags
            if (['img', 'input', 'br', 'hr', 'link', 'meta'].includes(tagName.toLowerCase())) continue;
            stack.push({ name: tagName, line: 0 }); // Pos not easily line-mapped here but better than nothing
        }
    }
}

console.log('Checking file...');
checkBalanced(content);
console.log('Done.');
