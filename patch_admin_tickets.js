const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter deleteTicketFn après deleteEventFn
const OLD1=`const deleteEventFn=async(id)=>{await dbDeleteEvent(id);setEvents(p=>p.filter(e=>e.id!==id));setDelConfirm(null);showToast("🗑️ Supprimé");};`;
const NEW1=`const deleteEventFn=async(id)=>{await dbDeleteEvent(id);setEvents(p=>p.filter(e=>e.id!==id));setDelConfirm(null);showToast("🗑️ Supprimé");};
  const deleteTicketFn=async(id)=>{await dbDeleteTicket(id);setTickets(p=>p.filter(t=>t.id!==id));setDelTicketConfirm(null);showToast("🗑️ Billet supprimé");};`;

// 2. Ajouter le state delTicketConfirm
const OLD2=`const [delConfirm,setDelConfirm]=useState(null);`;
const NEW2=`const [delConfirm,setDelConfirm]=useState(null);
  const [delTicketConfirm,setDelTicketConfirm]=useState(null);`;

if(c.includes(OLD1)&&c.includes(OLD2)){
  c=c.replace(OLD1,NEW1);
  c=c.replace(OLD2,NEW2);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouvé');
  if(!c.includes(OLD1)) console.log('OLD1 manquant');
  if(!c.includes(OLD2)) console.log('OLD2 manquant');
}
