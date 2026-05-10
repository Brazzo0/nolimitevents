const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
async function run(){
  const events=[
    {title:"NO LIMIT #2",date:"SAM 23 MAI 2026",time:"22:00",location:"Eden Night Club",city:"La Chaux-de-Fonds",price:20,category:"Hip-Hop",tags:["Hip-Hop","Afro","Shatta"],lineup:["DJ FAB","NOXX"],capacity:200,tickets_sold:0,sold_out:false,ended:false},
    {title:"NO LIMIT #3",date:"SAM 20 JUIN 2026",time:"22:00",location:"Eden Night Club",city:"La Chaux-de-Fonds",price:15,category:"Festival",tags:["Festival","Electronic"],lineup:["DJ SET","LIVE"],capacity:300,tickets_sold:0,sold_out:false,ended:false},
    {title:"NO LIMIT SUMMER",date:"SAM 25 JUILLET 2026",time:"21:00",location:"Plage de Neuchâtel",city:"Neuchâtel",price:25,category:"Festival",tags:["Summer","Afro","Latin"],lineup:["TBA"],capacity:500,tickets_sold:0,sold_out:false,ended:false},
  ];
  const r=await s.from('events').insert(events);
  console.log(JSON.stringify(r));
}
run();
