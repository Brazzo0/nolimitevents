const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="groups"&&(
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
)}`;

const NEW=`{screen==="groups"&&(()=>{
  const[gList,setGList]=React.useState([]);
  const[showModal,setShowModal]=React.useState(false);
  const[gName,setGName]=React.useState("");
  const[gEmoji,setGEmoji]=React.useState("🔥");
  const[gCreating,setGCreating]=React.useState(false);
  const[gCopied,setGCopied]=React.useState(null);
  const EMOJIS=["🦁","🔥","🌙","🎉","⚡","👑","💎","🚀","🎯","💫"];

  React.useEffect(()=>{
    if(!authUser)return;
    supabase.from("group_members").select("group_id,groups(id,name,emoji)").eq("user_id",authUser.id).then(({data})=>{
      if(data)setGList(data.map(d=>d.groups).filter(Boolean));
    });
  },[authUser]);

  const createGroup=async()=>{
    if(!gName.trim()||!authUser)return;
    setGCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:gName.trim(),emoji:gEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGList(p=>[...p,data]);
      setGName("");setShowModal(false);
    }
    setGCreating(false);
  };

  const copyLink=(g)=>{
    navigator.clipboard.writeText("https://nolimitevents.vercel.app/join/"+g.id);
    setGCopied(g.id);setTimeout(()=>setGCopied(null),2000);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,#1a0a2e 0%,#0D0D0D 40%,#1a0010 100%)",zIndex:100,display:"flex",flexDirection:"column"}}>
      <div style={{margin:"50px 16px 16px",background:"linear-gradient(135deg,#7B2FFF,#FF0080)",borderRadius:24,padding:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 30px rgba(123,47,255,0.4)",flexShrink:0}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>MES GROUPES</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{gList.length===0?"Crée ton premier groupe":gList.length+" groupe"+(gList.length>1?"s":"")}</div>
        </div>
        <div onClick={()=>setShowModal(true)} style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.95)",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7B2FFF",fontWeight:700}}>＋</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 16px 100px"}}>
        {gList.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 16px",gap:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              {["🦁","🔥","🌙","🎉","⚡"].map((e,i)=>(
                <div key={i} style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{e}</div>
              ))}
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:8}}>Crée ton premier groupe</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>Invite tes amis pour synchroniser vos events et cumuler des points ensemble.</div>
            </div>
            <div onClick={()=>setShowModal(true)} style={{width:"100%",padding:"16px 0",borderRadius:30,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:700,fontSize:17,color:"#fff",cursor:"pointer",boxShadow:"0 8px 25px rgba(255,0,128,0.4)"}}>+ Créer un groupe</div>
          </div>
        ):(
          gList.map(g=>(
            <div key={g.id} style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.08)",borderRadius:20,padding:"16px",marginBottom:12,border:"1px solid rgba(255,255,255,0.1)"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.emoji||"👥"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{g.name}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>Appuie pour inviter</div>
              </div>
              <div onClick={()=>copyLink(g)} style={{padding:"8px 14px",background:gCopied===g.id?"#00C853":"linear-gradient(135deg,#FF0080,#FF3399)",color:"#fff",border:"none",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {gCopied===g.id?"✓ Copié !":"Inviter"}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{width:"100%",maxWidth:420,background:"#141414",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>Créer un groupe</span>
              <div onClick={()=>setShowModal(false)} style={{background:"#222",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✕</div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:10}}>Icône</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {EMOJIS.map(e=>(
                  <div key={e} onClick={()=>setGEmoji(e)} style={{width:46,height:46,borderRadius:12,fontSize:24,background:gEmoji===e?"rgba(255,0,128,0.2)":"#222",border:"2px solid "+(gEmoji===e?"#FF0080":"transparent"),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:8}}>Nom du groupe</div>
              <input style={{width:"100%",padding:"14px",background:"#222",border:"1px solid #333",borderRadius:12,color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"}} placeholder="Ex: La team Eden 🔥" value={gName} onChange={e=>setGName(e.target.value)} maxLength={30}/>
            </div>
            <div onClick={createGroup} style={{padding:"14px",background:gName.trim()&&!gCreating?"linear-gradient(135deg,#FF0080,#FF3399)":"#333",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer",textAlign:"center",opacity:gName.trim()&&!gCreating?1:0.5}}>
              {gCreating?"Création...":"Créer "+gEmoji+" "+gName}
            </div>
          </div>
        </div>
      )}

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
  );
})()}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
