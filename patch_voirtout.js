const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div style={{fontSize:12,color:PINK,fontWeight:700,cursor:"pointer"}}>Voir tout</div>`;
const NEW=`<div onClick={()=>setTab("events")} style={{fontSize:12,color:PINK,fontWeight:700,cursor:"pointer"}}>Voir tout</div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
