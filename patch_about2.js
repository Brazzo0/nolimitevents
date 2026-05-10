const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{screen==="adminLogin"&&(`;

const NEW=`{screen==="about"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{position:"relative",height:320,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,0,128,.15),rgba(255,51,153,.05))"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 60%,rgba(255,0,128,.25),transparent 70%)"}}/>
      <img src={LOGO} alt="" style={{width:120,height:120,objectFit:"contain",position:"relative",zIndex:2,animation:"aboutPulse 3s ease-in-out infinite",filter:"drop-shadow(0 0 40px rgba(255,0,128,.8))"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",marginTop:16}}>
        <div style={{fontSize:26,fontWeight:900,color:"#FFFFFF",letterSpacing:2,textTransform:"uppercase"}}>No Limit Events</div>
        <div style={{fontSize:13,color:"#FF0080",fontWeight:700,marginTop:4,letterSpacing:3,textTransform:"uppercase"}}>La Chaux-de-Fonds</div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,#0D1117)"}}/>
    </div>
    <div style={{padding:"0 20px 40px"}}>
      <div style={{background:"#141A22",borderRadius:20,padding:20,marginBottom:16,border:"1px solid #1E2A38"}}>
        <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Notre Histoire</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.7}}>Fondée en 2026 à La Chaux-de-Fonds, No Limit Events est née d une passion simple : créer des soirées inoubliables. Chaque événement est pensé pour offrir une expérience unique, où la musique, l ambiance et les gens se rejoignent pour former quelque chose d exceptionnel.</div>
      </div>
      <div style={{background:"#141A22",borderRadius:20,padding:20,marginBottom:16,border:"1px solid #1E2A38"}}>
        <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>Nos Valeurs</div>
        {[["🎉","Expériences Uniques","Chaque soirée est une nouvelle surprise, une nouvelle aventure."],["🔥","Ambiance Incomparable","Du Hip-Hop à l Afro, on crée l atmosphère qui te fait bouger."],["👑","Accès VIP","Des offres exclusives pour vivre la soirée différemment."],["❤️","Communauté","Plus qu un événement, une famille de fêtards passionnés."]].map(([emoji,title,desc])=>(
          <div key={title} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,0,128,.1)",border:"1px solid rgba(255,0,128,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{emoji}</div>
            <div><div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:3}}>{title}</div><div style={{fontSize:12,color:"#8892A0",lineHeight:1.5}}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[["2026","Fondée"],["16+","Âge minimum"],["100%","Passion"]].map(([val,label])=>(
          <div key={label} style={{background:"#141A22",borderRadius:16,padding:"16px 10px",textAlign:"center",border:"1px solid #1E2A38"}}>
            <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#FF0080,#FF3399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{val}</div>
            <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginTop:4,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
          </div>
        ))}
      </div>
      {aboutMedia.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Nos Soirées</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {aboutMedia.map((m,i)=>(
              <div key={i} style={{borderRadius:16,overflow:"hidden",aspectRatio:"1",background:"#141A22"}}>
                {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} autoPlay muted loop playsInline/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",borderRadius:16,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:16}}>
        <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📸</div>
        <div><div style={{fontSize:14,fontWeight:900,color:"#FFFFFF"}}>@nolimit_eventss</div><div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:2}}>Suis-nous sur Instagram</div></div>
        <div style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:18}}>→</div>
      </div>
      <div onClick={()=>setScreen("main")} style={{borderRadius:16,padding:"15px 0",textAlign:"center",fontWeight:900,fontSize:14,color:"#FF0080",cursor:"pointer",border:"1.5px solid #FF0080",letterSpacing:1}}>RETOUR</div>
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
