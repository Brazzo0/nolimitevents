const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
async function run(){
  const{data:evs}=await s.from('events').select('id').ilike('title','%NO LIMIT%');
  const ids=evs.map(e=>e.id);
  console.log('events a supprimer:',ids);
  const t=await s.from('tickets').delete().in('event_id',ids);
  console.log('tickets supprimes:',JSON.stringify(t));
  const e=await s.from('events').delete().in('id',ids);
  console.log('events supprimes:',JSON.stringify(e));
}
run();
