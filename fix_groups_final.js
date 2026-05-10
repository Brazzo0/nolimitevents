const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Corriger la div non fermée dans tab=home et brancher GroupsScreen correctement
const OLD=`              {tab==="agenda"&&React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
              {tab==="agenda_old"&&(`;
const NEW=`              {tab==="agenda"&&React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
              {false&&(`;

if(c.includes(OLD)){c=c.replace(OLD,NEW);console.log('routing ok');}
else console.log('ERREUR: texte non trouve');

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('ok');
