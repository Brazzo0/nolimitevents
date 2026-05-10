const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`              {tab==="agenda"&&React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}`;
const NEW=`              {tab==="agenda"&&(
                <div style={{position:"absolute",inset:0,zIndex:10}}>
                  {React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
                </div>
              )}`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
