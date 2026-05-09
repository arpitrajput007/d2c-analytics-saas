const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getAllFiles(name, fileList);
    } else {
      fileList.push(name);
    }
  });
  return fileList;
}

const srcDir = path.resolve('src');
const allFiles = getAllFiles(srcDir);
const fileSet = new Set(allFiles);

let issues = 0;

allFiles.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(file, 'utf8');
    const imports = content.match(/import\s+.*?\s+from\s+['"](.*?)['"]/g) || [];
    
    imports.forEach(imp => {
      const match = imp.match(/from\s+['"](.*?)['"]/);
      if (match) {
        let relPath = match[1];
        if (relPath.startsWith('.')) {
          let absPath = path.resolve(path.dirname(file), relPath);
          
          // Check if it exists with possible extensions
          const exts = ['', '.js', '.jsx', '.ts', '.tsx', '.css'];
          let found = false;
          let foundPath = '';
          
          for (let ext of exts) {
            let testPath = absPath + ext;
            if (fs.existsSync(testPath)) {
              // Now check exact case
              const actualDir = path.dirname(testPath);
              const actualName = path.basename(testPath);
              const filesInDir = fs.readdirSync(actualDir);
              if (filesInDir.includes(actualName)) {
                found = true;
                foundPath = testPath;
                break;
              } else {
                const caseMatch = filesInDir.find(f => f.toLowerCase() === actualName.toLowerCase());
                if (caseMatch) {
                  console.log(`CASE MISMATCH in ${path.relative(process.cwd(), file)}:`);
                  console.log(`  Imported: ${relPath}`);
                  console.log(`  Actual file: ${path.join(path.dirname(relPath), caseMatch)}`);
                  issues++;
                }
              }
            }
          }
        }
      }
    });
  }
});

if (issues === 0) console.log('No case mismatches found.');
else console.log(`Found ${issues} case mismatch(es).`);
