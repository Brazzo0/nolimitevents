const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const GROUPS_SCREEN=`
function GroupsScreen({authUser,supabase}){
  const [groups,setGroups]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmoji,setNewEmoji]=useState("🔥");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(false);
  const [showInvite,setShowInvite]=useState(null);
  const EMOJIS=["🦁","🔥","🌙","🎉","⚡","👑","💎","🚀","🎯","💫"];

  useEffect(()=>{if(authUser)fetchGroups();else setLoading(false);},[authUser]);

  async function fetchGroups(){
    setLoading(true);
    const{data}=await supabase.from("group_members").select("group_id,groups(id,name,emoji,owner_id)").eq("user_id",authUser.id);
    if(data){
      const gs=data.map(d=>d.groups).filter(Boolean);
      const withCounts=await Promise.all(gs.map(async g=>{
        const{count}=await supabase.from("group_members").select("*",{count:"exact",head:true}).eq("group_id",g.id);
        return{...g,member_count:count||1};
      }));
      setGroups(withCounts);
    }
    setLoading(false);
  }

  async function createGroup(){
    if(!newName.trim()||!authUser)return;
    setCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:newName.trim(),emoji:newEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGroups(prev=>[...prev,{...data,member_count:1}]);
      setNewName("");setShowCreate(false);
    }
    setCreating(false);
  }

  function copyInvite(g){
    navigator.clipboard.writeText("https://nolimitevents.vercel.app/join/"+g.id);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  }

  const emptyState=React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:24,padding:"40px 32px"}},
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:8}},
      ["🦁","🔥","🌙","🎉","⚡"].map((e,i)=>React.createElement("div",{key:i,style:{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:"0 4px 15px rgba(0,0,0,0.2)"}},e))
    ),
    React.createElement("div",{style:{textAlign:"center"}},
      React.createElement("div",{style:{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}},"Crée ton premier groupe"),
      React.createElement("div",{style:{fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.5}},"Invite 2 à 9 amis pour chatter, synchroniser vos events et cumuler des points ensemble.")
    ),
    React.createElement("button",{onClick:()=>setShowCreate(true),style:{display:"flex",alignItems:"center",gap:10,padding:"16px 40px",background:"linear-gradient(135deg,#FF0080,#FF6B6B)",color:"#fff",border:"none",borderRadius:30,fontSize:17,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 25px rgba(255,0,128,0.4)",width:"100%",justifyContent:"center"}},"+ Créer un groupe")
  );

  const groupList=React.createElement("div",{style:{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}},
    groups.map(g=>React.createElement("div",{key:g.id,style:{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(10px)",borderRadius:20,padding:"16px",border:"1px solid rgba(255,255,255,0.1)"}},
      React.createElement("div",{style:{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}},g.emoji||"👥"),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontSize:16,fontWeight:700,color:"#fff"}}),g.name,
        React.createElement("div",{style:{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:2}},g.member_count+" membre"+(g.member_count>1?"s":""))
      ),
      React.createElement("button",{onClick:()=>setShowInvite(g),style:{padding:"8px 14px",background:"linear-gradient(135deg,#FF0080,#FF6B6B)",color:"#fff",border:"none",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer"}},"Inviter")
    )),
    React.createElement("button",{onClick:()=>setShowCreate(true),style:{display:"flex",alignItems:"center",gap:10,padding:"16px",background:"linear-gradient(135deg,#FF0080,#FF6B6B)",color:"#fff",border:"none",borderRadius:20,fontSize:15,fontWeight:700,cursor:"pointer",justifyContent:"center",marginTop:8}},"+ Nouveau groupe")
  );

  return React.createElement("div",{style:{minHeight:"100vh",background:"linear-gradient(160deg,#1a0a2e 0%,#0D0D0D 40%,#1a0010 100%)",color:"#fff",fontFamily:"system-ui",paddingBottom:80,display:"flex",flexDirection:"column"}},
    // Header card
    React.createElement("div",{style:{margin:"60px 16px 24px",background:"linear-gradient(135deg,#7B2FFF,#FF0080)",borderRadius:24,padding:"20px 20px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 30px rgba(123,47,255,0.4)"}},
      React.createElement("div",null,
        React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}},"MES GROUPES"),
        React.createElement("div",{style:{fontSize:22,fontWeight:800,color:"#fff"}},groups.length===0?"Crée ton premier groupe":groups.length+" groupe"+(groups.length>1?"s":""))
      ),
      React.createElement("button",{onClick:()=>setShowCreate(true),style:{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.95)",border:"none",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7B2FFF",fontWeight:700}},"＋")
    ),

    // Body
    loading?
      React.createElement("div",{style:{display:"flex",justifyContent:"center",padding:"60px 0"}},
        React.createElement("div",{style:{width:36,height:36,borderRadius:"50%",border:"3px solid rgba(255,0,128,0.2)",borderTop:"3px solid #FF0080"}})
      ):
      groups.length===0?emptyState:groupList,

    // Modal créer
    showCreate&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}},
      React.createElement("div",{style:{width:"100%",maxWidth:420,background:"#141414",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",display:"flex",flexDirection:"column",gap:18}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("span",{style:{fontSize:18,fontWeight:800,color:"#fff"}},"Créer un groupe"),
          React.createElement("button",{onClick:()=>setShowCreate(false),style:{background:"#222",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}},"✕")
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:13,color:"#888",marginBottom:10}},"Icône du groupe"),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:8}},
            EMOJIS.map(e=>React.createElement("button",{key:e,onClick:()=>setNewEmoji(e),style:{width:46,height:46,borderRadius:12,fontSize:24,background:newEmoji===e?"rgba(255,0,128,0.2)":"#222",border:"2px solid "+(newEmoji===e?"#FF0080":"transparent"),cursor:"pointer"}},e))
          )
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:13,color:"#888",marginBottom:8}},"Nom du groupe"),
          React.createElement("input",{style:{width:"100%",padding:"14px",background:"#222",border:"1px solid #333",borderRadius:12,color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"},placeholder:"Ex: La team Eden 🔥",value:newName,onChange:e=>setNewName(e.target.value),maxLength:30})
        ),
        React.createElement("button",{onClick:createGroup,disabled:!newName.trim()||creating,style:{padding:16,background:"linear-gradient(135deg,#FF0080,#FF6B6B)",color:"#fff",border:"none",borderRadius:16,fontSize:16,fontWeight:700,cursor:"pointer",opacity:!newName.trim()||creating?0.5:1}},creating?"Création...":"Créer "+newEmoji+" "+newName)
      )
    ),

    // Modal inviter
    showInvite&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}},
      React.createElement("div",{style:{width:"100%",maxWidth:420,background:"#141414",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",display:"flex",flexDirection:"column",gap:16}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("span",{style:{fontSize:18,fontWeight:800,color:"#fff"}},"Inviter des amis"),
          React.createElement("button",{onClick:()=>setShowInvite(null),style:{background:"#222",border:"none",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}},"✕")
        ),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8}},
          React.createElement("div",{style:{fontSize:40}},showInvite.emoji),
          React.createElement("div",{style:{fontSize:17,fontWeight:700,color:"#fff"}},showInvite.name)
        ),
        React.createElement("div",{style:{background:"#1A1A1A",borderRadius:12,padding:"12px 14px",border:"1px solid #333"}},
          React.createElement("div",{style:{fontSize:11,color:"#666",marginBottom:4}},"Lien d'invitation"),
          React.createElement("div",{style:{fontSize:12,color:"#aaa",wordBreak:"break-all"}},"nolimitevents.vercel.app/join/"+showInvite.id)
        ),
        React.createElement("button",{onClick:()=>copyInvite(showInvite),style:{padding:16,background:copied?"#00C853":"linear-gradient(135deg,#FF0080,#FF6B6B)",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer"}},copied?"✓ Lien copié !":"📋 Copier le lien")
      )
    )
  );
}
`;

const INSERT_BEFORE=`function NavBar({current,onNav,onProfil,onEvents,onTickets}){`;
if(c.includes(INSERT_BEFORE)&&!c.includes('function GroupsScreen(')){
  c=c.replace(INSERT_BEFORE,GROUPS_SCREEN+INSERT_BEFORE);
  console.log('GroupsScreen ok');
}else if(c.includes('function GroupsScreen(')){
  console.log('déjà présent');
}else console.log('ERREUR NavBar');

// Brancher dans tab agenda
if(!c.includes('GroupsScreen')&&c.includes('{tab==="agenda"&&(')){
  c=c.replace('{tab==="agenda"&&(','{tab==="agenda_disabled"&&(');
  c=c.replace('{tab==="profil"','{tab==="agenda"&&React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}{tab==="profil"');
  console.log('routing ok');
}else if(c.includes('GroupsScreen')){
  console.log('routing déjà ok');
}

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
