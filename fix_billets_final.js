const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');
const OLD1=`          if(s==="profil"&&onProfil){onProfil();}
          else if(s==="events"&&onEvents){onEvents();}
          else{onNav(s);}`;
const NEW1=`          if(s==="profil"&&onProfil){onProfil();}
          else if(s==="events"&&onEvents){onEvents();}
          else if(s==="tickets"){if(onTickets)onTickets();}
          else{onNav(s);}`;
const OLD2=`function NavBar({current,onNav,onProfil,onEvents}){`;
const NEW2=`function NavBar({current,onNav,onProfil,onEvents,onTickets}){`;
const OLD3=`<NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")}/>`;
const NEW3=`<NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>setScreen("tickets")}/>`;
let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('nav logic ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('props ok');}else console.log('ERREUR OLD2');
if(c.includes(OLD3)){c=c.replace(OLD3,NEW3);changed++;console.log('navcomp ok');}else console.log('ERREUR OLD3');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
