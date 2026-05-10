const fs=require('fs');
const home=require('os').homedir();
let c=fs.readFileSync(home+'/nolimitevents/src/App.js','utf8');

// Supprimer l'ancienne fonction createGroup dupliquée
const OLD=`  async function createGroup(){
    if(!newName.trim()||!authUser)return;
    setCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:newName.trim(),emoji:newEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGroups(prev=>[...prev,{...data,member_count:1}]);
      setNewName("");setShowCreate(false);
    }
    setCreating(false);
  }

  function copyInvite(g){
    navigator.clipboard.writeText("https://nolimitevents.vercel.app/join/"+g.id);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  }`;
const NEW=``;

if(c.includes(OLD)){c=c.replace(OLD,NEW);console.log('ok');}
else console.log('ERREUR: texte non trouve');

fs.writeFileSync(home+'/nolimitevents/src/App.js',c);
console.log('done');
