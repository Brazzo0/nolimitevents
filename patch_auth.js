const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter les states auth après screen
const OLD1=`const [screen,setScreen]=useState("splash");`;
const NEW1=`const [screen,setScreen]=useState("splash");
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [regPrenom,setRegPrenom]=useState("");
  const [regNom,setRegNom]=useState("");
  const [regEmail,setRegEmail]=useState("");
  const [regPass,setRegPass]=useState("");
  const [regErr,setRegErr]=useState("");
  const [regDone,setRegDone]=useState(false);`;

// 2. Ajouter useEffect auth après le useEffect splash
const OLD2=`const goMain=()=>{setSelEv(null);setPayStep(0);setScreen("main");};`;
const NEW2=`const goMain=()=>{setSelEv(null);setPayStep(0);setScreen("main");};
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user||null);
      setAuthLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      setAuthUser(session?.user||null);
    });
    return()=>subscription.unsubscribe();
  },[]);
  const doLogin=async()=>{
    setLoginErr("");
    const{error}=await supabase.auth.signInWithPassword({email:loginEmail,password:loginPass});
    if(error){setLoginErr("Email ou mot de passe incorrect ❌");}
    else{setLoginEmail("");setLoginPass("");setScreen("main");}
  };
  const doRegister=async()=>{
    setRegErr("");
    if(!regPrenom||!regNom||!regEmail||!regPass){setRegErr("Remplis tous les champs !");return;}
    if(regPass.length<6){setRegErr("Mot de passe trop court (6 min)");return;}
    const{error}=await supabase.auth.signUp({email:regEmail,password:regPass,options:{data:{prenom:regPrenom,nom:regNom}}});
    if(error){setRegErr(error.message);}
    else{setRegDone(true);}
  };
  const doLogout=async()=>{await supabase.auth.signOut();setAuthUser(null);setScreen("main");};`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('states ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('useEffect ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
