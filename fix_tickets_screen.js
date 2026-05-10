const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const TICKETS_SCREEN=`
function TicketsScreen({tickets,events,user}){
  const [tab,setTab]=useState(0);
  const tabs=["À venir","Passés","Tous"];
  const now=new Date();
  const myTickets=tickets.filter(t=>!user||(t.email&&user.email&&t.email.toLowerCase()===user.email.toLowerCase())||t.owner===user.email);
  const filtered=myTickets.filter(t=>{
    const ev=events.find(e=>e.id===t.eventId);
    const d=ev?new Date(ev.date):null;
    if(tab===0)return t.status!=="cancelled"&&(!d||d>=now);
    if(tab===1)return t.status!=="cancelled"&&d&&d<now;
    return true;
  });
  const statusColor={valid:"#00E676",used:"#888",cancelled:"#FF4444"};
  const statusLabel={valid:"✓ Valide",used:"Utilisé",cancelled:"Annulé"};
  return React.createElement("div",{style:{minHeight:"100vh",background:"#0D0D0D",color:"#fff",fontFamily:"system-ui",paddingBottom:80}},
    React.createElement("div",{style:{padding:"60px 20px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
      React.createElement("div",{style:{fontSize:24,fontWeight:800}},"🎟️ Mes Billets"),
      myTickets.length>0&&React.createElement("div",{style:{background:"rgba(255,0,128,0.15)",border:"1px solid rgba(255,0,128,0.4)",color:"#FF0080",padding:"4px 12px",borderRadius:20,fontSize:13,fontWeight:700}},myTickets.length+" billet"+(myTickets.length>1?"s":""))
    ),
    React.createElement("div",{style:{display:"flex",gap:8,padding:"0 20px 16px"}},
      tabs.map((t,i)=>React.createElement("button",{key:t,onClick:()=>setTab(i),style:{padding:"8px 18px",borderRadius:20,border:"1px solid "+(tab===i?"#FF0080":"#333"),background:tab===i?"#FF0080":"transparent",color:tab===i?"#fff":"#888",fontSize:14,fontWeight:600,cursor:"pointer"}},t))
    ),
    React.createElement("div",{style:{padding:"0 16px"}},
      filtered.length===0?
        React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",gap:10}},
          React.createElement("div",{style:{fontSize:52}},"🎟️"),
          React.createElement("div",{style:{fontSize:18,fontWeight:700}},"Aucun billet"),
          React.createElement("div",{style:{fontSize:14,color:"#666"}},"Achète des billets pour les prochains events !")
        ):
        filtered.map(t=>{
          const ev=events.find(e=>e.id===t.eventId);
          const sc=statusColor[t.status]||"#00E676";
          const sl=statusLabel[t.status]||"✓ Valide";
          return React.createElement("div",{key:t.id,style:{display:"flex",gap:14,background:"#1A1A1A",borderRadius:16,padding:14,border:"1px solid #2A2A2A",marginBottom:12}},
            React.createElement("div",{style:{position:"relative",flexShrink:0}},
              ev&&ev.poster?
                React.createElement("img",{src:ev.poster,style:{width:70,height:85,borderRadius:10,objectFit:"cover"}}):
                React.createElement("div",{style:{width:70,height:85,borderRadius:10,background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}},"🎉"),
              React.createElement("div",{style:{position:"absolute",bottom:4,left:0,right:0,textAlign:"center",fontSize:9,fontWeight:700,padding:"2px 4px",borderRadius:6,background:sc+"22",color:sc,border:"1px solid "+sc+"55"}},sl)
            ),
            React.createElement("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4}},
              React.createElement("div",{style:{fontSize:15,fontWeight:800}},(ev&&ev.title)||t.event||"Soirée"),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"📅 "+(ev&&ev.date?new Date(ev.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):t.date||"—")),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"📍 "+(ev&&ev.location||t.location||"Eden Night Club")),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"🎟️ "+(t.type||"Standard")+" · CHF "+(t.price||"—")),
              t.note&&React.createElement("div",{style:{fontSize:11,color:"#FF0080",marginTop:2}},"📝 "+t.note)
            )
          );
        })
    )
  );
}
`;

// Insérer avant la fonction NavBar
const INSERT_BEFORE=`function NavBar({current,onNav,onProfil,onEvents,onTickets}){`;
if(c.includes(INSERT_BEFORE)&&!c.includes('function TicketsScreen(')){
  c=c.replace(INSERT_BEFORE, TICKETS_SCREEN+INSERT_BEFORE);
  console.log('TicketsScreen inséré ok');
}else if(c.includes('function TicketsScreen(')){
  console.log('TicketsScreen déjà présent');
}else{
  console.log('ERREUR: NavBar non trouvée');
}

// Trouver où le screen "tickets" est rendu et le brancher
const OLD_TAB=`if(screen==="events")return React.createElement(EventsScreen`;
const NEW_TAB=`if(screen==="tickets")return React.createElement(TicketsScreen,{tickets,events,user:currentUser});
  if(screen==="events")return React.createElement(EventsScreen`;

if(c.includes(OLD_TAB)&&!c.includes('screen==="tickets"')){
  c=c.replace(OLD_TAB,NEW_TAB);
  console.log('routing tickets ok');
}else if(c.includes('screen==="tickets"')){
  console.log('routing déjà présent');
}else{
  console.log('ERREUR: routing events non trouvé');
}

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
