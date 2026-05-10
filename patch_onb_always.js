const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`if(screen==="splash"){
      const done=localStorage.getItem("nle_onb");
      const t=setTimeout(()=>{
        if(done){
          if(authUser){setScreen("main");}
          else{setScreen("login");}
        } else {
          setScreen("onboarding");
        }
      },2500);
      return()=>clearTimeout(t);
    }`;

const NEW=`if(screen==="splash"){
      const t=setTimeout(()=>{
        setScreen("onboarding");
      },2500);
      return()=>clearTimeout(t);
    }`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
