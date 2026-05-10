const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column"}}>`;
const NEW=`  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column",WebkitOverflowScrolling:"touch"}}>`;

const OLD2=`    <div style={{overflowY:"auto",flex:1,padding:"16px 16px 20px"}}>`;
const NEW2=`    <div style={{overflowY:"auto",flex:1,padding:"16px 16px 80px",WebkitOverflowScrolling:"touch",overscrollBehavior:"contain"}}>`;

let changed=0;
if(c.includes(OLD)){c=c.replace(OLD,NEW);changed++;console.log('container ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('scroll ok');}else console.log('ERREUR OLD2');
if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
