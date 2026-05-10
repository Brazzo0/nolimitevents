const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="adminLogin"&&(`;
const NEW=`{screen==="tickets"&&(
  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"50px 16px 16px",background:"linear-gradient(135deg,rgba(255,0,128,.15),rgba(255,51,153,.05))",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:22,fontWeight:900,color:"#FFFFFF"}}>Mes Billets</div>
        <div style={{background:"rgba(255,0,128,.1)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#FF0080"}}>{myTickets.length} billet{myTickets.length>1?"s":""}</div>
      </div>
    </div>
    <div style={{overflowY:"auto",flex:1,padding:"16px 16px 80px",WebkitOverflowScrolling:"touch"}}>
      {!authUser?(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🎟️</div>
          <div style={{fontSize:18,fontWeight:900,color:"#FFFFFF",marginBottom:10}}>Connecte-toi !</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:24}}>Pour voir tes billets, connecte-toi a ton compte.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer"}}>SE CONNECTER</div>
        </div>
      ):myTickets.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{marginBottom:20,opacity:.3,display:"flex",justifyContent:"center"}}><Icon n="ticket" s={56} c="#FF0080"/></div>
          <div style={{fontSize:18,fontWeight:900,color:"#FFFFFF",marginBottom:10}}>Aucun billet !</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:28}}>Achete ton premier billet pour voir ton QR code ici.</div>
          <div onClick={()=>setScreen("events")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer"}}>VOIR LES EVENEMENTS</div>
        </div>
      ):(
        <div>
          {myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{width:3,height:18,background:"linear-gradient(135deg,#FF0080,#FF3399)",borderRadius:4}}/>
                <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase"}}>A Venir</div>
                <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:"#FF0080"}}>{myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").length}</div>
              </div>
              {myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
            </div>
          )}
          {myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{width:3,height:18,background:"#1C2430",borderRadius:4,border:"1px solid #1E2A38"}}/>
                <div style={{fontSize:11,fontWeight:900,color:"#8892A0",letterSpacing:2,textTransform:"uppercase"}}>Passes</div>
              </div>
              {myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
            </div>
          )}
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
      {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
        <div key={s} onClick={()=>{if(s==="tickets"){}else if(s==="events"){setScreen("events");}else if(s==="profil"){setScreen("profil");}else{setTab(s);setScreen("main");}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <Icon n={ico} s={20} c={s==="tickets"?"#FF0080":"#8892A0"}/>
          <span style={{fontSize:9,fontWeight:700,color:s==="tickets"?"#FF0080":"#8892A0"}}>{label}</span>
          {s==="tickets"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
        </div>
      ))}
    </div>
  </div>
)}
{screen==="adminLogin"&&(`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
