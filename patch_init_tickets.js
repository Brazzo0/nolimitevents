const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD1=`const initialTickets=[
  {id:"NLE-001",eventId:1,event:"NO LIMIT PARTY #1",date:"VEN 24 AVRIL",location:"Eden Night Club",time:"22:00",owner:"Jean Dupont",email:"jean@example.ch",type:"paid",price:20,status:"valid",createdAt:"01/04/2026"},
];`;
const NEW1=`const initialTickets=[];`;

const OLD2=`const [tickets,setTickets]=useState(initialTickets);`;
const NEW2=`const [tickets,setTickets]=useState([]);`;

let changed=0;
if(c.includes(OLD1)){c=c.replace(OLD1,NEW1);changed++;console.log('initialTickets ok');}else console.log('ERREUR OLD1');
if(c.includes(OLD2)){c=c.replace(OLD2,NEW2);changed++;console.log('useState ok');}else console.log('ERREUR OLD2');

if(changed>0){fs.writeFileSync(home+'/nolimitevents/src/App.js',c);console.log('ok');}
