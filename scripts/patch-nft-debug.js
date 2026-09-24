const fs = require('fs');
let code = fs.readFileSync('node_modules/next/dist/compiled/@vercel/nft/index.js', 'utf8');
code = code.replace(/const emitAssetDirectory=[^;]+;[^;]+;/, 'const emitAssetDirectory=assetPath=>{ console.error("*** emitAssetDirectory CALLED WITH asset:", assetPath, "\\n*** FROM FILE:", e);');
fs.writeFileSync('node_modules/next/dist/compiled/@vercel/nft/index.js', code);
console.log('fixed successfully');
