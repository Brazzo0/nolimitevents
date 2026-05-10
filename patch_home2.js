const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`                    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(255,51,153,.05))",borderRadius:"0 0 24px 24px",padding:"14px 20px 20px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                        <div>
                          <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:2}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"} 👋</div>
                          <div style={{fontSize:20,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                        </div>
                        <div onClick={()=>setNotifOpen(true)} style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                          <Icon n="bell" s={18} c={WHITE}/>
                          <div style={{position:"absolute",top:8,right:8,width:8,height:8,borderRadius:"50%",background:PINK}}/>
                        </div>
                      </div>
                      <div style={{position:"relative",marginBottom:14}}>
                        <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={16} c={GRAY}/></div>
                        <input type="text" placeholder="Rechercher une soiree..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"12px 14px 12px 42px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:GRAY,cursor:"pointer",fontSize:18}}>x</div>}
                      </div>
                      <div style={{display:"flex",gap:10,justifyContent:"space-between"}}>
                        {[["🏆","Fidelite",()=>setScreen("profil")],["🎟️","Mes Billets",()=>setTab("tickets")],["⭐","VIP",()=>setScreen("vip")],["👤","Profil",()=>setScreen("profil")]].map(([emoji,label,action])=>(
                          <div key={label} onClick={action} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
                            <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{emoji}</div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.6)",textAlign:"center",letterSpacing:.5}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>`;

const NEW=`                    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(255,51,153,.05))",borderRadius:"0 0 24px 24px",padding:"10px 16px 16px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:1}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                          <div style={{fontSize:17,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                        </div>
                        <div onClick={()=>setNotifOpen(true)} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                          <Icon n="bell" s={16} c={WHITE}/>
                          <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:PINK}}/>
                        </div>
                      </div>
                      <div style={{position:"relative",marginBottom:12}}>
                        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={14} c={GRAY}/></div>
                        <input type="text" placeholder="Rechercher une soiree..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:WHITE,fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:GRAY,cursor:"pointer",fontSize:16}}>x</div>}
                      </div>
                      <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
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
                      </div>
                    </div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('step1 ok');
}else{
  console.log('ERREUR OLD1');
}

// Enlever filtres Tous/Festival et titre Toutes les soirees
const OLD2=`                    <div style={{margin:"0 16px",display:"flex",gap:10,marginBottom:16,justifyContent:"center"}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"9px 28px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":"1px solid "+BORDER,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</div>)}
                    </div>
                    <div style={{margin:"0 16px 10px"}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Toutes les soirees</div></div>`;
const NEW2=``;

if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);console.log('step2 ok');}else console.log('ERREUR OLD2');

// Enlever emoji dans A la une et A venir
const OLD3=`<div style={{fontSize:16,fontWeight:900,color:WHITE}}>A la une ⭐</div>`;
const NEW3=`<div style={{fontSize:16,fontWeight:900,color:WHITE}}>A la une</div>`;
if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);console.log('step3 ok');}else console.log('ERREUR OLD3');

const OLD4=`<div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:10}}>A venir 📅</div>`;
const NEW4=`<div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:10}}>A venir</div>`;
if(c.includes(OLD4)){c=c.replace(OLD4,NEW4);console.log('step4 ok');}else console.log('ERREUR OLD4');

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
