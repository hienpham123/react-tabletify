import fs from 'fs';
import path from 'path';

// Path tới package.json
const packagePath = path.resolve(process.cwd(), 'package.json');

// Đọc file
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

// Tách version
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Tăng patch
const newVersion = `${major}.${minor}.${patch + 1}`;

// Cập nhật
packageJson.version = newVersion;

// Ghi lại file
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf-8');

console.log(`Version updated to ${newVersion}`);
