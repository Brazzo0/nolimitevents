const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div style={{width:3,height:18,background:BG3,borderRadius:4,border:\`1px solid \${BORDER}\`}}/>`;
const NEW=`<div style={{width:3,height:18,background:BG3,borderRadius:4,border:"1px solid "+BORDER}}/>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
