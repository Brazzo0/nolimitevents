const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Changer la navbar pour aller vers screen "tickets"
const OLD1=`else{setTab(s);setScreen("main");}`;
const NEW1=`else if(s==="tickets"){setScreen("tickets");}else{setTab(s);setScreen("main");}`;

if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);console.log('nav ok');}else console.log('ERREUR OLD1');
fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
