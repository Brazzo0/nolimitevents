const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

const OLD=`        {screen==="main"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>`;

const NEW=`        {screen==="main"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",paddingBottom:"60px"}}>`;

if(c.includes(OLD)){
  c=c.replace(OLD,NEW);
  fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
  console.log('ok');
}else{
  console.log('ERREUR: texte non trouve');
}
