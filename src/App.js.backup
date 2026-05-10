import { useState, useRef, useEffect } from "react";
import LOGO from "./logo.png";
import ROSEBG from "./rosefond.jpg";
import { createClient } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const supabase=createClient("https://eypfrylitsaplkqpyxsh.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s");
const stripePromise=loadStripe("pk_live_51TTVaDFUXKzLhWzmPzssbExHX18VMOToe84YxYDRBSJOte5YQVUAYyyPs4abetTYlnf3FUZCRyST5jC7ZfQGLdWp00MVOLOkKj");

const BG="#0D1117",BG2="#141A22",BG3="#1C2430";
const PINK="#FF0080",PINK2="#FF3399",GREEN="#4ECDC4";
const WHITE="#FFFFFF",GRAY="#8892A0",BORDER="#1E2A38";
const ADMIN_PASS="nolimit2026";
const GRAD=`linear-gradient(135deg,${PINK},${PINK2})`;
const SAFE_TOP="env(safe-area-inset-top, 44px)";
const SAFE_BOT="env(safe-area-inset-bottom, 20px)";

const initialEvents=[];

const initialTickets=[
  {id:"NLE-001",eventId:1,event:"NO LIMIT PARTY #1",date:"VEN 24 AVRIL",location:"Eden Night Club",time:"22:00",owner:"Jean Dupont",email:"jean@example.ch",type:"paid",price:20,status:"valid",createdAt:"01/04/2026"},
];
const dbLoad=async()=>{
  try{const{data}=await supabase.from("events").select("*").order("created_at",{ascending:false});
  if(!data||!data.length) return null;
  return data.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time,location:e.location,city:e.city,price:e.price,category:e.category,poster:e.poster||null,tags:e.tags||[],lineup:e.lineup||[],soldOut:e.sold_out||false,ended:e.ended||false,ticketsSold:e.tickets_sold||0,capacity:e.capacity||200}));}catch{return null;}
};
const dbSave=async(ev)=>{
  try{const row={title:ev.title,date:ev.date,time:ev.time,location:ev.location,city:ev.city,price:ev.price,category:ev.category,poster:ev.poster||null,tags:ev.tags||[],lineup:ev.lineup||[],sold_out:ev.soldOut||false,ended:ev.ended||false,tickets_sold:ev.ticketsSold||0,capacity:ev.capacity||200};
  if(ev.id&&Number.isInteger(ev.id)&&ev.id<2000000000){await supabase.from("events").update(row).eq("id",ev.id);return ev.id;}
  const{data}=await supabase.from("events").insert(row).select().single();return data?.id||ev.id;}catch{return ev.id;}
};
const dbDel=async(id)=>{try{await supabase.from("events").delete().eq("id",id);}catch{}};
const dbUpload=async(file,id)=>{
  try{const fn="ev_"+id+"_"+Date.now()+"."+((file.name||"x.jpg").split(".").pop()||"jpg");
  const{error}=await supabase.storage.from("affiches").upload(fn,file,{upsert:true,contentType:file.type||"image/jpeg"});
  if(error) return null;
  return supabase.storage.from("affiches").getPublicUrl(fn).data?.publicUrl||null;}catch{return null;}
};
const dbSaveTix=async(t)=>{try{await supabase.from("tickets").insert({id:t.id,event_id:t.eventId,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note||null});}catch{}};
const dbLoadTix=async()=>{try{const{data}=await supabase.from("tickets").select("*");if(!data||!data.length)return null;return data.map(t=>({id:t.id,eventId:t.event_id,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note,createdAt:t.created_at}));}catch{return null;}};


const dbLoadEvents=async()=>{
  try{
    const{data,error}=await supabase.from("events").select("*").order("created_at",{ascending:false});
    if(error||!data||data.length===0) return null;
    return data.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time,location:e.location,city:e.city,price:e.price,category:e.category,poster:e.poster||null,tags:e.tags||[],lineup:e.lineup||[],soldOut:e.sold_out||false,ended:e.ended||false,ticketsSold:e.tickets_sold||0,capacity:e.capacity||200}));
  }catch{return null;}
};

const dbSaveEvent=async(ev)=>{
  try{
    const row={title:ev.title,date:ev.date,time:ev.time,location:ev.location,city:ev.city,price:ev.price,category:ev.category,poster:ev.poster||null,tags:ev.tags||[],lineup:ev.lineup||[],sold_out:ev.soldOut||false,ended:ev.ended||false,tickets_sold:ev.ticketsSold||0,capacity:ev.capacity||200};
    if(ev.id&&Number.isInteger(ev.id)&&ev.id<2000000000){await supabase.from("events").update(row).eq("id",ev.id);return ev.id;}
    const{data}=await supabase.from("events").insert(row).select().single();
    return data?.id||ev.id;
  }catch{return ev.id;}
};

const dbDeleteEvent=async(id)=>{try{await supabase.from("events").delete().eq("id",id);}catch{}};

const dbUploadPoster=async(file,eventId)=>{
  try{
    const ext=(file.name||"poster.jpg").split(".").pop()||"jpg";
    const fileName=`event_${eventId}_${Date.now()}.${ext}`;
    const{error}=await supabase.storage.from("affiches").upload(fileName,file,{upsert:true,contentType:file.type||"image/jpeg"});
    if(error) return null;
    const{data}=supabase.storage.from("affiches").getPublicUrl(fileName);
    return data?.publicUrl||null;
  }catch{return null;}
};

const dbLoadTickets=async()=>{
  try{
    const{data}=await supabase.from("tickets").select("*");
    if(!data||data.length===0) return null;
    return data.map(t=>({id:t.id,eventId:t.event_id,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note,createdAt:t.created_at}));
  }catch{return null;}
};

const dbSaveTicket=async(t)=>{
  try{await supabase.from("tickets").insert({id:t.id,event_id:t.eventId,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note||null});}catch{}
};

const dbSaveSignup=async(f)=>{
  try{await supabase.from("signups").upsert({prenom:f.prenom,nom:f.nom,email:f.email,tel:f.tel||null});}catch{}
};

const Icon=({n,s=22,c=GRAY,fill="none",sw=2.2})=>{
  const p={width:s,height:s,viewBox:"0 0 24 24",fill,stroke:c,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  const icons={
    home:<svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    ticket:<svg {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>,
    calendar:<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bell:<svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    menu:<svg {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    pin:<svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    users:<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    edit:<svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    image:<svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    trash:<svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check:<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    block:<svg {...p}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    dollar:<svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    bar:<svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    star:<svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    gift:<svg {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    upload:<svg {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    logout:<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    eye:<svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    back:<svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
  };
  return icons[n]||null;
};

function LightBeams(){
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",top:0,left:"-50%",width:"40%",height:"120%",background:`linear-gradient(90deg,transparent,${PINK}12,transparent)`,animation:"lightBeam 8s ease-in-out infinite"}}/>
      <div style={{position:"absolute",top:0,right:"-50%",width:"30%",height:"120%",background:`linear-gradient(90deg,transparent,${PINK}08,transparent)`,animation:"lightBeam2 10s ease-in-out infinite 1.5s"}}/>
      {[...Array(18)].map((_,i)=><div key={i} style={{position:"absolute",left:`${(i*41)%100}%`,top:-20,width:i%5===0?2:1,height:`${15+((i*17)%45)}px`,background:"linear-gradient(180deg,transparent,rgba(255,0,128,.8),transparent)",borderRadius:2,animation:`rainDrop ${1.5+(i%4)*.6}s ${(i%8)*.45}s linear infinite`}}/>)}
      <div style={{position:"absolute",bottom:-60,left:"30%",right:"30%",height:100,background:`radial-gradient(ellipse,${PINK}10,transparent 70%)`,animation:"glow 4s ease-in-out infinite"}}/>
    </div>
  );
}

function QRCode({id,size=150}){
  return <QRCodeSVG value={id} size={size} bgColor="#FFFFFF" fgColor="#0D1117" level="H" style={{borderRadius:12,border:"3px solid #FF0080",boxShadow:"0 8px 32px rgba(255,0,128,.3)"}}/>;
}

const Tag=({children})=><span style={{background:GRAD,color:WHITE,fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:20,letterSpacing:.5,textTransform:"uppercase"}}>{children}</span>;

function Btn({children,onClick,outline=false,style={}}){
  const [p,setP]=useState(false);
  return(
    <div onClick={()=>{setP(true);setTimeout(()=>setP(false),160);onClick&&onClick();}} style={{borderRadius:14,background:outline?"transparent":GRAD,border:outline?`1.5px solid ${PINK}`:"none",padding:"15px 0",width:"100%",textAlign:"center",cursor:"pointer",fontWeight:900,fontSize:14,color:outline?PINK:WHITE,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"inherit",transform:p?"scale(0.97)":"scale(1)",transition:"transform .15s",...style}}>
      {children}
    </div>
  );
}

function SoldOut(){
  return <div style={{position:"absolute",inset:0,background:"rgba(13,17,23,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}><div style={{fontSize:14,fontWeight:900,color:PINK,border:`1.5px solid ${PINK}`,padding:"4px 14px",borderRadius:30,letterSpacing:2}}>TERMINÉE</div></div>;
}

function TicketCard({ticket,events,onShowQR,index=0}){
  const isFree=ticket.type==="free";
  const ev=events.find(e=>e.id===ticket.eventId);
  return(
    <div style={{background:BG2,borderRadius:20,overflow:"hidden",marginBottom:14,border:`1px solid ${BORDER}`}}>
      <div style={{background:GRAD,padding:"16px 18px",position:"relative"}}>
        {ev?.poster&&<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.3}}/>}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{ticket.event}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:3}}>{ticket.date} • {ticket.location}</div>
          <div style={{display:"flex",gap:6,marginTop:6}}>
            <div style={{background:"rgba(255,255,255,.2)",color:WHITE,fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:20}}>{ticket.status==="valid"?"✓ VALIDE":"À VENIR"}</div>
            {isFree&&<div style={{background:"rgba(78,205,196,.25)",color:GREEN,fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:20}}>GRATUIT</div>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",padding:"0 14px"}}>
        <div style={{width:16,height:16,borderRadius:"50%",background:BG,border:`1px solid ${BORDER}`,flexShrink:0,marginLeft:-22}}/>
        <div style={{flex:1,borderTop:`2px dashed ${BORDER}`,margin:"0 8px"}}/>
        <div style={{width:16,height:16,borderRadius:"50%",background:BG,border:`1px solid ${BORDER}`,flexShrink:0,marginRight:-22}}/>
      </div>
      <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:GRAY,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>ID Billet</div>
          <div style={{fontSize:12,fontWeight:800,color:WHITE,fontFamily:"monospace"}}>{ticket.id}</div>
          <div style={{fontSize:10,color:GRAY,marginTop:2}}>{ticket.owner}</div>
        </div>
        <div onClick={()=>onShowQR(ticket)} style={{background:ticket.status==="valid"?GRAD:BG3,padding:"10px 16px",borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon n="eye" s={16} c={ticket.status==="valid"?WHITE:GRAY}/>
          <span style={{fontSize:9,fontWeight:900,color:ticket.status==="valid"?WHITE:GRAY,letterSpacing:1,textTransform:"uppercase"}}>QR CODE</span>
        </div>
      </div>
    </div>
  );
}

function QRModal({ticket,onClose}){
  if(!ticket) return null;
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:300,padding:30,animation:"slideUp .3s both"}}>
      <img src={LOGO} alt="" style={{width:50,height:50,objectFit:"contain",marginBottom:14,animation:"pulse 2s ease-in-out infinite"}}/>
      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:4}}>{ticket.event}</div>
      <div style={{fontSize:12,color:GRAY,marginBottom:6}}>{ticket.date} • {ticket.location}</div>
      {ticket.type==="free"&&<div style={{background:"rgba(78,205,196,.15)",border:`1px solid ${GREEN}`,color:GREEN,fontSize:10,fontWeight:900,padding:"4px 14px",borderRadius:20,marginBottom:16}}>BILLET GRATUIT</div>}
      <div style={{marginBottom:14}}><QRCode id={ticket.id} size={180}/></div>
      <div style={{fontSize:12,fontWeight:800,color:PINK,fontFamily:"monospace",marginBottom:4}}>{ticket.id}</div>
      <div style={{fontSize:11,color:GRAY,marginBottom:24}}>{ticket.owner}</div>
      <Btn onClick={onClose}>FERMER</Btn>
    </div>
  );
}

const INP_S={width:"100%",padding:"12px 14px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit"};
const LBL_S={fontSize:10,color:PINK,fontWeight:900,marginBottom:6,letterSpacing:1,textTransform:"uppercase",display:"block"};
const CATS=["Hip-Hop","Electronic","Festival","VIP","Afro","Latino","House","Techno"];

function EventForm({ev,onSave,onCancel}){
  const isNew=!ev.id;
  const [f,setF]=useState(ev.id?{...ev,lineup:Array.isArray(ev.lineup)?ev.lineup.join(", "):ev.lineup||"",tags:Array.isArray(ev.tags)?ev.tags.join(", "):ev.tags||""}:{title:"",date:"",time:"22:00",location:"Eden Night Club",city:"La Chaux-de-Fonds",price:"",category:"",poster:null,tags:"",soldOut:false,ended:false,lineup:"",capacity:200,ticketsSold:0});
  const fRef=useRef();
  const upd=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.title||!f.date||!f.price) return;
    onSave({...f,price:+f.price,capacity:+f.capacity||200,ticketsSold:+f.ticketsSold||0,lineup:(f.lineup||"").split(",").map(x=>x.trim()).filter(Boolean),tags:(f.tags||"").split(",").map(x=>x.trim()).filter(Boolean)});
  };
  const pickPoster=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const r=new FileReader();
    r.onload=(ev)=>setF(p=>({...p,poster:ev.target.result,_file:file}));
    r.readAsDataURL(file);
    e.target.value="";
  };
  return(
    <div style={{position:"absolute",inset:0,background:BG,zIndex:200,display:"flex",flexDirection:"column",paddingTop:SAFE_TOP,animation:"slideIn .3s both"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`,background:BG2,flexShrink:0}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:PINK,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={PINK}/></button>
        <span style={{fontSize:15,fontWeight:900,color:WHITE}}>{isNew?"Nouvel événement":"Modifier"}</span>
        <div onClick={save} style={{background:GRAD,color:WHITE,padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:900,cursor:"pointer"}}>SAUVEGARDER</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 30px"}}>
        <input ref={fRef} type="file" accept="image/*" style={{display:"none"}} onChange={pickPoster}/>
        <div onClick={()=>fRef.current.click()} style={{border:`2px dashed ${BORDER}`,borderRadius:16,padding:16,textAlign:"center",cursor:"pointer",background:BG2,marginBottom:16,minHeight:90,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {f.poster?<img src={f.poster} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10}}/>
            :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><Icon n="upload" s={28} c={PINK}/><div style={{fontSize:13,fontWeight:800,color:PINK}}>AJOUTER L'AFFICHE</div></div>}
        </div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Titre</label><input style={INP_S} placeholder="NO LIMIT PARTY #3" value={f.title||""} onChange={upd("title")}/></div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Date</label><input style={INP_S} placeholder="SAM 15 NOV 2026" value={f.date||""} onChange={upd("date")}/></div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <div style={{flex:1}}><label style={LBL_S}>Heure</label><input style={INP_S} placeholder="22:00" value={f.time||""} onChange={upd("time")}/></div>
          <div style={{flex:1}}><label style={LBL_S}>Prix CHF</label><input style={INP_S} type="number" placeholder="25" value={f.price||""} onChange={upd("price")}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Lieu</label><input style={INP_S} placeholder="Eden Night Club" value={f.location||""} onChange={upd("location")}/></div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Ville</label><input style={INP_S} placeholder="La Chaux-de-Fonds" value={f.city||""} onChange={upd("city")}/></div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Capacité</label><input style={INP_S} type="number" placeholder="200" value={f.capacity||""} onChange={upd("capacity")}/></div>
        <div style={{marginBottom:14}}>
          <label style={LBL_S}>Catégorie</label>
          <input style={INP_S} placeholder="Hip-Hop..." value={f.category||""} onChange={upd("category")}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {CATS.map(c=><div key={c} onClick={()=>setF(p=>({...p,category:c}))} style={{padding:"5px 12px",borderRadius:20,background:f.category===c?GRAD:BG3,color:f.category===c?WHITE:GRAY,fontSize:10,fontWeight:700,cursor:"pointer",border:f.category===c?"none":`1px solid ${BORDER}`}}>{c}</div>)}
          </div>
        </div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Tags (virgule)</label><input style={INP_S} placeholder="Shatta, Latino" value={f.tags||""} onChange={upd("tags")}/></div>
        <div style={{marginBottom:20}}><label style={LBL_S}>Line-up (virgule)</label><input style={INP_S} placeholder="DJ FAB, DJ NOXX" value={f.lineup||""} onChange={upd("lineup")}/></div>
        <Btn onClick={save}>{isNew?"CRÉER":"SAUVEGARDER"}</Btn>
      </div>
    </div>
  );
}

function FreeTicketForm({events,onSave,onCancel}){
  const [f,setF]=useState({eventId:"",ownerName:"",ownerEmail:"",note:""});
  const upd=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.eventId||!f.ownerName||!f.ownerEmail) return;
    const ev=events.find(e=>e.id===+f.eventId);
    if(!ev) return;
    onSave({id:`NLE-FREE-${Date.now().toString().slice(-6)}`,eventId:+f.eventId,event:ev.title,date:ev.date.split(" ").slice(0,3).join(" "),location:ev.location,time:ev.time,owner:f.ownerName,email:f.ownerEmail,type:"free",price:0,status:"valid",createdAt:new Date().toLocaleDateString("fr-CH"),note:f.note});
  };
  return(
    <div style={{position:"absolute",inset:0,background:BG,zIndex:200,display:"flex",flexDirection:"column",paddingTop:SAFE_TOP,animation:"slideIn .3s both"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`,background:BG2,flexShrink:0}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={GREEN}/></button>
        <span style={{fontSize:15,fontWeight:900,color:WHITE}}>Billet Gratuit</span>
        <div onClick={save} style={{background:`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:900,cursor:"pointer"}}>CRÉER</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
        <div style={{marginBottom:14}}>
          <label style={{...LBL_S,color:GREEN}}>Événement</label>
          {events.filter(e=>!e.ended).map(ev=>(
            <div key={ev.id} onClick={()=>setF(p=>({...p,eventId:String(ev.id)}))} style={{background:f.eventId===String(ev.id)?"rgba(78,205,196,.08)":BG3,border:f.eventId===String(ev.id)?`1.5px solid ${GREEN}`:`1px solid ${BORDER}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              {ev.poster?<img src={ev.poster} alt="" style={{width:44,height:44,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<div style={{width:44,height:44,borderRadius:10,background:BG2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="image" s={20} c={GRAY}/></div>}
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:WHITE}}>{ev.title}</div><div style={{fontSize:11,color:GRAY}}>{ev.date}</div></div>
              {f.eventId===String(ev.id)&&<Icon n="check" s={18} c={GREEN}/>}
            </div>
          ))}
        </div>
        <div style={{marginBottom:14}}><label style={{...LBL_S,color:GREEN}}>Nom</label><input style={INP_S} placeholder="DJ NOXX / Staff..." value={f.ownerName} onChange={upd("ownerName")}/></div>
        <div style={{marginBottom:14}}><label style={{...LBL_S,color:GREEN}}>Email</label><input style={INP_S} type="email" placeholder="collab@example.ch" value={f.ownerEmail} onChange={upd("ownerEmail")}/></div>
        <div style={{marginBottom:20}}><label style={{...LBL_S,color:GREEN}}>Note</label><input style={INP_S} placeholder="DJ, Staff, Photo..." value={f.note} onChange={upd("note")}/></div>
        <div onClick={save} style={{background:`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"16px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:"pointer",textTransform:"uppercase"}}>CRÉER LE BILLET</div>
      </div>
    </div>
  );
}

function SignupForm({onSuccess}){
  const [f,setF]=useState({nom:"",prenom:"",email:"",tel:""});
  const [done,setDone]=useState(false);
  const upd=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const save=async()=>{
    if(!f.nom||!f.prenom||!f.email) return;
    await dbSaveSignup(f);
    setDone(true);
    setTimeout(()=>onSuccess&&onSuccess(),1500);
  };
  if(done) return <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40,marginBottom:10}}>🎉</div><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Bienvenue dans la famille !</div></div>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><label style={LBL_S}>Prénom</label><input style={INP_S} placeholder="Jean" value={f.prenom} onChange={upd("prenom")}/></div>
        <div style={{flex:1}}><label style={LBL_S}>Nom</label><input style={INP_S} placeholder="Dupont" value={f.nom} onChange={upd("nom")}/></div>
      </div>
      <div><label style={LBL_S}>Email *</label><input style={INP_S} type="email" placeholder="jean@example.ch" value={f.email} onChange={upd("email")}/></div>
      <div><label style={LBL_S}>Téléphone</label><input style={INP_S} type="tel" placeholder="+41 79 000 00 00" value={f.tel} onChange={upd("tel")}/></div>
      <div onClick={save} style={{background:GRAD,color:WHITE,padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:"pointer",marginTop:8,textTransform:"uppercase"}}>REJOINDRE NO LIMIT EVENTS 🎉</div>
    </div>
  );
}

function CalendarWidget({events}){
  const [month,setMonth]=useState(new Date());
  const months=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  const days=["lun.","mar.","mer.","jeu.","ven.","sam.","dim."];
  const firstDay=(new Date(month.getFullYear(),month.getMonth(),1).getDay()+6)%7;
  const daysInMonth=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const today=new Date();
  const mN={"JANV":0,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DÉC":11};
  const mois={"janvier":0,"fevrier":1,"février":1,"mars":2,"avril":3,"mai":4,"juin":5,"juillet":6,"aout":7,"août":7,"septembre":8,"octobre":9,"novembre":10,"decembre":11,"décembre":11,"JANV":0,"FEV":1,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOUT":7,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DEC":11,"DÉC":11};
  const eDates=events.map(e=>{
    const p=e.date.split(" ");
    if(p.length>=4){return{day:parseInt(p[1]),month:mois[p[2]]??mois[p[2].toUpperCase()]??0,year:parseInt(p[3])};}
    if(p.length===3){return{day:parseInt(p[0]),month:mois[p[1].toLowerCase()]??0,year:parseInt(p[2])};}
    return{day:0,month:0,year:0};
  });
  const hasEv=(d)=>eDates.some(e=>e.day===d&&e.month===month.getMonth()&&e.year===month.getFullYear());
  return(
    <div style={{background:BG2,borderRadius:18,padding:16,border:`1px solid ${BORDER}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} style={{width:32,height:32,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon n="back" s={14} c={GRAY}/></div>
        <span style={{fontSize:15,fontWeight:800,color:WHITE}}>{months[month.getMonth()]} {month.getFullYear()}</span>
        <div onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} style={{width:32,height:32,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
        {days.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:GRAY,padding:"4px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(daysInMonth).fill(null).map((_,i)=>{
          const d=i+1;
          const isT=d===today.getDate()&&month.getMonth()===today.getMonth()&&month.getFullYear()===today.getFullYear();
          return(
            <div key={d} style={{textAlign:"center",padding:"5px 0"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:isT?GREEN:hasEv(d)?PINK:"transparent",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:12,fontWeight:isT||hasEv(d)?900:600,color:isT?BG:WHITE}}>{d}</div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavBar({current,onNav}){
  const tabs=[["home","Accueil"],["tickets","Billets"],["agenda","Agenda"]];
  const icons={home:"home",tickets:"ticket",agenda:"calendar"};
  return(
    <div style={{display:"flex",background:BG2,borderTop:`1px solid ${BORDER}`,paddingTop:10,paddingBottom:SAFE_BOT,flexShrink:0,position:"sticky",bottom:0,zIndex:50}}>
      {tabs.map(([s,label])=>(
        <div key={s} onClick={()=>onNav(s)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <div style={{transform:current===s?"scale(1.2) translateY(-2px)":"scale(1)",transition:"transform .25s cubic-bezier(.34,1.56,.64,1)"}}><Icon n={icons[s]} s={22} c={current===s?PINK:GRAY}/></div>
          <span style={{fontSize:"clamp(8px,2.5vw,10px)",fontWeight:700,letterSpacing:.3,textTransform:"uppercase",color:current===s?PINK:GRAY}}>{label}</span>
          {current===s&&<div style={{width:16,height:2.5,borderRadius:2,background:GRAD,animation:"dotPop .3s both"}}/>}
        </div>
      ))}
    </div>
  );
}

function AdminEventRow({ev,onEdit,onToggle,onDelete,onUpload,onEnd,index}){
  const pct=Math.round((ev.ticketsSold/ev.capacity)*100);
  return(
    <div style={{background:ev.ended?"rgba(255,255,255,.03)":BG2,borderRadius:18,marginBottom:12,overflow:"hidden",border:ev.ended?"1px solid rgba(255,255,255,.1)":`1px solid ${BORDER}`,opacity:ev.ended?.6:1}}>
      <div style={{display:"flex",gap:12,padding:"14px 16px",alignItems:"center"}}>
        {ev.poster?<img src={ev.poster} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
          :<div style={{width:52,height:52,borderRadius:12,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="image" s={22} c={GRAY}/></div>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <div style={{fontSize:13,fontWeight:800,color:WHITE,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
            
          </div>
          <div style={{fontSize:11,color:GRAY}}>{ev.date} • CHF {ev.price}</div>
          <div style={{height:4,background:BG3,borderRadius:4,overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${pct}%`,background:GRAD}}/></div>
          <div style={{fontSize:10,color:GRAY,marginTop:3}}>{ev.ticketsSold}/{ev.capacity} • {pct}%</div>
        </div>
      </div>
      <div style={{display:"flex",borderTop:`1px solid ${BORDER}`}}>
        {[
          [<Icon n="edit" s={13} c={GRAY}/>,"Modifier",()=>onEdit(ev),GRAY],
          [<Icon n="image" s={13} c={GRAY}/>,"Affiche",()=>onUpload(ev.id),GRAY],
          [ev.soldOut?<Icon n="check" s={13} c={GREEN}/>:<Icon n="block" s={13} c={PINK}/>,ev.soldOut?"Réactiver":"Sold Out",()=>onToggle(ev.id),ev.soldOut?GREEN:PINK],
          [ev.ended?<Icon n="check" s={13} c={GREEN}/>:<Icon n="block" s={13} c="#FF8C00"/>,ev.ended?"Réactiver":"Terminer",()=>onEnd(ev.id),ev.ended?GREEN:"#FF8C00"],
          [<Icon n="trash" s={13} c="#FF4444"/>,"Suppr.",()=>onDelete(ev.id),"#FF4444"],
        ].map(([icon,label,action,color],i)=>(
          <div key={i} onClick={action} style={{flex:1,padding:"10px 0",background:BG2,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",borderLeft:i>0?`1px solid ${BORDER}`:"none"}}
            onTouchStart={e=>e.currentTarget.style.background=BG3} onTouchEnd={e=>e.currentTarget.style.background=BG2}>
            {icon}<span style={{fontSize:8,fontWeight:800,color,letterSpacing:.4,textTransform:"uppercase"}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryScreen({onBack}){
  const [photos,setPhotos]=useState([]);
  const [current,setCurrent]=useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    dbLoadGallery().then(p=>{setPhotos(p||[]);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    if(photos.length<2) return;
    const t=setInterval(()=>setCurrent(c=>c+1>=photos.length?0:c+1),4000);
    return()=>clearInterval(t);
  },[photos.length]);

  const p=photos[current]||null;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:BG,overflow:"hidden",position:"relative"}}>
      <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",paddingTop:SAFE_TOP,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div onClick={onBack} style={{background:BG3,width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:WHITE,fontSize:16}}>←</div>
        <img src={LOGO} alt="" style={{width:34,height:34,objectFit:"contain",animation:"pulse 2s ease-in-out infinite"}}/>
        <div style={{width:36}}/>
      </div>
      {loading?<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${BG3}`,borderTop:`3px solid ${PINK}`,animation:"spin 1s linear infinite"}}/></div>:
      photos.length===0?<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,textAlign:"center"}}><div style={{fontSize:50,marginBottom:16}}>📸</div><div style={{fontSize:18,fontWeight:800,color:WHITE,marginBottom:8}}>Aucune photo</div><div style={{fontSize:14,color:GRAY}}>Les photos des soirées apparaîtront ici</div></div>:
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          {p&&<img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
          {p&&<div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 55%,rgba(0,0,0,.85))"}}/>}
          {p&&<div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.6)",borderRadius:10,padding:"4px 10px",display:"flex",alignItems:"center",gap:5}}><img src={LOGO} alt="" style={{width:14,height:14,objectFit:"contain"}}/><span style={{fontSize:9,fontWeight:800,color:WHITE}}>NO LIMIT</span></div>}
          {p&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px"}}>{p.event_name&&<div style={{fontSize:17,fontWeight:900,color:WHITE,marginBottom:3}}>{p.event_name}</div>}{p.caption&&<div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>{p.caption}</div>}</div>}
        </div>
        <div style={{background:BG2,padding:"12px 20px 20px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:12}}>{photos.map((_,i)=><div key={i} onClick={()=>setCurrent(i)} style={{width:i===current?18:5,height:5,borderRadius:3,background:i===current?PINK:"rgba(255,255,255,.25)",transition:"all .3s",cursor:"pointer"}}/>)}</div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div onClick={()=>setCurrent(c=>c-1<0?photos.length-1:c-1)} style={{flex:1,background:BG3,border:`1px solid ${BORDER}`,borderRadius:12,padding:"11px 0",textAlign:"center",fontSize:18,cursor:"pointer"}}>←</div>
            <div style={{flex:2,textAlign:"center",fontSize:12,color:GRAY,fontWeight:700}}>{current+1} / {photos.length}</div>
            <div onClick={()=>setCurrent(c=>c+1>=photos.length?0:c+1)} style={{flex:1,background:BG3,border:`1px solid ${BORDER}`,borderRadius:12,padding:"11px 0",textAlign:"center",fontSize:18,cursor:"pointer"}}>→</div>
          </div>
        </div>
      </div>}
    </div>
  );
}


function AdminGallery(){
  const [photos,setPhotos]=useState([]);
  const [caption,setCaption]=useState("");
  const [eventName,setEventName]=useState("");
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);

  useEffect(()=>{dbLoadGallery().then(setPhotos);},[]);

  const handleUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setUploading(true);
    const url=await dbUploadGallery(file);
    if(url){
      await dbAddPhoto(url,caption,eventName);
      const updated=await dbLoadGallery();
      setPhotos(updated);
      setCaption("");setEventName("");
    }
    setUploading(false);
    e.target.value="";
  };

  const handleDelete=async(id)=>{
    await dbDeletePhoto(id);
    setPhotos(p=>p.filter(x=>x.id!==id));
  };

  return(
    <div style={{padding:"0 0 20px"}}>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleUpload}/>
      
      {/* Formulaire ajout */}
      <div style={{background:BG2,borderRadius:16,padding:16,margin:"0 0 16px",border:`1px solid ${BORDER}`}}>
        <div style={{fontSize:12,color:PINK,fontWeight:900,marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>Ajouter une photo</div>
        <input placeholder="Nom de la soirée (ex: NO LIMIT #2)" className="inp" value={eventName} onChange={e=>setEventName(e.target.value)} style={{marginBottom:10}}/>
        <input placeholder="Description (optionnel)" className="inp" value={caption} onChange={e=>setCaption(e.target.value)} style={{marginBottom:12}}/>
        <div onClick={()=>!uploading&&fileRef.current.click()} style={{background:uploading?"rgba(255,0,128,.3)":GRAD,color:WHITE,padding:"13px 0",borderRadius:12,textAlign:"center",fontWeight:900,fontSize:13,cursor:"pointer",opacity:uploading?.7:1}}>
          {uploading?"⏳ Upload en cours...":"📸 CHOISIR UNE PHOTO"}
        </div>
      </div>

      {/* Liste photos */}
      <div style={{fontSize:12,color:GRAY,fontWeight:700,marginBottom:10,letterSpacing:.5}}>{photos.length} PHOTO{photos.length!==1?"S":""}</div>
      {photos.map(p=>(
        <div key={p.id} style={{background:BG2,borderRadius:14,overflow:"hidden",marginBottom:10,border:`1px solid ${BORDER}`,display:"flex",alignItems:"stretch"}}>
          <img src={p.url} alt="" style={{width:70,height:70,objectFit:"cover",flexShrink:0}}/>
          <div style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontSize:13,fontWeight:800,color:WHITE,marginBottom:2}}>{p.event_name||"Sans titre"}</div>
            {p.caption&&<div style={{fontSize:11,color:GRAY}}>{p.caption}</div>}
            <div style={{fontSize:10,color:GRAY,marginTop:4}}>{new Date(p.created_at).toLocaleDateString("fr-CH")}</div>
          </div>
          <div onClick={()=>handleDelete(p.id)} style={{padding:"0 14px",display:"flex",alignItems:"center",cursor:"pointer",color:"#FF4444",fontSize:18}}>🗑</div>
        </div>
      ))}
      {photos.length===0&&<div style={{textAlign:"center",color:GRAY,fontSize:13,padding:20}}>Aucune photo ajoutée</div>}
    </div>
  );
}

function StripePayForm({amount,onSuccess}){
  const stripe=useStripe();
  const elements=useElements();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const pay=async()=>{
    if(!stripe||!elements) return;
    setLoading(true);setError(null);
    try{
      const r=await fetch("/api/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount})});
      const{clientSecret}=await r.json();
      const{error:se}=await stripe.confirmCardPayment(clientSecret,{payment_method:{card:elements.getElement(CardElement)}});
      if(se){setError(se.message);setLoading(false);}else{onSuccess();}
    }catch{setError("Erreur de paiement");setLoading(false);}
  };
  return(
    <div style={{marginTop:14}}>
      <div style={{background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,padding:"14px",marginBottom:14}}>
        <CardElement options={{hidePostalCode:true,style:{base:{fontSize:"16px",color:"#FFFFFF","::placeholder":{color:"#8892A0"}},invalid:{color:"#FF4444"}}}}/>
      </div>
      {error&&<div style={{color:"#FF4444",fontSize:12,marginBottom:10}}>{error}</div>}
      <div onClick={pay} style={{background:"linear-gradient(135deg,#FF0080,#FF3399)",color:"#FFFFFF",padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:"pointer",opacity:loading?0.7:1,textTransform:"uppercase"}}>
        {loading?"TRAITEMENT...":"PAYER CHF "+amount}
      </div>
    </div>
  );
}

function QRScanner({tickets,events,onClose}){
  return(
    <div style={{position:"absolute",inset:0,background:"#0D1117",zIndex:300,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,.9)",flexShrink:0,paddingTop:"calc(env(safe-area-inset-top,44px) + 14px)"}}>
        <span style={{fontSize:15,fontWeight:900,color:"#FFFFFF"}}>Scanner QR</span>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#FFFFFF",fontSize:18,cursor:"pointer",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>
        <div style={{fontSize:14,color:"#8892A0",marginBottom:16,textAlign:"center"}}>Sélectionne la soirée à scanner</div>
        {events.filter(e=>!e.ended).map(ev=>(
          <div key={ev.id} onClick={()=>window.open("/scanner.html?event_id="+ev.id+"&title="+encodeURIComponent(ev.title),"_blank")} style={{background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:16,padding:16,marginBottom:12,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            {ev.poster?<img src={ev.poster} alt="" style={{width:52,height:52,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<div style={{width:52,height:52,borderRadius:10,background:"#1C2430",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:24}}>🎵</span></div>}
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:800,color:"#FFFFFF"}}>{ev.title}</div>
              <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.date} • {tickets.filter(t=>t.eventId===ev.id).length} billets</div>
            </div>
            <div style={{fontSize:12,color:"#FF0080",fontWeight:700}}>SCANNER →</div>
          </div>
        ))}
      </div>
    </div>
  );
}




export default function App(){
  const [screen,setScreen]=useState("splash");
  const [tab,setTab]=useState("home");
  const [events,setEvents]=useState(initialEvents);
  const [tickets,setTickets]=useState(initialTickets);
  const [selEv,setSelEv]=useState(null);
  const [qty,setQty]=useState(1);
  const [qrTicket,setQrTicket]=useState(null);
  const [filter,setFilter]=useState("Tous");
  const [payStep,setPayStep]=useState(0);
  const [payMethod,setPayMethod]=useState("card");
  const [buyerInfo,setBuyerInfo]=useState({prenom:"",nom:"",email:"",tel:""});
  const [qtyAnim,setQtyAnim]=useState(false);
  const [adminAuth,setAdminAuth]=useState(false);
  const [adminPass,setAdminPass]=useState("");
  const [adminErr,setAdminErr]=useState("");
  const [adminTab,setAdminTab]=useState("dashboard");
  const [editEv,setEditEv]=useState(null);
  const [showEvForm,setShowEvForm]=useState(false);
  const [showFreeForm,setShowFreeForm]=useState(false);
  const [showScanner,setShowScanner]=useState(false);
  const [showGallery,setShowGallery]=useState(false);
  const [delConfirm,setDelConfirm]=useState(null);
  const [toast,setToast]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const tapsRef=useRef(0);
  const tapsTimer=useRef(null);
  const uploadRef=useRef(null);
  const fileRef=useRef();

  useEffect(()=>{
    Promise.all([dbLoadEvents(),dbLoadTickets()]).then(([evs,tix])=>{
      if(evs&&evs.length>0) setEvents(evs);
      if(tix&&tix.length>0) setTickets(tix);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    const sub=supabase.channel("nle").on("postgres_changes",{event:"*",schema:"public",table:"events"},()=>{
      dbLoadEvents().then(evs=>{if(evs&&evs.length>0)setEvents(evs);});
    }).subscribe();
    return()=>supabase.removeChannel(sub);
  },[]);

  useEffect(()=>{
    Promise.all([dbLoad(),dbLoadTix()]).then(([evs,tix])=>{
      if(evs&&evs.length>0) setEvents(evs);
      if(tix&&tix.length>0) setTickets(tix);
    }).catch(()=>{});
  },[]);
  useEffect(()=>{if(screen==="splash"){const t=setTimeout(()=>setScreen("main"),2500);return()=>clearTimeout(t);}},[screen]);

  const goMain=()=>{setSelEv(null);setPayStep(0);setScreen("main");};
  const openEv=(ev)=>{setSelEv(events.find(e=>e.id===ev.id));setQty(1);setScreen("event");};
  const changeQty=(d)=>{setQty(q=>Math.min(10,Math.max(1,q+d)));setQtyAnim(true);setTimeout(()=>setQtyAnim(false),300);};
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const navHandler=(t)=>{setTab(t);if(screen!=="main")setScreen("main");};

  const tapLogo=()=>{
    tapsRef.current+=1;
    if(tapsTimer.current) clearTimeout(tapsTimer.current);
    tapsTimer.current=setTimeout(()=>{tapsRef.current=0;},3000);
    if(tapsRef.current>=5){tapsRef.current=0;clearTimeout(tapsTimer.current);setScreen(adminAuth?"admin":"adminLogin");}
  };

  const handleUpload=(id)=>{uploadRef.current=id;fileRef.current.click();};
  const handleFile=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const id=typeof uploadRef.current==="number"?uploadRef.current:parseInt(uploadRef.current);
    showToast("⏳ Upload...");
    const url=await dbUploadPoster(file,id);
    if(url){
      await supabase.from("events").update({poster:url}).eq("id",id);
      setEvents(p=>p.map(ev=>ev.id===id?{...ev,poster:url}:ev));
      showToast("✅ Affiche sauvegardée !");
    } else showToast("❌ Erreur upload");
    e.target.value="";
  };

  const adminLogin=()=>{if(adminPass===ADMIN_PASS){setAdminAuth(true);setAdminErr("");setScreen("admin");}else setAdminErr("Mot de passe incorrect ❌");};

  const saveEventFn=async(ev)=>{
    showToast("⏳ Sauvegarde...");
    let poster=ev.poster||null;
    if(ev._file){
      const url=await dbUploadPoster(ev._file,ev.id||Date.now());
      if(url) poster=url;
    } else if(poster&&poster.startsWith("data:")){
      try{
        const res=await fetch(poster);
        const blob=await res.blob();
        const file=new File([blob],"poster.jpg",{type:"image/jpeg"});
        const url=await dbUploadPoster(file,ev.id||Date.now());
        if(url) poster=url;
      }catch{}
    }
    const clean={...ev,poster};
    delete clean._file;
    const newId=await dbSaveEvent(clean);
    const updated={...clean,id:newId||ev.id};
    setEvents(p=>p.find(e=>e.id===ev.id)?p.map(e=>e.id===ev.id?updated:e):[...p,updated]);
    setShowEvForm(false);setEditEv(null);setAdminTab("events");showToast("✅ Sauvegardé !");
  };

  const saveFreeTicketFn=async(t)=>{await dbSaveTicket(t);setTickets(p=>[...p,t]);setShowFreeForm(false);showToast("🎁 Billet créé !");};
  const deleteEventFn=async(id)=>{await dbDeleteEvent(id);setEvents(p=>p.filter(e=>e.id!==id));setDelConfirm(null);showToast("🗑️ Supprimé");};
  const toggleSoldOut=async(id)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const v=!ev.soldOut;await supabase.from("events").update({sold_out:v}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,soldOut:v}:e));showToast("✅ Mis à jour");};
  const toggleEnd=async(id)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const ending=!ev.ended;await supabase.from("events").update({ended:ending,sold_out:ending?true:ev.soldOut}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,ended:ending,soldOut:ending?true:e.soldOut}:e));showToast(ending?"✅ Terminée !":"✅ Réactivée !");};

  const addPaidTicket=async(buyerEmail="jean@example.ch",buyerName="Client")=>{
    if(!selEv) return;
    const newTickets=[];
    for(let i=0;i<qty;i++){
      await new Promise(r=>setTimeout(r,50));
      const id="NLE-"+Date.now().toString().slice(-6)+"-"+(i+1);
      const t={id,eventId:selEv.id,event:selEv.title,date:selEv.date.split(" ").slice(0,3).join(" "),location:selEv.location,time:selEv.time,owner:buyerName,email:buyerEmail,type:"paid",price:selEv.price,status:"valid",createdAt:new Date().toLocaleDateString("fr-CH")};
      await dbSaveTix(t);
      newTickets.push(t);
      try{await fetch("/api/send-ticket",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:buyerEmail,name:buyerName,eventTitle:selEv.title,eventDate:selEv.date,eventLocation:selEv.location,ticketId:id})});}catch{}
    }
    setTickets(p=>[...p,...newTickets]);
    await supabase.from("events").update({tickets_sold:selEv.ticketsSold+qty}).eq("id",selEv.id);
    setEvents(p=>p.map(e=>e.id===selEv.id?{...e,ticketsSold:e.ticketsSold+qty}:e));
  };

  const totalRev=events.reduce((s,e)=>s+e.ticketsSold*e.price,0);
  const totalSold=events.reduce((s,e)=>s+e.ticketsSold,0);
  const totalCap=events.reduce((s,e)=>s+e.capacity,0);
  const freeCount=tickets.filter(t=>t.type==="free").length;
  const myTickets=tickets.filter(t=>t.email==="jean@example.ch");
  const filters=["Tous","Hip-Hop","Electronic","Festival","VIP"];
  const mN2={"JANV":0,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DÉC":11};
  const getD=(ev)=>{const p=ev.date.split(" ");return new Date(parseInt(p[3]),mN2[p[2]]||0,parseInt(p[1]));};
  const filtered=events.filter(ev=>filter==="Tous"||ev.category===filter).sort((a,b)=>getD(b)-getD(a));
  const today2=new Date();
  const newestId=filtered.filter(e=>!e.ended).sort((a,b)=>{
    const parseD=(d)=>{const p=d.split(" ");if(p.length>=4)return new Date(p[3],["JANV","FÉV","MARS","AVRIL","MAI","JUIN","JUIL","AOÛT","SEPT","OCT","NOV","DÉC"].indexOf(p[2].toUpperCase()),parseInt(p[1]));if(p.length===3)return new Date(parseInt(p[2]),["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].indexOf(p[1].toLowerCase()),parseInt(p[0]));return new Date(0);};
    return parseD(a.date)-parseD(b.date);
  }).find(e=>{ const p=e.date.split(" ");let d;if(p.length>=4)d=new Date(p[3],["JANV","FÉV","MARS","AVRIL","MAI","JUIN","JUIL","AOÛT","SEPT","OCT","NOV","DÉC"].indexOf(p[2].toUpperCase()),parseInt(p[1]));else if(p.length===3)d=new Date(parseInt(p[2]),["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].indexOf(p[1].toLowerCase()),parseInt(p[0]));else d=new Date(0);return d>=today2;})?.id||filtered.filter(e=>!e.ended)[0]?.id;

  const IGBtn=()=>(
    <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,background:BG3,border:`1px solid ${BORDER}`,cursor:"pointer"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </div>
      <div><div style={{fontSize:13,fontWeight:800,color:WHITE}}>@nolimit_eventss</div><div style={{fontSize:11,color:GRAY}}>Instagram</div></div>
    </div>
  );

  return(
    <div style={{display:"flex",justifyContent:"center",background:BG,minHeight:"100vh",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        body,html{background:${BG};margin:0;padding:0}
        .phone{width:100%;max-width:430px;height:100vh;background:${BG};overflow:hidden;position:relative;}
        .sc{height:100%;display:flex;flex-direction:column;overflow:hidden;position:relative;}
        .scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;}
        .inp{width:100%;padding:12px 14px;background:${BG3};border:1.5px solid ${BORDER};border-radius:12px;color:${WHITE};font-size:14px;outline:none;font-family:inherit}
        .inp::placeholder{color:${GRAY}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rowSlide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes dotPop{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes pulse{0%,100%{filter:drop-shadow(0 0 6px rgba(255,0,128,.4))}50%{filter:drop-shadow(0 0 20px rgba(255,0,128,.9))}}
        @keyframes glow{0%,100%{opacity:.3}50%{opacity:.7}}
        @keyframes lightBeam{0%{transform:translateX(-100%) rotate(25deg);opacity:0}20%{opacity:.15}80%{opacity:.08}100%{transform:translateX(200%) rotate(25deg);opacity:0}}
        @keyframes lightBeam2{0%{transform:translateX(200%) rotate(-20deg);opacity:0}20%{opacity:.1}80%{opacity:.05}100%{transform:translateX(-100%) rotate(-20deg);opacity:0}}
        @keyframes particleFloat{0%{transform:translateY(0);opacity:.5}50%{transform:translateY(-25px);opacity:.2}100%{transform:translateY(0);opacity:.5}}
        @keyframes rainDrop{0%{transform:translateY(-20px);opacity:0}10%{opacity:.8}90%{opacity:.5}100%{transform:translateY(110vh);opacity:0}}
        @keyframes splashIn{0%{opacity:0;transform:scale(.5)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
        @keyframes loadBar{from{width:0}to{width:100%}}
        @keyframes qrFlip{from{transform:rotateY(90deg)}to{transform:rotateY(0)}}
        @keyframes confetti{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes qtyBounce{0%{transform:scale(1)}40%{transform:scale(1.4)}70%{transform:scale(.9)}100%{transform:scale(1)}}
        @keyframes toastIn{from{transform:translateX(-50%) translateY(40px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes menuSlide{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes menuSlideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="phone">

        {screen==="splash"&&(
          <div style={{height:"100%",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 40px"}}>
            <img src={ROSEBG} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.2)"}}/>
            {[...Array(25)].map((_,i)=><div key={i} style={{position:"absolute",left:`${(i*41)%100}%`,top:-20,width:i%5===0?2:1,height:`${20+((i*17)%55)}px`,background:"linear-gradient(180deg,transparent,rgba(255,255,255,.9),transparent)",borderRadius:2,animation:`rainDrop ${1.5+(i%4)*.6}s ${(i%8)*.45}s linear infinite`,zIndex:1}}/>)}
            <div style={{position:"relative",zIndex:2,marginBottom:60,animation:"splashIn .8s cubic-bezier(.34,1.56,.64,1) both"}}>
              <img src={LOGO} alt="" style={{width:"50vw",maxWidth:190,height:"50vw",maxHeight:190,objectFit:"contain",display:"block",filter:"drop-shadow(0 0 24px rgba(255,255,255,.6))",animation:"pulse 2s ease-in-out infinite"}}/>
            </div>
            <div style={{fontSize:12,color:WHITE,letterSpacing:4,textTransform:"uppercase",textAlign:"center",zIndex:2,fontWeight:800}}>LA SOIRÉE SANS LIMITES</div>
            <div style={{width:100,height:3,background:"rgba(255,255,255,.3)",borderRadius:10,marginTop:40,overflow:"hidden",zIndex:2}}>
              <div style={{height:"100%",background:WHITE,animation:"loadBar 2.3s ease forwards"}}/>
            </div>
          </div>
        )}

        {screen==="main"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
              <div style={{background:BG,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative"}}>
                  <div onClick={()=>setMenuOpen(true)} style={{width:34,height:34,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${BORDER}`,cursor:"pointer"}}><Icon n="menu" s={17} c={GRAY}/></div>
                  <div onClick={tapLogo} style={{position:"absolute",left:"50%",transform:"translateX(-50%)",cursor:"pointer"}}>
                    <div style={{position:"relative"}}>
                      <div style={{position:"absolute",inset:-8,borderRadius:"50%",background:`radial-gradient(circle,${PINK}20,transparent 70%)`,animation:"glow 3s ease-in-out infinite"}}/>
                      <img src={LOGO} alt="" style={{height:"clamp(34px,8vw,46px)",objectFit:"contain",display:"block",position:"relative",zIndex:1,filter:`drop-shadow(0 0 10px ${PINK}70)`,animation:"pulse 2s ease-in-out infinite"}}/>
                    </div>
                  </div>
                  <div onClick={()=>setNotifOpen(true)} style={{width:34,height:34,borderRadius:10,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${BORDER}`,cursor:"pointer",position:"relative"}}>
                    <Icon n="bell" s={15} c={GRAY}/>
                    <div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:PINK,border:`2px solid ${BG3}`}}/>
                  </div>
                </div>
                <div style={{display:"flex",padding:"0 20px"}}>
                  {["Événements","VIP"].map((t,i)=>(
                    <div key={t} onClick={()=>i===1&&setScreen("vip")} style={{flex:1,padding:"10px 0",textAlign:"center",fontWeight:800,fontSize:14,color:i===0?WHITE:GRAY,borderBottom:i===0?`3px solid ${PINK}`:"3px solid transparent",cursor:"pointer"}}>{t}</div>
                  ))}
                  <div onClick={()=>setScreen("vip")} style={{width:38,height:38,marginLeft:10,marginTop:2,background:GRAD,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><Icon n="star" s={17} c={WHITE} fill={WHITE}/></div>
                </div>
              </div>

              {tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                      {filters.map(f=><div key={f} onClick={()=>setFilter(f)} style={{padding:"8px 16px",borderRadius:20,background:filter===f?GRAD:BG3,color:filter===f?WHITE:GRAY,border:filter===f?"none":`1px solid ${BORDER}`,fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{f}</div>)}
                    </div>
                    <div style={{marginBottom:10}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>Soirées</div><div style={{fontSize:13,fontWeight:700,color:PINK}}>La Chaux-de-Fonds</div></div>
                  </div>
                  <div style={{flex:1,overflow:"hidden"}}>
                    {loading?(
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
                        <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${BG3}`,borderTop:`3px solid ${PINK}`,animation:"spin 1s linear infinite"}}/>
                        <div style={{fontSize:12,color:GRAY}}>Chargement...</div>
                      </div>
                    ):(
                      <div style={{display:"flex",overflowX:"auto",gap:16,padding:"4px 20px 16px",scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",height:"100%",alignItems:"flex-start"}}>
                        {filtered.map((ev,i)=>{
                          const isNew=ev.id===newestId&&!ev.ended;
                          return(
                            <div key={ev.id} onClick={()=>{if(!ev.soldOut&&!ev.ended)openEv(ev);}} style={{flexShrink:0,width:"72vw",maxWidth:290,scrollSnapAlign:"center",borderRadius:22,overflow:"hidden",background:BG2,border:isNew?`1.5px solid ${PINK}`:ev.ended?"1px solid rgba(255,255,255,.1)":`1px solid ${BORDER}`,cursor:ev.soldOut||ev.ended?"default":"pointer",animation:`slideIn .4s ${i*.1}s both`,boxShadow:isNew?`0 0 20px ${PINK}35,0 8px 30px rgba(0,0,0,.5)`:"0 8px 30px rgba(0,0,0,.4)",position:"relative",opacity:ev.ended?.7:1}}>
                              {isNew&&<div style={{position:"absolute",top:12,left:12,zIndex:10,background:GRAD,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20,animation:"pulse 2s ease-in-out infinite"}}>✨ NOUVEAU</div>}
                              {ev.ended&&<div style={{position:"absolute",top:12,left:12,zIndex:10,background:PINK,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20}}>TERMINÉE</div>}
                              <div style={{width:"100%",paddingTop:"125%",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${BG3},rgba(255,0,128,.08))`}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                                  :<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${BG3},rgba(255,0,128,.06))`}}/>}
                                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(13,17,23,.98) 100%)"}}/>
                                {ev.soldOut&&!ev.ended&&<SoldOut/>}
                                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px",zIndex:2}}>
                                  <div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap"}}>{ev.tags.slice(0,2).map(t=><Tag key={t}>{t}</Tag>)}</div>
                                  <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:3}}>{ev.title}</div>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",gap:5}}><Icon n="pin" s={10} c={GRAY}/>{ev.location}</div>
                                </div>
                              </div>
                              <div style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{fontSize:11,color:GRAY,display:"flex",alignItems:"center",gap:4}}><Icon n="calendar" s={11} c={GRAY}/>{ev.date}</div>
                                <div style={{fontSize:19,fontWeight:900,color:ev.ended?GRAY:PINK}}>{ev.ended?"TERMINÉE":`CHF ${ev.price}`}</div>
                              </div>
                            </div>
                          );
                        })}
                        <div style={{flexShrink:0,width:20}}/>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab==="tickets"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div style={{fontSize:22,fontWeight:900,color:WHITE}}>Mes Billets</div>
                    <div style={{background:"rgba(255,0,128,.1)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:PINK}}>{myTickets.length} billet{myTickets.length>1?"s":""}</div>
                  </div>
                  {myTickets.length===0?(
                    <div style={{textAlign:"center",padding:"60px 20px"}}>
                      <div style={{marginBottom:20,opacity:.3,display:"flex",justifyContent:"center"}}><Icon n="ticket" s={56} c={PINK}/></div>
                      <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:10}}>Aucun billet !</div>
                      <div style={{fontSize:13,color:GRAY,marginBottom:28}}>Achète ton premier billet pour voir ton QR code ici.</div>
                      <Btn onClick={()=>setTab("home")}>VOIR LES ÉVÉNEMENTS</Btn>
                    </div>
                  ):(myTickets.map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>))}
                  <div style={{height:20}}/>
                </div>
              )}

              {tab==="agenda"&&(
                <div className="scroll" style={{padding:"20px"}}>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:20}}>Agenda</div>
                  <CalendarWidget events={events}/>
                  <div style={{marginTop:20,marginBottom:12,fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>PROCHAINS ÉVÉNEMENTS</div>
                  {[...events].sort((a,b)=>{
    const mn={"janvier":0,"février":1,"mars":2,"avril":3,"mai":4,"juin":5,"juillet":6,"août":7,"septembre":8,"octobre":9,"novembre":10,"décembre":11,"JANV":0,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DÉC":11};
    const pd=(d)=>{const p=d.split(" ");if(p.length>=4)return new Date(parseInt(p[3]),mn[p[2].toUpperCase()]??0,parseInt(p[1]));if(p.length===3)return new Date(parseInt(p[2]),mn[p[1].toLowerCase()]??0,parseInt(p[0]));return new Date(0);};
    const now=new Date();
    const da=pd(a.date),db=pd(b.date);
    const fa=da>=now&&!a.ended,fb=db>=now&&!b.ended;
    if(fa&&!fb) return -1;if(!fa&&fb) return 1;
    return fa?da-db:db-da;
  }).map((ev,i)=>(
                    <div key={ev.id} onClick={()=>openEv(ev)} style={{background:BG2,borderRadius:16,padding:"14px 16px",marginBottom:10,border:`1px solid ${BORDER}`,display:"flex",gap:14,alignItems:"center",cursor:"pointer",animation:`rowSlide .4s ${i*.08}s both`}}>
                      {ev.poster?<img src={ev.poster} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
                        :<div style={{width:52,height:52,borderRadius:12,background:GRAD,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:9,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[0]}</span>
                          <span style={{fontSize:16,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[1]}</span>
                        </div>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                        <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.location} • {ev.date}</div>
                      </div>
                      <div style={{fontSize:15,fontWeight:900,color:PINK,flexShrink:0}}>CHF {ev.price}</div>
                    </div>
                  ))}
                  <div style={{height:20}}/>
                </div>
              )}

              <NavBar current={tab} onNav={navHandler}/>
            </div>
          </div>
        )}

        {screen==="signup"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
              <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14}}>
                  <button onClick={goMain} style={{background:"none",border:"none",color:PINK,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={PINK}/></button>
                  <div style={{fontSize:16,fontWeight:900,color:WHITE}}>S'inscrire</div>
                </div>
              </div>
              <div className="scroll" style={{padding:"20px"}}>
                <div style={{textAlign:"center",marginBottom:28}}>
                  <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",marginBottom:14,animation:"pulse 2s ease-in-out infinite"}}/>
                  <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:6}}>Rejoins No Limit Events 🎉</div>
                  <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Sois le premier informé des soirées et offres exclusives !</div>
                </div>
                <SignupForm onSuccess={()=>{showToast("🎉 Inscription réussie !");goMain();}}/>
                <div style={{height:16}}/>
                <IGBtn/>
                <div style={{height:30}}/>
              </div>
            </div>
          </div>
        )}

        {screen==="vip"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
              <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14}}>
                  <button onClick={goMain} style={{background:"none",border:"none",color:PINK,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={PINK}/></button>
                  <div style={{fontSize:16,fontWeight:900,color:WHITE}}>Tables VIP</div>
                </div>
              </div>
              <div className="scroll" style={{padding:"20px"}}>
                {[{name:"Silver",sub:"Duo VIP",emoji:"🥈",price:90,popular:false,perks:["Pour 2 personnes","Entrée VIP prioritaire","1 verre offert"]},
                  {name:"Gold",sub:"Le classique",emoji:"🥇",price:280,popular:true,perks:["Pour 5 personnes","1 bouteille incluse","Softs inclus","Entrée prioritaire"]},
                  {name:"Premium",sub:"Ultimate VIP",emoji:"💎",price:500,popular:false,perks:["Pour 10 personnes","2 bouteilles incluses","Softs & snacks","Entrée exclusive"]}
                ].map((pkg)=>(
                  <div key={pkg.name} style={{background:pkg.popular?`linear-gradient(135deg,${PINK}12,${BG2})`:BG2,borderRadius:20,marginBottom:14,border:pkg.popular?`1.5px solid ${PINK}`:`1px solid ${BORDER}`,overflow:"hidden"}}>
                    {pkg.popular&&<div style={{background:GRAD,padding:"6px 0",textAlign:"center",fontSize:11,fontWeight:900,color:WHITE}}>⭐ LE + DEMANDÉ</div>}
                    <div style={{padding:"18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:28}}>{pkg.emoji}</span>
                          <div><div style={{fontSize:20,fontWeight:900,color:WHITE}}>{pkg.name}</div><div style={{fontSize:12,color:GRAY}}>{pkg.sub}</div></div>
                        </div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:26,fontWeight:900,color:PINK}}>{pkg.price}</div><div style={{fontSize:11,color:GRAY}}>CHF</div></div>
                      </div>
                      {pkg.perks.map(p=>(
                        <div key={p} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <div style={{width:18,height:18,borderRadius:"50%",background:`${PINK}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="check" s={10} c={PINK}/></div>
                          <span style={{fontSize:13,color:GRAY}}>{p}</span>
                        </div>
                      ))}
                      <div onClick={()=>showToast("📷 Contacte @nolimit_eventss sur Instagram")} style={{background:pkg.popular?GRAD:"transparent",border:pkg.popular?"none":`1.5px solid ${PINK}`,borderRadius:14,padding:"13px 0",textAlign:"center",fontWeight:900,fontSize:14,color:pkg.popular?WHITE:PINK,cursor:"pointer",marginTop:14}}>
                        RÉSERVER — CHF {pkg.price}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{height:20}}/>
              </div>
            </div>
          </div>
        )}

        {screen==="adminLogin"&&(
          <div className="sc">
            <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,background:BG,paddingTop:SAFE_TOP}}>
              <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",marginBottom:20,animation:"pulse 2s ease-in-out infinite"}}/>
              <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:6}}>Espace Admin</div>
              <div style={{fontSize:13,color:GRAY,marginBottom:28,textAlign:"center"}}>Accès réservé</div>
              <input type="password" placeholder="Mot de passe" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adminLogin()} className="inp" style={{width:"100%",marginBottom:12,textAlign:"center",letterSpacing:4}}/>
              {adminErr&&<div style={{color:"#FF4444",fontWeight:700,fontSize:13,marginBottom:12}}>{adminErr}</div>}
              <Btn onClick={adminLogin}>SE CONNECTER</Btn>
              <div onClick={goMain} style={{marginTop:16,color:GRAY,fontSize:12,cursor:"pointer"}}>← Retour</div>
            </div>
          </div>
        )}

        {screen==="admin"&&adminAuth&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
              <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <img src={LOGO} alt="" style={{width:26,height:26,objectFit:"contain"}}/>
                    <span style={{fontSize:15,fontWeight:900,color:WHITE}}>Panel Admin</span>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div onClick={goMain} style={{padding:"6px 10px",borderRadius:10,background:BG3,color:GRAY,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:4}}><Icon n="home" s={12} c={GRAY}/> App</div>
                    <div onClick={()=>{setAdminAuth(false);setAdminPass("");goMain();}} style={{padding:"6px 10px",borderRadius:10,background:BG3,color:GRAY,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:4}}><Icon n="logout" s={12} c={GRAY}/> Déco</div>
                  </div>
                </div>
                <div style={{display:"flex",padding:"0 20px"}}>
                  {[["bar","Stats","dashboard"],["calendar","Soirées","events"],["gift","Gratuits","free"],["eye","Scanner","scanner"],["upload","Ajouter","add"]].map(([ico,label,t])=>(
                    <div key={t} onClick={()=>{setAdminTab(t);if(t==="add"){setEditEv({});setShowEvForm(true);}if(t==="free"){setShowFreeForm(true);}if(t==="scanner"){setShowScanner(true);}}} style={{flex:1,padding:"10px 0",textAlign:"center",borderBottom:adminTab===t?`3px solid ${t==="free"?GREEN:PINK}`:"3px solid transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <Icon n={ico} s={15} c={adminTab===t?(t==="free"?GREEN:PINK):GRAY}/>
                      <span style={{fontSize:8,fontWeight:800,color:adminTab===t?(t==="free"?GREEN:PINK):GRAY,letterSpacing:.5,textTransform:"uppercase"}}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="scroll" style={{padding:"16px 20px 20px"}}>
                {adminTab==="dashboard"&&(
                  <div>
                    <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>VUE D'ENSEMBLE</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[[<Icon n="dollar" s={20} c={PINK}/>,"Revenus",`CHF ${totalRev}`,"Total",PINK],
                        [<Icon n="ticket" s={20} c={PINK}/>,"Billets",totalSold,`/ ${totalCap}`,PINK],
                        [<Icon n="gift" s={20} c={GREEN}/>,"Gratuits",freeCount,"Staff",GREEN],
                        [<Icon n="bar" s={20} c={GREEN}/>,"Remplissage",`${Math.round(totalSold/Math.max(totalCap,1)*100)}%`,"Moy.",GREEN],
                      ].map(([icon,label,val,sub,color])=>(
                        <div key={label} style={{background:BG2,borderRadius:16,padding:"14px",border:`1px solid ${BORDER}`}}>
                          <div style={{marginBottom:6}}>{icon}</div>
                          <div style={{fontSize:19,fontWeight:900,color}}>{val}</div>
                          <div style={{fontSize:11,fontWeight:700,color:WHITE,marginTop:2}}>{label}</div>
                          <div style={{fontSize:10,color:GRAY,marginTop:2}}>{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {adminTab==="events"&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>SOIRÉES ({events.length})</div>
                      <div onClick={()=>{setEditEv({});setShowEvForm(true);}} style={{background:GRAD,color:WHITE,padding:"8px 14px",borderRadius:20,fontSize:11,fontWeight:900,cursor:"pointer"}}>+ NOUVEAU</div>
                    </div>
                    {events.map((ev,i)=><AdminEventRow key={ev.id} ev={ev} index={i} onEdit={(ev)=>{setEditEv(ev);setShowEvForm(true);}} onToggle={toggleSoldOut} onEnd={toggleEnd} onDelete={(id)=>setDelConfirm(id)} onUpload={handleUpload}/>)}
                  </div>
                )}
                {adminTab==="free"&&!showFreeForm&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>BILLETS GRATUITS</div>
                      <div onClick={()=>setShowFreeForm(true)} style={{background:`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"8px 14px",borderRadius:20,fontSize:11,fontWeight:900,cursor:"pointer"}}>+ CRÉER</div>
                    </div>
                    {tickets.filter(t=>t.type==="free").map((t)=>(
                      <div key={t.id} style={{background:BG2,borderRadius:16,overflow:"hidden",marginBottom:12,border:`1px solid ${GREEN}33`}}>
                        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:800,color:WHITE}}>{t.owner}</div>
                            <div style={{fontSize:11,color:GRAY}}>{t.event}</div>
                            {t.note&&<div style={{fontSize:10,color:GREEN}}>{t.note}</div>}
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <div onClick={()=>setQrTicket(t)} style={{background:`${GREEN}22`,color:GREEN,padding:"7px 12px",borderRadius:10,fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Icon n="eye" s={13} c={GREEN}/> QR</div>
                            <div onClick={()=>setTickets(p=>p.filter(x=>x.id!==t.id))} style={{background:"rgba(255,68,68,.1)",color:"#FF4444",padding:"7px 10px",borderRadius:10,cursor:"pointer"}}><Icon n="trash" s={13} c="#FF4444"/></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {showScanner&&<QRScanner tickets={tickets} events={events} onClose={()=>{setShowScanner(false);setAdminTab("dashboard");}}/> }
              {showEvForm&&editEv!==null&&<EventForm ev={editEv} onSave={saveEventFn} onCancel={()=>{setShowEvForm(false);setEditEv(null);setAdminTab("events");}}/>}
              {showFreeForm&&<FreeTicketForm events={events} onSave={saveFreeTicketFn} onCancel={()=>{setShowFreeForm(false);setAdminTab("free");}}/>}
              {delConfirm&&(
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:300}}>
                  <div style={{background:BG2,borderRadius:"24px 24px 0 0",padding:"24px 24px 40px",width:"100%",border:`1px solid ${BORDER}`}}>
                    <div style={{fontSize:16,fontWeight:900,color:WHITE,textAlign:"center",marginBottom:8}}>Supprimer la soirée ?</div>
                    <div style={{fontSize:13,color:GRAY,textAlign:"center",marginBottom:20}}>Cette action est irréversible.</div>
                    <div style={{display:"flex",gap:10}}>
                      <div onClick={()=>setDelConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:50,border:`1px solid ${BORDER}`,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",background:BG3}}>ANNULER</div>
                      <div onClick={()=>deleteEventFn(delConfirm)} style={{flex:1,padding:"14px 0",borderRadius:50,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {screen==="event"&&selEv&&(
          <div className="sc">
            <div className="scroll">
              <div style={{height:selEv.poster?280:160,position:"relative",overflow:"hidden",paddingTop:SAFE_TOP}}>
                {selEv.poster&&<img src={selEv.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
                <div style={{position:"absolute",inset:0,background:selEv.poster?"linear-gradient(180deg,rgba(13,17,23,.4),rgba(13,17,23,.95) 100%)":`linear-gradient(135deg,${BG3},rgba(255,0,128,.06))`}}/>
                <button onClick={goMain} style={{position:"absolute",top:`calc(${SAFE_TOP} + 10px)`,left:18,background:"rgba(13,17,23,.6)",border:"1px solid rgba(255,255,255,.15)",width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
                  <Icon n="back" s={16} c={WHITE}/>
                </button>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 20px",zIndex:2}}>
                  <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>{selEv.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
                  <div style={{fontSize:24,fontWeight:900,color:WHITE}}>{selEv.title}</div>
                </div>
              </div>
              <div style={{padding:"16px 20px 20px"}}>
                {[[<Icon n="calendar" s={18} c={PINK}/>,selEv.date,`${selEv.time} — Ouverture`],[<Icon n="pin" s={18} c={PINK}/>,selEv.location,selEv.city],[<Icon n="users" s={18} c={PINK}/>,"Âge : 16+","Pièce d'identité"]].map(([icon,l1,l2],i)=>(
                  <div key={i} style={{display:"flex",gap:14,background:BG2,padding:"13px 16px",borderRadius:14,marginBottom:10,border:`1px solid ${BORDER}`,alignItems:"center"}}>
                    {icon}<div><div style={{fontSize:14,color:WHITE,fontWeight:700}}>{l1}</div><div style={{fontSize:12,color:GRAY}}>{l2}</div></div>
                  </div>
                ))}
                <div style={{background:BG2,borderRadius:14,padding:"14px 16px",marginBottom:14,border:`1px solid ${BORDER}`}}>
                  <div style={{fontSize:10,color:PINK,fontWeight:900,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Line-up</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {selEv.lineup.map(dj=><span key={dj} style={{padding:"7px 14px",background:BG3,borderRadius:20,fontSize:12,fontWeight:800,color:WHITE,border:`1px solid ${BORDER}`}}>{dj}</span>)}
                  </div>
                </div>
                {!selEv.ended&&(
                  <div style={{background:BG2,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${BORDER}`}}>
                    <div style={{fontSize:10,color:PINK,fontWeight:900,letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>Nombre de billets</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:16,alignItems:"center"}}>
                        <button onClick={()=>changeQty(-1)} style={{width:38,height:38,borderRadius:"50%",border:`1px solid ${BORDER}`,background:BG3,color:WHITE,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{fontSize:32,fontWeight:900,color:WHITE,animation:qtyAnim?"qtyBounce .3s both":"none",minWidth:40,textAlign:"center"}}>{qty}</span>
                        <button onClick={()=>changeQty(1)} style={{width:38,height:38,borderRadius:"50%",border:"none",background:GRAD,color:WHITE,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:11,color:GRAY}}>TOTAL</div><div style={{fontSize:28,fontWeight:900,color:PINK}}>CHF {selEv.price*qty}</div></div>
                    </div>
                  </div>
                )}
                {!selEv.ended?<Btn onClick={()=>setScreen("payment")}>ACHETER DES BILLETS</Btn>
                  :<div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"14px 0",textAlign:"center",color:GRAY,fontWeight:800,fontSize:13}}>🔒 CETTE SOIRÉE EST TERMINÉE</div>}
                <div style={{height:10}}/>
                <Btn outline onClick={()=>setScreen("vip")}>RÉSERVER VIP 👑</Btn>
                <div style={{height:20}}/>
              </div>
            </div>
          </div>
        )}

        {screen==="payment"&&(
          <div className="sc">
            <div style={{padding:"10px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${BORDER}`,background:BG2,flexShrink:0,paddingTop:SAFE_TOP}}>
              <button onClick={()=>setScreen("event")} style={{background:"none",border:"none",color:PINK,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={PINK}/></button>
              <span style={{fontSize:16,fontWeight:900,color:WHITE}}>Paiement</span>
            </div>
            <div style={{display:"flex",gap:6,padding:"12px 20px",flexShrink:0}}>
              {["Infos","Paiement","Confirmation"].map((s,i)=>(
                <div key={s} style={{flex:1}}>
                  <div style={{height:3,borderRadius:2,background:BG3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:i<=payStep?"100%":"0%",background:GRAD,transition:"width .5s ease"}}/></div>
                  <div style={{fontSize:10,color:i<=payStep?PINK:GRAY,fontWeight:700}}>{s}</div>
                </div>
              ))}
            </div>
            <div className="scroll" style={{padding:"8px 20px 20px"}}>
              {payStep===0&&(
                <div>
                  <div style={{fontSize:15,fontWeight:900,color:WHITE,marginBottom:16}}>Vos informations</div>
                  {[["Prénom","Jean"],["Nom","Dupont"],["Email","jean@example.ch"],["Téléphone","+41 79 000 00 00"]].map(([l,ph])=>(
                    <div key={l} style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:PINK,fontWeight:900,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>{l}</div>
                      <input placeholder={ph} className="inp"/>
                    </div>
                  ))}
                  <div style={{background:BG2,borderRadius:14,padding:16,marginBottom:20,border:`1px solid ${BORDER}`,marginTop:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:WHITE,fontWeight:700,marginBottom:8}}><span>{selEv?.title} × {qty}</span><span>CHF {(selEv?.price||0)*qty}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY}}><span>Frais</span><span>CHF 2.90</span></div>
                    <div style={{borderTop:`1px solid ${BORDER}`,marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:14,fontWeight:900,color:WHITE}}>TOTAL</span>
                      <span style={{fontSize:20,fontWeight:900,color:PINK}}>CHF {(selEv?.price||0)*qty+2.90}</span>
                    </div>
                  </div>
                  <Btn onClick={()=>setPayStep(1)}>CONTINUER</Btn>
                </div>
              )}
              {payStep===1&&(
                <div>
                  <div style={{fontSize:15,fontWeight:900,color:WHITE,marginBottom:16}}>Moyen de paiement</div>
                  {[["card","💳","Carte de crédit"],["twint","📱","TWINT"],["bank","🏦","Virement bancaire"]].map(([key,icon,label])=>(
                    <div key={key} onClick={()=>setPayMethod(key)} style={{background:payMethod===key?"rgba(255,0,128,.07)":BG2,borderRadius:14,padding:16,marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:payMethod===key?`1.5px solid ${PINK}`:`1px solid ${BORDER}`}}>
                      <span style={{fontSize:22}}>{icon}</span>
                      <span style={{fontSize:14,color:WHITE,fontWeight:600,flex:1}}>{label}</span>
                      {payMethod===key&&<Icon n="check" s={18} c={PINK}/>}
                    </div>
                  ))}
                  {payMethod==="card"&&(
                    <div style={{marginTop:14}}>
                      <div style={{fontSize:10,color:PINK,fontWeight:900,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Numéro de carte</div>
                      <input placeholder="0000 0000 0000 0000" className="inp" style={{marginBottom:10}}/>
                      <div style={{display:"flex",gap:10}}>
                        <div style={{flex:1}}><div style={{fontSize:10,color:PINK,fontWeight:900,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Expiration</div><input placeholder="MM / AA" className="inp"/></div>
                        <div style={{flex:1}}><div style={{fontSize:10,color:PINK,fontWeight:900,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>CVV</div><input placeholder="•••" className="inp"/></div>
                      </div>
                    </div>
                  )}
                  <div style={{height:20}}/>
                  <Btn onClick={()=>{setPayStep(2);addPaidTicket();}}>PAYER CHF {(selEv?.price||0)*qty+2.90}</Btn>
                </div>
              )}
              {payStep===2&&(
                <div style={{textAlign:"center",paddingTop:10}}>
                  <div style={{animation:"confetti .6s both",display:"inline-block",marginBottom:16}}>
                    <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",animation:"pulse 2s ease-in-out infinite"}}/>
                  </div>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:6}}>Paiement réussi ! 🎉</div>
                  <div style={{fontSize:13,color:GRAY,marginBottom:24}}>Ton billet est dans <span style={{color:PINK,fontWeight:700}}>Billets</span> !</div>
                  <div style={{background:BG2,borderRadius:20,border:`1px solid ${BORDER}`,overflow:"hidden",marginBottom:20}}>
                    <div style={{background:GRAD,padding:"16px 20px"}}>
                      <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{selEv?.title}</div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,.7)",marginTop:2}}>{selEv?.date} • {selEv?.location}</div>
                    </div>
                    <div style={{padding:18,display:"flex",justifyContent:"center",animation:"qrFlip .6s .5s both"}}>
                      <QRCode id={`NLE-${Date.now().toString().slice(-6)}`} size={140}/>
                    </div>
                  </div>
                  <Btn onClick={()=>{setScreen("main");setSelEv(null);setPayStep(0);setTab("tickets");}}>VOIR MES BILLETS</Btn>
                </div>
              )}
            </div>
          </div>
        )}

        {notifOpen&&(
          <div style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,.6)"}} onClick={()=>setNotifOpen(false)}>
            <div style={{position:"absolute",top:0,right:0,bottom:0,width:"85%",maxWidth:340,background:BG2,borderLeft:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",paddingTop:SAFE_TOP,animation:"menuSlideRight .3s both"}} onClick={e=>e.stopPropagation()}>
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Icon n="bell" s={20} c={PINK}/><span style={{fontSize:16,fontWeight:900,color:WHITE}}>Notifications</span></div>
                <button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:22}}>×</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                <div style={{background:`linear-gradient(135deg,${PINK}15,${BG3})`,border:`1px solid ${PINK}44`,borderRadius:16,padding:"16px",marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:22}}>🔔</span>
                    <div><div style={{fontSize:14,fontWeight:900,color:WHITE}}>Activer les notifications</div><div style={{fontSize:11,color:GRAY}}>Sois le premier informé !</div></div>
                  </div>
                  <div onClick={()=>showToast("🔔 Notifications activées !")} style={{background:GRAD,color:WHITE,padding:"10px 0",borderRadius:12,textAlign:"center",fontWeight:900,fontSize:13,cursor:"pointer"}}>ACTIVER</div>
                </div>
                <div style={{fontSize:10,color:GRAY,fontWeight:900,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>SOIRÉES</div>
                {events.slice(0,3).map((ev,i)=>(
                  <div key={i} style={{background:i===0?"rgba(255,0,128,.06)":BG3,borderRadius:14,padding:"14px",marginBottom:10,border:i===0?`1px solid ${PINK}33`:`1px solid ${BORDER}`,display:"flex",gap:12}}>
                    <span style={{fontSize:22}}>🎉</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:800,color:WHITE}}>{ev.title}</div>
                      <div style={{fontSize:11,color:GRAY,marginTop:3}}>{ev.date} • CHF {ev.price}</div>
                    </div>
                  </div>
                ))}
                <div style={{height:16}}/>
                <IGBtn/>
                <div style={{height:30}}/>
              </div>
            </div>
          </div>
        )}

        {menuOpen&&(
          <div style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,.6)"}} onClick={()=>setMenuOpen(false)}>
            <div style={{position:"absolute",top:0,left:0,bottom:0,width:"80%",maxWidth:320,background:BG2,borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",paddingTop:SAFE_TOP,animation:"menuSlide .3s both"}} onClick={e=>e.stopPropagation()}>
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <img src={LOGO} alt="" style={{height:36,objectFit:"contain"}}/>
                <button onClick={()=>setMenuOpen(false)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:22}}>×</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
                <div onClick={()=>{setMenuOpen(false);setScreen("signup");}} style={{background:GRAD,borderRadius:16,padding:"16px 18px",marginBottom:20,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22}}>🎉</span>
                  <div><div style={{fontSize:15,fontWeight:900,color:WHITE}}>S'inscrire</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Rejoins la communauté</div></div>
                </div>
                <div style={{fontSize:10,color:GRAY,fontWeight:900,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>NAVIGATION</div>
                {[["home","Accueil",()=>{setTab("home");setMenuOpen(false);setScreen("main");}],
                  ["ticket","Mes Billets",()=>{setTab("tickets");setMenuOpen(false);setScreen("main");}],
                  ["image","Galerie",()=>{setTab("gallery");setMenuOpen(false);setScreen("main");}],
                  ["calendar","Agenda",()=>{setTab("agenda");setMenuOpen(false);setScreen("main");}],
                  ["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}]
                ].map(([ico,label,action])=>(
                  <div key={label} onClick={action} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${BORDER}`,cursor:"pointer"}}>
                    <Icon n={ico} s={20} c={PINK}/>
                    <span style={{fontSize:15,fontWeight:700,color:WHITE,flex:1}}>{label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
                <div style={{height:1,background:BORDER,margin:"20px 0"}}/>
                <IGBtn/>
                <div style={{height:1,background:BORDER,margin:"20px 0"}}/>
                <div style={{fontSize:11,color:GRAY,textAlign:"center"}}>No Limit Events © 2026</div>
                <div style={{fontSize:11,color:GRAY,textAlign:"center",marginTop:4}}>La Chaux-de-Fonds 🇨🇭</div>
              </div>
            </div>
          </div>
        )}

        {qrTicket&&<QRModal ticket={qrTicket} onClose={()=>setQrTicket(null)}/>}
        {toast&&<div style={{position:"absolute",bottom:90,left:"50%",background:GRAD,color:WHITE,padding:"10px 22px",borderRadius:30,fontSize:13,fontWeight:900,boxShadow:"0 4px 20px rgba(255,0,128,.4)",animation:"toastIn .4s both",whiteSpace:"nowrap",zIndex:400}}>{toast}</div>}
      </div>
    </div>
  );
}
