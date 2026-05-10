const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Agrandir le logo
const OLD1=`<img src={LOGO} alt="" onClick={tapLogo} style={{width:44,height:44,objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(255,0,128,.6))",animation:"pulse 2s ease-in-out infinite",cursor:"pointer"}}/>`;
const NEW1=`<img src={LOGO} alt="" onClick={tapLogo} style={{width:65,height:65,objectFit:"contain",filter:"drop-shadow(0 0 14px rgba(255,0,128,.7))",animation:"pulse 2s ease-in-out infinite",cursor:"pointer"}}/>`;

// Enlever le bouton engrenage
const OLD2=`                          <div onClick={()=>setScreen(adminAuth?"admin":"adminLogin")} style={{width:34,height:34,borderRadius:10,background:"rgba(255,0,128,.15)",border:"1px solid rgba(255,0,128,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                            <Icon n="settings" s={16} c={PINK}/>
                          </div>`;
const NEW2=``;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('logo ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('engrenage ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
