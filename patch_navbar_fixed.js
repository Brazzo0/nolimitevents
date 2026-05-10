const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`    <div style={{display:"flex",background:BG2,borderTop:"1px solid "+BORDER,paddingTop:8,paddingBottom:SAFE_BOT,flexShrink:0,position:"sticky",bottom:0,zIndex:50}}>`;
const NEW=`    <div style={{display:"flex",background:BG2,borderTop:"1px solid "+BORDER,paddingTop:8,paddingBottom:SAFE_BOT,flexShrink:0,position:"fixed",bottom:0,left:0,right:0,zIndex:200}}>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
