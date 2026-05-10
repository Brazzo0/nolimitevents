const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter les states profil
const OLD1=`const [aboutMedia,setAboutMedia]=useState([]);`;
const NEW1=`const [aboutMedia,setAboutMedia]=useState([]);
  const [profil,setProfil]=useState(null);
  const [profilEdit,setProfilEdit]=useState(false);
  const [profilPseudo,setProfilPseudo]=useState("");
  const [profilInsta,setProfilInsta]=useState("");
  const [profilSnap,setProfilSnap]=useState("");
  const [profilSaving,setProfilSaving]=useState(false);
  const [profilErr,setProfilErr]=useState("");`;

// 2. Ajouter fonctions profil après doLogout
const OLD2=`const doLogout=async()=>{await supabase.auth.signOut();setAuthUser(null);setScreen("main");};`;
const NEW2=`const doLogout=async()=>{await supabase.auth.signOut();setAuthUser(null);setScreen("main");};
  const loadProfil=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){setProfil(data);setProfilPseudo(data.pseudo||"");setProfilInsta(data.instagram||"");setProfilSnap(data.snapchat||"");}
    else{await supabase.from("profiles").insert({id:uid,pseudo:"",instagram:"",snapchat:"",points:0});setProfil({pseudo:"",instagram:"",snapchat:"",points:0});}
  };
  const saveProfil=async()=>{
    if(!authUser)return;
    setProfilSaving(true);setProfilErr("");
    if(profilPseudo&&profilPseudo.length<3){setProfilErr("Pseudo trop court (3 min)");setProfilSaving(false);return;}
    const{error}=await supabase.from("profiles").upsert({id:authUser.id,pseudo:profilPseudo,instagram:profilInsta,snapchat:profilSnap,points:profil?.points||0});
    if(error){setProfilErr("Pseudo déjà pris !");} else{setProfil(p=>({...p,pseudo:profilPseudo,instagram:profilInsta,snapchat:profilSnap}));setProfilEdit(false);}
    setProfilSaving(false);
  };
  useEffect(()=>{if(authUser)loadProfil(authUser.id);},[authUser]);`;

if(c.includes(OLD1)&&c.includes(OLD2)){
  c=c.replace(OLD1,NEW1);
  c=c.replace(OLD2,NEW2);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  if(!c.includes(OLD1))console.log('ERREUR OLD1');
  if(!c.includes(OLD2))console.log('ERREUR OLD2');
}
