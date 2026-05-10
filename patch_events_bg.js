const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div style={{position:"absolute",inset:0,overflowY:"auto",padding:"20px 16px",paddingBottom:80,zIndex:2}}>`;
const NEW=`<div style={{position:"absolute",inset:0,overflowY:"auto",padding:"20px 16px",paddingBottom:80,zIndex:2,background:BG}}>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
