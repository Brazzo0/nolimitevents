const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD1=`const SAFE_TOP="env(safe-area-inset-top, 44px)";`;
const NEW1=`const SAFE_TOP="env(safe-area-inset-top, 20px)";`;

const OLD2=`const SAFE_BOT="env(safe-area-inset-bottom, 20px)";`;
const NEW2=`const SAFE_BOT="env(safe-area-inset-bottom, 8px)";`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('safe top ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('safe bot ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
