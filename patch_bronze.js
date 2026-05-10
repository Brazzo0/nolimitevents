const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div style={{width:36,height:36,borderRadius:10,background:"rgba(255,165,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🥉</div>`;
const NEW=`<div style={{width:36,height:36,borderRadius:10,background:"rgba(255,165,0,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB347" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
</div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
