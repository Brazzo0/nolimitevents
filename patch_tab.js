const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`[["bar","Stats","dashboard"],["calendar","Soirées","events"],["gift","Gratuits","free"],["eye","Scanner","scanner"],["upload","Ajouter","add"]]`;
const NEW=`[["bar","Stats","dashboard"],["calendar","Soirées","events"],["ticket","Billets","tickets"],["gift","Gratuits","free"],["eye","Scanner","scanner"],["upload","Ajouter","add"]]`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
