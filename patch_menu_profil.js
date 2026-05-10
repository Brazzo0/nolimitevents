const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}],
                  ["info","À propos",()=>{setMenuOpen(false);setScreen("about");}]`;
const NEW=`["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}],
                  ["info","À propos",()=>{setMenuOpen(false);setScreen("about");}],
                  ["users","Mon Profil",()=>{setMenuOpen(false);setScreen("profil");}]`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
