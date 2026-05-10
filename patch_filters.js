const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Enlever Hip-Hop, Electronic, VIP — garder seulement Tous et Festival
const OLD1=`const filters=["Tous","Hip-Hop","Electronic","Festival","VIP"];`;
const NEW1=`const filters=["Tous","Festival"];`;

// 2. Corriger la suppression des billets — aussi supprimer de Supabase correctement
const OLD2=`const dbDeleteTicket=async(id)=>{try{await supabase.from("tickets").delete().eq("id",id);}catch{}};`;
const NEW2=`const dbDeleteTicket=async(id)=>{try{const r=await supabase.from("tickets").delete().eq("id",id);console.log("del ticket",JSON.stringify(r));}catch(e){console.log("err",e);}};`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;}else console.log('ERREUR OLD2');

if(changed===2){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
