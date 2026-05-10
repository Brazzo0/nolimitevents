const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="about"&&(`;

const NEW=`{screen==="login"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,zIndex:100}}>
    <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",marginBottom:20,filter:"drop-shadow(0 0 20px rgba(255,0,128,.6))",animation:"pulse 2s ease-in-out infinite"}}/>
    <div style={{fontSize:24,fontWeight:900,color:"#FFFFFF",marginBottom:6,letterSpacing:1}}>Connexion</div>
    <div style={{fontSize:13,color:"#8892A0",marginBottom:28}}>Content de te revoir !</div>
    <input type="email" placeholder="Adresse email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>
    <input type="password" placeholder="Mot de passe" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
    {loginErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center"}}>{loginErr}</div>}
    <div onClick={doLogin} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE CONNECTER</div>
    <div style={{fontSize:13,color:"#8892A0",marginBottom:20}}>Pas encore de compte ? <span onClick={()=>setScreen("register")} style={{color:"#FF0080",fontWeight:700,cursor:"pointer"}}>S inscrire</span></div>
    <div onClick={()=>setScreen("main")} style={{fontSize:12,color:"#8892A0",cursor:"pointer"}}>Continuer sans compte</div>
  </div>
)}
{screen==="register"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{padding:"60px 24px 40px"}}>
      <img src={LOGO} alt="" style={{width:60,height:60,objectFit:"contain",display:"block",margin:"0 auto 16px",filter:"drop-shadow(0 0 16px rgba(255,0,128,.6))"}}/>
      <div style={{fontSize:24,fontWeight:900,color:"#FFFFFF",marginBottom:6,letterSpacing:1,textAlign:"center"}}>Créer un compte</div>
      <div style={{fontSize:13,color:"#8892A0",marginBottom:28,textAlign:"center"}}>Rejoins la communaute No Limit !</div>
      {regDone?(
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>🎉</div>
          <div style={{fontSize:20,fontWeight:900,color:"#FFFFFF",marginBottom:8}}>Compte cree !</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:24}}>Verifie ton email pour confirmer ton compte.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",letterSpacing:1}}>SE CONNECTER</div>
        </div>
      ):(
        <div>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            <input type="text" placeholder="Prenom" value={regPrenom} onChange={e=>setRegPrenom(e.target.value)} style={{flex:1,padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            <input type="text" placeholder="Nom" value={regNom} onChange={e=>setRegNom(e.target.value)} style={{flex:1,padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <input type="email" placeholder="Adresse email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>
          <input type="password" placeholder="Mot de passe (6 min)" value={regPass} onChange={e=>setRegPass(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
          {regErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center"}}>{regErr}</div>}
          <div onClick={doRegister} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>CREER MON COMPTE</div>
          <div style={{fontSize:13,color:"#8892A0",textAlign:"center"}}>Deja un compte ? <span onClick={()=>setScreen("login")} style={{color:"#FF0080",fontWeight:700,cursor:"pointer"}}>Se connecter</span></div>
        </div>
      )}
    </div>
  </div>
)}
{screen==="profil"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(255,51,153,.05))",padding:"60px 24px 30px",textAlign:"center"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#FFFFFF",margin:"0 auto 14px",boxShadow:"0 0 30px rgba(255,0,128,.4)"}}>
        {authUser?(authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom[0].toUpperCase():"U"):"?"}
      </div>
      <div style={{fontSize:20,fontWeight:900,color:"#FFFFFF",marginBottom:4}}>
        {authUser?((authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom+" ":"")+(authUser.user_metadata&&authUser.user_metadata.nom?authUser.user_metadata.nom:""))||"Utilisateur":"Non connecte"}
      </div>
      <div style={{fontSize:13,color:"rgba(255,0,128,.9)",fontWeight:700}}>{authUser?authUser.email:""}</div>
    </div>
    <div style={{padding:"20px 24px 40px"}}>
      {authUser?(
        <div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Mon Compte</div>
            {[["Email",authUser.email],["Prenom",(authUser.user_metadata&&authUser.user_metadata.prenom)||"-"],["Nom",(authUser.user_metadata&&authUser.user_metadata.nom)||"-"]].map(([label,val])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #1E2A38"}}>
                <div style={{flex:1}}><div style={{fontSize:10,color:"#8892A0",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:13,color:"#FFFFFF",fontWeight:600,marginTop:2}}>{val}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Mes Billets</div>
            <div style={{fontSize:13,color:"#8892A0"}}>{tickets.filter(t=>t.email===authUser.email).length} billet(s) lie(s) a ce compte</div>
          </div>
          <div onClick={doLogout} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",textAlign:"center",fontWeight:900,fontSize:14,color:"#FF4444",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE DECONNECTER</div>
        </div>
      ):(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>👤</div>
          <div style={{fontSize:18,fontWeight:900,color:"#FFFFFF",marginBottom:8}}>Pas encore connecte</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:24}}>Connecte-toi pour acceder a tes billets et ton profil.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE CONNECTER</div>
          <div onClick={()=>setScreen("register")} style={{padding:"15px 0",borderRadius:14,background:"transparent",border:"1.5px solid #FF0080",textAlign:"center",fontWeight:900,fontSize:15,color:"#FF0080",cursor:"pointer",letterSpacing:1}}>CREER UN COMPTE</div>
        </div>
      )}
      <div onClick={()=>setScreen("main")} style={{padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:13,color:"#8892A0",cursor:"pointer",letterSpacing:1}}>RETOUR</div>
    </div>
  </div>
)}
{screen==="about"&&(`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
