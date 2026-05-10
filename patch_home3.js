const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`                      <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
                        {[
                          ["linear-gradient(135deg,#FFB347,#FF8C00)","trophy","Fidelite",()=>setScreen("profil")],
                          ["linear-gradient(135deg,#FF0080,#FF3399)","ticket","Billets",()=>setTab("tickets")],
                          ["linear-gradient(135deg,#9B59B6,#8E44AD)","star","VIP",()=>setScreen("vip")],
                          ["linear-gradient(135deg,#4ECDC4,#2ECC71)","users","Profil",()=>setScreen("profil")]
                        ].map(([bg,ico,label,action])=>(
                          <div key={label} onClick={action} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
                            <div style={{width:46,height:46,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,.3)"}}>
                              <Icon n={ico} s={20} c={WHITE} fill={ico==="star"?WHITE:"none"}/>
                            </div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",textAlign:"center",letterSpacing:.5}}>{label}</div>
                          </div>
                        ))}
                      </div>`;

const NEW=`                      <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
                        {[
                          ["trophy","Fidelite",()=>setScreen("profil")],
                          ["ticket","Billets",()=>setTab("tickets")],
                          ["star","VIP",()=>setScreen("vip")],
                          ["users","Profil",()=>setScreen("profil")]
                        ].map(([ico,label,action])=>(
                          <div key={label} onClick={action} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
                            <div style={{width:50,height:50,borderRadius:"50%",background:"transparent",border:"2px solid "+PINK,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Icon n={ico} s={20} c={PINK} fill={ico==="star"?PINK:"none"}/>
                            </div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",textAlign:"center",letterSpacing:.5}}>{label}</div>
                          </div>
                        ))}
                      </div>`;

// Header plus compact
const OLD2=`                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:1}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                          <div style={{fontSize:17,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                        </div>
                        <div onClick={()=>setNotifOpen(true)} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                          <Icon n="bell" s={16} c={WHITE}/>
                          <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:PINK}}/>
                        </div>
                      </div>`;

const NEW2=`                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                            <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <div onClick={()=>setScreen(adminAuth?"admin":"adminLogin")} style={{width:34,height:34,borderRadius:10,background:"rgba(255,0,128,.15)",border:"1px solid rgba(255,0,128,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                            <Icon n="settings" s={16} c={PINK}/>
                          </div>
                          <div onClick={()=>setNotifOpen(true)} style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                            <Icon n="bell" s={16} c={WHITE}/>
                            <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:PINK}}/>
                          </div>
                        </div>
                      </div>`;

let changed=0;
if(c.includes(OLD)){c=c.replace(OLD,NEW);changed++;console.log('raccourcis ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('header ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
