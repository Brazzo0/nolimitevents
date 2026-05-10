const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter "À propos" dans le menu
const OLD1=`["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}]`;
const NEW1=`["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}],
                  ["info","À propos",()=>{setMenuOpen(false);setScreen("about");}]`;

// 2. Ajouter state pour médias about
const OLD2=`const [menuOpen,setMenuOpen]=useState(false);`;
const NEW2=`const [menuOpen,setMenuOpen]=useState(false);
  const [aboutMedia,setAboutMedia]=useState([]);`;

if(c.includes(OLD1)&&c.includes(OLD2)){
  c=c.replace(OLD1,NEW1);
  c=c.replace(OLD2,NEW2);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  if(!c.includes(OLD1)) console.log('ERREUR OLD1');
  if(!c.includes(OLD2)) console.log('ERREUR OLD2');
}
