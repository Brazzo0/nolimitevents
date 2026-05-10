const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
async function run(){
  // Test si la table groups existe
  const{data,error}=await s.from('groups').select('*').limit(1);
  if(error)console.log('TABLE MANQUANTE:',error.message);
  else console.log('Table groups OK, données:',JSON.stringify(data));
  
  const{data:d2,error:e2}=await s.from('group_members').select('*').limit(1);
  if(e2)console.log('TABLE MANQUANTE:',e2.message);
  else console.log('Table group_members OK');
}
run();
