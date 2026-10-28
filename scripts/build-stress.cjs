'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const script=['index.js','docs/stress.js','docs/stress-app.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n').replace(/\r\n?/g,'\n');
if(/<\/script/i.test(script))throw Error('Unsafe embedded script terminator');
const hash=crypto.createHash('sha256').update(script).digest('base64');
fs.writeFileSync(path.join(root,'docs/stress-lab.html'),fs.readFileSync(path.join(root,'scripts/stress-template.html'),'utf8').replace(/\r\n?/g,'\n').replace('{{HASH}}',hash).replace('{{SCRIPT}}',()=>script));
