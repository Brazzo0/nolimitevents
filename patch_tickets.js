const fs=require('fs');
let c=fs.readFileSync(require('os').homedir()+'/nolimitevents/src/App.js','utf8');

const OLD=`{tab==="tickets"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div style={{fontSize:22,fontWeight:900,color:WHITE}}>Mes Billets</div>
                    <div style={{background:"rgba(255,0,128,.1)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:PINK}}>{myTickets.length} billet{myTickets.length>1?"s":""}</div>
                  </div>
                  {myTickets.length===0?(
                    <div style={{textAlign:"center",padding:"60px 20px"}}>
                      <div style={{marginBottom:20,opacity:.3,display:"flex",justifyContent:"center"}}><Icon n="ticket" s={56} c={PINK}/></div>
                      <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:10}}>Aucun billet !</div>
                      <div style={{fontSize:13,color:GRAY,marginBottom:28}}>Achète ton premier billet pour voir ton QR code ici.</div>
                      <Btn onClick={()=>setTab("home")}>VOIR LES ÉVÉNEMENTS</Btn>
                    </div>
                  ):(myTickets.map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>))}
                  <div style={{height:20}}/>
                </div>
              )}`;

const NEW=`{tab==="tickets"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div style={{fontSize:22,fontWeight:900,color:WHITE}}>Mes Billets</div>
                    <div style={{background:"rgba(255,0,128,.1)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:PINK}}>{myTickets.length} billet{myTickets.length>1?"s":""}</div>
                  </div>
                  {myTickets.length===0?(
                    <div style={{textAlign:"center",padding:"60px 20px"}}>
                      <div style={{marginBottom:20,opacity:.3,display:"flex",justifyContent:"center"}}><Icon n="ticket" s={56} c={PINK}/></div>
                      <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:10}}>Aucun billet !</div>
                      <div style={{fontSize:13,color:GRAY,marginBottom:28}}>Achète ton premier billet pour voir ton QR code ici.</div>
                      <Btn onClick={()=>setTab("home")}>VOIR LES ÉVÉNEMENTS</Btn>
                    </div>
                  ):(()=>{
                    const upcoming=myTickets.filter(t=>t.status==="valid"||t.status==="upcoming");
                    const past=myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming");
                    return(
                      <div>
                        {upcoming.length>0&&(
                          <div style={{marginBottom:24}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                              <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                              <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>À Venir</div>
                              <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:PINK}}>{upcoming.length}</div>
                            </div>
                            {upcoming.map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                          </div>
                        )}
                        {past.length>0&&(
                          <div style={{marginBottom:24}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                              <div style={{width:3,height:18,background:BG3,borderRadius:4,border:\`1px solid \${BORDER}\`}}/>
                              <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Passés</div>
                              <div style={{background:"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:GRAY}}>{past.length}</div>
                            </div>
                            {past.map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                          </div>
                        )}
                      </div>
                    );
                  })())}
                  <div style={{height:20}}/>
                </div>
              )}`;

if(c.includes(OLD)){c=c.replace(OLD,NEW);fs.writeFileSync(require('os').homedir()+'/nolimitevents/src/App.js',c);console.log('ok');}
else{console.log('ERREUR: texte non trouvé');}
