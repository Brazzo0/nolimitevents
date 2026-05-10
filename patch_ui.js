const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Centrer les filtres et enlever overflowX
const OLD1=`<div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"8px 16px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":\`1px solid \${BORDER}\`,fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{f}</div>)}
                    </div>`;
const NEW1=`<div style={{display:"flex",gap:10,marginBottom:12,justifyContent:"center"}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"9px 28px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":"1px solid "+BORDER,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</div>)}
                    </div>`;

// 2. Corriger suppression billets — enlever la ligne qui ne supprime qu'en mémoire dans l'admin
const OLD2=`<div onClick={()=>setTickets(p=>p.filter(x=>x.id!==t.id))} style={{background:"rgba(255,68,68,.1)",color:"#FF4444",padding:"7px 10px",borderRadius:10,cursor:"pointer"}}><Icon n="trash" s={13} c="#FF4444"/></div>`;
const NEW2=`<div onClick={()=>setDelTicketConfirm(t.id)} style={{background:"rgba(255,68,68,.1)",color:"#FF4444",padding:"7px 10px",borderRadius:10,cursor:"pointer"}}><Icon n="trash" s={13} c="#FF4444"/></div>`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('filtres ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('billets ok');}else console.log('ERREUR OLD2');

if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
