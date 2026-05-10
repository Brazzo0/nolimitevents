const{createClient}=require('@supabase/supabase-js');
const s=createClient('https://eypfrylitsaplkqpyxsh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s');
s.from('tickets').delete().neq('id','__none__').then(r=>console.log(JSON.stringify(r)));
