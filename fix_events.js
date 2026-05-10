const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');
c=c.replace(
  '{tab==="events"&&(',
  '{tab==="events"&&(<div style={{position:"fixed",top:0,left:0,right:0,bottom:60,background:"#0D1117",zIndex:50,overflowY:"auto",padding:"70px 16px 20px"}}><div style={{fontSize:22,fontWeight:900,color:"#FFFFFF",marginBottom:20}}>TEST EVENTS</div></div>)}{tab==="events_old"&&('
);
fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
