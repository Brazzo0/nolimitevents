const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{position:"relative",marginBottom:14}}>
                      <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={16} c={GRAY}/></div>
                      <input type="text" placeholder="Rechercher une soirée..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"12px 14px 12px 42px",background:BG2,border:"1.5px solid "+BORDER,borderRadius:14,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                      {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:GRAY,cursor:"pointer",fontSize:18}}>×</div>}
                    </div>
                    {!search&&events.filter(e=>!e.ended).length>0&&(
                      <div style={{marginBottom:16}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{fontSize:16,fontWeight:900,color:WHITE}}>A la une ⭐</div>
                        </div>
                        <div style={{borderRadius:20,overflow:"hidden",position:"relative",height:180,background:BG2,cursor:"pointer"}} onClick={()=>{const ev=events.filter(e=>!e.ended)[0];if(ev)openEv(ev);}}>
                          {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].poster?<img src={events.filter(e=>!e.ended)[0].poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,rgba(255,0,128,.3),rgba(255,51,153,.1))"}}/>}
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(13,17,23,.95) 100%)"}}/>
                          <div style={{position:"absolute",top:12,left:12,background:GRAD,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20,animation:"pulse 2s ease-in-out infinite"}}>⭐ A LA UNE</div>
                          <div style={{position:"absolute",bottom:14,left:14,right:14}}>
                            <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:2}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].title}</div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].date} • {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].location}</div>
                            <div style={{fontSize:13,fontWeight:900,color:PINK,marginTop:4}}>CHF {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].price}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{display:"flex",gap:10,marginBottom:12,justifyContent:"center"}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"9px 28px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":"1px solid "+BORDER,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</div>)}
                    </div>
                    <div style={{marginBottom:10}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Soirées</div><div style={{fontSize:13,fontWeight:700,color:PINK}}>La Chaux-de-Fonds</div></div>
                  </div>`;

const NEW=`{tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div className="scroll" style={{padding:"0 0 20px"}}>
                    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(255,51,153,.05))",borderRadius:"0 0 24px 24px",padding:"14px 20px 20px",marginBottom:16}}>
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
                    </div>
                    {authUser&&(
                      <div style={{margin:"0 16px 16px",background:BG2,borderRadius:16,padding:"14px 16px",border:"1px solid "+BORDER}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,165,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🥉</div>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <div style={{fontSize:13,fontWeight:800,color:"#FFB347"}}>Bronze</div>
                              <div style={{fontSize:11,color:GRAY}}>{profil?profil.points||0:0} pts</div>
                            </div>
                            <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,.1)",overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#FFB347,#FF8C00)",width:((profil?profil.points||0:0)/500*100)+"%",transition:"width 1s ease"}}/>
                            </div>
                            <div style={{fontSize:10,color:GRAY,marginTop:3}}>Encore {500-(profil?profil.points||0:0)} pts pour Argent</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!search&&events.filter(e=>!e.ended).length>0&&(
                      <div style={{margin:"0 16px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{fontSize:16,fontWeight:900,color:WHITE}}>A la une ⭐</div>
                          <div style={{fontSize:12,color:PINK,fontWeight:700,cursor:"pointer"}}>Voir tout</div>
                        </div>
                        <div style={{borderRadius:20,overflow:"hidden",position:"relative",height:190,background:BG2,cursor:"pointer"}} onClick={()=>{const ev=events.filter(e=>!e.ended)[0];if(ev)openEv(ev);}}>
                          {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].poster?<img src={events.filter(e=>!e.ended)[0].poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,rgba(255,0,128,.3),rgba(255,51,153,.1))"}}/>}
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(13,17,23,.95) 100%)"}}/>
                          <div style={{position:"absolute",top:12,left:12,background:GRAD,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20,animation:"pulse 2s ease-in-out infinite"}}>⭐ A LA UNE</div>
                          <div style={{position:"absolute",bottom:14,left:14,right:14}}>
                            <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:2}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].title}</div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].date} • {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].location}</div>
                            <div style={{fontSize:13,fontWeight:900,color:PINK,marginTop:4}}>CHF {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].price}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!search&&events.filter(e=>!e.ended).length>0&&(
                      <div style={{margin:"0 16px 16px"}}>
                        <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:10}}>A venir 📅</div>
                        {events.filter(e=>!e.ended).map((ev,i)=>(
                          <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,cursor:"pointer",animation:"rowSlide .4s "+i*.08+"s both"}}>
                            <div style={{width:52,height:52,borderRadius:12,background:GRAD,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                              {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[1]||"?"}</div><div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div></div>}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:14,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                              <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.location} • {ev.time}</div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:13,fontWeight:900,color:PINK}}>CHF {ev.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{margin:"0 16px",display:"flex",gap:10,marginBottom:16,justifyContent:"center"}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"9px 28px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":"1px solid "+BORDER,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</div>)}
                    </div>
                    <div style={{margin:"0 16px 10px"}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Toutes les soirees</div></div>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
