const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// 1. Ajouter state onboarding
const OLD1=`const [screen,setScreen]=useState("splash");`;
const NEW1=`const [screen,setScreen]=useState("splash");
  const [onbStep,setOnbStep]=useState(0);
  const [onbDone,setOnbDone]=useState(false);`;

// 2. Modifier le splash pour aller vers onboarding
const OLD2=`useEffect(()=>{if(screen==="splash"){const t=setTimeout(()=>setScreen("main"),2500);return()=>clearTimeout(t);}},[screen]);`;
const NEW2=`useEffect(()=>{
    if(screen==="splash"){
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
    }
  },[screen,authUser]);`;

if(c.includes(OLD1)&&c.includes(OLD2)){
  c=c.replace(OLD1,NEW1);
  c=c.replace(OLD2,NEW2);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  if(!c.includes(OLD1))console.log('ERREUR OLD1');
  if(!c.includes(OLD2))console.log('ERREUR OLD2');
}
