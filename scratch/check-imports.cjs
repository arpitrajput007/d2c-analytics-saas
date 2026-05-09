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
          const exts = ['', '.js', '.jsx', '.ts', '.tsx', '.css', '.svg', '.png', '.jpg'];
          let found = false;
          for (let ext of exts) {
            if (fs.existsSync(absPath + ext)) {
              found = true;
              break;
            }
          }
          if (!found) {
            console.log(`BROKEN IMPORT in ${path.relative(process.cwd(), file)}: ${relPath}`);
          }
        }
      }
    });
  }
});
