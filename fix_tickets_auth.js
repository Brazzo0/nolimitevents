const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`  const myTickets=tickets.filter(t=>t.email==="jean@example.ch");`;
const NEW=`  const myTickets=authUser?tickets.filter(t=>t.email&&authUser.email&&t.email.toLowerCase()===authUser.email.toLowerCase()):[];`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
