const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div><div style={{fontSize:15,fontWeight:900,color:WHITE}}>S'inscrire</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Rejoins la communauté</div></div>`;
const NEW=`<div><div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser?"Mon Profil 👤":"Se connecter"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>{authUser?(authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom+" ":"")+authUser.email:"Rejoins la communaute"}</div></div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
