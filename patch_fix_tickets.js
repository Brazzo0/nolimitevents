const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`                  ):(()=>{
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
                  })())}`;

const NEW=`                  ):(
                    <div>
                      {(()=>{const upcoming=myTickets.filter(t=>t.status==="valid"||t.status==="upcoming");return upcoming.length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>A Venir</div>
                            <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:PINK}}>{myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").length}</div>
                          </div>
                          {myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                        </div>
                      );})()}
                      {(()=>{const past=myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming");return past.length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:BG3,borderRadius:4,border:"1px solid "+BORDER}}/>
                            <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Passes</div>
                            <div style={{background:"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:GRAY}}>{myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").length}</div>
                          </div>
                          {myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                        </div>
                      );})()}
                    </div>
                  )}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
