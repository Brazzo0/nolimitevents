const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`{tab==="agenda"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:20}}>Agenda</div>
                  <CalendarWidget events={events}/>`;

const NEW=`{tab==="agenda"&&React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
              {tab==="agenda_old"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:20}}>Agenda</div>
                  <CalendarWidget events={events}/>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  console.log('routing groups ok');
}else console.log('ERREUR: bloc non trouvé');

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
