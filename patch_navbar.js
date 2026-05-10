const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Supprimer la barre du haut (hamburger + logo + onglets)
const OLD1=`              <div style={{background:BG,borderBottom:\`1px solid \${BORDER}\`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative"}}>
                  <div onClick={()=>setMenuOpen(true)} style={{width:34,height:34,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",border:\`1px solid \${BORDER}\`,cursor:"pointer"}}><Icon n="menu" s={17} c={GRAY}/></div>
                  <div onClick={tapLogo} style={{position:"absolute",left:"50%",transform:"translateX(-50%)",cursor:"pointer"}}>
                    <div style={{position:"relative"}}>
                      <div style={{position:"absolute",inset:-8,borderRadius:"50%",background:\`radial-gradient(circle,\${PINK}20,transparent 70%)\`,animation:"glow 3s ease-in-out infinite"}}/>
                      <img src={LOGO} alt="" style={{height:"clamp(34px,8vw,46px)",objectFit:"contain",display:"block",position:"relative",zIndex:1,filter:\`drop-shadow(0 0 10px \${PINK}70)\`,animation:"pulse 2s ease-in-out infinite"}}/>
                    </div>
                  </div>
                  <div onClick={()=>setNotifOpen(true)} style={{width:34,height:34,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",border:\`1px solid \${BORDER}\`,cursor:"pointer",position:"relative"}}>
                    <Icon n="bell" s={15} c={GRAY}/>
                    <div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:PINK,border:\`2px solid \${BG3}\`}}/>
                  </div>
                </div>
                <div style={{display:"flex",padding:"0 20px"}}>
                  {["Événements","VIP"].map((t,i)=>(
                    <div key={t} onClick={()=>i===1&&setScreen("vip")} style={{flex:1,padding:"10px 0",textAlign:"center",fontWeight:800,fontSize:14,color:i===0?WHITE:GRAY,borderBottom:i===0?\`3px solid \${PINK}\`:"3px solid transparent",cursor:"pointer"}}>{t}</div>
                  ))}
                  <div onClick={()=>setScreen("vip")} style={{width:38,height:38,marginLeft:10,marginTop:2,background:GRAD,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><Icon n="star" s={17} c={WHITE} fill={WHITE}/></div>
                </div>
              </div>`;
const NEW1=``;

if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);console.log('header ok');}else console.log('ERREUR OLD1');
fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
