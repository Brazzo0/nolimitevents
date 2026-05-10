const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Navbar : agenda -> setScreen("groups")
const OLD1=`          else if(s==="tickets"){if(onTickets)onTickets();}
          else{onNav(s);}`;
const NEW1=`          else if(s==="tickets"){if(onTickets)onTickets();}
          else if(s==="agenda"){if(onGroups)onGroups();}
          else{onNav(s);}`;

const OLD2=`function NavBar({current,onNav,onProfil,onEvents,onTickets}){`;
const NEW2=`function NavBar({current,onNav,onProfil,onEvents,onTickets,onGroups}){`;

const OLD3=`<NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>setScreen("tickets")}/>`;
const NEW3=`<NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>setScreen("tickets")} onGroups={()=>setScreen("groups")}/>`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('nav logic ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('props ok');}else console.log('ERREUR OLD2');
if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);changed++;console.log('navcomp ok');}else console.log('ERREUR OLD3');

// 2. Ajouter screen groups avant adminLogin
const OLD4=`{screen==="adminLogin"&&(`;
const NEW4=`{screen==="groups"&&(
  <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,#1a0a2e 0%,#0D0D0D 40%,#1a0010 100%)",zIndex:100,display:"flex",flexDirection:"column"}}>
    <div style={{margin:"50px 16px 20px",background:"linear-gradient(135deg,#7B2FFF,#FF0080)",borderRadius:24,padding:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 30px rgba(123,47,255,0.4)",flexShrink:0}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>MES GROUPES</div>
        <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>Crée ton premier groupe</div>
      </div>
      <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.95)",border:"none",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7B2FFF",fontWeight:700}}>＋</div>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 32px",gap:24}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginBottom:8}}>
        {["🦁","🔥","🌙","🎉","⚡"].map((e,i)=>(
          <div key={i} style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{e}</div>
        ))}
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}}>Crée ton premier groupe</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>Invite 2 à 9 amis pour chatter, synchroniser vos events et cumuler des points ensemble.</div>
      </div>
      <div style={{width:"100%",padding:"16px 0",borderRadius:30,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:700,fontSize:17,color:"#fff",cursor:"pointer",boxShadow:"0 8px 25px rgba(255,0,128,0.4)"}}>+ Créer un groupe</div>
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
      {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
        <div key={s} onClick={()=>{if(s==="agenda"){}else if(s==="events"){setScreen("events");}else if(s==="tickets"){setScreen("tickets");}else if(s==="profil"){setScreen("profil");}else{setTab(s);setScreen("main");}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <Icon n={ico} s={20} c={s==="agenda"?"#FF0080":"#8892A0"}/>
          <span style={{fontSize:9,fontWeight:700,color:s==="agenda"?"#FF0080":"#8892A0"}}>{label}</span>
          {s==="agenda"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
        </div>
      ))}
    </div>
  </div>
)}
{screen==="adminLogin"&&(`;

if(c.includes(OLD4)){c=c.replace(OLD4,NEW4);changed++;console.log('screen ok');}else console.log('ERREUR OLD4');

if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
