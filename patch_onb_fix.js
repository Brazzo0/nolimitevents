const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Bouton PASSER en bas au lieu d'en haut
const OLD1=`<div onClick={()=>{localStorage.setItem("nle_onb","1");setScreen("login");}} style={{position:"absolute",top:20,right:20,zIndex:10,padding:"8px 16px",borderRadius:20,background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>PASSER</div>`;
const NEW1=`<div onClick={()=>{setScreen("login");}} style={{position:"absolute",bottom:120,right:24,zIndex:10,padding:"8px 16px",borderRadius:20,background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>PASSER</div>`;

// 2. Logo vrai sans filtre noir
const OLD2=`<img src={LOGO} alt="" style={{width:60,height:60,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>`;
const NEW2=`<img src={LOGO} alt="" style={{width:70,height:70,objectFit:"contain"}}/>`;

// 3. Enlever "de La Chaux-de-Fonds"
const OLD3=`Chaque soiree est une nouvelle surprise. Decouvre les meilleurs evenements de La Chaux-de-Fonds.`;
const NEW3=`Chaque soiree est une nouvelle surprise. Decouvre les meilleurs evenements pres de chez toi.`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('passer ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('logo ok');}else console.log('ERREUR OLD2');
if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);changed++;console.log('texte ok');}else console.log('ERREUR OLD3');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
