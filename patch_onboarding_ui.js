const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="login"&&(`;

const NEW=`{screen==="onboarding"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",display:"flex",flexDirection:"column",zIndex:100}}>
    <div onClick={()=>{localStorage.setItem("nle_onb","1");setScreen("login");}} style={{position:"absolute",top:20,right:20,zIndex:10,padding:"8px 16px",borderRadius:20,background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>PASSER</div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px 0",textAlign:"center"}}>
      {onbStep===0&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)",animation:"pulse 2s ease-in-out infinite"}}>
            <img src={LOGO} alt="" style={{width:60,height:60,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Bienvenue sur No Limit Events</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Chaque soiree est une nouvelle surprise. Decouvre les meilleurs evenements de La Chaux-de-Fonds.</div>
        </div>
      )}
      {onbStep===1&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Vos billets, simplifies</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>QR code securise, achat en 2 clics, acces VIP exclusifs. Tout dans ta poche.</div>
        </div>
      )}
      {onbStep===2&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Partagez l experience</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Rejoins la communaute No Limit. Retrouve tes amis, partage tes soirees et vis l experience a fond.</div>
        </div>
      )}
    </div>
    <div style={{padding:"20px 30px 40px"}}>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{height:4,borderRadius:4,background:i===onbStep?"#FF0080":"rgba(255,255,255,.15)",width:i===onbStep?28:8,transition:"all .3s"}}/>
        ))}
      </div>
      <div onClick={()=>{
        if(onbStep<2){setOnbStep(onbStep+1);}
        else{localStorage.setItem("nle_onb","1");setScreen("login");}
      }} style={{width:"100%",padding:"16px 0",borderRadius:16,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:16,color:"#FFFFFF",cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 30px rgba(255,0,128,.4)"}}>
        {onbStep<2?"SUIVANT →":"COMMENCER 🎉"}
      </div>
    </div>
  </div>
)}
{screen==="login"&&(`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
