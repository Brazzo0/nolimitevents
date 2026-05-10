const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter state recherche
const OLD1=`const [filter,setFilter]=useState("Tous");`;
const NEW1=`const [filter,setFilter]=useState("Tous");
  const [search,setSearch]=useState("");`;

// 2. Modifier le filtre pour inclure la recherche
const OLD2=`const filtered=events.filter(ev=>filter==="Tous"||ev.category===filter).sort((a,b)=>getD(b)-getD(a));`;
const NEW2=`const filtered=events.filter(ev=>(filter==="Tous"||ev.category===filter)&&(search===""||ev.title.toLowerCase().includes(search.toLowerCase())||ev.location.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>getD(b)-getD(a));`;

// 3. Ajouter barre recherche + section A la une avant les filtres
const OLD3=`{tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{display:"flex",gap:10,marginBottom:12,justifyContent:"center"}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"9px 28px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":"1px solid "+BORDER,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</div>)}
                    </div>
                    <div style={{marginBottom:10}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Soirées</div><div style={{fontSize:13,fontWeight:700,color:PINK}}>La Chaux-de-Fonds</div></div>
                  </div>`;

const NEW3=`{tab==="home"&&(
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

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('state ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('filter ok');}else console.log('ERREUR OLD2');
if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);changed++;console.log('ui ok');}else console.log('ERREUR OLD3');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
