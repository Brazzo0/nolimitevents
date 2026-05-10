const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="events"&&(
  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,overflowY:"auto",paddingBottom:80}}>
    <div style={{padding:"60px 16px 20px"}}>
      <div style={{fontSize:24,fontWeight:900,color:"#FFFFFF",marginBottom:6}}>Evenements</div>
      <div style={{fontSize:13,color:"#FF0080",fontWeight:700,marginBottom:20}}>La Chaux-de-Fonds</div>
      {events.filter(e=>!e.ended).map((ev,i)=>(
        <div key={ev.id} onClick={()=>{openEv(ev);}} style={{display:"flex",gap:12,alignItems:"center",background:"#141A22",borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid #1E2A38",cursor:"pointer"}}>
          <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}>
            {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
            <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:20,color:"#FFFFFF",fontWeight:900}}>{ev.date.split(" ")[1]||"?"}</span>
            </div>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:800,color:"#FFFFFF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
            <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.location}</div>
            <div style={{fontSize:11,color:"#8892A0",marginTop:1}}>{ev.date} • {ev.time}</div>
          </div>
          <div style={{fontSize:14,fontWeight:900,color:"#FF0080",flexShrink:0}}>CHF {ev.price}</div>
        </div>
      ))}
      {events.filter(e=>!e.ended).length===0&&(
        <div style={{textAlign:"center",padding:"60px 0",color:"#8892A0",fontSize:14}}>Aucun evenement a venir</div>
      )}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
      {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
        <div key={s} onClick={()=>{if(s==="events"){}else if(s==="profil"){setScreen("profil");}else{setTab(s);setScreen("main");}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <Icon n={ico} s={20} c={s==="events"?"#FF0080":"#8892A0"}/>
          <span style={{fontSize:9,fontWeight:700,color:s==="events"?"#FF0080":"#8892A0"}}>{label}</span>
          {s==="events"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
        </div>
      ))}
    </div>
  </div>
)}`;

const NEW=`{screen==="events"&&(
  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"50px 16px 12px",background:"linear-gradient(135deg,rgba(255,0,128,.15),rgba(255,51,153,.05))",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:22,fontWeight:900,color:"#FFFFFF"}}>Evenements</div>
        <div style={{fontSize:11,color:"#FF0080",fontWeight:700}}>La Chaux-de-Fonds</div>
      </div>
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={14} c="#8892A0"/></div>
        <input type="text" placeholder="Rechercher un evenement..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#8892A0",cursor:"pointer",fontSize:16}}>x</div>}
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
        {["Tous","Hip-Hop","Festival","Electronic","Afro","Latin"].map(f=>(
          <div key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:20,background:filter===f?"linear-gradient(135deg,#FF0080,#FF3399)":"rgba(255,255,255,.08)",color:filter===f?"#FFFFFF":"#8892A0",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{f}</div>
        ))}
      </div>
    </div>
    <div style={{overflowY:"auto",flex:1,padding:"16px 16px 20px"}}>
      <div style={{marginBottom:16}}>
        <CalendarWidget events={events}/>
      </div>
      {events.filter(e=>!e.ended&&(filter==="Tous"||e.category===filter)&&(search===""||e.title.toLowerCase().includes(search.toLowerCase()))).length>0&&(
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:3,height:16,background:"linear-gradient(135deg,#FF0080,#FF3399)",borderRadius:4}}/>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase"}}>A venir</div>
          </div>
          {events.filter(e=>!e.ended&&(filter==="Tous"||e.category===filter)&&(search===""||e.title.toLowerCase().includes(search.toLowerCase()))).map((ev,i)=>(
            <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:"#141A22",borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid #1E2A38",cursor:"pointer"}}>
              <div style={{width:64,height:64,borderRadius:14,overflow:"hidden",flexShrink:0,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}>
                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:16,fontWeight:900,color:"#FFFFFF"}}>{ev.date.split(" ")[1]||"?"}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div>
                </div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800,color:"#FFFFFF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.location} • {ev.time}</div>
                <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                  <div style={{background:"rgba(255,0,128,.15)",padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,color:"#FF0080"}}>{ev.category||"Soiree"}</div>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:14,fontWeight:900,color:"#FF0080"}}>CHF {ev.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {events.filter(e=>e.ended).length>0&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:3,height:16,background:"#1E2A38",borderRadius:4}}/>
            <div style={{fontSize:11,fontWeight:900,color:"#8892A0",letterSpacing:2,textTransform:"uppercase"}}>Terminees</div>
          </div>
          {events.filter(e=>e.ended).map((ev,i)=>(
            <div key={ev.id} style={{display:"flex",gap:12,alignItems:"center",background:"#141A22",borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid #1E2A38",opacity:.5}}>
              <div style={{width:64,height:64,borderRadius:14,overflow:"hidden",flexShrink:0,background:"#1C2430"}}>
                {ev.poster&&<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800,color:"#8892A0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.date}</div>
              </div>
              <div style={{background:"rgba(255,255,255,.1)",padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:900,color:"#8892A0"}}>TERMINEE</div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
      {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
        <div key={s} onClick={()=>{if(s==="events"){}else if(s==="profil"){setScreen("profil");}else{setTab(s);setScreen("main");}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <Icon n={ico} s={20} c={s==="events"?"#FF0080":"#8892A0"}/>
          <span style={{fontSize:9,fontWeight:700,color:s==="events"?"#FF0080":"#8892A0"}}>{label}</span>
          {s==="events"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
        </div>
      ))}
    </div>
  </div>
)}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
