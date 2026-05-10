const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                            <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                          </div>
                        </div>`;

const NEW=`                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <img src={LOGO} alt="" onClick={tapLogo} style={{width:44,height:44,objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(255,0,128,.6))",animation:"pulse 2s ease-in-out infinite",cursor:"pointer"}}/>
                          <div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                            <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                          </div>
                        </div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
