const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Lier les billets au vrai compte
const OLD1=`const myTickets=tickets.filter(t=>t.email==="jean@example.ch");`;
const NEW1=`const myTickets=authUser?tickets.filter(t=>t.email===authUser.email):[];`;

if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);console.log('auth ok');}else console.log('ERREUR OLD1');
fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
