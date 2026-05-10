const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Fix tickets auth
const OLD1=`  const myTickets=tickets.filter(t=>t.email==="jean@example.ch");`;
const NEW1=`  const myTickets=authUser?tickets.filter(t=>t.email&&authUser.email&&t.email.toLowerCase()===authUser.email.toLowerCase()):[];`;

// 2. Fix GroupsScreen - ajouter navbar en bas
const OLD2=`      {showCreate&&(`;
const NEW2=`      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
        {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
          <div key={s} onClick={()=>{if(s==="agenda"){}else if(s==="events"){window.dispatchEvent(new CustomEvent("navigate",{detail:"events"}));}else if(s==="tickets"){window.dispatchEvent(new CustomEvent("navigate",{detail:"tickets"}));}else if(s==="profil"){window.dispatchEvent(new CustomEvent("navigate",{detail:"profil"}));}else{window.dispatchEvent(new CustomEvent("navigate",{detail:s}));}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
            <Icon n={ico} s={20} c={s==="agenda"?"#FF0080":"#8892A0"}/>
            <span style={{fontSize:9,fontWeight:700,color:s==="agenda"?"#FF0080":"#8892A0"}}>{label}</span>
            {s==="agenda"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
          </div>
        ))}
      </div>
      {showCreate&&(`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('tickets ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('navbar ok');}else console.log('ERREUR OLD2');

// 3. Ajouter listener navigate dans App
const OLD3=`  const navHandler=(t)=>{setTab(t);if(screen!=="main")setScreen("main");};`;
const NEW3=`  const navHandler=(t)=>{setTab(t);if(screen!=="main")setScreen("main");};
  useEffect(()=>{
    const handler=(e)=>{
      const dest=e.detail;
      if(dest==="events")setScreen("events");
      else if(dest==="tickets")setScreen("tickets");
      else if(dest==="profil")setScreen("profil");
      else if(dest==="groups")setScreen("groups");
      else{setTab(dest);setScreen("main");}
    };
    window.addEventListener("navigate",handler);
    return()=>window.removeEventListener("navigate",handler);
  },[]);`;

if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);changed++;console.log('listener ok');}else console.log('ERREUR OLD3');

if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
