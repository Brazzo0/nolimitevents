const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
async function run(){
  const{data}=await s.from('tickets').select('id').limit(3);
  console.log('billets existants:',JSON.stringify(data));
  if(data&&data[0]){
    const r=await s.from('tickets').delete().eq('id',data[0].id);
    console.log('suppression:',JSON.stringify(r));
  }
}
run();
