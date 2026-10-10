const fs = require('fs');
const content = fs.readFileSync('src/lib/content/seed.ts', 'utf8');
const regex = /src:\s*["']([^"']+)["']/g;
let match;
const missing = [];
let total = 0;
while ((match = regex.exec(content)) !== null) {
  total++;
  const src = match[1];
  if (src.startsWith('/') && !fs.existsSync('public' + src)) {
    missing.push(src);
  }
}
console.log('Total images checked:', total);
if (missing.length === 0) {
  console.log('ALL images exist on disk!');
} else {
  console.log('Missing images:', missing);
}
