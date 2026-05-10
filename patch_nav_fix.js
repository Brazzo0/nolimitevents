const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`          else if(s==="events"&&onEvents){onEvents();}
          else{onNav(s==="events"?"agenda":s);}`;
const NEW=`          else if(s==="events"&&onEvents){onEvents();}
          else{onNav(s);}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
