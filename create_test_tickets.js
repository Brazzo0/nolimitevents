const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
async function run(){
  const tickets=[
    {id:"NLE-TEST-001",event_id:10,event:"NO LIMIT #2",date:"SAM 23 MAI 2026",location:"Eden Night Club",time:"22:00",owner:"Alexandre Dos Santos",email:"alexandre.11ferreira@icloud.com",type:"paid",price:20,status:"valid",note:null},
    {id:"NLE-TEST-002",event_id:11,event:"NO LIMIT #3",date:"SAM 20 JUIN 2026",location:"Eden Night Club",time:"22:00",owner:"Alexandre Dos Santos",email:"alexandre.11ferreira@icloud.com",type:"paid",price:15,status:"valid",note:null},
  ];
  const r=await s.from('tickets').insert(tickets);
  console.log(JSON.stringify(r));
}
run();
