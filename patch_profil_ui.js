const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="profil"&&(
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
)}`;

const NEW=`{screen==="profil"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.25),rgba(255,51,153,.05))",padding:"60px 24px 30px",textAlign:"center",position:"relative"}}>
      <div style={{width:86,height:86,borderRadius:"50%",background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,color:"#FFFFFF",margin:"0 auto 14px",boxShadow:"0 0 40px rgba(255,0,128,.5)"}}>
        {authUser?(authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom[0].toUpperCase():"U"):"?"}
      </div>
      <div style={{fontSize:21,fontWeight:900,color:"#FFFFFF",marginBottom:2}}>
        {authUser?((authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom+" ":"")+(authUser.user_metadata&&authUser.user_metadata.nom?authUser.user_metadata.nom:""))||"Utilisateur":"Non connecte"}
      </div>
      {profil&&profil.pseudo&&<div style={{fontSize:13,color:"#FF0080",fontWeight:700,marginBottom:4}}>{"@"+profil.pseudo}</div>}
      <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:16}}>{authUser?authUser.email:""}</div>
      <div style={{display:"flex",justifyContent:"center",gap:20}}>
        {[["🎟️",tickets.filter(t=>authUser&&t.email===authUser.email).length,"Billets"],["⭐",profil?profil.points||0:0,"Points"],["📅",events.filter(e=>!e.ended).length,"Events"]].map(([emoji,val,label])=>(
          <div key={label} style={{textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:"#FFFFFF"}}>{val}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"20px 24px 40px"}}>
      {authUser?(
        <div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase"}}>Mon Pseudo Social</div>
              <div onClick={()=>setProfilEdit(!profilEdit)} style={{fontSize:11,fontWeight:700,color:"#FF0080",cursor:"pointer"}}>{profilEdit?"ANNULER":"MODIFIER"}</div>
            </div>
            {profilEdit?(
              <div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Pseudo @</div>
                  <input type="text" placeholder="tonpseudo" value={profilPseudo} onChange={e=>setProfilPseudo(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Instagram</div>
                  <input type="text" placeholder="@toninstagram" value={profilInsta} onChange={e=>setProfilInsta(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Snapchat</div>
                  <input type="text" placeholder="tonsnapchat" value={profilSnap} onChange={e=>setProfilSnap(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                {profilErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:8,textAlign:"center"}}>{profilErr}</div>}
                <div onClick={saveProfil} style={{padding:"13px 0",borderRadius:12,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:13,color:"#FFFFFF",cursor:"pointer",letterSpacing:1}}>{profilSaving?"SAUVEGARDE...":"SAUVEGARDER"}</div>
              </div>
            ):(
              <div>
                {[["@",profil&&profil.pseudo?"@"+profil.pseudo:"Non defini","Pseudo"],["📸",profil&&profil.instagram?profil.instagram:"Non renseigne","Instagram"],["👻",profil&&profil.snapchat?profil.snapchat:"Non renseigne","Snapchat"]].map(([icon,val,label])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #1E2A38"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,0,128,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                    <div><div style={{fontSize:10,color:"#8892A0",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:13,color:"#FFFFFF",fontWeight:600,marginTop:1}}>{val}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Mon Compte</div>
            {[["📧","Email",authUser.email],["👤","Prenom",(authUser.user_metadata&&authUser.user_metadata.prenom)||"-"],["👤","Nom",(authUser.user_metadata&&authUser.user_metadata.nom)||"-"]].map(([icon,label,val])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #1E2A38"}}>
                <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,0,128,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                <div><div style={{fontSize:10,color:"#8892A0",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:13,color:"#FFFFFF",fontWeight:600,marginTop:1}}>{val}</div></div>
              </div>
            ))}
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
)}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
