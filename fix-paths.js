const fs = require('fs');
const path = require('path');

const dir = '/Users/arpitrajput/D2C-Analytics-SaaS/src/components/landing';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const oldPath = path.join(dir, file);
    const code = fs.readFileSync(oldPath, 'utf8');
    
    // Replace @/components/X with ./X
    let newCode = code.replace(/@\/components\//g, './');
    
    // Replace @/lib/utils with ../../lib/utils
    newCode = newCode.replace(/@\/lib\/utils/g, '../../lib/utils');

    // Make React import explicitly work if needed, though vite plugin injects it.
    
    // Rename to jsx (optional) - let's keep TSX since Vite processes it normally, but rename for consistency:
    const newPath = path.join(dir, file.replace('.tsx', '.jsx'));
    
    // VERY BASIC TS STRIP FOR SHADCN: just remove standard TS things if they break .jsx
    // Actually, Vite expects ESBuild to strip types from TSX files natively, but for JSX it might fail on `<T>` etc.
    // We will just save as .jsx, if there are heavy interface exports, they will fail, but these components are simple.
    
    // Let's strip `interface Props { ... }` simple regexes just in case
    newCode = newCode.replace(/export interface [^}]+}/g, '');
    newCode = newCode.replace(/: React\.FC<[^>]+>/g, '');
    
    fs.writeFileSync(newPath, newCode);
    fs.unlinkSync(oldPath);
  }
});
console.log('Done mapping components');
