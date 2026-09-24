const fs = require('fs');
let code = fs.readFileSync('node_modules/next/dist/compiled/glob/glob.js', 'utf8');
const target = 'if(this.noprocess)return this;';
const replacement = 'if(String(this.pattern).includes("PC05")||String(this.pattern).includes("Users")){ console.error("!!! GLOB CALLED WITH:", this.pattern, (new Error()).stack); } if(this.noprocess)return this;';
code = code.replace(target, replacement);
fs.writeFileSync('node_modules/next/dist/compiled/glob/glob.js', code);
console.log('patched Glob constructor');
