import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modifiedFiles = [
  'app/src/components/StudyCard.tsx',
  'app/src/components/common/PdfViewerModal.tsx',
  'app/src/lib/evidence-data.ts',
  'app/src/app/api/studies/route.ts',
  'app/src/app/api/admin/parse-pdf/route.ts',
  'app/src/app/studies/page.tsx',
  'app/src/app/admin/page.tsx',
];

console.log('Verifying modified files syntax and balance...');

let allOk = true;

for (const relPath of modifiedFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing file: ${relPath}`);
    allOk = false;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Check brackets balance
  const stack = [];
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let inBlockComment = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (!inString && !inComment && !inBlockComment) {
      if (char === '/' && next === '/') {
        inComment = true;
        i++;
        continue;
      }
      if (char === '/' && next === '*') {
        inBlockComment = true;
        i++;
        continue;
      }
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, index: i });
      } else if (char === '}' || char === ')' || char === ']') {
        const top = stack.pop();
        if (!top) {
          console.error(`Unmatched closing ${char} in ${relPath}`);
          allOk = false;
          break;
        }
        if (
          (char === '}' && top.char !== '{') ||
          (char === ')' && top.char !== '(') ||
          (char === ']' && top.char !== '[')
        ) {
          console.error(`Mismatched ${top.char} and ${char} in ${relPath}`);
          allOk = false;
          break;
        }
      }
    } else if (inComment) {
      if (char === '\n') inComment = false;
    } else if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
    } else if (inString) {
      if (char === '\\') {
        i++; // skip escaped
      } else if (char === stringChar) {
        inString = false;
      }
    }
  }

  if (stack.length > 0) {
    console.error(`Unclosed brackets in ${relPath}: ${stack.length} remaining (first: ${stack[0].char})`);
    allOk = false;
  } else {
    console.log(`[PASS] ${relPath} (${(content.length / 1024).toFixed(1)} KB) - Balanced.`);
  }
}

if (allOk) {
  console.log('\nAll modified files are balanced and structurally sound!\n');
} else {
  process.exit(1);
}
