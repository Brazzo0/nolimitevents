const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`if(screen==="tickets")return React.createElement(TicketsScreen,{tickets,events,user:currentUser});`;
const NEW=`if(screen==="tickets")return React.createElement(TicketsScreen,{tickets,events,user:authUser});`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  console.log('user fix ok');
}else{
  console.log('ERREUR: ligne non trouvée');
}

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
