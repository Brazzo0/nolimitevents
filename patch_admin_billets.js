const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD2=`{adminTab==="free"&&!showFreeForm&&(`;

const NEW2=`{adminTab==="tickets"&&(
                  <div style={{padding:"0 16px 20px"}}>
                    <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>TOUS LES BILLETS ({tickets.length})</div>
                    {tickets.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0",color:GRAY,fontSize:13}}>Aucun billet</div>
                    ):(
                      tickets.map(t=>(
                        <div key={t.id} style={{background:BG2,borderRadius:16,padding:"14px 16px",marginBottom:10,border:"1px solid "+BORDER,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.event}</div>
                            <div style={{fontSize:10,color:GRAY,marginTop:2}}>{t.owner} - {t.date}</div>
                            <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                              <div style={{fontSize:9,fontWeight:900,fontFamily:"monospace",color:PINK}}>{t.id}</div>
                              <div style={{background:t.status==="valid"?"rgba(255,0,128,.15)":"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:t.status==="valid"?PINK:GRAY}}>{t.status==="valid"?"VALIDE":"A VENIR"}</div>
                              <div style={{background:"rgba(255,255,255,.05)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:WHITE}}>CHF {t.price}</div>
                            </div>
                          </div>
                          <div onClick={()=>setDelTicketConfirm(t.id)} style={{marginLeft:12,width:36,height:36,borderRadius:10,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                            <Icon n="trash" s={15} c="#FF4444"/>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {delTicketConfirm&&(
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:30}}>
                    <div style={{background:BG2,borderRadius:20,padding:24,width:"100%",border:"1px solid "+BORDER}}>
                      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8,textAlign:"center"}}>Supprimer ce billet ?</div>
                      <div style={{fontSize:12,color:GRAY,marginBottom:20,textAlign:"center"}}>Cette action est irreversible.</div>
                      <div style={{display:"flex",gap:10}}>
                        <div onClick={()=>setDelTicketConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:50,background:BG3,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",border:"1px solid "+BORDER}}>ANNULER</div>
                        <div onClick={()=>deleteTicketFn(delTicketConfirm)} style={{flex:1,padding:"14px 0",borderRadius:50,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                      </div>
                    </div>
                  </div>
                )}
                {adminTab==="free"&&!showFreeForm&&(`;

if(c.includes(OLD2)){
  c=c.replace(OLD2,NEW2);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
