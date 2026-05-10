const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`function NavBar({current,onNav}){
  const tabs=[["home","Accueil"],["tickets","Billets"],["agenda","Agenda"]];
  const icons={home:"home",tickets:"ticket",agenda:"calendar"};
  return(
    <div style={{display:"flex",background:BG2,borderTop:\`1px solid \${BORDER}\`,paddingTop:10,paddingBottom:SAFE_BOT,flexShrink:0,position:"sticky",bottom:0,zIndex:50}}>
      {tabs.map(([s,label])=>(
        <div key={s} onClick={()=>onNav(s)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <div style={{transform:current===s?"scale(1.2) translateY(-2px)":"scale(1)",transition:"transform .25s cubic-bezier(.34,1.56,.64,1)"}}><Icon n={icons[s]} s={22} c={current===s?PINK:GRAY}/></div>
          <span style={{fontSize:"clamp(8px,2.5vw,10px)",fontWeight:700,letterSpacing:.3,textTransform:"uppercase",color:current===s?PINK:GRAY}}>{label}</span>
          {current===s&&<div style={{width:16,height:2.5,borderRadius:2,background:GRAD,animation:"dotPop .3s both"}}/>}
        </div>
      ))}
    </div>
  );
}`;

const NEW=`function NavBar({current,onNav,onProfil,onEvents}){
  const tabs=[
    ["home","Accueil","home"],
    ["events","Events","calendar"],
    ["tickets","Billets","ticket"],
    ["agenda","Groupes","users"],
    ["profil","Profil","users"]
  ];
  return(
    <div style={{display:"flex",background:BG2,borderTop:"1px solid "+BORDER,paddingTop:8,paddingBottom:SAFE_BOT,flexShrink:0,position:"sticky",bottom:0,zIndex:50}}>
      {tabs.map(([s,label,ico])=>(
        <div key={s} onClick={()=>{
          if(s==="profil"&&onProfil){onProfil();}
          else if(s==="events"&&onEvents){onEvents();}
          else{onNav(s==="events"?"agenda":s);}
        }} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:current===s?"rgba(255,0,128,.15)":"transparent",transition:"all .2s"}}>
            <Icon n={ico} s={20} c={current===s?PINK:GRAY}/>
          </div>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:.3,color:current===s?PINK:GRAY}}>{label}</span>
          {current===s&&<div style={{width:16,height:2.5,borderRadius:2,background:GRAD}}/>}
        </div>
      ))}
    </div>
  );
}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
