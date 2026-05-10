const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Changer onEvents pour aller vers tab "events"
const OLD1=`onEvents={()=>setTab("agenda")}`;
const NEW1=`onEvents={()=>setTab("events")}`;

// 2. Ajouter le tab events avant le tab agenda
const OLD2=`              {tab==="agenda"&&(`;
const NEW2=`              {tab==="events"&&(
                <div className="scroll" style={{padding:"20px 16px",paddingBottom:80}}>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:6}}>Evenements</div>
                  <div style={{fontSize:13,color:PINK,fontWeight:700,marginBottom:20}}>La Chaux-de-Fonds</div>
                  {events.length===0?(
                    <div style={{textAlign:"center",padding:"60px 0"}}>
                      <div style={{fontSize:48,marginBottom:16}}>🎉</div>
                      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8}}>Aucun evenement</div>
                      <div style={{fontSize:13,color:GRAY}}>Reviens bientot !</div>
                    </div>
                  ):(
                    <div>
                      {events.filter(e=>!e.ended).length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:12,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>A venir</div>
                            <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:PINK}}>{events.filter(e=>!e.ended).length}</div>
                          </div>
                          {events.filter(e=>!e.ended).map((ev,i)=>(
                            <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,cursor:"pointer",animation:"rowSlide .4s "+i*.08+"s both"}}>
                              <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,background:GRAD}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
                                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                  <div style={{fontSize:14,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[1]||"?"}</div>
                                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div>
                                </div>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.location}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:1}}>{ev.date} • {ev.time}</div>
                              </div>
                              <div style={{textAlign:"right",flexShrink:0}}>
                                <div style={{fontSize:14,fontWeight:900,color:PINK}}>CHF {ev.price}</div>
                                <div style={{fontSize:9,color:GRAY,marginTop:2,background:BG3,padding:"2px 8px",borderRadius:10}}>{ev.category||"Soiree"}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {events.filter(e=>e.ended).length>0&&(
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:BG3,borderRadius:4,border:"1px solid "+BORDER}}/>
                            <div style={{fontSize:12,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Terminees</div>
                          </div>
                          {events.filter(e=>e.ended).map((ev,i)=>(
                            <div key={ev.id} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,opacity:.6}}>
                              <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,background:BG3}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%"}}/>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:800,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.date}</div>
                              </div>
                              <div style={{background:"rgba(255,255,255,.1)",padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:900,color:GRAY}}>TERMINEE</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {tab==="agenda"&&(`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('nav ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('tab ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
