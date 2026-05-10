const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`                  <div style={{height:20}}/>
                </div>
              )}

              <NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setTab("agenda")}/>`;

const NEW=`                  <div style={{height:20}}/>
                </div>
              )}

              </div>
              )}

              <NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setTab("agenda")}/>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
