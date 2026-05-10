const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Remplacer GroupsScreen par une version JSX pure sans React.createElement
const OLD=`function GroupsScreen({authUser,supabase}){
  const [groups,setGroups]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmoji,setNewEmoji]=useState("🔥");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(false);
  const [showInvite,setShowInvite]=useState(null);
  const EMOJIS=["🦁","🔥","🌙","🎉","⚡","👑","💎","🚀","🎯","💫"];

  useEffect(()=>{if(authUser)fetchGroups();else setLoading(false);},[authUser]);`;

const NEW=`function GroupsScreen({authUser,supabase}){
  const [groups,setGroups]=useState([]);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmoji,setNewEmoji]=useState("🔥");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(null);
  const EMOJIS=["🦁","🔥","🌙","🎉","⚡","👑","💎","🚀","🎯","💫"];

  useEffect(()=>{
    if(!authUser)return;
    supabase.from("group_members").select("group_id,groups(id,name,emoji)").eq("user_id",authUser.id).then(({data})=>{
      if(data)setGroups(data.map(d=>d.groups).filter(Boolean));
    });
  },[authUser]);`;

if(c.includes(OLD)){c=c.replace(OLD,NEW);console.log('state ok');}else console.log('ERREUR OLD');

// Remplacer le return complet par du JSX propre
const OLD2=`  const emptyState=React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:24,padding:"40px 32px"}},`;

// Trouver et remplacer tout le return de GroupsScreen
const startMarker=`  const emptyState=React.createElement`;
const endMarker=`function NavBar({current,onNav,onProfil,onEvents,onTickets,onGroups}){`;

const startIdx=c.indexOf(startMarker);
const endIdx=c.indexOf(endMarker);

if(startIdx>-1&&endIdx>-1){
  const newGroupsReturn=`
  const createGroup=async()=>{
    if(!newName.trim()||!authUser)return;
    setCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:newName.trim(),emoji:newEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGroups(p=>[...p,data]);
      setNewName("");setShowCreate(false);
    }
    setCreating(false);
  };

  const copyInvite=(g)=>{
    navigator.clipboard.writeText("https://nolimitevents.vercel.app/join/"+g.id);
    setCopied(g.id);setTimeout(()=>setCopied(null),2000);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,#1a0a2e 0%,#0D0D0D 40%,#1a0010 100%)",zIndex:100,display:"flex",flexDirection:"column"}}>
      <div style={{margin:"50px 16px 16px",background:"linear-gradient(135deg,#7B2FFF,#FF0080)",borderRadius:24,padding:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 30px rgba(123,47,255,0.4)",flexShrink:0}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>MES GROUPES</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{groups.length===0?"Crée ton premier groupe":groups.length+" groupe"+(groups.length>1?"s":"")}</div>
        </div>
        <div onClick={()=>setShowCreate(true)} style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.95)",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7B2FFF",fontWeight:700}}>＋</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 100px"}}>
        {groups.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 16px",gap:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              {["🦁","🔥","🌙","🎉","⚡"].map((e,i)=>(
                <div key={i} style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{e}</div>
              ))}
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:8}}>Crée ton premier groupe</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>Invite tes amis pour synchroniser vos events et cumuler des points ensemble.</div>
            </div>
            <div onClick={()=>setShowCreate(true)} style={{width:"100%",padding:"16px 0",borderRadius:30,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:700,fontSize:17,color:"#fff",cursor:"pointer"}}>+ Créer un groupe</div>
          </div>
        ):(
          <div>
            {groups.map(g=>(
              <div key={g.id} style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.08)",borderRadius:20,padding:"16px",marginBottom:12,border:"1px solid rgba(255,255,255,0.1)"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.emoji||"👥"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{g.name}</div>
                </div>
                <div onClick={()=>copyInvite(g)} style={{padding:"8px 14px",background:copied===g.id?"#00C853":"linear-gradient(135deg,#FF0080,#FF3399)",color:"#fff",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {copied===g.id?"✓ Copié !":"Inviter"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCreate&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{width:"100%",maxWidth:420,background:"#141414",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>Créer un groupe</span>
              <div onClick={()=>setShowCreate(false)} style={{background:"#222",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✕</div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:10}}>Icône</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {EMOJIS.map(e=>(
                  <div key={e} onClick={()=>setNewEmoji(e)} style={{width:46,height:46,borderRadius:12,fontSize:24,background:newEmoji===e?"rgba(255,0,128,0.2)":"#222",border:"2px solid "+(newEmoji===e?"#FF0080":"transparent"),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:8}}>Nom du groupe</div>
              <input style={{width:"100%",padding:"14px",background:"#222",border:"1px solid #333",borderRadius:12,color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"}} placeholder="Ex: La team Eden 🔥" value={newName} onChange={e=>setNewName(e.target.value)} maxLength={30}/>
            </div>
            <div onClick={createGroup} style={{padding:"14px",background:newName.trim()&&!creating?"linear-gradient(135deg,#FF0080,#FF3399)":"#333",color:"#fff",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer",textAlign:"center",opacity:newName.trim()&&!creating?1:0.5}}>
              {creating?"Création...":"Créer "+newEmoji+" "+newName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  c=c.substring(0,startIdx)+newGroupsReturn+c.substring(endIdx);
  console.log('return ok');
}else{
  console.log('ERREUR: markers non trouves');
}

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
