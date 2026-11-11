const fs = require("fs");
const path = require("path");

function findTsx(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes("node_modules") && !full.includes(".next") && !full.includes("generated")) {
        results.push(...findTsx(full));
      }
    } else if (full.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

const files = findTsx("./src");
let count = 0;
for (const f of files) {
  const content = fs.readFileSync(f, "utf-8");
  const lines = content.split("\n");
  lines.forEach((l, idx) => {
    if (l.trim().startsWith("//") || l.trim().startsWith("/*") || l.trim().startsWith("*")) return;
    if (emojiRegex.test(l)) {
      console.log(`${f}:${idx + 1}: ${l.trim().slice(0, 100)}`);
      count++;
    }
  });
}
console.log(`\nTotal emoji occurrences found in JSX: ${count}`);

