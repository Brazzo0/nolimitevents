const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Changer onEvents pour aller vers un screen dédié
const OLD1=`onEvents={()=>{setTab("events");if(screen!=="main")setScreen("main");}}`;
const NEW1=`onEvents={()=>setScreen("events")}`;

// Ajouter le screen events avant adminLogin
const OLD2=`{screen==="adminLogin"&&(`;
const NEW2=`{screen==="events"&&(
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
)}
{screen==="adminLogin"&&(`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('nav ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('screen ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
