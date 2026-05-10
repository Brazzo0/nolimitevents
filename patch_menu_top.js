const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`<div onClick={()=>{setMenuOpen(false);setScreen("signup");}} style={{background:GRAD,borderRadius:16,padding:"16px 18px",marginBottom:20,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>`;
const NEW=`<div onClick={()=>{setMenuOpen(false);setScreen("profil");}} style={{background:GRAD,borderRadius:16,padding:"16px 18px",marginBottom:20,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
