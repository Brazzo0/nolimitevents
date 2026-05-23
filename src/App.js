import { useState, useRef, useEffect } from "react";
import LOGO from "./logo.png";
import ROSEBG from "./rosefond.jpg";
import { createClient } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Stripe as StripeNative } from '@capacitor-community/stripe';
import { Capacitor } from '@capacitor/core';
const supabase=createClient("https://eypfrylitsaplkqpyxsh.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGZyeWxpdHNhcGxrcXB5eHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mzg3MTMsImV4cCI6MjA5MzQxNDcxM30.Mo5cYeMahhmNwwHQId4Jc26BVgCSGAGiWapRWIHOK8s");
const stripePromise=loadStripe("pk_live_51TTVaDFUXKzLhWzmPzssbExHX18VMOToe84YxYDRBSJOte5YQVUAYyyPs4abetTYlnf3FUZCRyST5jC7ZfQGLdWp00MVOLOkKj");

const BG="#0D1117",BG2="#141A22",BG3="#1C2430";
const PINK="#FF0080",PINK2="#FF3399",GREEN="#4ECDC4";
const WHITE="#FFFFFF",GRAY="#8892A0",BORDER="#1E2A38";
const ADMIN_PASS="nolimit2026";
const API_BASE="https://app.nolimitevents.ch";
const APP_VERSION="v2.6";
const GRAD=`linear-gradient(135deg,${PINK},${PINK2})`;
const SAFE_TOP="env(safe-area-inset-top, 20px)";
const SAFE_BOT="env(safe-area-inset-bottom, 8px)";
const normDate=(d)=>{if(!d)return"";const m=d.match(/^(\d{2})\.(\d{2})\.(\d{4})/);if(m)return`${m[3]}-${m[2]}-${m[1]}`;return d.slice(0,10);};
const withFees=(price)=>Math.round((price+0.30)/(1-0.015)*100)/100;
const feeAmount=(price)=>Math.round((withFees(price)-price)*100)/100;

const initialEvents=[];

const initialTickets=[];
const dbLoad=async()=>{
  try{const{data}=await supabase.from("events").select("*").order("created_at",{ascending:false});
  if(!data||!data.length) return null;
  return data.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time,location:e.location,city:e.city,price:e.price,category:e.category,poster:e.poster||null,tags:e.tags||[],lineup:e.lineup||[],soldOut:e.sold_out||false,ended:e.ended||false,ticketsSold:e.tickets_sold||0,capacity:e.capacity||200,published:e.published||false,phase1Price:e.phase1_price||0,phase2Price:e.phase2_price||0,phase3Price:e.phase3_price||0,activePhase:e.active_phase||1,phase1Capacity:e.phase1_capacity||0,phase2Capacity:e.phase2_capacity||0,phase3Capacity:e.phase3_capacity||0,phase1Sold:e.phase1_sold||0,phase2Sold:e.phase2_sold||0,phase3Sold:e.phase3_sold||0}));}catch{return null;}
};
const dbSave=async(ev)=>{
  try{const row={title:ev.title,date:ev.date,time:ev.time,location:ev.location,city:ev.city,price:ev.price,category:ev.category,poster:ev.poster||null,tags:ev.tags||[],lineup:ev.lineup||[],sold_out:ev.soldOut||false,ended:ev.ended||false,tickets_sold:ev.ticketsSold||0,capacity:ev.capacity||200,published:ev.published||false,phase1_price:ev.phase1Price||0,phase2_price:ev.phase2Price||0,phase3_price:ev.phase3Price||0,active_phase:ev.activePhase||1,phase1_capacity:ev.phase1Capacity||0,phase2_capacity:ev.phase2Capacity||0,phase3_capacity:ev.phase3Capacity||0,phase1_sold:ev.phase1Sold||0,phase2_sold:ev.phase2Sold||0,phase3_sold:ev.phase3Sold||0};
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
    return data.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time,location:e.location,city:e.city,price:e.price,category:e.category,poster:e.poster||null,tags:e.tags||[],lineup:e.lineup||[],soldOut:e.sold_out||false,ended:e.ended||false,ticketsSold:e.tickets_sold||0,capacity:e.capacity||200,published:e.published||false,phase1Price:e.phase1_price||0,phase2Price:e.phase2_price||0,phase3Price:e.phase3_price||0,activePhase:e.active_phase||1,phase1Capacity:e.phase1_capacity||0,phase2Capacity:e.phase2_capacity||0,phase3Capacity:e.phase3_capacity||0,phase1Sold:e.phase1_sold||0,phase2Sold:e.phase2_sold||0,phase3Sold:e.phase3_sold||0}));
  }catch{return null;}
};

const dbSaveEvent=async(ev)=>{
  try{
    const base={title:ev.title,date:ev.date,time:ev.time,location:ev.location,city:ev.city,price:ev.price,category:ev.category,poster:ev.poster||null,tags:ev.tags||[],lineup:ev.lineup||[],sold_out:ev.soldOut||false,ended:ev.ended||false,tickets_sold:ev.ticketsSold||0,capacity:ev.capacity||200,published:ev.published||false,phase1_price:ev.phase1Price||0,phase2_price:ev.phase2Price||0,phase3_price:ev.phase3Price||0,active_phase:ev.activePhase||1};
    let savedId=ev.id;
    if(ev.id&&Number.isInteger(ev.id)&&ev.id<2000000000){await supabase.from("events").update(base).eq("id",ev.id);}
    else{const{data}=await supabase.from("events").insert(base).select().single();savedId=data?.id||ev.id;}
    try{await supabase.from("events").update({phase1_capacity:ev.phase1Capacity||0,phase2_capacity:ev.phase2Capacity||0,phase3_capacity:ev.phase3Capacity||0,phase1_sold:ev.phase1Sold||0,phase2_sold:ev.phase2Sold||0,phase3_sold:ev.phase3Sold||0}).eq("id",savedId);}catch{}
    return savedId;
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
    return data.map(t=>({id:t.id,eventId:t.event_id,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note,createdAt:t.created_at,source:t.source||"app"}));
  }catch{return null;}
};

const dbSaveTicket=async(t)=>{
  try{
    const{data,error}=await supabase.from("tickets").insert({id:t.id,event_id:t.eventId,event:t.event,date:t.date,location:t.location,time:t.time,owner:t.owner,email:t.email,type:t.type,price:t.price,status:t.status,note:t.note||null,source:t.source||"app"}).select();
    if(error)return error.message;
    if(!data||data.length===0)return "Accès refusé (RLS Supabase) — connecte-toi d'abord";
    return null;
  }catch(e){return e.message||"Erreur inconnue";}
};

const dbDeleteTicket=async(id)=>{try{const{error}=await supabase.from("tickets").delete().eq("id",id);if(error)return error.message;return null;}catch(e){return e.message||"Erreur";}};


const dbSaveSignup=async(f)=>{
  try{await supabase.from("signups").upsert({prenom:f.prenom,nom:f.nom,email:f.email,tel:f.tel||null});}catch{}
};

const dbLoadMedia=async(eventId=null)=>{
  try{
    let q=supabase.from("event_media").select("*").order("position",{ascending:true}).order("created_at",{ascending:true});
    if(eventId!=null)q=q.eq("event_id",eventId);
    const{data}=await q;
    return data||[];
  }catch{return[];}
};
const dbSavePositions=async(list)=>{
  try{
    for(let i=0;i<list.length;i++){
      await supabase.from("event_media").update({position:i}).eq("id",list[i].id);
    }
  }catch{}
};
const dbUploadMedia=async(file,eventId=null)=>{
  try{
    const ext=(file.name||"media.jpg").split(".").pop()||"jpg";
    const isVideo=(file.type||"").startsWith("video");
    const fn=`media_${eventId||"about"}_${Date.now()}.${ext}`;
    const bucket=isVideo?"event-videos":"event-photos";
    const{error:storageErr}=await supabase.storage.from(bucket).upload(fn,file,{upsert:true,contentType:file.type||"image/jpeg"});
    if(storageErr){console.error("Storage error:",storageErr);return null;}
    const{data}=supabase.storage.from(bucket).getPublicUrl(fn);
    const url=data?.publicUrl||null;
    if(url){
      const{error:dbErr}=await supabase.from("event_media").insert({event_id:eventId||null,url,type:isVideo?"video":"photo"});
      if(dbErr){console.error("DB insert error:",dbErr);return "ERR:"+dbErr.message;}
    }
    return url;
  }catch(e){console.error("Upload exception:",e);return null;}
};
const dbDeleteMedia=async(id)=>{try{await supabase.from("event_media").delete().eq("id",id);}catch{}};

const dbLoadProfiles=async()=>{
  try{const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});return data||[];}catch{return[];}
};
const dbDeleteProfile=async(id)=>{try{await supabase.from("profiles").delete().eq("id",id);}catch{}};

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
    trophy:<svg {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
    search:<svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  };
  return icons[n]||null;
};

function LightBeams(){
  const p="M 30 -15 C 30 50,370 100,370 165 C 370 230,30 280,30 345 C 30 410,370 460,370 525 C 370 590,30 640,30 705 C 30 770,370 820,370 885 C 370 940,200 970,200 970";
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <style>{`
        @keyframes snakeMove{from{stroke-dashoffset:240}to{stroke-dashoffset:-2360}}
        @keyframes ambPulse{0%,100%{opacity:.4}50%{opacity:.8}}
      `}</style>

      {/* Halos d'ambiance */}
      <div style={{position:"absolute",top:-60,left:-60,width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,0,128,.13) 0%,transparent 70%)",animation:"ambPulse 7s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:-50,right:-50,width:210,height:210,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,255,.10) 0%,transparent 70%)",animation:"ambPulse 10s ease-in-out infinite 3.5s"}}/>

      {/* Serpent néon – 2 instances décalées pour effet continu */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 400 850" preserveAspectRatio="none">
        {/* Trace fantôme (fond glow large) */}
        {[0,4.4].map((delay,i)=>(
          <path key={"g"+i} d={p} fill="none" stroke="#FF0080" strokeWidth="12" strokeDasharray="220 2500" strokeLinecap="round" opacity="0.08"
            style={{animation:`snakeMove 8.8s ${delay}s linear infinite`}}
          />
        ))}
        {/* Corps principal du serpent */}
        {[0,4.4].map((delay,i)=>(
          <path key={"s"+i} d={p} fill="none" stroke="#FF0080" strokeWidth="2.5" strokeDasharray="220 2500" strokeLinecap="round" opacity="0.9"
            style={{animation:`snakeMove 8.8s ${delay}s linear infinite`,filter:"drop-shadow(0 0 6px #FF0080) drop-shadow(0 0 14px #FF008088)"}}
          />
        ))}
        {/* Tête lumineuse (point brillant) */}
        {[0,4.4].map((delay,i)=>(
          <path key={"h"+i} d={p} fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="18 2702" strokeLinecap="round" opacity="0.85"
            style={{animation:`snakeMove 8.8s ${delay}s linear infinite`,filter:"drop-shadow(0 0 4px #ffffff)"}}
          />
        ))}
      </svg>
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
  const isValid=ticket.status==="valid";
  const isUsed=ticket.status==="used";
  const isCancelled=ticket.status==="cancelled";
  const statusColor=isValid?"#00E676":isUsed?GRAY:"#FF4444";
  const statusLabel=isValid?"✓ VALIDE":isUsed?"UTILISÉ":"ANNULÉ";
  const delay=index*0.08;
  return(
    <div style={{borderRadius:24,overflow:"hidden",marginBottom:16,boxShadow:`0 8px 32px rgba(0,0,0,.4)`,animation:`slideUp .5s ${delay}s both`,position:"relative"}}>
      {/* Partie haute : affiche + infos */}
      <div style={{position:"relative",minHeight:120,background:"linear-gradient(135deg,#1C2430,#141A22)"}}>
        {ev?.poster&&<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.22}}/>}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(13,17,23,0) 0%,rgba(13,17,23,.85) 100%)"}}/>
        {/* Badge statut */}
        <div style={{position:"absolute",top:12,right:12,background:`${statusColor}18`,border:`1px solid ${statusColor}55`,color:statusColor,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20,letterSpacing:1,backdropFilter:"blur(6px)"}}>{statusLabel}</div>
        <div style={{position:"relative",zIndex:1,padding:"16px 16px 14px",display:"flex",gap:14,alignItems:"flex-end"}}>
          <div style={{width:64,height:78,borderRadius:14,overflow:"hidden",flexShrink:0,border:`1.5px solid rgba(255,255,255,.1)`,boxShadow:"0 4px 16px rgba(0,0,0,.5)"}}>
            {ev?.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#FF0080,#7B2FFF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🎉</div>}
          </div>
          <div style={{flex:1,paddingBottom:2}}>
            <div style={{fontSize:16,fontWeight:900,color:WHITE,lineHeight:1.2,marginBottom:5}}>{(ev&&ev.title)||ticket.event||"Soirée"}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>{(ev&&ev.date)||ticket.date||"—"}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>{(ev&&ev.location)||ticket.location||"Eden Night Club"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Séparateur ticket déchiré */}
      <div style={{position:"relative",height:20,background:BG2,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:-10,width:20,height:20,borderRadius:"50%",background:BG,zIndex:2}}/>
        <div style={{flex:1,marginLeft:16,marginRight:16,borderTop:`2px dashed rgba(255,255,255,.08)`}}/>
        <div style={{position:"absolute",right:-10,width:20,height:20,borderRadius:"50%",background:BG,zIndex:2}}/>
      </div>
      {/* Partie basse : ID + QR */}
      <div style={{background:BG2,padding:"12px 16px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:GRAY,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>ID Billet</div>
          <div style={{fontSize:11,fontWeight:800,color:PINK,fontFamily:"monospace",letterSpacing:.5,marginBottom:3}}>{ticket.id}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>{ticket.owner}</div>
          {ticket.price>0&&<div style={{fontSize:12,fontWeight:900,color:WHITE,marginTop:4}}>CHF {ticket.price}</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div onClick={()=>isValid&&onShowQR(ticket)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:isValid?"pointer":"default",opacity:isValid?1:.4,transition:"transform .15s",userSelect:"none"}}
            onMouseDown={e=>{if(isValid)e.currentTarget.style.transform="scale(.94)"}}
            onMouseUp={e=>{if(isValid)e.currentTarget.style.transform="scale(1)"}}>
            <div style={{width:58,height:58,borderRadius:16,background:isValid?"linear-gradient(135deg,#FF0080,#FF3399)":"rgba(255,255,255,.05)",border:isValid?"none":`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isValid?"0 4px 20px rgba(255,0,128,.4)":"none"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isValid?WHITE:GRAY} strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <line x1="14" y1="14" x2="14" y2="14"/><line x1="17" y1="14" x2="17" y2="14"/><line x1="20" y1="14" x2="20" y2="14"/>
                <line x1="14" y1="17" x2="14" y2="17"/><line x1="17" y1="17" x2="17" y2="17"/><line x1="20" y1="17" x2="20" y2="17"/>
                <line x1="14" y1="20" x2="14" y2="20"/><line x1="17" y1="20" x2="17" y2="20"/><line x1="20" y1="20" x2="20" y2="20"/>
              </svg>
            </div>
            <span style={{fontSize:9,fontWeight:900,color:isValid?PINK:GRAY,letterSpacing:1,textTransform:"uppercase"}}>QR CODE</span>
          </div>
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
  const [f,setF]=useState(ev.id?{...ev,lineup:Array.isArray(ev.lineup)?ev.lineup.join(", "):ev.lineup||"",tags:Array.isArray(ev.tags)?ev.tags.join(", "):ev.tags||""}:{title:"",date:"",time:"22:00",location:"Eden Night Club",city:"La Chaux-de-Fonds",price:"",phase1Price:"",phase2Price:"",phase3Price:"",activePhase:1,phase1Capacity:"",phase2Capacity:"",phase3Capacity:"",category:"",poster:null,tags:"",soldOut:false,ended:false,lineup:"",capacity:200,ticketsSold:0,published:false});
  const fRef=useRef();
  const upd=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.title||!f.date||!f.phase1Price) return;
    const p1=+f.phase1Price||0,p2=+f.phase2Price||0,p3=+f.phase3Price||0;
    const activeP=f.activePhase||1;
    const currentPrice=activeP===1?p1:activeP===2?p2:p3;
    onSave({...f,price:currentPrice,phase1Price:p1,phase2Price:p2,phase3Price:p3,activePhase:activeP,phase1Capacity:+f.phase1Capacity||0,phase2Capacity:+f.phase2Capacity||0,phase3Capacity:+f.phase3Capacity||0,capacity:+f.capacity||200,ticketsSold:+f.ticketsSold||0,lineup:(f.lineup||"").split(",").map(x=>x.trim()).filter(Boolean),tags:(f.tags||"").split(",").map(x=>x.trim()).filter(Boolean)});
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
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"16px 20px 30px"}}>
        <input ref={fRef} type="file" accept="image/*" style={{display:"none"}} onChange={pickPoster}/>
        <div onClick={()=>fRef.current.click()} style={{border:`2px dashed ${BORDER}`,borderRadius:16,padding:16,textAlign:"center",cursor:"pointer",background:BG2,marginBottom:16,minHeight:90,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {f.poster?<img src={f.poster} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10}}/>
            :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><Icon n="upload" s={28} c={PINK}/><div style={{fontSize:13,fontWeight:800,color:PINK}}>AJOUTER L'AFFICHE</div></div>}
        </div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Titre</label><input style={INP_S} placeholder="NO LIMIT PARTY #3" value={f.title||""} onChange={upd("title")}/></div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Date</label><input style={INP_S} placeholder="SAM 15 NOV 2026" value={f.date||""} onChange={upd("date")}/></div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <div style={{flex:1}}><label style={LBL_S}>Heure</label><input style={INP_S} placeholder="22:00" value={f.time||""} onChange={upd("time")}/></div>
          <div style={{flex:1}}><label style={LBL_S}>Capacité</label><input style={INP_S} type="number" placeholder="200" value={f.capacity||""} onChange={upd("capacity")}/></div>
        </div>
        <div style={{background:"rgba(255,0,128,.06)",border:"1px solid rgba(255,0,128,.2)",borderRadius:16,padding:"14px",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>🎟️ Prix par phase</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[{ph:1,label:"Early"},{ph:2,label:"Regular"},{ph:3,label:"Last"}].map(({ph,label})=>{
              const price=ph===1?+f.phase1Price||0:ph===2?+f.phase2Price||0:+f.phase3Price||0;
              const cap=ph===1?+f.phase1Capacity||0:ph===2?+f.phase2Capacity||0:+f.phase3Capacity||0;
              const isActive=f.activePhase===ph;
              return(
                <div key={ph} onClick={()=>setF(p=>({...p,activePhase:ph}))} style={{flex:1,padding:"10px 6px",borderRadius:12,textAlign:"center",cursor:"pointer",background:isActive?GRAD:"rgba(255,255,255,.05)",border:isActive?"none":"1px solid rgba(255,255,255,.1)"}}>
                  <div style={{fontSize:9,fontWeight:900,letterSpacing:1,color:isActive?WHITE:GRAY,marginBottom:4}}>PHASE {ph}</div>
                  <div style={{fontSize:13,fontWeight:900,color:isActive?WHITE:price?WHITE:GRAY}}>{price?`CHF ${price}`:"—"}</div>
                  <div style={{fontSize:9,color:isActive?"rgba(255,255,255,.7)":GRAY,marginTop:2}}>{cap?`${cap} billets`:"∞"}</div>
                </div>
              );
            })}
          </div>
          {[{ph:1,priceKey:"phase1Price",capKey:"phase1Capacity",label:"Early Bird"},{ph:2,priceKey:"phase2Price",capKey:"phase2Capacity",label:"Regular"},{ph:3,priceKey:"phase3Price",capKey:"phase3Capacity",label:"Last Call"}].filter(x=>x.ph===f.activePhase).map(({ph,priceKey,capKey,label})=>(
            <div key={ph}>
              <div style={{display:"flex",gap:10,marginBottom:0}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:GRAY,letterSpacing:1,marginBottom:6}}>PRIX CHF</div>
                  <input style={{...INP_S,marginBottom:0,border:"1.5px solid #FF0080"}} type="number" step="0.01" min="0" placeholder="Ex: 12.50" value={f[priceKey]||""} onChange={upd(priceKey)}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:GRAY,letterSpacing:1,marginBottom:6}}>NB BILLETS</div>
                  <input style={{...INP_S,marginBottom:0}} type="number" step="1" min="0" placeholder="Illimité" value={f[capKey]||""} onChange={upd(capKey)}/>
                </div>
              </div>
              <div style={{fontSize:10,color:GRAY,marginTop:10,textAlign:"center",opacity:.7}}>Phase {ph} · {label} · Laisse "Nb billets" vide = illimité</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Lieu</label><input style={INP_S} placeholder="Eden Night Club" value={f.location||""} onChange={upd("location")}/></div>
        <div style={{marginBottom:14}}><label style={LBL_S}>Ville</label><input style={INP_S} placeholder="La Chaux-de-Fonds" value={f.city||""} onChange={upd("city")}/></div>
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
  const [f,setF]=useState({eventId:"",ownerName:"",ownerEmail:"",note:"",quantity:1});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const [mailStatus,setMailStatus]=useState("");
  const upd=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const save=async()=>{
    if(!f.eventId||!f.ownerName||!f.ownerEmail){setErr("Remplis tous les champs obligatoires");return;}
    const ev=events.find(e=>e.id===+f.eventId);
    if(!ev){setErr("Événement introuvable");return;}
    const qty=Math.max(1,Math.min(20,parseInt(f.quantity)||1));
    setSaving(true);setErr("");setMailStatus("");
    const tickets=Array.from({length:qty},(_,i)=>({
      id:`NLE-FREE-${Date.now().toString().slice(-6)}-${i+1}`,
      eventId:+f.eventId,event:ev.title,date:ev.date.split(" ").slice(0,3).join(" "),
      location:ev.location,time:ev.time,owner:f.ownerName,email:f.ownerEmail,
      type:"free",price:0,status:"valid",createdAt:new Date().toLocaleDateString("fr-CH"),note:f.note
    }));
    for(const ticket of tickets){
      const dbErr=await onSave(ticket);
      if(dbErr){setErr("❌ Erreur sauvegarde : "+dbErr);setSaving(false);return;}
    }
    setMailStatus("📧 Billets sauvegardés, envoi du mail...");
    try{
      const resp=await fetch(`${API_BASE}/api/send-ticket`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:tickets[0].email,name:tickets[0].owner,eventTitle:tickets[0].event,eventDate:tickets[0].date,eventLocation:tickets[0].location,ticketId:tickets.map(t=>t.id).join(", "),quantity:qty})});
      if(resp.ok){setMailStatus(`✅ ${qty} billet${qty>1?"s":""} envoyé${qty>1?"s":""} à ${tickets[0].email} !`);}
      else{const d=await resp.json().catch(()=>({}));setMailStatus("⚠️ Billets OK mais mail échoué : "+(d.error||resp.status));}
    }catch(e){setMailStatus("⚠️ Billets OK, mail échoué (réseau) : "+e.message);}
    setSaving(false);
  };
  return(
    <div style={{position:"absolute",inset:0,background:BG,zIndex:200,display:"flex",flexDirection:"column",paddingTop:SAFE_TOP,animation:"slideIn .3s both"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`,background:BG2,flexShrink:0}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",display:"flex"}}><Icon n="back" s={22} c={GREEN}/></button>
        <span style={{fontSize:15,fontWeight:900,color:WHITE}}>Billet Gratuit</span>
        <div onClick={saving?null:save} style={{background:saving?"rgba(78,205,196,.3)":`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:900,cursor:saving?"default":"pointer",opacity:saving?.6:1}}>
          {saving?"...":"CRÉER"}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"20px"}}>
        {err&&<div style={{background:"rgba(255,68,68,.12)",border:"1px solid rgba(255,68,68,.4)",borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:13,fontWeight:700,color:"#FF4444"}}>{err}</div>}
        {mailStatus&&<div style={{background:mailStatus.startsWith("✅")?"rgba(78,205,196,.1)":"rgba(255,179,71,.1)",border:`1px solid ${mailStatus.startsWith("✅")?"rgba(78,205,196,.4)":"rgba(255,179,71,.4)"}`,borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:13,fontWeight:700,color:mailStatus.startsWith("✅")?GREEN:"#FFB347"}}>{mailStatus}</div>}
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
        <div style={{marginBottom:14}}>
          <label style={{...LBL_S,color:GREEN}}>Nombre de billets</label>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div onClick={()=>setF(p=>({...p,quantity:Math.max(1,parseInt(p.quantity||1)-1)}))} style={{width:40,height:40,borderRadius:10,background:"rgba(78,205,196,.15)",border:`1px solid ${GREEN}44`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,color:GREEN,fontWeight:900,flexShrink:0}}>−</div>
            <input style={{...INP_S,textAlign:"center",fontWeight:900,fontSize:18,color:GREEN,flex:1}} type="number" min="1" max="20" value={f.quantity} onChange={e=>setF(p=>({...p,quantity:Math.max(1,Math.min(20,parseInt(e.target.value)||1))}))}/>
            <div onClick={()=>setF(p=>({...p,quantity:Math.min(20,parseInt(p.quantity||1)+1)}))} style={{width:40,height:40,borderRadius:10,background:"rgba(78,205,196,.15)",border:`1px solid ${GREEN}44`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,color:GREEN,fontWeight:900,flexShrink:0}}>+</div>
          </div>
        </div>
        <div style={{marginBottom:20}}><label style={{...LBL_S,color:GREEN}}>Note</label><input style={INP_S} placeholder="DJ, Staff, Photo..." value={f.note} onChange={upd("note")}/></div>
        {!mailStatus.startsWith("✅")&&<div onClick={saving?null:save} style={{background:saving?"rgba(78,205,196,.2)":`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"16px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:saving?"default":"pointer",textTransform:"uppercase",opacity:saving?.6:1}}>{saving?"ENVOI EN COURS...":"CRÉER LE BILLET"}</div>}
        {mailStatus.startsWith("✅")&&<div onClick={onCancel} style={{background:`linear-gradient(135deg,${GREEN},#38B2AC)`,color:BG,padding:"16px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:"pointer",textTransform:"uppercase"}}>FERMER</div>}
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


function TicketsScreen({tickets,events,user,loading}){
  const [tab,setTab]=useState(0);
  const [qrTicket,setQrTicket]=useState(null);
  const tabs=[{label:"À venir",icon:"🗓️"},{label:"Passés",icon:"✓"},{label:"Tous",icon:"#"}];
  const now=new Date();
  const myTickets=user?tickets.filter(t=>t.email&&user.email&&t.email.toLowerCase()===user.email.toLowerCase()):[];
  const parseFrDate=(s)=>{if(!s)return null;const mn={"JANV":0,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DÉC":11,"janvier":0,"février":1,"mars":2,"avril":3,"mai":4,"juin":5,"juillet":6,"août":7,"septembre":8,"octobre":9,"novembre":10,"décembre":11};const p=s.split(" ");if(p.length>=4){const m=mn[p[2]];if(m!==undefined)return new Date(parseInt(p[3]),m,parseInt(p[1]));}if(p.length===3){const m=mn[p[1]];if(m!==undefined)return new Date(parseInt(p[2]),m,parseInt(p[0]));}return new Date(s);};
  const filtered=myTickets.filter(t=>{
    const ev=events.find(e=>e.id===t.eventId);
    const d=ev?parseFrDate(ev.date):null;
    if(tab===0)return t.status!=="cancelled"&&(!d||d>=now);
    if(tab===1)return t.status!=="cancelled"&&d&&d<now;
    return true;
  });
  const validCount=myTickets.filter(t=>t.status==="valid").length;
  if(loading)return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,background:BG}}>
      <div style={{position:"relative",width:56,height:56}}>
        <div style={{position:"absolute",inset:0,border:"2px solid rgba(255,0,128,.1)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",inset:0,border:"2px solid transparent",borderTopColor:PINK,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
        <div style={{position:"absolute",inset:8,border:"2px solid transparent",borderTopColor:"rgba(255,0,128,.4)",borderRadius:"50%",animation:"spin 1.2s linear infinite reverse"}}/>
      </div>
      <div style={{fontSize:13,color:GRAY,fontWeight:600}}>Chargement des billets...</div>
    </div>
  );
  if(!user)return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",gap:18,background:BG}}>
      <div style={{width:72,height:72,borderRadius:24,background:"rgba(255,0,128,.08)",border:`1px solid rgba(255,0,128,.2)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:8}}>Connexion requise</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Connecte-toi pour accéder à tes billets et les présenter à l'entrée.</div>
      </div>
    </div>
  );
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",overflowX:"hidden",background:BG}}>
      <style>{`
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* QR Modal inline */}
      {qrTicket&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:500,padding:24,animation:"slideUp .3s both"}} onClick={()=>setQrTicket(null)}>
          <div style={{background:BG2,borderRadius:28,padding:"28px 24px",width:"100%",maxWidth:340,textAlign:"center",border:`1px solid ${BORDER}`,boxShadow:"0 24px 64px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:52,height:52,borderRadius:16,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <img src={LOGO} alt="" style={{width:32,height:32,objectFit:"contain"}}/>
            </div>
            <div style={{fontSize:17,fontWeight:900,color:WHITE,marginBottom:4}}>{qrTicket.event}</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:16}}>{qrTicket.date} · {qrTicket.location}</div>
            {qrTicket.type==="free"&&<div style={{background:"rgba(78,205,196,.12)",border:`1px solid ${GREEN}44`,color:GREEN,fontSize:10,fontWeight:900,padding:"4px 14px",borderRadius:20,marginBottom:16,display:"inline-block"}}>BILLET GRATUIT</div>}
            <div style={{background:WHITE,padding:14,borderRadius:18,display:"inline-block",marginBottom:16}}>
              <QRCode id={qrTicket.id} size={170}/>
            </div>
            <div style={{fontSize:13,fontWeight:900,color:PINK,fontFamily:"monospace",marginBottom:4,letterSpacing:.5}}>{qrTicket.id}</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:20}}>{qrTicket.owner}</div>
            <div onClick={()=>setQrTicket(null)} style={{padding:"13px 0",borderRadius:14,background:"rgba(255,255,255,.06)",border:`1px solid ${BORDER}`,fontSize:13,fontWeight:900,color:WHITE,cursor:"pointer",letterSpacing:.5}}>FERMER</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{padding:`calc(env(safe-area-inset-top,44px) + 12px) 20px 0`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-40,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,0,128,.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>NolimitEvents</div>
            <div style={{fontSize:26,fontWeight:900,color:WHITE,lineHeight:1.1}}>Mes Billets</div>
          </div>
          {myTickets.length>0&&(
            <div style={{background:"rgba(255,0,128,.1)",border:"1px solid rgba(255,0,128,.3)",borderRadius:14,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:PINK}}>{myTickets.length}</div>
              <div style={{fontSize:9,color:GRAY,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>billet{myTickets.length>1?"s":""}</div>
            </div>
          )}
        </div>

        {/* Mini stats */}
        {myTickets.length>0&&(
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {[
              [validCount,"Valides","#00E676"],
              [myTickets.filter(t=>t.status==="used").length,"Utilisés",GRAY],
              [myTickets.filter(t=>t.type==="free").length,"Gratuits",GREEN],
            ].map(([n,l,c])=>(
              <div key={l} style={{flex:1,background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.06)`,borderRadius:14,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:900,color:c,marginBottom:2}}>{n}</div>
                <div style={{fontSize:9,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:.6}}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:0}}>
          {tabs.map((t,i)=>(
            <div key={t.label} onClick={()=>setTab(i)} style={{flex:1,padding:"9px 4px",borderRadius:14,border:`1px solid ${tab===i?"rgba(255,0,128,.4)":BORDER}`,background:tab===i?"rgba(255,0,128,.1)":"transparent",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
              <div style={{fontSize:12,fontWeight:800,color:tab===i?PINK:GRAY}}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div style={{padding:"16px 16px 100px"}}>
        {filtered.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",gap:14,animation:"fadeSlideUp .5s both"}}>
            <div style={{width:80,height:80,borderRadius:24,background:"rgba(255,255,255,.04)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
            </div>
            <div style={{fontSize:18,fontWeight:900,color:WHITE}}>Aucun billet</div>
            <div style={{fontSize:13,color:GRAY,textAlign:"center",lineHeight:1.6}}>
              {tab===0?"Aucun événement à venir. Achète tes billets !":tab===1?"Aucun événement passé.":"Tu n'as pas encore de billets."}
            </div>
          </div>
        ):(
          filtered.map((t,i)=>(
            <TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>
          ))
        )}
      </div>
    </div>
  );
}

function GroupsScreen({authUser,supabase}){
  const [groups,setGroups]=useState([]);
  const [loadingGroups,setLoadingGroups]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmoji,setNewEmoji]=useState("🔥");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(null);
  const [refCopied,setRefCopied]=useState(false);
  const [pseudoSearch,setPseudoSearch]=useState("");
  const [pseudoResults,setPseudoResults]=useState([]);
  const [searchLoading,setSearchLoading]=useState(false);
  const [inviteModal,setInviteModal]=useState(null);
  const [inviting,setInviting]=useState(false);
  const [refCode,setRefCode]=useState("");
  const EMOJIS=["🔥","👑","💎","⚡","🚀","🎯","🦁","🌙","🎉","💫","🏆","❤️"];
  const GROUP_COLORS=["linear-gradient(135deg,#FF0080,#FF3399)","linear-gradient(135deg,#7B2FFF,#9B59B6)","linear-gradient(135deg,#00C853,#4ECDC4)","linear-gradient(135deg,#FF6B35,#F7931E)","linear-gradient(135deg,#0099FF,#00D4FF)","linear-gradient(135deg,#FF0080,#7B2FFF)"];

  useEffect(()=>{
    if(!authUser)return;
    setLoadingGroups(true);
    const loadAll=async()=>{
      try{
        const[{data:profData},{data:memberData}]=await Promise.all([
          supabase.from("profiles").select("referral_code").eq("id",authUser.id).single(),
          supabase.from("group_members").select("group_id,groups(id,name,emoji,owner_id)").eq("user_id",authUser.id)
        ]);
        if(profData?.referral_code){
          setRefCode(profData.referral_code);
        }else{
          const code="NLE"+Math.random().toString(36).substring(2,8).toUpperCase();
          await supabase.from("profiles").update({referral_code:code}).eq("id",authUser.id);
          setRefCode(code);
        }
        if(memberData){
          const gs=memberData.map(d=>d.groups).filter(Boolean);
          const withCounts=await Promise.all(gs.map(async g=>{
            const{count}=await supabase.from("group_members").select("*",{count:"exact",head:true}).eq("group_id",g.id);
            return{...g,member_count:count||1};
          }));
          setGroups(withCounts);
        }
      }catch(e){}
      setLoadingGroups(false);
    };
    loadAll();
  },[authUser]);

  useEffect(()=>{
    if(!pseudoSearch.trim()||pseudoSearch.length<2){setPseudoResults([]);return;}
    setSearchLoading(true);
    const t=setTimeout(async()=>{
      const{data}=await supabase.from("profiles").select("id,pseudo").ilike("pseudo",`%${pseudoSearch}%`).neq("id",authUser?.id||"").limit(8);
      setPseudoResults(data||[]);
      setSearchLoading(false);
    },350);
    return()=>clearTimeout(t);
  },[pseudoSearch]);

  const inviteToGroup=async(profileId,groupId)=>{
    setInviting(true);
    const{error}=await supabase.from("group_members").insert({group_id:groupId,user_id:profileId,role:"member"});
    if(!error){setPseudoSearch("");setPseudoResults([]);setInviteModal(null);}
    setInviting(false);
  };


  const createGroup=async()=>{
    if(!newName.trim()||!authUser)return;
    setCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:newName.trim(),emoji:newEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGroups(p=>[...p,{...data,member_count:1}]);
      setNewName("");setNewEmoji("🔥");setShowCreate(false);
    }
    setCreating(false);
  };

  const copyText=(text,done)=>{
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>{const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.focus();el.select();try{document.execCommand("copy");}catch{}document.body.removeChild(el);done();});}
      else{const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.focus();el.select();try{document.execCommand("copy");}catch{}document.body.removeChild(el);done();}
    }catch{}
  };
  const copyRefLink=()=>{if(!refCode)return;copyText(refCode,()=>{setRefCopied(true);setTimeout(()=>setRefCopied(false),2500);});};
  const copyInvite=(g)=>{copyText("Code groupe : "+g.id,()=>{setCopied(g.id);setTimeout(()=>setCopied(null),2500);});};

  const getColor=(id)=>GROUP_COLORS[(id||0)%GROUP_COLORS.length];

  return(
    <div style={{position:"fixed",inset:0,background:BG,zIndex:100,display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:.5}50%{transform:translateY(-18px) scale(1.08);opacity:.25}100%{transform:translateY(0) scale(1);opacity:.5}}`}</style>

      {/* Header */}
      <div style={{flexShrink:0,paddingTop:"env(safe-area-inset-top,20px)",background:"linear-gradient(180deg,rgba(123,47,255,.18) 0%,transparent 100%)"}}>
        <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Mes Groupes</div>
            <div style={{fontSize:22,fontWeight:900,color:WHITE}}>{loadingGroups?"...":groups.length===0?"Aucun groupe":groups.length+" groupe"+(groups.length>1?"s":"")}</div>
          </div>
          <div onClick={()=>setShowCreate(true)} style={{width:46,height:46,borderRadius:14,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 18px rgba(255,0,128,.4)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"4px 16px 90px"}}>

        {/* Carte parrainage */}
        <div style={{background:"linear-gradient(135deg,rgba(123,47,255,.2),rgba(255,0,128,.15))",borderRadius:18,padding:"14px 16px",marginBottom:14,border:"1px solid rgba(123,47,255,.3)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{fontSize:20}}>🎁</div>
            <div>
              <div style={{fontSize:13,fontWeight:900,color:WHITE}}>Parraine un ami</div>
              <div style={{fontSize:11,color:GRAY}}>+50 points pour toi quand il s'inscrit</div>
            </div>
          </div>
          <div onClick={copyRefLink} style={{padding:"10px 14px",borderRadius:12,background:refCopied?"rgba(78,205,196,.15)":"rgba(255,255,255,.07)",border:refCopied?`1px solid ${GREEN}`:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",transition:"all .3s"}}>
            <div style={{fontSize:14,color:refCopied?GREEN:PINK,fontFamily:"monospace",fontWeight:900,letterSpacing:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{refCode||"Chargement..."}</div>
            <div style={{fontSize:11,fontWeight:800,color:refCopied?GREEN:PINK,flexShrink:0,marginLeft:8,display:"flex",alignItems:"center",gap:4}}>
              {refCopied?<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Copié!</>:<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copier</>}
            </div>
          </div>
        </div>

        {/* Recherche par pseudo */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,color:GRAY,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Trouver un ami par pseudo</div>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={14} c={GRAY}/></div>
            <input
              style={{width:"100%",padding:"11px 12px 11px 36px",background:BG2,border:`1.5px solid ${pseudoSearch?PINK:BORDER}`,borderRadius:14,color:WHITE,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color .2s"}}
              placeholder="Tape un pseudo..."
              value={pseudoSearch}
              onChange={e=>setPseudoSearch(e.target.value)}
            />
            {searchLoading&&<div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}><div style={{width:14,height:14,border:"2px solid rgba(255,0,128,.2)",borderTop:"2px solid #FF0080",borderRadius:"50%",animation:"spin .7s linear infinite"}}/></div>}
            {pseudoSearch&&!searchLoading&&<div onClick={()=>{setPseudoSearch("");setPseudoResults([]);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:GRAY,cursor:"pointer",fontSize:16}}>×</div>}
          </div>
          {pseudoResults.length>0&&(
            <div style={{background:BG2,borderRadius:14,border:`1px solid ${BORDER}`,marginTop:6,overflow:"hidden"}}>
              {pseudoResults.map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i<pseudoResults.length-1?`1px solid ${BORDER}`:"none"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:WHITE,flexShrink:0}}>
                    {(p.pseudo||"?")[0].toUpperCase()}
                  </div>
                  <div style={{flex:1,fontWeight:700,color:WHITE,fontSize:13}}>@{p.pseudo}</div>
                  {groups.length>0?(
                    <div onClick={()=>setInviteModal(p)} style={{padding:"7px 12px",background:"rgba(255,0,128,.15)",border:`1px solid rgba(255,0,128,.3)`,borderRadius:10,fontSize:11,fontWeight:800,color:PINK,cursor:"pointer"}}>Inviter</div>
                  ):(
                    <div style={{fontSize:10,color:GRAY}}>Crée un groupe d'abord</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {pseudoSearch.length>=2&&!searchLoading&&pseudoResults.length===0&&(
            <div style={{textAlign:"center",padding:"12px 0",fontSize:12,color:GRAY}}>Aucun pseudo trouvé</div>
          )}
        </div>

        {/* Groupes */}
        {loadingGroups?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 0"}}>
            <div style={{width:32,height:32,border:"3px solid rgba(255,0,128,.2)",borderTop:"3px solid #FF0080",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
          </div>
        ):groups.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px",gap:0}}>
            <div style={{position:"relative",width:160,height:130,marginBottom:20}}>
              {[["🔥",0,20,8],["👑",110,10,6.5],["💎",50,75,7],["⚡",130,70,5.5],["🚀",-10,60,6]].map(([e,x,y,s],i)=>(
                <div key={i} style={{position:"absolute",left:x,top:y,fontSize:s*4,animation:`floatUp ${2.2+i*.4}s ${i*.3}s ease-in-out infinite`,filter:"drop-shadow(0 4px 12px rgba(255,0,128,.3))"}}>{e}</div>
              ))}
            </div>
            <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:8,textAlign:"center"}}>Crée ton premier groupe</div>
            <div style={{fontSize:12,color:GRAY,lineHeight:1.7,textAlign:"center",marginBottom:22,maxWidth:260}}>Invite tes amis, synchronisez vos soirées et cumulez des points ensemble.</div>
            <div onClick={()=>setShowCreate(true)} style={{width:"100%",padding:"15px 0",borderRadius:16,background:GRAD,textAlign:"center",fontWeight:900,fontSize:14,color:WHITE,cursor:"pointer",boxShadow:"0 6px 24px rgba(255,0,128,.35)"}}>CRÉER UN GROUPE</div>
          </div>
        ):(
          <div style={{paddingTop:4}}>
            <div style={{fontSize:11,fontWeight:800,color:GRAY,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Mes groupes</div>
            {groups.map((g,i)=>(
              <div key={g.id} style={{borderRadius:20,marginBottom:12,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)",animation:`slideUp .4s ${i*.08}s both`}}>
                <div style={{height:4,background:getColor(g.id)}}/>
                <div style={{background:BG2,padding:"14px 16px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:52,height:52,borderRadius:16,background:getColor(g.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:"0 4px 14px rgba(0,0,0,.3)"}}>{g.emoji||"👥"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:800,color:WHITE,marginBottom:3}}>{g.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:GREEN}}/>
                      <div style={{fontSize:11,color:GRAY}}>{g.member_count||1} membre{(g.member_count||1)>1?"s":""}</div>
                    </div>
                  </div>
                  <div onClick={()=>copyInvite(g)} style={{padding:"9px 12px",background:copied===g.id?"rgba(78,205,196,.15)":GRAD,border:copied===g.id?`1px solid ${GREEN}`:"none",color:copied===g.id?GREEN:WHITE,borderRadius:12,fontSize:11,fontWeight:800,cursor:"pointer",transition:"all .3s",flexShrink:0,display:"flex",alignItems:"center",gap:5}}>
                    {copied===g.id?<><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Copié</>:<><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>Inviter</>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal inviter dans un groupe */}
      {inviteModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:350,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setInviteModal(null);}}>
          <div style={{width:"100%",background:BG2,borderRadius:"24px 24px 0 0",padding:"8px 20px 40px",animation:"slideUp .3s both",border:`1px solid ${BORDER}`,borderBottom:"none"}}>
            <div style={{width:36,height:4,background:BORDER,borderRadius:4,margin:"12px auto 16px"}}/>
            <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:4}}>Inviter @{inviteModal.pseudo}</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:16}}>Dans quel groupe ?</div>
            {groups.map(g=>(
              <div key={g.id} onClick={()=>!inviting&&inviteToGroup(inviteModal.id,g.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:BG3,borderRadius:14,marginBottom:8,cursor:"pointer",border:`1px solid ${BORDER}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:getColor(g.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{g.emoji||"👥"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:WHITE}}>{g.name}</div>
                  <div style={{fontSize:11,color:GRAY}}>{g.member_count||1} membre{(g.member_count||1)>1?"s":""}</div>
                </div>
                {inviting?<div style={{width:16,height:16,border:"2px solid rgba(255,0,128,.3)",borderTop:"2px solid #FF0080",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<Icon n="back" s={14} c={GRAY}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NavBar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:BG2,borderTop:`1px solid ${BORDER}`,paddingTop:8,paddingBottom:"env(safe-area-inset-bottom,8px)",display:"flex",zIndex:200}}>
        {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
          <div key={s} onClick={()=>{if(s==="agenda"){}else if(s==="events"){window.dispatchEvent(new CustomEvent("navigate",{detail:"events"}));}else if(s==="tickets"){window.dispatchEvent(new CustomEvent("navigate",{detail:"tickets"}));}else if(s==="profil"){window.dispatchEvent(new CustomEvent("navigate",{detail:"profil"}));}else{window.dispatchEvent(new CustomEvent("navigate",{detail:s}));}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
            <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:s==="agenda"?"rgba(255,0,128,.15)":"transparent"}}>
              <Icon n={ico} s={20} c={s==="agenda"?PINK:GRAY}/>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:s==="agenda"?PINK:GRAY}}>{label}</span>
            {s==="agenda"&&<div style={{width:16,height:2.5,borderRadius:2,background:GRAD}}/>}
          </div>
        ))}
      </div>

      {/* Modal créer groupe */}
      {showCreate&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:300,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget){setShowCreate(false);setNewName("");setNewEmoji("🔥");}}}>
          <div style={{width:"100%",background:BG2,borderRadius:"24px 24px 0 0",padding:"8px 20px 40px",animation:"slideUp .35s both",border:`1px solid ${BORDER}`,borderBottom:"none"}}>
            <div style={{width:36,height:4,background:BORDER,borderRadius:4,margin:"12px auto 20px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontSize:18,fontWeight:900,color:WHITE}}>Nouveau groupe</span>
              <div onClick={()=>{setShowCreate(false);setNewName("");setNewEmoji("🔥");}} style={{width:32,height:32,borderRadius:"50%",background:BG3,border:`1px solid ${BORDER}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
            </div>

            {/* Aperçu */}
            {newName.trim()&&(
              <div style={{background:BG3,borderRadius:16,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,border:`1px solid ${BORDER}`,animation:"slideUp .2s both"}}>
                <div style={{width:42,height:42,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{newEmoji}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:WHITE}}>{newName}</div>
                  <div style={{fontSize:11,color:GRAY}}>1 membre · Toi</div>
                </div>
              </div>
            )}

            {/* Choix emoji */}
            <div style={{fontSize:12,fontWeight:700,color:GRAY,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Icône du groupe</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
              {EMOJIS.map(e=>(
                <div key={e} onClick={()=>setNewEmoji(e)} style={{width:46,height:46,borderRadius:12,fontSize:22,background:newEmoji===e?"rgba(255,0,128,.18)":BG3,border:`2px solid ${newEmoji===e?PINK:"transparent"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",transform:newEmoji===e?"scale(1.1)":"scale(1)"}}>
                  {e}
                </div>
              ))}
            </div>

            {/* Nom */}
            <div style={{fontSize:12,fontWeight:700,color:GRAY,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Nom du groupe</div>
            <input
              style={{width:"100%",padding:"14px 16px",background:BG3,border:`1.5px solid ${newName.trim()?PINK:BORDER}`,borderRadius:14,color:WHITE,fontSize:15,outline:"none",boxSizing:"border-box",transition:"border-color .2s",fontFamily:"inherit"}}
              placeholder="Ex: La team Eden, Crew Nolimit..."
              value={newName}
              onChange={e=>setNewName(e.target.value)}
              maxLength={30}
              autoFocus
            />
            <div style={{textAlign:"right",fontSize:10,color:newName.length>25?"#FF4444":GRAY,marginTop:4,marginBottom:18}}>{newName.length}/30</div>

            {/* Bouton créer */}
            <div onClick={createGroup} style={{padding:"16px 0",borderRadius:16,background:newName.trim()&&!creating?GRAD:"rgba(255,255,255,.08)",color:newName.trim()&&!creating?WHITE:"rgba(255,255,255,.3)",textAlign:"center",fontWeight:900,fontSize:15,cursor:newName.trim()&&!creating?"pointer":"default",transition:"all .3s",boxShadow:newName.trim()&&!creating?"0 6px 20px rgba(255,0,128,.35)":"none",letterSpacing:.5}}>
              {creating?(
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <div style={{width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                  Création...
                </div>
              ):`CRÉER ${newEmoji} ${newName||"MON GROUPE"}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function NavBar({current,onNav,onProfil,onEvents,onTickets,onGroups}){
  const tabs=[
    ["home","Accueil","home"],
    ["events","Events","calendar"],
    ["tickets","Billets","ticket"],
    ["agenda","Groupes","users"],
    ["profil","Profil","users"]
  ];
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"linear-gradient(to top,rgba(13,17,23,1) 60%,transparent)",paddingBottom:"env(safe-area-inset-bottom,8px)",pointerEvents:"none"}}>
      <style>{`
        @keyframes navPop{0%{transform:scale(.85)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes navGlow{0%,100%{box-shadow:0 0 10px rgba(255,0,128,.2)}50%{box-shadow:0 0 22px rgba(255,0,128,.45)}}
      `}</style>
      <div style={{margin:"0 10px 10px",borderRadius:26,background:"rgba(14,19,27,.82)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",padding:"6px 4px",boxShadow:"0 -2px 0 rgba(255,255,255,.03) inset, 0 12px 40px rgba(0,0,0,.6)",pointerEvents:"auto"}}>
        {tabs.map(([s,label,ico])=>{
          const active=current===s;
          return(
            <div key={s} onClick={()=>{
              if(s==="profil"&&onProfil)onProfil();
              else if(s==="events"&&onEvents)onEvents();
              else if(s==="tickets"&&onTickets)onTickets();
              else if(s==="agenda"&&onGroups)onGroups();
              else onNav(s);
            }} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 2px",position:"relative"}}>
              {/* Pill indicator */}
              <div style={{width:active?44:32,height:32,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:active?"linear-gradient(135deg,rgba(255,0,128,.28),rgba(255,51,153,.15))":"transparent",border:active?"1px solid rgba(255,0,128,.3)":"1px solid transparent",transition:"all .3s cubic-bezier(.34,1.56,.64,1)",animation:active?"navGlow 2.5s ease-in-out infinite":"none",boxShadow:active?"0 0 14px rgba(255,0,128,.2)":"none"}}>
                <div style={{transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",transform:active?"scale(1.15)":"scale(1)"}}>
                  <Icon n={ico} s={active?20:18} c={active?PINK:GRAY}/>
                </div>
              </div>
              {/* Label */}
              <span style={{fontSize:9,fontWeight:active?800:600,color:active?PINK:GRAY,letterSpacing:active?.3:0,transition:"all .25s",whiteSpace:"nowrap"}}>{label}</span>
              {/* Dot */}
              {active&&<div style={{position:"absolute",bottom:0,width:4,height:4,borderRadius:"50%",background:PINK,boxShadow:`0 0 8px ${PINK}`}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminEventRow({ev,onEdit,onToggle,onDelete,onUpload,onEnd,onPublish,onPhase,index}){
  const pct=Math.round((ev.ticketsSold/ev.capacity)*100);
  return(
    <div style={{background:ev.ended?"rgba(255,255,255,.03)":BG2,borderRadius:18,marginBottom:12,overflow:"hidden",border:ev.ended?"1px solid rgba(255,255,255,.1)":`1px solid ${BORDER}`,opacity:ev.ended?.6:1}}>
      <div style={{display:"flex",gap:12,padding:"14px 16px",alignItems:"center"}}>
        {ev.poster?<img src={ev.poster} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
          :<div style={{width:52,height:52,borderRadius:12,background:BG3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="image" s={22} c={GRAY}/></div>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <div style={{fontSize:13,fontWeight:800,color:WHITE,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
            {!ev.published&&<div style={{background:"rgba(123,47,255,.2)",border:"1px solid rgba(123,47,255,.4)",borderRadius:8,padding:"2px 7px",fontSize:9,fontWeight:900,color:"#7B2FFF",letterSpacing:.5,flexShrink:0}}>BROUILLON</div>}
            {ev.published&&<div style={{background:"rgba(0,230,118,.12)",border:"1px solid rgba(0,230,118,.3)",borderRadius:8,padding:"2px 7px",fontSize:9,fontWeight:900,color:GREEN,letterSpacing:.5,flexShrink:0}}>PUBLIÉ</div>}
          </div>
          <div style={{fontSize:11,color:GRAY}}>{ev.date} • CHF {ev.price}</div>
          <div style={{height:4,background:BG3,borderRadius:4,overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${pct}%`,background:GRAD}}/></div>
          <div style={{fontSize:10,color:GRAY,marginTop:3}}>{ev.ticketsSold}/{ev.capacity} • {pct}%</div>
          {(ev.phase1Price||ev.phase2Price||ev.phase3Price)>0&&(
            <div style={{display:"flex",gap:4,marginTop:6}}>
              {[1,2,3].map(ph=>{const price=ph===1?ev.phase1Price:ph===2?ev.phase2Price:ev.phase3Price;const cap=ph===1?ev.phase1Capacity:ph===2?ev.phase2Capacity:ev.phase3Capacity;const sold=ph===1?ev.phase1Sold:ph===2?ev.phase2Sold:ev.phase3Sold;if(!price)return null;const full=cap>0&&sold>=cap;return(
                <div key={ph} onClick={()=>!full&&onPhase&&onPhase(ev.id,ph)} style={{padding:"3px 8px",borderRadius:8,fontSize:9,fontWeight:900,cursor:full?"default":"pointer",background:ev.activePhase===ph?"rgba(255,0,128,.25)":full?"rgba(255,68,68,.1)":"rgba(255,255,255,.06)",border:ev.activePhase===ph?"1px solid rgba(255,0,128,.5)":full?"1px solid rgba(255,68,68,.3)":"1px solid rgba(255,255,255,.1)",color:ev.activePhase===ph?PINK:full?"#FF4444":GRAY}}>
                  P{ph} CHF {price}{cap>0?` · ${sold}/${cap}`:""}{full?" 🔒":""}
                </div>
              );})}
            </div>
          )}
        </div>
      </div>
      <div style={{display:"flex",borderTop:`1px solid ${BORDER}`}}>
        {[
          [<Icon n="edit" s={13} c={GRAY}/>,"Modifier",()=>onEdit(ev),GRAY],
          [<Icon n="image" s={13} c={GRAY}/>,"Affiche",()=>onUpload(ev.id),GRAY],
          [ev.published?<Icon n="check" s={13} c={GREEN}/>:<Icon n="block" s={13} c="#7B2FFF"/>,ev.published?"Publié":"Publier",()=>onPublish(ev.id),ev.published?GREEN:"#7B2FFF"],
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

function NativePayButton({amount,clientSecret,onSuccess,pendingData}){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [applePayOk,setApplePayOk]=useState(false);
  useEffect(()=>{StripeNative.isApplePayAvailable().then(()=>setApplePayOk(true)).catch(()=>setApplePayOk(false));},[]);
  const savePending=()=>{if(pendingData)localStorage.setItem("nle_pending_ticket",JSON.stringify(pendingData));};
  const clearPending=()=>localStorage.removeItem("nle_pending_ticket");
  const payApple=async()=>{
    setLoading(true);setError(null);
    try{
      savePending();
      await StripeNative.createApplePay({
        paymentIntentClientSecret:clientSecret,
        paymentSummaryItems:[{label:"No Limit Events",amount:amount}],
        merchantIdentifier:"merchant.ch.nolimitevents.app",
        countryCode:"CH",
        currency:"chf",
      });
      const{paymentResult}=await StripeNative.presentApplePay();
      if(paymentResult==="applePayCompleted"){clearPending();onSuccess();}
      else{clearPending();setError("Paiement annulé");}
    }catch(e){clearPending();setError(e?.message||"Erreur Apple Pay");}
    setLoading(false);
  };
  const payCard=async()=>{
    setLoading(true);setError(null);
    try{
      savePending();
      await StripeNative.createPaymentSheet({
        paymentIntentClientSecret:clientSecret,
        merchantDisplayName:"No Limit Events",
        countryCode:"CH",
        currency:"chf",
        returnURL:"nolimitevents://",
      });
      const{paymentResult}=await StripeNative.presentPaymentSheet();
      if(paymentResult==="paymentSheetCompleted"){clearPending();onSuccess();}
      else{clearPending();setError("Paiement annulé");}
    }catch(e){clearPending();setError(e?.message||"Erreur de paiement");}
    setLoading(false);
  };
  return(
    <div style={{marginTop:14}}>
      {error&&<div style={{color:"#FF4444",fontSize:12,marginBottom:10}}>{error}</div>}
      {applePayOk&&(
        <div onClick={!loading?payApple:undefined} style={{background:"#000000",color:"#FFFFFF",padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:15,cursor:"pointer",opacity:loading?0.7:1,marginBottom:10,letterSpacing:1}}>
          {loading?"TRAITEMENT...":" Payer avec Apple Pay"}
        </div>
      )}
      <div onClick={!loading?payCard:undefined} style={{background:"linear-gradient(135deg,#FF0080,#FF3399)",color:"#FFFFFF",padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:14,cursor:"pointer",opacity:loading?0.7:1,textTransform:"uppercase"}}>
        {loading?"TRAITEMENT...":"PAYER PAR CARTE CHF "+amount}
      </div>
    </div>
  );
}

function StripePayForm({amount,onSuccess,pendingData}){
  const stripe=useStripe();
  const elements=useElements();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const pay=async()=>{
    if(!stripe||!elements) return;
    setLoading(true);setError(null);
    try{
      if(pendingData)localStorage.setItem("nle_pending_ticket",JSON.stringify(pendingData));
      const{error:se}=await stripe.confirmPayment({elements,confirmParams:{return_url:window.location.origin+"/"},redirect:"if_required"});
      if(se){localStorage.removeItem("nle_pending_ticket");setError(se.message);setLoading(false);}
      else{localStorage.removeItem("nle_pending_ticket");onSuccess();}
    }catch{localStorage.removeItem("nle_pending_ticket");setError("Erreur de paiement");setLoading(false);}
  };
  return(
    <div style={{marginTop:14}}>
      <div style={{background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,padding:"14px",marginBottom:14}}>
        <PaymentElement options={{layout:"tabs"}}/>
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
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:20}}>
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
  const [onbStep,setOnbStep]=useState(0);
  const [onbDone,setOnbDone]=useState(false);
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [loginEmail,setLoginEmail]=useState(localStorage.getItem("nle_saved_email")||"");
  const [loginPass,setLoginPass]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [regPrenom,setRegPrenom]=useState("");
  const [regNom,setRegNom]=useState("");
  const [regEmail,setRegEmail]=useState("");
  const [regPass,setRegPass]=useState("");
  const [regPassConfirm,setRegPassConfirm]=useState("");
  const [forgotScreen,setForgotScreen]=useState(false);
  const [forgotEmail,setForgotEmail]=useState("");
  const [forgotSent,setForgotSent]=useState(false);
  const [forgotErr,setForgotErr]=useState("");
  const [regRefCode,setRegRefCode]=useState("");
  const [regErr,setRegErr]=useState("");
  const [regDone,setRegDone]=useState(false);
  const [showEmailConfirm,setShowEmailConfirm]=useState(false);
  const [tab,setTab]=useState("home");
  const [events,setEvents]=useState(initialEvents);
  const [tickets,setTickets]=useState([]);
  const [selEv,setSelEv]=useState(null);
  const [qty,setQty]=useState(1);
  const [qrTicket,setQrTicket]=useState(null);
  const [filter,setFilter]=useState("Tous");
  const [search,setSearch]=useState("");
  const [payStep,setPayStep]=useState(0);
  const [payMethod,setPayMethod]=useState("card");
  const [buyerInfo,setBuyerInfo]=useState({prenom:"",nom:"",email:"",tel:""});
  const [payClientSecret,setPayClientSecret]=useState(null);
  const [twintSuccess,setTwintSuccess]=useState(false);
  const [qtyAnim,setQtyAnim]=useState(false);
  const [adminAuth,setAdminAuth]=useState(false);
  const [adminPass,setAdminPass]=useState("");
  const [adminErr,setAdminErr]=useState("");
  const [adminTab,setAdminTab]=useState("dashboard");
  const [chartPeriod,setChartPeriod]=useState(7);
  const [editEv,setEditEv]=useState(null);
  const [showEvForm,setShowEvForm]=useState(false);
  const [showFreeForm,setShowFreeForm]=useState(false);
  const [showScanner,setShowScanner]=useState(false);
  const [showGallery,setShowGallery]=useState(false);
  const [delConfirm,setDelConfirm]=useState(null);
  const [delTicketConfirm,setDelTicketConfirm]=useState(null);
  const [adminUsers,setAdminUsers]=useState([]);
  const [adminUsersLoading,setAdminUsersLoading]=useState(false);
  const [delUserConfirm,setDelUserConfirm]=useState(null);
  const [toast,setToast]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const [aboutMedia,setAboutMedia]=useState([]);
  const [profil,setProfil]=useState(null);
  const [profilEdit,setProfilEdit]=useState(false);
  const [profilPseudo,setProfilPseudo]=useState("");
  const [profilInsta,setProfilInsta]=useState("");
  const [profilSnap,setProfilSnap]=useState("");
  const [profilSaving,setProfilSaving]=useState(false);
  const [profilErr,setProfilErr]=useState("");
  const [notifOpen,setNotifOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [ticketsLoading,setTicketsLoading]=useState(false);
  const [setupPseudo,setSetupPseudo]=useState("");
  const [setupPseudoErr,setSetupPseudoErr]=useState("");
  const [setupPseudoSaving,setSetupPseudoSaving]=useState(false);
  const [evMedia,setEvMedia]=useState({});
  const [galleryEv,setGalleryEv]=useState(null);
  const [galleryIdx,setGalleryIdx]=useState(0);
  const [mediaUploading,setMediaUploading]=useState(false);
  const mediaFileRef=useRef();
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
    dbLoadMedia().then(items=>{
      const map={};
      items.forEach(m=>{
        const key=m.event_id||"about";
        if(!map[key])map[key]=[];
        map[key].push(m);
      });
      setEvMedia(map);
      setAboutMedia(map["about"]||[]);
    });
  },[]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const ref=p.get("ref");
    if(ref)localStorage.setItem("nle_ref",ref);
  },[]);

  useEffect(()=>{
    const h=window.location.hash;
    if(h&&(h.includes('type=signup')||h.includes('type=email_change'))){
      setShowEmailConfirm(true);
      window.history.replaceState(null,'',window.location.pathname);
    }
  },[]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const status=p.get("redirect_status");
    if(status==="succeeded"){
      const pending=JSON.parse(localStorage.getItem("nle_pending_ticket")||"null");
      if(pending){
        localStorage.removeItem("nle_pending_ticket");
        setTwintSuccess(true);
        (async()=>{
          const newTs=[];
          for(let i=0;i<(pending.qty||1);i++){
            await new Promise(r=>setTimeout(r,50));
            const id="NLE-"+Date.now().toString().slice(-6)+"-"+(i+1);
            const t={id,eventId:pending.eventId,event:pending.event,date:pending.date,location:pending.location,time:pending.time,owner:pending.buyerName,email:pending.buyerEmail,type:"paid",price:pending.unitPrice,status:"valid"};
            await dbSaveTix(t);newTs.push(t);
            try{await fetch(`${API_BASE}/api/send-ticket`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:pending.buyerEmail,name:pending.buyerName,eventTitle:pending.event,eventDate:pending.date,eventLocation:pending.location,ticketId:id})});}catch{}
          }
          setTickets(prev=>[...prev,...newTs]);
          try{
            const{data:evData}=await supabase.from("events").select("*").eq("id",pending.eventId).single();
            if(evData){
              const ap=evData.active_phase||1;
              const newSold=(evData.tickets_sold||0)+(pending.qty||1);
              const newPhaseSold=(evData[`phase${ap}_sold`]||0)+(pending.qty||1);
              const phaseCap=evData[`phase${ap}_capacity`]||0;
              await supabase.from("events").update({tickets_sold:newSold,[`phase${ap}_sold`]:newPhaseSold}).eq("id",pending.eventId);
              if(phaseCap>0&&newPhaseSold>=phaseCap&&ap<3){const np=ap+1;const npr=evData[`phase${np}_price`]||0;if(npr)await supabase.from("events").update({active_phase:np,price:npr}).eq("id",pending.eventId);}
            }
          }catch{}
        })();
      }
      window.history.replaceState(null,"",window.location.pathname);
    }
  },[]);

  useEffect(()=>{
    if(payStep!==1||!selEv)return;
    const hasD=(profil?.points||0)>=1000;
    const base=(selEv.price||0)*qty;
    const discounted=hasD?Math.round(base*0.7*100)/100:base;
    const amount=withFees(discounted);
    setPayClientSecret(null);
    fetch(`${API_BASE}/api/create-payment-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount})})
      .then(r=>r.json()).then(({clientSecret})=>{if(clientSecret)setPayClientSecret(clientSecret);}).catch(()=>{});
  },[payStep,selEv?.id,qty]);

  useEffect(()=>{
    if(screen==="main"&&twintSuccess){setTwintSuccess(false);showToast("✅ Paiement réussi ! Ton billet est dans Billets 🎟️",5000);setTab("tickets");}
  },[screen,twintSuccess]);

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
  useEffect(()=>{
    if(authUser){
      dbLoadTickets().then(tix=>{if(tix&&tix.length>0)setTickets(tix);});
    }
  },[authUser]);

  useEffect(()=>{
    if(screen==="tickets"&&authUser){
      setTicketsLoading(true);
      dbLoadTickets().then(tix=>{if(tix&&tix.length>0)setTickets(tix);setTicketsLoading(false);}).catch(()=>setTicketsLoading(false));
    }
  },[screen]);

  useEffect(()=>{
    if(!adminAuth)return;
    setAdminUsersLoading(true);
    dbLoadProfiles().then(u=>{setAdminUsers(u||[]);setAdminUsersLoading(false);});
  },[adminAuth]);

  useEffect(()=>{
    if(!adminAuth)return;
    if(adminTab==="users"){
      setAdminUsersLoading(true);
      dbLoadProfiles().then(u=>{setAdminUsers(u||[]);setAdminUsersLoading(false);});
    }
    if(adminTab==="free"||adminTab==="tickets"){
      dbLoadTickets().then(tix=>{if(tix&&tix.length>=0)setTickets(tix);});
    }
  },[adminTab,adminAuth]);

  useEffect(()=>{
    if(screen==="splash"&&!authLoading){
      const t=setTimeout(()=>{
        if(authUser){setScreen("setup-pseudo");}
        else if(localStorage.getItem("nle_onb")){setScreen("login");}
        else{setScreen("onboarding");}
      },2500);
      return()=>clearTimeout(t);
    }
  },[screen,authUser,authLoading]);

  const goMain=()=>{if(!authUser){setScreen("login");return;}setSelEv(null);setPayStep(0);setScreen("main");};

  useEffect(()=>{
    if(!authUser)return;
    const ch=supabase.channel(`kick:${authUser.id}`)
      .on('broadcast',{event:'kicked'},async()=>{
        await supabase.auth.signOut();
        setAuthUser(null);setProfil(null);
        setScreen("login");
        showToast("⛔ Ton compte a été supprimé.",6000);
      })
      .subscribe();
    return()=>supabase.removeChannel(ch);
  },[authUser]);

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        const{data:{user},error}=await supabase.auth.getUser();
        if(error||!user){
          await supabase.auth.signOut();
          setAuthUser(null);
        } else {
          setAuthUser(user);
        }
      } else {
        setAuthUser(null);
      }
      setAuthLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      setAuthUser(session?.user||null);
    });
    return()=>subscription.unsubscribe();
  },[]);
  const doLogin=async()=>{
    setLoginErr("");
    const{error}=await supabase.auth.signInWithPassword({email:loginEmail,password:loginPass});
    if(error){setLoginErr("Email ou mot de passe incorrect ❌");}
    else{localStorage.setItem("nle_saved_email",loginEmail);setLoginPass("");setScreen("setup-pseudo");}
  };
  const doRegister=async()=>{
    setRegErr("");
    if(!regPrenom||!regNom||!regEmail||!regPass||!regPassConfirm){setRegErr("Remplis tous les champs !");return;}
    if(regPass.length<6){setRegErr("Mot de passe trop court (6 min)");return;}
    if(regPass!==regPassConfirm){setRegErr("Les mots de passe ne correspondent pas ❌");return;}
    const{error}=await supabase.auth.signUp({email:regEmail,password:regPass,options:{data:{prenom:regPrenom,nom:regNom},emailRedirectTo:"https://app.nolimitevents.ch/confirm.html"}});
    if(error){setRegErr(error.message);}
    else{
      if(regRefCode.trim())localStorage.setItem("nle_pendingRef",regRefCode.trim().toUpperCase());
      setRegDone(true);
    }
  };
  const doLogout=async()=>{await supabase.auth.signOut();setAuthUser(null);setProfil(null);setScreen("login");};
  const doForgotPassword=async()=>{
    setForgotErr("");
    if(!forgotEmail){setForgotErr("Entre ton adresse email");return;}
    const{error}=await supabase.auth.resetPasswordForEmail(forgotEmail,{redirectTo:"https://app.nolimitevents.ch/reset-password.html"});
    if(error){setForgotErr(error.message);}
    else{setForgotSent(true);}
  };
  const loadProfil=async(uid,email)=>{
    const pendingRef=localStorage.getItem("nle_pendingRef");
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){
      if(!data.referral_code){
        const code="NLE"+Math.random().toString(36).substring(2,8).toUpperCase();
        await supabase.from("profiles").update({referral_code:code}).eq("id",uid);
        data.referral_code=code;
      }
      if(email&&!data.email){
        await supabase.rpc("save_user_email",{user_id:uid,user_email:email});
        data.email=email;
      }
      if(pendingRef){
        await supabase.rpc("award_referral_points",{referrer_code:pendingRef});
        localStorage.removeItem("nle_pendingRef");
      }
      setProfil(data);setProfilPseudo(data.pseudo||"");setProfilInsta(data.instagram||"");setProfilSnap(data.snapchat||"");
    }
    else{
      const code="NLE"+Math.random().toString(36).substring(2,8).toUpperCase();
      if(pendingRef){
        await supabase.rpc("award_referral_points",{referrer_code:pendingRef});
        localStorage.removeItem("nle_pendingRef");
      }
      await supabase.from("profiles").insert({id:uid,email:email||null,pseudo:null,instagram:"",snapchat:"",points:0,referral_code:code});
      setProfil({email:email||null,pseudo:"",instagram:"",snapchat:"",points:0,referral_code:code});
    }
  };
  const saveProfil=async()=>{
    if(!authUser)return;
    setProfilSaving(true);setProfilErr("");
    if(profilPseudo&&profilPseudo.length<3){setProfilErr("Pseudo trop court (3 min)");setProfilSaving(false);return;}
    const{error}=await supabase.from("profiles").update({pseudo:profilPseudo||null,instagram:profilInsta||"",snapchat:profilSnap||""}).eq("id",authUser.id);
    if(error){setProfilErr(error.code==="23505"?"Ce pseudo est déjà pris !":"Erreur : "+error.message);} else{setProfil(p=>({...p,pseudo:profilPseudo,instagram:profilInsta,snapchat:profilSnap}));setProfilEdit(false);}
    setProfilSaving(false);
  };
  const doSetupPseudo=async()=>{
    if(!setupPseudo||setupPseudo.length<3){setSetupPseudoErr("Pseudo trop court (3 min)");return;}
    setSetupPseudoSaving(true);setSetupPseudoErr("");
    const{error}=await supabase.from("profiles").update({pseudo:setupPseudo}).eq("id",authUser.id);
    if(error){
      if(error.code==="23505"){setSetupPseudoErr("Ce pseudo est déjà pris, essaies-en un autre !");}
      else{setSetupPseudoErr("Erreur : "+error.message);}
    } else{setProfil(p=>({...p,pseudo:setupPseudo}));setProfilPseudo(setupPseudo);setScreen("main");}
    setSetupPseudoSaving(false);
  };
  useEffect(()=>{if(screen==="setup-pseudo"&&profil&&profil.pseudo){setScreen("main");}  },[screen,profil]);
  useEffect(()=>{if(authUser)loadProfil(authUser.id,authUser.email);},[authUser]);
  useEffect(()=>{if(Capacitor.isNativePlatform()){StripeNative.initialize({publishableKey:"pk_live_51TTVaDFUXKzLhWzmPzssbExHX18VMOToe84YxYDRBSJOte5YQVUAYyyPs4abetTYlnf3FUZCRyST5jC7ZfQGLdWp00MVOLOkKj"}).catch(()=>{});}},[]);
  const openEv=(ev)=>{setSelEv(events.find(e=>e.id===ev.id));setQty(1);setScreen("event");};
  const changeQty=(d)=>{setQty(q=>Math.min(10,Math.max(1,q+d)));setQtyAnim(true);setTimeout(()=>setQtyAnim(false),300);};
  const showToast=(msg,dur=4000)=>{setToast(msg);setTimeout(()=>setToast(null),dur)};
  const navHandler=(t)=>{setTab(t);if(screen!=="main")setScreen("main");};
  useEffect(()=>{
    const handler=(e)=>{
      const dest=e.detail;
      if(dest==="events")setScreen("events");
      else if(dest==="tickets")setScreen("tickets");
      else if(dest==="profil")setScreen("profil");
      else if(dest==="groups")setScreen("groups");
      else{setTab(dest);setScreen("main");}
    };
    window.addEventListener("navigate",handler);
    return()=>window.removeEventListener("navigate",handler);
  },[]);

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

  const ADMIN_EMAILS=["info@nolimitevents.ch","alexandre.11ferreira@icloud.com"];
  const adminLogin=()=>{
    if(!authUser||!ADMIN_EMAILS.includes(authUser.email)){setAdminErr("Accès réservé — connecte-toi d'abord avec ton compte propriétaire.");return;}
    if(adminPass===ADMIN_PASS){setAdminAuth(true);setAdminErr("");setScreen("admin");}else setAdminErr("Mot de passe incorrect ❌");
  };

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

  const saveFreeTicketFn=async(t)=>{
    if(!authUser)return"Connecte-toi d'abord avec ton compte (email + mot de passe), puis reviens ici.";
    const dbErr=await dbSaveTicket(t);
    if(!dbErr)setTickets(p=>[...p,t]);
    return dbErr;
  };
  const deleteEventFn=async(id)=>{await dbDeleteEvent(id);setEvents(p=>p.filter(e=>e.id!==id));setDelConfirm(null);showToast("🗑️ Supprimé");};
  const deleteTicketFn=async(id)=>{const err=await dbDeleteTicket(id);if(err){showToast("❌ Erreur suppression : "+err,8000);setDelTicketConfirm(null);return;}setTickets(p=>p.filter(t=>t.id!==id));setDelTicketConfirm(null);showToast("🗑️ Billet supprimé");};
  const deleteUserFn=async(id)=>{
    try{
      const r=await fetch(`${API_BASE}/api/delete-user`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,adminKey:ADMIN_PASS})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"Erreur serveur");
      setAdminUsers(p=>p.filter(u=>u.id!==id));
      setDelUserConfirm(null);
      showToast("🗑️ Compte supprimé définitivement");
    }catch(e){
      showToast("❌ Erreur : "+e.message,8000);
      setDelUserConfirm(null);
    }
  };
  const toggleSoldOut=async(id)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const v=!ev.soldOut;await supabase.from("events").update({sold_out:v}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,soldOut:v}:e));showToast("✅ Mis à jour");};
  const switchPhase=async(id,phase)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const newPrice=phase===1?ev.phase1Price:phase===2?ev.phase2Price:ev.phase3Price;if(!newPrice){showToast("⚠️ Prix phase "+phase+" non défini");return;}await supabase.from("events").update({active_phase:phase,price:newPrice}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,activePhase:phase,price:newPrice}:e));showToast(`✅ Phase ${phase} activée – CHF ${newPrice}`);};
  const togglePublished=async(id)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const v=!ev.published;await supabase.from("events").update({published:v}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,published:v}:e));showToast(v?"✅ Soirée publiée !":"📝 Passée en brouillon");};
  const toggleEnd=async(id)=>{const ev=events.find(e=>e.id===id);if(!ev)return;const ending=!ev.ended;await supabase.from("events").update({ended:ending,sold_out:ending?true:ev.soldOut}).eq("id",id);setEvents(p=>p.map(e=>e.id===id?{...e,ended:ending,soldOut:ending?true:e.soldOut}:e));showToast(ending?"✅ Terminée !":"✅ Réactivée !");};

  const addPaidTicket=async(buyerEmail="jean@example.ch",buyerName="Client")=>{
    if(!selEv) return;
    const hasDisc=(profil?.points||0)>=1000;
    const unitPrice=hasDisc?Math.round(selEv.price*0.7*100)/100:selEv.price;
    const newTickets=[];
    for(let i=0;i<qty;i++){
      await new Promise(r=>setTimeout(r,50));
      const id="NLE-"+Date.now().toString().slice(-6)+"-"+(i+1);
      const t={id,eventId:selEv.id,event:selEv.title,date:selEv.date.split(" ").slice(0,3).join(" "),location:selEv.location,time:selEv.time,owner:buyerName,email:buyerEmail,type:"paid",price:unitPrice,status:"valid",createdAt:new Date().toLocaleDateString("fr-CH")};
      await dbSaveTix(t);
      newTickets.push(t);
      try{await fetch(`${API_BASE}/api/send-ticket`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:buyerEmail,name:buyerName,eventTitle:selEv.title,eventDate:selEv.date,eventLocation:selEv.location,ticketId:id})});}catch{}
    }
    setTickets(p=>[...p,...newTickets]);
    const newSold=selEv.ticketsSold+qty;
    const activePhase=selEv.activePhase||1;
    const phaseSoldKey=`phase${activePhase}Sold`;
    const phaseCapKey=`phase${activePhase}Capacity`;
    const newPhaseSold=(selEv[phaseSoldKey]||0)+qty;
    const phaseCap=selEv[phaseCapKey]||0;
    const phaseUpdate={tickets_sold:newSold,[`phase${activePhase}_sold`]:newPhaseSold};
    await supabase.from("events").update(phaseUpdate).eq("id",selEv.id);
    setEvents(p=>p.map(e=>e.id===selEv.id?{...e,ticketsSold:newSold,[phaseSoldKey]:newPhaseSold}:e));
    if(phaseCap>0&&newPhaseSold>=phaseCap&&activePhase<3){
      const nextPhase=activePhase+1;
      const nextPrice=nextPhase===2?selEv.phase2Price:selEv.phase3Price;
      if(nextPrice){await supabase.from("events").update({active_phase:nextPhase,price:nextPrice}).eq("id",selEv.id);setEvents(p=>p.map(e=>e.id===selEv.id?{...e,activePhase:nextPhase,price:nextPrice}:e));showToast(`🎟️ Phase ${nextPhase} activée automatiquement – CHF ${nextPrice}`);}
    }
    if(hasDisc&&authUser){
      const nd=Math.max(0,(profil.points||0)-1000);
      await supabase.from("profiles").update({points:nd}).eq("id",authUser.id);
      setProfil(p=>({...p,points:nd}));
    }
  };

  const totalRev=events.reduce((s,e)=>s+e.ticketsSold*e.price,0);
  const totalSold=events.reduce((s,e)=>s+e.ticketsSold,0);
  const totalCap=events.reduce((s,e)=>s+e.capacity,0);
  const freeCount=tickets.filter(t=>t.type==="free").length;
  const myTickets=authUser?tickets.filter(t=>t.email&&authUser.email&&t.email.toLowerCase()===authUser.email.toLowerCase()):[];
  const filters=["Tous","Hip-Hop","Electronic","Festival","VIP"];
  const mN2={"JANV":0,"FÉV":1,"MARS":2,"AVRIL":3,"MAI":4,"JUIN":5,"JUIL":6,"AOÛT":7,"SEPT":8,"OCT":9,"NOV":10,"DÉC":11};
  const getD=(ev)=>{const p=ev.date.split(" ");return new Date(parseInt(p[3]),mN2[p[2]]||0,parseInt(p[1]));};
  const filtered=events.filter(ev=>(filter==="Tous"||ev.category===filter)&&(search===""||ev.title.toLowerCase().includes(search.toLowerCase())||ev.location.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>getD(b)-getD(a));
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
    <div style={{display:"flex",justifyContent:"center",background:BG,width:"100vw",height:"100dvh",overflow:"hidden",position:"fixed",top:0,left:0,fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;touch-action:manipulation;min-width:0;}
        ::-webkit-scrollbar{display:none}
        body,html{background:${BG};margin:0;padding:0;overflow:hidden;height:100%;width:100%;max-width:100vw;position:fixed;}
        #root{width:100vw;height:100%;height:100dvh;overflow:hidden;position:relative;}
        .phone{width:100vw;max-width:430px;height:100%;height:100dvh;background:${BG};overflow:hidden;position:relative;}
        .sc{height:100%;display:flex;flex-direction:column;overflow:hidden;position:relative;}
        .scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;width:100%;touch-action:pan-y;}
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
          <div style={{height:"100%",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#000"}}>
            <style>{`
              @keyframes starBlink{0%,100%{opacity:.08}50%{opacity:.9}}
              @keyframes gridAppear{from{opacity:0}to{opacity:1}}
              @keyframes rayBurst{0%{opacity:0;transform:scaleY(0)}22%{opacity:.95}65%{opacity:.35}100%{opacity:0;transform:scaleY(1)}}
              @keyframes shockExpand{0%{transform:scale(.08);opacity:1}100%{transform:scale(8);opacity:0}}
              @keyframes logoExplode{0%{transform:scale(.05);opacity:0;filter:blur(30px) brightness(6)}55%{transform:scale(1.2);filter:blur(1px) brightness(1.5)}78%{transform:scale(.96)}100%{transform:scale(1);opacity:1;filter:blur(0) brightness(1)}}
              @keyframes splashLogoGlow{0%,100%{box-shadow:0 0 25px ${PINK}cc,0 0 55px ${PINK}66,0 0 90px ${PINK}22}50%{box-shadow:0 0 50px ${PINK},0 0 100px ${PINK}88,0 0 160px ${PINK}44}}
              @keyframes rRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
              @keyframes rRingR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
              @keyframes dotOrbit1{from{transform:rotate(0deg) translateX(72px) rotate(0deg)}to{transform:rotate(360deg) translateX(72px) rotate(-360deg)}}
              @keyframes dotOrbit2{from{transform:rotate(130deg) translateX(58px) rotate(-130deg)}to{transform:rotate(490deg) translateX(58px) rotate(-490deg)}}
              @keyframes dotOrbit3{from{transform:rotate(255deg) translateX(88px) rotate(-255deg)}to{transform:rotate(615deg) translateX(88px) rotate(-615deg)}}
              @keyframes splashTitleSweep{0%{clip-path:inset(0 100% 0 0);opacity:0}8%{opacity:1}100%{clip-path:inset(0 0% 0 0)}}
              @keyframes splashSubFade{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
              @keyframes splashBarGrow{0%{width:0}100%{width:100%}}
              @keyframes splashDotJump{0%,75%,100%{transform:translateY(0);opacity:.2}38%{transform:translateY(-9px);opacity:1}}
              @keyframes ambBreath{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.14)}}
              @keyframes vignette{from{opacity:0}to{opacity:1}}
            `}</style>

            {/* Fond void */}
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 46%,#0E0016 0%,#000 68%)"}}/>

            {/* Vignette coins */}
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,transparent 38%,rgba(0,0,0,.75) 100%)",animation:"vignette 1.5s ease both"}}/>

            {/* Grille */}
            <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,0,128,.042) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,128,.042) 1px,transparent 1px)`,backgroundSize:"46px 46px",animation:"gridAppear 2s ease both"}}/>

            {/* Étoiles */}
            {[...Array(68)].map((_,i)=>{
              const x=((i*23.7+11)%100).toFixed(1);
              const y=((i*15.3+7)%100).toFixed(1);
              const s=(((i*7)%3)*.7+.35).toFixed(1);
              const dur=((i*19)%20+15)/10;
              const del=((i*7)%22)/10;
              return <div key={i} style={{position:"absolute",left:x+"%",top:y+"%",width:+s,height:+s,borderRadius:"50%",background:"#fff",animation:`starBlink ${dur}s ${del}s ease-in-out infinite`}}/>;
            })}

            {/* Halo ambiant central */}
            <div style={{position:"absolute",top:"50%",left:"50%",width:520,height:520,borderRadius:"50%",background:`radial-gradient(circle,${PINK}1A 0%,#7B2FFF0D 40%,transparent 68%)`,filter:"blur(38px)",animation:"ambBreath 3.5s ease-in-out infinite"}}/>

            {/* Rayons d'énergie × 8 */}
            {[0,45,90,135,180,225,270,315].map((deg,i)=>(
              <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:0,height:0,transform:`rotate(${deg}deg)`}}>
                <div style={{position:"absolute",top:0,left:-1,width:2,height:230,transformOrigin:"50% 0%",background:`linear-gradient(to bottom,${PINK}EE,#7B2FFF55,transparent)`,animation:`rayBurst .7s ${.08+i*.025}s ease-out both`}}/>
              </div>
            ))}

            {/* Ondes de choc */}
            {[.2,.35,.5].map((del,i)=>(
              <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:90,height:90,marginLeft:-45,marginTop:-45,borderRadius:"50%",border:`${3-i}px solid rgba(255,0,128,${.9-i*.3})`,animation:`shockExpand 1s ${del}s cubic-bezier(0,.55,.5,1) both`}}/>
            ))}

            {/* Zone logo */}
            <div style={{position:"relative",zIndex:10}}>

              {/* Anneau extérieur pointillé */}
              <div style={{position:"absolute",top:"50%",left:"50%",marginTop:-76,marginLeft:-76,width:152,height:152,borderRadius:"50%",border:"1px dashed rgba(255,0,128,.16)",animation:"rRing 22s linear infinite"}}/>

              {/* Anneau intérieur */}
              <div style={{position:"absolute",top:"50%",left:"50%",marginTop:-65,marginLeft:-65,width:130,height:130,borderRadius:"50%",border:"1px solid rgba(123,47,255,.14)",animation:"rRingR 13s linear infinite"}}/>

              {/* Particule orbitale 1 – rose */}
              <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0,animation:"dotOrbit1 3s 1.2s linear infinite"}}>
                <div style={{position:"absolute",top:-5,left:-5,width:10,height:10,borderRadius:"50%",background:PINK,boxShadow:`0 0 14px ${PINK},0 0 28px ${PINK}99`}}/>
              </div>

              {/* Particule orbitale 2 – violet */}
              <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0,animation:"dotOrbit2 5s 1.2s linear infinite"}}>
                <div style={{position:"absolute",top:-4,left:-4,width:8,height:8,borderRadius:"50%",background:"#A78BFA",boxShadow:"0 0 12px #A78BFA,0 0 24px #A78BFA99"}}/>
              </div>

              {/* Particule orbitale 3 – cyan */}
              <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0,animation:"dotOrbit3 7s 1.2s linear infinite"}}>
                <div style={{position:"absolute",top:-3,left:-3,width:6,height:6,borderRadius:"50%",background:"#00E5FF",boxShadow:"0 0 10px #00E5FF,0 0 20px #00E5FF88"}}/>
              </div>

              {/* Cercle logo */}
              <div style={{width:112,height:112,borderRadius:"50%",background:"linear-gradient(135deg,rgba(255,0,128,.18),rgba(80,20,160,.12))",border:"1.5px solid rgba(255,0,128,.65)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",animation:"logoExplode .9s .28s cubic-bezier(.2,1.2,.4,1) both"}}>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",animation:"splashLogoGlow 2.8s 1.3s ease-in-out infinite"}}/>
                <img src={LOGO} alt="" style={{width:82,height:82,objectFit:"contain",filter:"drop-shadow(0 0 22px rgba(255,0,128,1)) drop-shadow(0 0 8px rgba(255,0,128,.6))",position:"relative",zIndex:1}}/>
              </div>
            </div>

            {/* Titre */}
            <div style={{position:"relative",zIndex:10,marginTop:46,textAlign:"center"}}>
              <div style={{fontSize:25,fontWeight:900,color:"#fff",letterSpacing:6,display:"inline-block",animation:"splashTitleSweep 1.1s 1.1s ease both",textShadow:`0 0 24px ${PINK},0 0 50px ${PINK}66`}}>NO LIMIT EVENTS</div>
              <div style={{fontSize:10,color:PINK,letterSpacing:7,textTransform:"uppercase",fontWeight:700,marginTop:12,animation:"splashSubFade .9s 1.85s ease both"}}>La soirée sans limites</div>
            </div>

            {/* Barre de progression */}
            <div style={{position:"relative",zIndex:10,marginTop:64,width:"55%",maxWidth:155}}>
              <div style={{height:1.5,background:"rgba(255,255,255,.06)",borderRadius:6,overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,height:"100%",borderRadius:6,background:`linear-gradient(90deg,#7B2FFF,${PINK})`,animation:`splashBarGrow 2.1s 1.4s cubic-bezier(.25,.46,.45,.94) both`,boxShadow:`0 0 10px ${PINK},0 0 20px ${PINK}66`}}/>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:24}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:5,height:5,borderRadius:"50%",background:PINK,animation:`splashDotJump 1.3s ${1.6+i*.18}s ease-in-out infinite`,boxShadow:`0 0 8px ${PINK}`}}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen==="main"&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",paddingBottom:"80px"}}>


              {tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div className="scroll" style={{padding:"0 0 20px"}}>
                    {/* ── HEADER ── */}
                    <div style={{padding:"env(safe-area-inset-top,44px) 18px 0",paddingTop:`calc(env(safe-area-inset-top,44px) + 10px)`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <img src={LOGO} alt="" onClick={tapLogo} style={{width:46,height:46,objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(255,0,128,.7))",animation:"pulse 2s ease-in-out infinite",cursor:"pointer"}}/>
                          <div>
                            <div style={{fontSize:11,color:GRAY,fontWeight:600}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon après-midi":"Bonsoir"} {authUser?.user_metadata?.prenom||"No Limiter"} 👋</div>
                            <div style={{fontSize:18,fontWeight:900,color:WHITE,lineHeight:1.1}}>No Limit Events</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <div onClick={()=>setNotifOpen(true)} style={{width:38,height:38,borderRadius:13,background:"rgba(255,0,128,.1)",border:"1px solid rgba(255,0,128,.25)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",boxShadow:"0 0 14px rgba(255,0,128,.15)"}}>
                            <Icon n="bell" s={17} c={PINK}/>
                            <div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:PINK,boxShadow:`0 0 8px ${PINK}`,animation:"liveDot 1.5s ease-in-out infinite"}}/>
                          </div>
                        </div>
                      </div>

                      {/* Barre de recherche */}
                      <div style={{position:"relative",marginBottom:16}}>
                        <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}><Icon n="search" s={14} c={GRAY}/></div>
                        <input type="text" placeholder="Rechercher une soirée..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"11px 14px 11px 38px",background:BG2,border:`1px solid ${search?PINK:BORDER}`,borderRadius:14,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}/>
                        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:WHITE,fontSize:12}}>×</div>}
                      </div>

                      {/* Actions rapides */}
                      <div style={{display:"flex",gap:10,marginBottom:6}}>
                        {[
                          [<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>,"Billets",()=>setScreen("tickets"),PINK],
                          [<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,"VIP",()=>setScreen("vip"),"#FFD700"],
                          [<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,"Groupes",()=>setScreen("groups"),"#4ECDC4"],
                          [<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B6CF6" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,"À propos",()=>setScreen("about"),"#7B6CF6"],
                        ].map(([icon,label,action,color])=>(
                          <div key={label} onClick={action} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
                            <div style={{width:52,height:52,borderRadius:16,background:`${color}14`,border:`1.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .15s"}}
                              onMouseDown={e=>e.currentTarget.style.transform="scale(.92)"}
                              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{icon}</div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.65)",textAlign:"center",letterSpacing:.3}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── À PROPOS teaser ── */}
                    <div style={{margin:"0 16px 18px",animation:"slideUp .35s both"}}>
                      <div onClick={()=>setScreen("about")} style={{borderRadius:20,overflow:"hidden",position:"relative",cursor:"pointer",background:"linear-gradient(135deg,rgba(123,47,255,.15),rgba(255,0,128,.08))",border:"1px solid rgba(123,47,255,.25)"}}>
                        <div style={{padding:"18px 18px 16px",display:"flex",alignItems:"center",gap:14}}>
                          <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#7B2FFF,#FF0080)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 16px rgba(123,47,255,.4)"}}>
                            <img src={LOGO} alt="" style={{width:34,height:34,objectFit:"contain"}}/>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:900,color:WHITE,marginBottom:4}}>No Limit Events</div>
                            <div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.5}}>La soirée sans limites · La Chaux-de-Fonds</div>
                          </div>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                        <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,.06)"}}>
                          {[["🎉","Soirées",events.filter(e=>e.published).length],["🎟️","À venir",events.filter(e=>!e.ended&&e.published).length],["📸","Photos",Object.values(evMedia).flat().filter(m=>m.type==="photo").length]].map(([ico,label,val])=>(
                            <div key={label} style={{flex:1,textAlign:"center",padding:"10px 4px",borderRight:"1px solid rgba(255,255,255,.04)"}}>
                              <div style={{fontSize:9,marginBottom:3}}>{ico}</div>
                              <div style={{fontSize:16,fontWeight:900,color:WHITE}}>{val}</div>
                              <div style={{fontSize:8,color:GRAY,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Niveau fidélité */}
                    {authUser&&(()=>{
                      const pts=profil?.points||0;
                      const tier=pts>=1000?{n:"Or",c:"#FFD700",bg:"rgba(255,215,0,.08)",grad:"linear-gradient(90deg,#FFD700,#FFA500)",next:1000,icon:"🏆"}:pts>=500?{n:"Argent",c:"#C0C0C0",bg:"rgba(192,192,192,.08)",grad:"linear-gradient(90deg,#C0C0C0,#A8A8A8)",next:1000,icon:"🥈"}:{n:"Bronze",c:"#CD7F32",bg:"rgba(205,127,50,.08)",grad:"linear-gradient(90deg,#CD7F32,#A0522D)",next:500,icon:"🥉"};
                      const pct=Math.min(100,Math.round(pts/tier.next*100));
                      return(
                        <div onClick={()=>setScreen("groups")} style={{margin:"0 16px 18px",background:tier.bg,borderRadius:18,padding:"14px 16px",border:`1px solid ${tier.c}25`,cursor:"pointer",animation:"slideUp .35s both"}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:40,height:40,borderRadius:12,background:`${tier.c}18`,border:`1px solid ${tier.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{tier.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                                <div style={{fontSize:13,fontWeight:900,color:tier.c}}>Niveau {tier.n}</div>
                                <div style={{fontSize:11,color:GRAY,fontWeight:700}}>{pts} / {tier.next} pts</div>
                              </div>
                              <div style={{height:5,borderRadius:5,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                                <div style={{height:"100%",borderRadius:5,background:tier.grad,width:pct+"%",transition:"width 1.2s ease",boxShadow:`0 0 8px ${tier.c}66`}}/>
                              </div>
                              <div style={{fontSize:10,color:GRAY,marginTop:4}}>{pts>=1000?"🎉 30% de réduction activée !":` ${tier.next-pts} pts pour ${tier.n==="Bronze"?"l'Argent":"l'Or"}`}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── HERO événement à la une ── */}
                    {(()=>{
                      const featEv=events.find(e=>e.id===newestId&&!e.ended&&e.published)||events.find(e=>!e.ended&&e.published);
                      if(!featEv||search) return null;
                      return(
                        <div style={{margin:"0 16px 20px",animation:"slideUp .35s both"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:3,height:16,background:GRAD,borderRadius:4}}/>
                              <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>À la une</div>
                            </div>
                            <div onClick={()=>setScreen("events")} style={{fontSize:11,fontWeight:700,color:PINK,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Tout voir <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
                          </div>
                          <div onClick={()=>openEv(featEv)} style={{borderRadius:22,overflow:"hidden",cursor:"pointer",position:"relative",boxShadow:"0 12px 40px rgba(0,0,0,.5)"}}>
                            <div style={{height:210,position:"relative"}}>
                              {featEv.poster?<img src={featEv.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#FF0080,#7B2FFF)"}}/>}
                              <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(13,17,23,1) 0%,rgba(13,17,23,.1) 70%,transparent 100%)"}}/>
                              <div style={{position:"absolute",top:12,left:12,background:GRAD,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 12px",borderRadius:20,animation:"pulse 2s ease-in-out infinite",letterSpacing:.5}}>⭐ À LA UNE</div>
                              {featEv.soldOut&&<div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.2)",color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20}}>COMPLET</div>}
                              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 16px 14px"}}>
                                <div style={{fontSize:19,fontWeight:900,color:WHITE,marginBottom:5,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{featEv.title}</div>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>{featEv.date} · {featEv.location}</div>
                                  <div style={{fontSize:18,fontWeight:900,color:PINK,textShadow:`0 0 12px ${PINK}88`}}>CHF {featEv.price}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── PROCHAINS ÉVÉNEMENTS carousel ── */}
                    {!search&&events.filter(e=>e.published&&!e.ended).length>1&&(
                      <div style={{marginBottom:22,animation:"slideUp .35s both"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,padding:"0 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:3,height:16,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>Prochains events</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:12,overflowX:"auto",padding:"4px 16px 8px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",scrollSnapType:"x mandatory"}}>
                          {events.filter(e=>e.published&&!e.ended).slice(0,6).map((ev,i)=>(
                            <div key={ev.id} onClick={()=>openEv(ev)} style={{flexShrink:0,width:155,borderRadius:18,overflow:"hidden",background:BG2,border:`1px solid ${BORDER}`,cursor:"pointer",scrollSnapAlign:"start",animation:`slideIn .4s ${i*.07}s both`,boxShadow:"0 6px 20px rgba(0,0,0,.35)"}}>
                              <div style={{height:110,position:"relative",background:"linear-gradient(135deg,#FF0080,#7B2FFF)"}}>
                                {ev.poster&&<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
                                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(13,17,23,.8) 100%)"}}/>
                                <div style={{position:"absolute",bottom:7,left:10,background:"rgba(0,0,0,.55)",borderRadius:8,padding:"3px 8px",backdropFilter:"blur(4px)"}}>
                                  <div style={{fontSize:9,fontWeight:900,color:PINK}}>CHF {ev.price}</div>
                                </div>
                              </div>
                              <div style={{padding:"9px 10px 11px"}}>
                                <div style={{fontSize:12,fontWeight:900,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{ev.title}</div>
                                <div style={{fontSize:10,color:GRAY}}>{ev.date.split(" ").slice(0,3).join(" ")}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── SOIRÉES PASSÉES carousel ── */}
                    {!search&&events.filter(e=>e.ended).length>0&&(
                      <div style={{marginBottom:22,animation:"slideUp .35s both"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,padding:"0 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:3,height:16,background:"linear-gradient(135deg,#7B6CF6,#4ECDC4)",borderRadius:4}}/>
                            <div style={{fontSize:10,fontWeight:900,color:"#7B6CF6",letterSpacing:2,textTransform:"uppercase"}}>Soirées passées</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:12,overflowX:"auto",padding:"4px 16px 8px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",scrollSnapType:"x mandatory"}}>
                          {events.filter(e=>e.ended).slice(0,6).map((ev,i)=>(
                            <div key={ev.id} onClick={()=>openEv(ev)} style={{flexShrink:0,width:"calc(100vw - 48px)",maxWidth:380,borderRadius:22,overflow:"hidden",cursor:"pointer",scrollSnapAlign:"start",animation:`slideIn .4s ${i*.07}s both`,boxShadow:"0 12px 40px rgba(0,0,0,.5)"}}>
                              <div style={{height:210,position:"relative"}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(20%)"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#7B6CF6,#4ECDC4)"}}/>}
                                <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(13,17,23,1) 0%,rgba(13,17,23,.1) 70%,transparent 100%)"}}/>
                                <div style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,.55)",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.7)",fontSize:9,fontWeight:900,padding:"4px 12px",borderRadius:20,letterSpacing:.5,backdropFilter:"blur(6px)"}}>✓ PASSÉE</div>
                                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 16px 14px"}}>
                                  <div style={{fontSize:19,fontWeight:900,color:WHITE,marginBottom:5,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{ev.title}</div>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,.55)"}}>{ev.date.split(" ").slice(0,3).join(" ")} · {ev.location}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── GALERIE soirées ── */}
                    {(()=>{
                      const allMedia=Object.entries(evMedia).flatMap(([k,arr])=>k!=="about"?arr:[]).slice(0,6);
                      if(allMedia.length===0)return null;
                      return(
                        <div style={{margin:"0 16px 22px",animation:"slideUp .35s both"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:3,height:16,background:"linear-gradient(135deg,#7B6CF6,#4ECDC4)",borderRadius:4}}/>
                              <div style={{fontSize:10,fontWeight:900,color:"#7B6CF6",letterSpacing:2,textTransform:"uppercase"}}>Galerie soirées</div>
                            </div>
                            <div onClick={()=>setScreen("about")} style={{fontSize:11,fontWeight:700,color:"#7B6CF6",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Voir plus <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B6CF6" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                            {allMedia.slice(0,6).map((m,i)=>(
                              <div key={m.id||i} onClick={()=>{setGalleryEv({title:"Galerie",media:allMedia});setGalleryIdx(i);setScreen("gallery");}} style={{borderRadius:12,overflow:"hidden",aspectRatio:"1",background:BG2,cursor:"pointer",animation:"slideUp .3s both",position:"relative"}}>
                                {m.type==="video"
                                  ?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>
                                  :<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                                {m.type==="video"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.3)"}}><div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.9)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}


                    {/* ── INSTAGRAM ── */}
                    <div style={{margin:"0 16px 22px",animation:"slideUp .35s both"}}>
                      <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{borderRadius:18,padding:"14px 16px",background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",display:"flex",alignItems:"center",gap:14,cursor:"pointer",boxShadow:"0 8px 24px rgba(131,58,180,.3)"}}>
                        <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:900,color:WHITE}}>@nolimit_eventss</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>Suis-nous sur Instagram</div>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>

                    <div style={{height:24}}/>
                  </div>
                </div>
              )}


              {tab==="tickets"&&(
                <div className="scroll" style={{padding:"20px",paddingTop:`calc(env(safe-area-inset-top,44px) + 10px)`}}>
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
                  ):(
                    <div>
                      {(()=>{const upcoming=myTickets.filter(t=>t.status==="valid"||t.status==="upcoming");return upcoming.length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>À Venir</div>
                            <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:PINK}}>{myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").length}</div>
                          </div>
                          {myTickets.filter(t=>t.status==="valid"||t.status==="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                        </div>
                      );})()}
                      {(()=>{const past=myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming");return past.length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:BG3,borderRadius:4,border:"1px solid "+BORDER}}/>
                            <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Passes</div>
                            <div style={{background:"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:GRAY}}>{myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").length}</div>
                          </div>
                          {myTickets.filter(t=>t.status!=="valid"&&t.status!=="upcoming").map((t,i)=><TicketCard key={t.id} ticket={t} events={events} onShowQR={setQrTicket} index={i}/>)}
                        </div>
                      );})()}
                    </div>
                  )}
                  <div style={{height:20}}/>
                </div>
              )}

              {tab==="agenda"&&(
                <div style={{position:"absolute",inset:0,zIndex:10}}>
                  {React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
                </div>
              )}

              <NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>navHandler("tickets")} onGroups={()=>setScreen("groups")}/>
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
          <div className="sc" style={{background:"linear-gradient(180deg,#080600,#0D1117)"}}>
            <LightBeams/>
            {/* Gold glow top */}
            <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,215,0,.14),transparent 70%)",pointerEvents:"none",zIndex:0}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
              {/* Header */}
              <div style={{flexShrink:0,paddingTop:`calc(${SAFE_TOP} + 10px)`,padding:`calc(env(safe-area-inset-top,44px) + 10px) 20px 0`}}>
                <button onClick={goMain} style={{background:"rgba(255,255,255,.06)",border:`1px solid ${BORDER}`,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:24}}><Icon n="back" s={16} c={WHITE}/></button>
                <div style={{textAlign:"center",marginBottom:24}}>
                  <div style={{fontSize:48,marginBottom:10,filter:"drop-shadow(0 0 20px rgba(255,215,0,.6))",animation:"pulse 2s ease-in-out infinite"}}>👑</div>
                  <div style={{fontSize:28,fontWeight:900,color:"#FFD700",letterSpacing:.5,textShadow:"0 0 30px rgba(255,215,0,.4)"}}>Tables VIP</div>
                  <div style={{fontSize:13,color:"rgba(255,215,0,.55)",marginTop:6,fontWeight:600}}>Une expérience sans limites</div>
                </div>
              </div>
              <div className="scroll" style={{padding:"0 16px 40px"}}>
                {[
                  {name:"Silver",sub:"Duo VIP",emoji:"🥈",price:90,color:"#C0C0C0",glow:"rgba(192,192,192,.25)",bg:"linear-gradient(135deg,rgba(192,192,192,.08),rgba(192,192,192,.03))",perks:["Pour 2 personnes","Entrée VIP prioritaire","1 verre offert"]},
                  {name:"Gold",sub:"Le classique",emoji:"🥇",price:280,popular:true,color:"#FFD700",glow:"rgba(255,215,0,.35)",bg:"linear-gradient(135deg,rgba(255,215,0,.14),rgba(255,180,0,.06))",perks:["Pour 5 personnes","1 bouteille incluse","Softs inclus","Entrée prioritaire"]},
                  {name:"Premium",sub:"Ultimate VIP",emoji:"💎",price:500,color:"#A78BFA",glow:"rgba(167,139,250,.25)",bg:"linear-gradient(135deg,rgba(167,139,250,.1),rgba(123,47,255,.05))",perks:["Pour 10 personnes","2 bouteilles incluses","Softs & snacks","Entrée exclusive"]},
                ].map((pkg,pi)=>(
                  <div key={pkg.name} style={{borderRadius:24,marginBottom:14,border:`1.5px solid ${pkg.color}${pkg.popular?"55":"28"}`,background:pkg.bg,overflow:"hidden",animation:`evCardIn .4s ${pi*.1}s both`,boxShadow:pkg.popular?`0 0 30px ${pkg.glow}`:undefined}}>
                    {pkg.popular&&(
                      <div style={{background:`linear-gradient(90deg,${pkg.color}33,${pkg.color}66,${pkg.color}33)`,padding:"7px 0",textAlign:"center",fontSize:11,fontWeight:900,color:pkg.color,letterSpacing:2}}>⭐ LE PLUS DEMANDÉ</div>
                    )}
                    <div style={{padding:"20px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:52,height:52,borderRadius:16,background:`${pkg.color}15`,border:`1px solid ${pkg.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:`0 0 20px ${pkg.glow}`}}>{pkg.emoji}</div>
                          <div>
                            <div style={{fontSize:20,fontWeight:900,color:WHITE}}>{pkg.name}</div>
                            <div style={{fontSize:12,color:GRAY,marginTop:2}}>{pkg.sub}</div>
                          </div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:30,fontWeight:900,color:pkg.color,lineHeight:1,textShadow:`0 0 20px ${pkg.glow}`}}>{pkg.price}</div>
                          <div style={{fontSize:11,color:GRAY,marginTop:2}}>CHF</div>
                        </div>
                      </div>
                      <div style={{marginBottom:18}}>
                        {pkg.perks.map((p,i)=>(
                          <div key={p} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<pkg.perks.length-1?10:0}}>
                            <div style={{width:20,height:20,borderRadius:"50%",background:`${pkg.color}20`,border:`1px solid ${pkg.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={pkg.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <span style={{fontSize:13,color:"rgba(255,255,255,.8)",fontWeight:600}}>{p}</span>
                          </div>
                        ))}
                      </div>
                      <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{padding:"14px 0",borderRadius:16,background:pkg.popular?`linear-gradient(135deg,${pkg.color},${pkg.color}bb)`:`transparent`,border:pkg.popular?"none":`1.5px solid ${pkg.color}55`,textAlign:"center",fontWeight:900,fontSize:14,color:pkg.popular?"#000":pkg.color,cursor:"pointer",letterSpacing:.5,boxShadow:pkg.popular?`0 6px 24px ${pkg.glow}`:undefined}}>
                        RÉSERVER — CHF {pkg.price}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{background:"rgba(255,215,0,.06)",border:"1px solid rgba(255,215,0,.15)",borderRadius:16,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:12,color:"rgba(255,215,0,.7)",fontWeight:600}}>Réservation via Instagram · <span style={{color:"#FFD700",fontWeight:800}}>@nolimit_eventss</span></div>
                </div>
                <div style={{height:30}}/>
              </div>
            </div>
          </div>
        )}

        {screen==="onboarding"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",display:"flex",flexDirection:"column",zIndex:100}}>
    <div onClick={()=>{setScreen("login");}} style={{position:"absolute",bottom:120,right:24,zIndex:10,padding:"8px 16px",borderRadius:20,background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>PASSER</div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px 0",textAlign:"center"}}>
      {onbStep===0&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)",animation:"pulse 2s ease-in-out infinite"}}>
            <img src={LOGO} alt="" style={{width:70,height:70,objectFit:"contain"}}/>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Bienvenue sur No Limit Events</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Chaque soirée est une nouvelle surprise. Découvre les meilleurs événements près de chez toi.</div>
        </div>
      )}
      {onbStep===1&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Vos billets, simplifiés</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>QR code sécurisé, achat en 2 clics, accès VIP exclusifs. Tout dans ta poche.</div>
        </div>
      )}
      {onbStep===2&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Partagez l'expérience</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Rejoins la communauté No Limit. Retrouve tes amis, partage tes soirées et vis l'expérience à fond.</div>
        </div>
      )}
    </div>
    <div style={{padding:"20px 30px 40px"}}>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{height:4,borderRadius:4,background:i===onbStep?"#FF0080":"rgba(255,255,255,.15)",width:i===onbStep?28:8,transition:"all .3s"}}/>
        ))}
      </div>
      <div onClick={()=>{
        if(onbStep<2){setOnbStep(onbStep+1);}
        else{localStorage.setItem("nle_onb","1");setScreen("login");}
      }} style={{width:"100%",padding:"16px 0",borderRadius:16,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:16,color:"#FFFFFF",cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 30px rgba(255,0,128,.4)"}}>
        {onbStep<2?"SUIVANT →":"COMMENCER 🎉"}
      </div>
    </div>
  </div>
)}
{screen==="login"&&(
  <div style={{position:"absolute",inset:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",zIndex:100,overflow:"hidden"}}>
    <LightBeams/>
    <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,animation:"slideUp .4s ease-out both"}}>
      {/* Logo + titre */}
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(123,47,255,.15))",border:"1px solid rgba(255,0,128,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:"0 0 40px rgba(255,0,128,.3)"}}>
          <img src={LOGO} alt="" style={{width:54,height:54,objectFit:"contain",filter:"drop-shadow(0 0 12px rgba(255,0,128,.8))"}}/>
        </div>
        <div style={{fontSize:26,fontWeight:900,color:WHITE,letterSpacing:.5,marginBottom:6}}>Connexion</div>
        <div style={{fontSize:13,color:GRAY}}>Content de te revoir 👋</div>
      </div>
      {/* Carte formulaire */}
      <div style={{background:"rgba(20,26,34,.85)",backdropFilter:"blur(16px)",border:`1px solid ${BORDER}`,borderRadius:24,padding:"24px 20px"}}>
        <input type="email" placeholder="Adresse email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} autoComplete="email" style={{width:"100%",padding:"14px 16px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:14,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
        <input type="password" placeholder="Mot de passe" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} autoComplete="current-password" style={{width:"100%",padding:"14px 16px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:14,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
        {loginErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center",padding:"8px",background:"rgba(255,68,68,.08)",borderRadius:10}}>{loginErr}</div>}
        <div onClick={doLogin} style={{width:"100%",padding:"15px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",letterSpacing:1,boxShadow:`0 6px 24px rgba(255,0,128,.35)`,marginTop:4}}>SE CONNECTER</div>
        <div onClick={()=>{setForgotScreen(true);setForgotEmail(loginEmail);setForgotSent(false);setForgotErr("");}} style={{textAlign:"center",marginTop:14,fontSize:13,color:GRAY,cursor:"pointer"}}>Mot de passe oublié ? <span style={{color:PINK,fontWeight:700}}>Réinitialiser</span></div>
      </div>
      <div style={{textAlign:"center",marginTop:20,fontSize:13,color:GRAY}}>
        Pas encore de compte ? <span onClick={()=>setScreen("register")} style={{color:PINK,fontWeight:800,cursor:"pointer"}}>S'inscrire</span>
      </div>
    </div>
  </div>
)}
{forgotScreen&&(
  <div style={{position:"absolute",inset:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",zIndex:200,overflow:"hidden"}}>
    <LightBeams/>
    <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,animation:"slideUp .4s ease-out both"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:48,marginBottom:12}}>🔑</div>
        <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:6}}>Mot de passe oublié</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Entre ton email et on t'envoie un lien pour réinitialiser ton mot de passe.</div>
      </div>
      <div style={{background:"rgba(20,26,34,.85)",backdropFilter:"blur(16px)",border:`1px solid ${BORDER}`,borderRadius:24,padding:"24px 20px"}}>
        {!forgotSent?(
          <>
            <input type="email" placeholder="Adresse email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} autoComplete="email" style={{width:"100%",padding:"14px 16px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:14,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
            {forgotErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center",padding:"8px",background:"rgba(255,68,68,.08)",borderRadius:10}}>{forgotErr}</div>}
            <div onClick={doForgotPassword} style={{width:"100%",padding:"15px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",letterSpacing:1,boxShadow:`0 6px 24px rgba(255,0,128,.35)`}}>ENVOYER LE LIEN</div>
          </>
        ):(
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>📧</div>
            <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8}}>Email envoyé !</div>
            <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Vérifie ta boite mail et clique sur le lien pour créer un nouveau mot de passe.</div>
          </div>
        )}
      </div>
      <div onClick={()=>setForgotScreen(false)} style={{textAlign:"center",marginTop:20,fontSize:13,color:GRAY,cursor:"pointer"}}>← Retour à la connexion</div>
    </div>
  </div>
)}
{screen==="register"&&(
  <div style={{position:"absolute",inset:0,background:BG,overflowY:"auto",overflowX:"hidden",zIndex:100}}>
    <LightBeams/>
    <div style={{position:"relative",zIndex:1,padding:"calc(env(safe-area-inset-top,44px) + 20px) 20px 40px",display:"flex",flexDirection:"column",alignItems:"center",width:"100%",boxSizing:"border-box"}}>
      <div style={{width:"100%",maxWidth:380,animation:"slideUp .4s ease-out both"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(123,47,255,.15))",border:"1px solid rgba(255,0,128,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(255,0,128,.25)"}}>
            <img src={LOGO} alt="" style={{width:48,height:48,objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(255,0,128,.8))"}}/>
          </div>
          <div style={{fontSize:24,fontWeight:900,color:WHITE,letterSpacing:.5,marginBottom:6}}>Créer un compte</div>
          <div style={{fontSize:13,color:GRAY}}>Rejoins la communauté No Limit ! 🔥</div>
        </div>
        {regDone?(
          <div style={{padding:"20px 0",animation:"slideUp .4s both"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:52,marginBottom:10}}>📧</div>
              <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:6}}>Vérifie ton email !</div>
              <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Un email de confirmation a été envoyé à</div>
              <div style={{fontSize:13,color:PINK,fontWeight:800,marginTop:4}}>{regEmail}</div>
            </div>
            <div style={{background:"rgba(255,0,128,.07)",border:"1px solid rgba(255,0,128,.2)",borderRadius:18,padding:"18px 16px",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:900,color:WHITE,marginBottom:14}}>Comment activer ton compte :</div>
              {[["1️⃣","Ouvre l'email de","No Limit Events","dans ta boite mail"],["2️⃣","Clique sur le lien","Confirmer mon email","dans l'email"],["3️⃣","Reviens ici et connecte-toi","","🎉"]].map(([num,pre,bold,suf],i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:i<2?10:0}}>
                  <span style={{fontSize:18,flexShrink:0,lineHeight:1.3}}>{num}</span>
                  <span style={{fontSize:12,color:GRAY,lineHeight:1.6}}>{pre} <span style={{color:PINK,fontWeight:700}}>{bold}</span> {suf}</span>
                </div>
              ))}
            </div>
            <div onClick={()=>{setRegDone(false);setRegEmail("");setRegPass("");setRegPrenom("");setRegNom("");setRegRefCode("");setScreen("login");}} style={{padding:"15px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",letterSpacing:1,boxShadow:`0 6px 24px rgba(255,0,128,.35)`,marginBottom:10}}>SE CONNECTER</div>
            <div style={{textAlign:"center",fontSize:11,color:GRAY,marginTop:6}}>Tu n'as pas reçu l'email ? Vérifie tes spams 📁</div>
          </div>
        ):(
          <div style={{background:"rgba(20,26,34,.85)",backdropFilter:"blur(16px)",border:`1px solid ${BORDER}`,borderRadius:24,padding:"24px 20px"}}>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <input type="text" placeholder="Prénom" value={regPrenom} onChange={e=>setRegPrenom(e.target.value)} autoComplete="given-name" style={{flex:1,minWidth:0,padding:"13px 14px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
              <input type="text" placeholder="Nom" value={regNom} onChange={e=>setRegNom(e.target.value)} autoComplete="family-name" style={{flex:1,minWidth:0,padding:"13px 14px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
            </div>
            <input type="email" placeholder="Adresse email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} autoComplete="email" style={{width:"100%",padding:"13px 14px",background:BG3,border:`1.5px solid ${BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
            <input type="password" placeholder="Mot de passe (6 min)" value={regPass} onChange={e=>setRegPass(e.target.value)} autoComplete="new-password" style={{width:"100%",padding:"13px 14px",background:BG3,border:`1.5px solid ${regPassConfirm&&regPass!==regPassConfirm?"rgba(255,68,68,.6)":BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
            <input type="password" placeholder="Confirmer le mot de passe" value={regPassConfirm} onChange={e=>setRegPassConfirm(e.target.value)} autoComplete="new-password" style={{width:"100%",padding:"13px 14px",background:BG3,border:`1.5px solid ${regPassConfirm&&regPass!==regPassConfirm?"rgba(255,68,68,.6)":regPassConfirm&&regPass===regPassConfirm?"rgba(0,230,118,.5)":BORDER}`,borderRadius:12,color:WHITE,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:regPassConfirm&&regPass!==regPassConfirm?4:12,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=PINK} onBlur={e=>e.target.style.borderColor=BORDER}/>
            {regPassConfirm&&regPass!==regPassConfirm&&<div style={{fontSize:11,color:"#FF4444",fontWeight:700,marginBottom:10}}>❌ Les mots de passe ne correspondent pas</div>}
            {regPassConfirm&&regPass===regPassConfirm&&regPass.length>=6&&<div style={{fontSize:11,color:"#00E676",fontWeight:700,marginBottom:10}}>✓ Mots de passe identiques</div>}
            <div style={{position:"relative",marginBottom:8}}>
              <input type="text" placeholder="Code de parrainage (optionnel)" value={regRefCode} onChange={e=>setRegRefCode(e.target.value.toUpperCase())} style={{width:"100%",padding:"13px 14px 13px 40px",background:BG3,border:`1.5px solid ${regRefCode.length>=6?"rgba(255,0,128,.6)":BORDER}`,borderRadius:12,color:PINK,fontSize:13,fontWeight:700,outline:"none",fontFamily:"monospace",boxSizing:"border-box",letterSpacing:1,transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor="rgba(255,0,128,.6)"} onBlur={e=>e.target.style.borderColor=regRefCode.length>=6?"rgba(255,0,128,.6)":BORDER}/>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🎁</span>
              {regRefCode.length>=6&&<span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#00E676"}}>✓</span>}
            </div>
            {regRefCode.length>=6&&<div style={{fontSize:11,color:"#00E676",fontWeight:700,marginBottom:8,textAlign:"center"}}>+50 points offerts avec ce code 🎁</div>}
            {regErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center",padding:"8px",background:"rgba(255,68,68,.08)",borderRadius:10}}>{regErr}</div>}
            <div onClick={doRegister} style={{width:"100%",padding:"15px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",letterSpacing:1,boxShadow:`0 6px 24px rgba(255,0,128,.35)`,marginTop:4}}>CRÉER MON COMPTE</div>
          </div>
        )}
        {!regDone&&<div style={{textAlign:"center",marginTop:20,fontSize:13,color:GRAY}}>
          Déjà un compte ? <span onClick={()=>setScreen("login")} style={{color:PINK,fontWeight:800,cursor:"pointer"}}>Se connecter</span>
        </div>}
      </div>
    </div>
  </div>
)}
{screen==="setup-pseudo"&&authUser&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",zIndex:100,overflow:"hidden"}}>
    <div style={{position:"absolute",width:340,height:340,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,0,128,.18),transparent 70%)",top:-100,right:-100,animation:"pulse 3s ease-in-out infinite"}}/>
    <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,51,153,.12),transparent 70%)",bottom:-40,left:-60,animation:"pulse 4s 1s ease-in-out infinite"}}/>
    {!profil?(
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:"3px solid #1C2430",borderTop:"3px solid #FF0080",animation:"spin 1s linear infinite"}}/>
        <div style={{fontSize:14,color:"#8892A0"}}>Chargement...</div>
      </div>
    ):(
      <div style={{width:"100%",maxWidth:380,animation:"slideUp .4s ease-out both",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:82,height:82,borderRadius:"50%",background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 0 60px rgba(255,0,128,.55)",animation:"pulse 2s ease-in-out infinite"}}>
            <img src={LOGO} alt="" style={{width:54,height:54,objectFit:"contain"}}/>
          </div>
          <div style={{fontSize:26,fontWeight:900,color:"#FFFFFF",marginBottom:8,letterSpacing:.3}}>Choisis ton pseudo</div>
          <div style={{fontSize:13,color:"#8892A0",lineHeight:1.6}}>Il sera visible par toute la communauté.<br/>Choisis-le bien !</div>
        </div>
        <div style={{position:"relative",marginBottom:6}}>
          <div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:17,fontWeight:900,color:setupPseudo.length>=3?"#FF0080":"#8892A0",transition:"color .25s"}}>@</div>
          <input autoFocus type="text" placeholder="tonpseudo" value={setupPseudo} onChange={e=>setSetupPseudo(e.target.value)} style={{width:"100%",padding:"16px 44px 16px 38px",background:"#141A22",border:`2px solid ${setupPseudo.length>=3?"#FF0080":"#1E2A38"}`,borderRadius:14,color:"#FFFFFF",fontSize:17,fontWeight:700,outline:"none",fontFamily:"inherit",boxSizing:"border-box",letterSpacing:.5,transition:"border-color .25s",boxShadow:setupPseudo.length>=3?"0 0 20px rgba(255,0,128,.2)":"none"}}/>
          {setupPseudo.length>=3&&<div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:18,color:"#00E676",animation:"dotPop .2s both"}}>✓</div>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontSize:11,color:"#8892A0"}}>3 caractères minimum</div>
          <div style={{fontSize:11,fontWeight:800,color:setupPseudo.length>=3?"#00E676":setupPseudo.length>0?"#FFB347":"#8892A0",transition:"color .25s"}}>{setupPseudo.length} car.</div>
        </div>
        {setupPseudoErr&&(
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.3)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
            <div style={{fontSize:14}}>⚠️</div>
            <div style={{fontSize:12,fontWeight:700,color:"#FF4444"}}>{setupPseudoErr}</div>
          </div>
        )}
        <div onClick={setupPseudo.length>=3&&!setupPseudoSaving?doSetupPseudo:undefined} style={{width:"100%",padding:"16px 0",borderRadius:14,background:setupPseudo.length<3?"#1C2430":setupPseudoSaving?"rgba(255,0,128,.4)":"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:setupPseudo.length<3?"#8892A0":"#FFFFFF",cursor:setupPseudo.length<3||setupPseudoSaving?"not-allowed":"pointer",letterSpacing:1,transition:"all .3s",boxShadow:setupPseudo.length>=3&&!setupPseudoSaving?"0 8px 30px rgba(255,0,128,.45)":"none",transform:setupPseudo.length>=3&&!setupPseudoSaving?"scale(1)":"scale(.98)"}}>
          {setupPseudoSaving?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",animation:"spin 1s linear infinite"}}/>
              SAUVEGARDE...
            </div>
          ):"VALIDER MON PSEUDO →"}
        </div>
      </div>
    )}
  </div>
)}
{screen==="profil"&&(
  <div style={{position:"absolute",inset:0,background:BG,overflowY:"auto",overflowX:"hidden",zIndex:100,paddingBottom:90}}>
    <LightBeams/>
    <style>{`
      @keyframes ringRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes neonPulse{0%,100%{box-shadow:0 0 10px rgba(255,0,128,.3),0 0 30px rgba(255,0,128,.1)}50%{box-shadow:0 0 20px rgba(255,0,128,.6),0 0 60px rgba(255,0,128,.25)}}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    `}</style>

    {/* Header futuriste */}
    <div style={{position:"relative",padding:"50px 20px 28px",textAlign:"center",overflow:"hidden"}}>
      {/* Blobs de fond */}
      <div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,0,128,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:20,left:-60,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,255,.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:20,right:-60,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,180,255,.1) 0%,transparent 70%)",pointerEvents:"none"}}/>

      {/* Bouton retour */}
      <div onClick={()=>setScreen("main")} style={{position:"absolute",top:"calc(env(safe-area-inset-top,20px) + 10px)",left:16,width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.06)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2}}>
        <Icon n="back" s={16} c={GRAY}/>
      </div>

      {/* Avatar avec anneau tournant */}
      <div style={{position:"relative",width:96,height:96,margin:"0 auto 14px"}}>
        <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:"2px dashed rgba(255,0,128,.5)",animation:"ringRotate 6s linear infinite"}}/>
        <div style={{position:"absolute",inset:-8,borderRadius:"50%",border:"1px dashed rgba(123,47,255,.3)",animation:"ringRotate 10s linear infinite reverse"}}/>
        <div style={{width:96,height:96,borderRadius:"50%",background:"linear-gradient(135deg,#FF0080,#7B2FFF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:900,color:WHITE,animation:"neonPulse 3s ease-in-out infinite",position:"relative",zIndex:1}}>
          {authUser?(authUser.user_metadata?.prenom?authUser.user_metadata.prenom[0].toUpperCase():"U"):"?"}
        </div>
      </div>

      {/* Nom */}
      <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:2}}>
        {authUser?((authUser.user_metadata?.prenom||"")+" "+(authUser.user_metadata?.nom||"")).trim()||"Utilisateur":"Non connecté"}
      </div>
      {profil?.pseudo&&<div style={{fontSize:13,color:PINK,fontWeight:800,marginBottom:4,letterSpacing:.5}}>@{profil.pseudo}</div>}
      <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginBottom:20}}>{authUser?.email}</div>

      {/* Stats en ligne */}
      <div style={{display:"flex",justifyContent:"center",gap:6}}>
        {[
          [tickets.filter(t=>authUser&&t.email===authUser.email).length,"Billets","#FF0080"],
          [profil?.points||0,"Points","#FFD700"],
          [events.filter(e=>!e.ended).length,"Événements","#4ECDC4"],
        ].map(([val,label,color])=>(
          <div key={label} style={{flex:1,maxWidth:90,background:"rgba(255,255,255,.04)",borderRadius:14,padding:"10px 6px",border:`1px solid rgba(255,255,255,.07)`}}>
            <div style={{fontSize:20,fontWeight:900,color,marginBottom:1}}>{val}</div>
            <div style={{fontSize:9,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>{label}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{padding:"0 16px 50px"}}>
      {authUser?(
        <div style={{animation:"slideUp .4s both"}}>

          {/* Carte niveau */}
          {(()=>{
            const pts=profil?.points||0;
            const tier=pts>=1000?{n:"Or",c:"#FFD700",grad:"linear-gradient(90deg,#FFD700,#FFA500)",icon:"🏆",next:1000}:pts>=500?{n:"Argent",c:"#C0C0C0",grad:"linear-gradient(90deg,#C0C0C0,#888)",icon:"🥈",next:1000}:{n:"Bronze",c:"#CD7F32",grad:"linear-gradient(90deg,#CD7F32,#A0522D)",icon:"🥉",next:500};
            const pct=Math.min(100,Math.round(pts/tier.next*100));
            return(
            <div style={{background:`linear-gradient(135deg,rgba(255,215,0,.04),rgba(255,0,128,.06))`,borderRadius:20,padding:"16px",marginBottom:14,border:`1px solid ${tier.c}22`}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{fontSize:28}}>{tier.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:15,fontWeight:900,color:tier.c}}>{tier.n}</div>
                    <div style={{fontSize:12,color:GRAY,fontWeight:700}}>{pts} / {tier.next} pts</div>
                  </div>
                  <div style={{height:6,borderRadius:6,background:"rgba(255,255,255,.07)",overflow:"hidden",marginTop:6}}>
                    <div style={{height:"100%",borderRadius:6,background:tier.grad,width:pct+"%",transition:"width 1.5s ease",boxShadow:`0 0 10px ${tier.c}66`}}/>
                  </div>
                  {pts>=1000?(
                    <div style={{fontSize:10,color:"#FFD700",marginTop:5,fontWeight:800,letterSpacing:.3}}>🎉 30% de réduction sur ta prochaine soirée !</div>
                  ):(
                    <div style={{fontSize:10,color:GRAY,marginTop:5}}>Encore {tier.next-pts} pts pour {tier.n==="Bronze"?"l'Argent":"l'Or"}</div>
                  )}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[["🥉","Bronze","0 pts"],["🥈","Argent","500 pts"],["🏆","Or","1000 pts"]].map(([ico,name,req],i)=>(
                  <div key={name} style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:10,background:tier.n===name?"rgba(255,255,255,.08)":"transparent",border:`1px solid ${tier.n===name?"rgba(255,255,255,.12)":"transparent"}`}}>
                    <div style={{fontSize:16,marginBottom:2}}>{ico}</div>
                    <div style={{fontSize:8,fontWeight:800,color:tier.n===name?WHITE:GRAY,letterSpacing:.5}}>{name}</div>
                    <div style={{fontSize:8,color:GRAY}}>{req}</div>
                  </div>
                ))}
              </div>
            </div>
            );
          })()}

          {/* Parrainage */}
          <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.07),rgba(123,47,255,.05))",borderRadius:20,padding:"16px",marginBottom:14,border:`1px solid rgba(255,0,128,.2)`}}>
            <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Parrainage</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:10,lineHeight:1.5}}>Partage ton code à tes amis. Chaque inscription te rapporte <span style={{color:WHITE,fontWeight:800}}>+50 points</span>. À <span style={{color:"#FFD700",fontWeight:800}}>1000 points</span> tu reçois <span style={{color:WHITE,fontWeight:800}}>-30%</span> sur ta prochaine soirée.</div>
            {profil?.referral_code?(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,background:BG3,borderRadius:12,padding:"12px 14px",fontFamily:"monospace",fontSize:15,fontWeight:900,color:PINK,letterSpacing:2,border:`1px solid rgba(255,0,128,.3)`}}>{profil.referral_code}</div>
                <div onClick={()=>{navigator.clipboard.writeText(profil.referral_code);showToast("✅ Code copié !");}} style={{background:"rgba(255,0,128,.12)",border:"1px solid rgba(255,0,128,.3)",borderRadius:12,padding:"12px 14px",cursor:"pointer",fontSize:18}}>📋</div>
              </div>
            ):(
              <div style={{fontSize:12,color:GRAY,fontStyle:"italic"}}>Code en cours de génération...</div>
            )}
          </div>

          {/* Profil social */}
          <div style={{background:BG2,borderRadius:20,padding:"16px",marginBottom:14,border:`1px solid ${BORDER}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>Profil Social</div>
              <div onClick={()=>{setProfilEdit(!profilEdit);setProfilErr("");}} style={{padding:"5px 12px",borderRadius:20,background:profilEdit?"rgba(255,68,68,.1)":"rgba(255,0,128,.1)",border:`1px solid ${profilEdit?"rgba(255,68,68,.3)":"rgba(255,0,128,.3)"}`,fontSize:11,fontWeight:800,color:profilEdit?"#FF4444":PINK,cursor:"pointer"}}>
                {profilEdit?"ANNULER":"MODIFIER"}
              </div>
            </div>
            {profilEdit?(
              <div>
                {/* Pseudo */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:GRAY,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Pseudo</div>
                  <input value={profilPseudo} onChange={e=>setProfilPseudo(e.target.value)} placeholder="Ton pseudo..." style={{width:"100%",padding:"12px 14px",background:BG3,border:`1.5px solid ${profilPseudo?PINK:BORDER}`,borderRadius:12,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}/>
                </div>
                {/* Instagram — optionnel */}
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <div style={{fontSize:10,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Instagram</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.3)",background:"rgba(255,255,255,.05)",borderRadius:6,padding:"1px 6px"}}>optionnel</div>
                  </div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </div>
                    <input value={profilInsta} onChange={e=>setProfilInsta(e.target.value)} placeholder="@toninstagram" style={{width:"100%",padding:"12px 14px 12px 36px",background:BG3,border:`1.5px solid ${profilInsta?"#E1306C":BORDER}`,borderRadius:12,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}/>
                  </div>
                </div>
                {/* Snapchat — optionnel */}
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <div style={{fontSize:10,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Snapchat</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.3)",background:"rgba(255,255,255,.05)",borderRadius:6,padding:"1px 6px"}}>optionnel</div>
                  </div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFC00" stroke="#FFFC00" strokeWidth="0"><path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.56 5.8 4 7.54V21l2.5-1.5c1.1.34 2.27.5 3.5.5 5.52 0 10-4.03 10-9S17.52 2 12 2z"/></svg>
                    </div>
                    <input value={profilSnap} onChange={e=>setProfilSnap(e.target.value)} placeholder="tonsnapchat" style={{width:"100%",padding:"12px 14px 12px 36px",background:BG3,border:`1.5px solid ${profilSnap?"#FFFC00":BORDER}`,borderRadius:12,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}/>
                  </div>
                </div>
                {profilErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:10,textAlign:"center"}}>{profilErr}</div>}
                <div onClick={saveProfil} style={{padding:"14px 0",borderRadius:14,background:profilSaving?"rgba(255,255,255,.08)":GRAD,textAlign:"center",fontWeight:900,fontSize:13,color:WHITE,cursor:"pointer",letterSpacing:.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {profilSaving?<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Sauvegarde...</>:"SAUVEGARDER"}
                </div>
              </div>
            ):(
              <div>
                {[
                  [<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, profil?.pseudo?"@"+profil.pseudo:"Non défini", PINK, true],
                  [<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, profil?.instagram||"Non renseigné", "#E1306C", false],
                  [<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFC00" stroke="none"><path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.56 5.8 4 7.54V21l2.5-1.5c1.1.34 2.27.5 3.5.5 5.52 0 10-4.03 10-9S17.52 2 12 2z"/></svg>, profil?.snapchat||"Non renseigné", "#FFFC00", false],
                ].map(([icon,val,color,required],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?`1px solid ${BORDER}`:"none"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:`${color}15`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:val.startsWith("Non")?GRAY:WHITE,fontWeight:val.startsWith("Non")?400:600}}>{val}</div>
                      {!required&&val.startsWith("Non")&&<div style={{fontSize:10,color:"rgba(255,255,255,.25)"}}>Appuie sur Modifier pour ajouter</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mon Compte */}
          <div style={{background:BG2,borderRadius:20,padding:"16px",marginBottom:14,border:`1px solid ${BORDER}`}}>
            <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Mon Compte</div>
            {[
              [<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,"Email",authUser.email],
              [<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,"Prénom",(authUser.user_metadata?.prenom)||"—"],
              [<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,"Nom",(authUser.user_metadata?.nom)||"—"],
            ].map(([icon,label,val],i)=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?`1px solid ${BORDER}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.04)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontSize:10,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:1}}>{label}</div>
                  <div style={{fontSize:13,color:WHITE,fontWeight:600}}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Déconnexion */}
          <div onClick={doLogout} style={{padding:"15px 0",borderRadius:14,background:"rgba(204,0,0,.08)",border:"1px solid rgba(204,0,0,.25)",textAlign:"center",fontWeight:900,fontSize:14,color:"#FF4444",cursor:"pointer",letterSpacing:.5}}>
            SE DÉCONNECTER
          </div>
        </div>
      ):(
        <div style={{textAlign:"center",padding:"40px 0",animation:"slideUp .4s both"}}>
          <div style={{fontSize:56,marginBottom:16}}>👤</div>
          <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:8}}>Non connecté</div>
          <div style={{fontSize:13,color:GRAY,marginBottom:28}}>Connecte-toi pour accéder à ton profil et tes billets.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",marginBottom:10}}>SE CONNECTER</div>
          <div onClick={()=>setScreen("register")} style={{padding:"15px 0",borderRadius:14,border:`1.5px solid ${PINK}`,textAlign:"center",fontWeight:900,fontSize:15,color:PINK,cursor:"pointer"}}>CRÉER UN COMPTE</div>
        </div>
      )}
    </div>
  <NavBar current="profil" onNav={navHandler} onProfil={()=>{}} onEvents={()=>setScreen("events")} onTickets={()=>navHandler("tickets")} onGroups={()=>setScreen("groups")}/>
  </div>
)}
{screen==="about"&&(
  <div style={{position:"fixed",inset:0,background:BG,zIndex:100,overflowY:"auto",overflowX:"hidden"}}>
    <LightBeams/>
    <style>{`@keyframes aboutFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    {/* Hero */}
    <div style={{position:"relative",height:280,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 80%,rgba(255,0,128,.3),transparent 65%)"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,rgba(123,47,255,.2),transparent 60%)"}}/>
      {[...Array(6)].map((_,i)=><div key={i} style={{position:"absolute",width:i%2?180:120,height:i%2?180:120,borderRadius:"50%",border:`1px solid rgba(255,0,128,${.04+i*.02})`,top:`${15+i*12}%`,left:`${10+i*14}%`,animation:`ringRotate ${8+i*3}s linear infinite ${i%2?"reverse":""}`,pointerEvents:"none"}}/>)}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:`linear-gradient(transparent,${BG})`}}/>
      {/* Bouton retour */}
      <div onClick={()=>setScreen("main")} style={{position:"absolute",top:`calc(env(safe-area-inset-top,20px) + 10px)`,left:16,width:38,height:38,borderRadius:12,background:"rgba(13,17,23,.7)",border:`1px solid ${BORDER}`,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2}}>
        <Icon n="back" s={16} c={WHITE}/>
      </div>
      <img src={LOGO} alt="" style={{width:100,height:100,objectFit:"contain",position:"relative",zIndex:2,animation:"aboutFloat 3s ease-in-out infinite",filter:"drop-shadow(0 0 30px rgba(255,0,128,.7))"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",marginTop:14}}>
        <div style={{fontSize:24,fontWeight:900,color:WHITE,letterSpacing:1}}>No Limit Events</div>
        <div style={{fontSize:12,color:PINK,fontWeight:700,marginTop:4,letterSpacing:3,textTransform:"uppercase"}}>La Chaux-de-Fonds · Suisse</div>
      </div>
    </div>

    <div style={{padding:"0 16px 40px"}}>
      {/* Stats */}
      <div style={{display:"flex",gap:8,marginBottom:18,animation:"slideUp .4s both"}}>
        {[
          [events.filter(e=>e.published).length,"Soirées","🎉",PINK],
          [events.filter(e=>!e.ended&&e.published).length,"À venir","📅","#4ECDC4"],
          [Object.values(evMedia).flat().length,"Médias","📸","#7B6CF6"],
          ["100%","Passion","🔥","#FFD700"],
        ].map(([val,label,ico,color])=>(
          <div key={label} style={{flex:1,background:BG2,borderRadius:16,padding:"12px 6px",textAlign:"center",border:`1px solid rgba(255,255,255,.06)`}}>
            <div style={{fontSize:10,marginBottom:4}}>{ico}</div>
            <div style={{fontSize:17,fontWeight:900,color,marginBottom:2}}>{val}</div>
            <div style={{fontSize:8,color:GRAY,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Histoire */}
      <div style={{background:BG2,borderRadius:20,padding:"18px 18px",marginBottom:14,border:`1px solid ${BORDER}`,animation:"slideUp .4s .05s both"}}>
        <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Notre Histoire</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.75}}>Fondée en 2026 à La Chaux-de-Fonds, <span style={{color:WHITE,fontWeight:700}}>No Limit Events</span> est née d'une passion simple : créer des soirées inoubliables. Chaque événement est pensé pour offrir une expérience unique, où la musique, l'ambiance et les gens se rejoignent pour quelque chose d'exceptionnel.</div>
      </div>

      {/* Valeurs */}
      <div style={{background:BG2,borderRadius:20,padding:"18px",marginBottom:14,border:`1px solid ${BORDER}`,animation:"slideUp .4s .1s both"}}>
        <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Nos Valeurs</div>
        {[
          ["🎉","Expériences Uniques","Chaque soirée est une nouvelle surprise, une aventure.","rgba(255,0,128,.1)"],
          ["🔥","Ambiance Incomparable","Du Hip-Hop à l'Afro, on crée l'atmosphère qui te fait bouger.","rgba(255,107,53,.1)"],
          ["👑","Accès VIP","Des offres exclusives pour vivre la soirée autrement.","rgba(255,215,0,.1)"],
          ["❤️","Communauté","Plus qu'un événement, une famille de passionnés.","rgba(78,205,196,.1)"],
        ].map(([emoji,title,desc,bg],i)=>(
          <div key={title} style={{display:"flex",gap:14,marginBottom:i<3?14:0,alignItems:"flex-start",animation:`slideUp .3s ${i*.06}s both`}}>
            <div style={{width:44,height:44,borderRadius:14,background:bg,border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:WHITE,marginBottom:3}}>{title}</div>
              <div style={{fontSize:12,color:GRAY,lineHeight:1.55}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Galerie par soirée */}
      {events.filter(e=>evMedia[e.id]&&evMedia[e.id].length>0).length>0&&(
        <div style={{marginBottom:14,animation:"slideUp .4s .15s both"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:3,height:16,background:"linear-gradient(135deg,#7B6CF6,#4ECDC4)",borderRadius:4}}/>
            <div style={{fontSize:10,fontWeight:900,color:"#7B6CF6",letterSpacing:2,textTransform:"uppercase"}}>Photos & Vidéos des soirées</div>
          </div>
          {events.filter(e=>evMedia[e.id]&&evMedia[e.id].length>0).map((ev,ei)=>(
            <div key={ev.id} style={{marginBottom:14,animation:`slideUp .4s ${ei*.08}s both`}}>
              {/* Header soirée */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"0 2px"}}>
                {ev.poster?<img src={ev.poster} alt="" style={{width:34,height:34,borderRadius:9,objectFit:"cover",flexShrink:0}}/>:<div style={{width:34,height:34,borderRadius:9,background:GRAD,flexShrink:0}}/>}
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:900,color:WHITE}}>{ev.title}</div>
                  <div style={{fontSize:10,color:GRAY}}>{evMedia[ev.id].length} média{evMedia[ev.id].length>1?"s":""}</div>
                </div>
                <div onClick={()=>{setGalleryEv({...ev,media:evMedia[ev.id]});setGalleryIdx(0);setScreen("gallery");}} style={{background:"rgba(123,47,255,.15)",border:"1px solid rgba(123,47,255,.3)",color:"#7B6CF6",padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:800,cursor:"pointer",flexShrink:0}}>Voir tout</div>
              </div>
              {/* Carrousel horizontal */}
              <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",paddingBottom:4}}>
                {evMedia[ev.id].map((m,mi)=>(
                  <div key={m.id||mi} onClick={()=>{setGalleryEv({...ev,media:evMedia[ev.id]});setGalleryIdx(mi);setScreen("gallery");}} style={{flexShrink:0,width:130,height:100,borderRadius:14,overflow:"hidden",background:BG3,cursor:"pointer",position:"relative"}}>
                    {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                    {m.type==="video"&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.2)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 24 24" fill={WHITE}><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Galerie générale (about) */}
      {aboutMedia.length>0&&(
        <div style={{marginBottom:14,animation:"slideUp .4s .2s both"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:3,height:16,background:GRAD,borderRadius:4}}/>
              <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>Galerie générale</div>
            </div>
            <div onClick={()=>{setGalleryEv({title:"Galerie générale",media:aboutMedia});setGalleryIdx(0);setScreen("gallery");}} style={{background:"rgba(255,0,128,.12)",border:"1px solid rgba(255,0,128,.25)",color:PINK,padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:800,cursor:"pointer"}}>{aboutMedia.length} médias</div>
          </div>
          {/* Grande photo featured + strip */}
          <div style={{borderRadius:20,overflow:"hidden",background:BG2,border:`1px solid ${BORDER}`}}>
            {/* Photo principale */}
            <div onClick={()=>{setGalleryEv({title:"Galerie générale",media:aboutMedia});setGalleryIdx(0);setScreen("gallery");}} style={{height:200,position:"relative",cursor:"pointer"}}>
              {aboutMedia[0].type==="video"?<video src={aboutMedia[0].url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>:<img src={aboutMedia[0].url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,.7))"}}/>
              <div style={{position:"absolute",bottom:12,left:14,fontSize:12,fontWeight:800,color:WHITE}}>Voir la galerie complète →</div>
              {aboutMedia[0].type==="video"&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,.2)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill={WHITE}><polygon points="5 3 19 12 5 21 5 3"/></svg></div>}
            </div>
            {/* Strip des autres */}
            {aboutMedia.length>1&&(
              <div style={{display:"flex",gap:3,padding:"3px",overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
                {aboutMedia.slice(1).map((m,i)=>(
                  <div key={m.id||i} onClick={()=>{setGalleryEv({title:"Galerie générale",media:aboutMedia});setGalleryIdx(i+1);setScreen("gallery");}} style={{flexShrink:0,width:80,height:60,borderRadius:10,overflow:"hidden",background:BG3,cursor:"pointer",position:"relative"}}>
                    {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                    {m.type==="video"&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="8" height="8" viewBox="0 0 24 24" fill={WHITE}><polygon points="5 3 19 12 5 21 5 3"/></svg></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Site web */}
      <div onClick={()=>window.open("https://nolimitevents.ch","_blank")} style={{borderRadius:18,padding:"14px 16px",background:BG2,border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:10,animation:"slideUp .4s .22s both"}}>
        <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,0,128,.12)",border:"1px solid rgba(255,0,128,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div><div style={{fontSize:14,fontWeight:900,color:WHITE}}>nolimitevents.ch</div><div style={{fontSize:11,color:GRAY,marginTop:2}}>Notre site officiel</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5" style={{marginLeft:"auto"}}><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      {/* Instagram */}
      <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{borderRadius:18,padding:"14px 16px",background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:12,boxShadow:"0 8px 24px rgba(131,58,180,.3)",animation:"slideUp .4s .25s both"}}>
        <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </div>
        <div><div style={{fontSize:14,fontWeight:900,color:WHITE}}>@nolimit_eventss</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>Suis-nous sur Instagram</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" style={{marginLeft:"auto"}}><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  </div>
)}

{screen==="gallery"&&galleryEv&&(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:200,display:"flex",flexDirection:"column"}}>
    {/* Header */}
    <div style={{padding:`calc(env(safe-area-inset-top,20px) + 10px) 16px 12px`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      <div onClick={()=>setScreen("about")} style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,.08)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <Icon n="back" s={16} c={WHITE}/>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{galleryEv.title}</div>
        <div style={{fontSize:11,color:GRAY}}>{galleryEv.media?.length||0} média{(galleryEv.media?.length||0)>1?"s":""}</div>
      </div>
    </div>

    {/* Média principal */}
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 16px",position:"relative",overflow:"hidden"}}>
      {galleryEv.media&&galleryEv.media[galleryIdx]&&(
        galleryEv.media[galleryIdx].type==="video"
          ?<video src={galleryEv.media[galleryIdx].url} style={{maxWidth:"100%",maxHeight:"100%",borderRadius:16,objectFit:"contain"}} controls autoPlay/>
          :<img src={galleryEv.media[galleryIdx].url} alt="" style={{maxWidth:"100%",maxHeight:"100%",borderRadius:16,objectFit:"contain"}}/>
      )}
      {galleryIdx>0&&<div onClick={()=>setGalleryIdx(i=>i-1)} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></div>}
      {galleryEv.media&&galleryIdx<galleryEv.media.length-1&&<div onClick={()=>setGalleryIdx(i=>i+1)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>}
      <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.5)",borderRadius:20,padding:"4px 12px",fontSize:11,color:WHITE,fontWeight:700}}>{galleryIdx+1} / {galleryEv.media?.length||0}</div>
    </div>

    {/* Miniatures */}
    {galleryEv.media&&galleryEv.media.length>1&&(
      <div style={{padding:"10px 12px",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",flexShrink:0}}>
        {galleryEv.media.map((m,i)=>(
          <div key={i} onClick={()=>setGalleryIdx(i)} style={{flexShrink:0,width:54,height:54,borderRadius:10,overflow:"hidden",border:i===galleryIdx?`2px solid ${PINK}`:`2px solid transparent`,cursor:"pointer",opacity:i===galleryIdx?1:.55,transition:"all .2s"}}>
            {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
          </div>
        ))}
      </div>
    )}
  </div>
)}
{screen==="events"&&(
  <div style={{position:"fixed",inset:0,background:BG,zIndex:100,display:"flex",flexDirection:"column"}}>
    <LightBeams/>
    <style>{`
      @keyframes evCardIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
      @keyframes heroIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
      @keyframes glowPulse{0%,100%{box-shadow:0 0 0 rgba(255,0,128,0)}50%{box-shadow:0 0 30px rgba(255,0,128,.25)}}
    `}</style>

    {/* Header fixe */}
    <div style={{flexShrink:0,background:BG,paddingTop:"env(safe-area-inset-top,20px)"}}>
      <div style={{padding:"14px 18px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:PINK,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>NolimitEvents</div>
          <div style={{fontSize:22,fontWeight:900,color:WHITE}}>Événements</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,0,128,.08)",border:"1px solid rgba(255,0,128,.2)",borderRadius:20,padding:"6px 12px"}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{fontSize:11,fontWeight:700,color:PINK}}>La Chaux-de-Fonds</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={{position:"relative",padding:"0 16px 10px"}}>
        <div style={{position:"absolute",left:28,top:"50%",transform:"translateY(-60%)"}}><Icon n="search" s={15} c={GRAY}/></div>
        <input type="text" placeholder="Rechercher un événement..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:"100%",padding:"11px 14px 11px 40px",background:BG2,border:`1px solid ${search?PINK:BORDER}`,borderRadius:14,color:WHITE,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s"}}/>
        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:28,top:"50%",transform:"translateY(-60%)",width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:WHITE}}>×</div>}
      </div>

      {/* Filtres catégorie */}
      <div style={{display:"flex",gap:8,padding:"0 16px 12px",overflowX:"auto",scrollbarWidth:"none"}}>
        {["Tous","Hip-Hop","Festival","Electronic","Afro","Latin","House","VIP"].map(f=>(
          <div key={f} onClick={()=>setFilter(f)} style={{padding:"7px 16px",borderRadius:20,background:filter===f?GRAD:"rgba(255,255,255,.05)",border:filter===f?"none":`1px solid ${BORDER}`,color:filter===f?WHITE:GRAY,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all .2s",boxShadow:filter===f?"0 4px 16px rgba(255,0,128,.3)":"none"}}>{f}</div>
        ))}
      </div>
      <div style={{height:1,background:BORDER,margin:"0 16px"}}/>
    </div>

    {/* Contenu scrollable */}
    <div style={{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",overscrollBehavior:"contain"}}>
      {(()=>{
        const upcoming=events.filter(e=>e.published&&!e.ended&&(filter==="Tous"||e.category===filter)&&(search===""||e.title.toLowerCase().includes(search.toLowerCase())));
        const ended=events.filter(e=>e.published&&e.ended&&(search===""||e.title.toLowerCase().includes(search.toLowerCase())));
        const featured=upcoming[0]||null;
        const rest=upcoming.slice(1);
        return(
          <div style={{padding:"16px 16px 100px"}}>

            {/* Event en vedette */}
            {featured&&!search&&filter==="Tous"&&(
              <div style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:3,height:16,background:GRAD,borderRadius:4}}/>
                  <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>Prochain événement</div>
                </div>
                <div onClick={()=>openEv(featured)} style={{borderRadius:24,overflow:"hidden",cursor:"pointer",animation:"heroIn .5s both",boxShadow:"0 12px 40px rgba(0,0,0,.5)",position:"relative"}}>
                  <div style={{width:"100%",aspectRatio:"5/6",position:"relative"}}>
                    {featured.poster?<img src={featured.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#FF0080,#7B2FFF)"}}/>}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(13,17,23,1) 0%,rgba(13,17,23,.2) 60%,transparent 100%)"}}/>
                    {featured.soldOut&&<div style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.7)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"5px 12px",fontSize:9,fontWeight:900,color:WHITE,letterSpacing:1}}>COMPLET</div>}
                    {!featured.soldOut&&<div style={{position:"absolute",top:14,right:14,background:"rgba(255,0,128,.15)",border:"1px solid rgba(255,0,128,.4)",borderRadius:20,padding:"5px 12px",fontSize:9,fontWeight:900,color:PINK,letterSpacing:1,backdropFilter:"blur(6px)"}}>BILLETS DISPO</div>}
                    <div style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.5)",borderRadius:12,padding:"6px 10px",backdropFilter:"blur(6px)"}}>
                      <div style={{fontSize:18,fontWeight:900,color:WHITE,lineHeight:1}}>{featured.date.split(" ")[1]||"—"}</div>
                      <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",textTransform:"uppercase"}}>{featured.date.split(" ")[2]||""}</div>
                    </div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 18px"}}>
                      {featured.category&&<div style={{display:"inline-block",background:"rgba(255,0,128,.2)",border:"1px solid rgba(255,0,128,.4)",color:PINK,fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:20,marginBottom:8,letterSpacing:.8}}>{featured.category}</div>}
                      <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:6,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{featured.title}</div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{featured.location}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{featured.time}</span>
                          </div>
                        </div>
                        <div style={{fontSize:20,fontWeight:900,color:PINK,textShadow:"0 0 20px rgba(255,0,128,.5)"}}>CHF {featured.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des autres events à venir */}
            {upcoming.length>0&&(
              <div style={{marginBottom:20}}>
                {(featured&&!search&&filter==="Tous"?rest:upcoming).length>0&&(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                      <div style={{width:3,height:16,background:GRAD,borderRadius:4}}/>
                      <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>À venir</div>
                      <div style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:GRAY}}>{upcoming.length} event{upcoming.length>1?"s":""}</div>
                    </div>
                    {(featured&&!search&&filter==="Tous"?rest:upcoming).map((ev,i)=>{
                      const pct=ev.capacity>0?Math.min(100,Math.round((ev.ticketsSold||0)/ev.capacity*100)):0;
                      return(
                        <div key={ev.id} onClick={()=>openEv(ev)} style={{borderRadius:22,overflow:"hidden",marginBottom:14,cursor:"pointer",animation:`evCardIn .45s ${i*.07}s both`,boxShadow:"0 12px 40px rgba(0,0,0,.5)",position:"relative",width:"100%",aspectRatio:"5/6"}}>
                          {ev.poster?<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#FF0080,#7B2FFF)"}}/>}
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(13,17,23,1) 0%,rgba(13,17,23,.3) 55%,transparent 100%)"}}/>
                          <div style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.5)",borderRadius:12,padding:"6px 10px",backdropFilter:"blur(6px)"}}>
                            <div style={{fontSize:20,fontWeight:900,color:WHITE,lineHeight:1}}>{ev.date.split(" ")[1]||"—"}</div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",textTransform:"uppercase"}}>{ev.date.split(" ")[2]||""}</div>
                          </div>
                          {ev.soldOut?<div style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.7)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"5px 12px",fontSize:9,fontWeight:900,color:WHITE,letterSpacing:1}}>COMPLET</div>:<div style={{position:"absolute",top:14,right:14,background:"rgba(255,0,128,.15)",border:"1px solid rgba(255,0,128,.4)",borderRadius:20,padding:"5px 12px",fontSize:9,fontWeight:900,color:PINK,letterSpacing:1,backdropFilter:"blur(6px)"}}>BILLETS DISPO</div>}
                          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"18px 18px 16px"}}>
                            {ev.category&&<div style={{display:"inline-block",background:"rgba(255,0,128,.2)",border:"1px solid rgba(255,0,128,.4)",color:PINK,fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:20,marginBottom:8,letterSpacing:.8}}>{ev.category}</div>}
                            <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:6,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{ev.title}</div>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:pct>0?10:0}}>
                              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                <div style={{display:"flex",alignItems:"center",gap:5}}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  <span style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{ev.location}</span>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:5}}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  <span style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{ev.time}</span>
                                </div>
                              </div>
                              <div style={{fontSize:22,fontWeight:900,color:PINK,textShadow:`0 0 20px ${PINK}88`}}>CHF {ev.price}</div>
                            </div>
                            {pct>0&&<div style={{height:3,borderRadius:3,background:"rgba(255,255,255,.1)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:pct>80?"linear-gradient(90deg,#FF4444,#FF6B6B)":GRAD,width:`${pct}%`,transition:"width 1s ease"}}/></div>}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* Events terminés */}
            {ended.length>0&&(
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <div style={{width:3,height:16,background:"rgba(255,255,255,.12)",borderRadius:4}}/>
                  <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Soirées passées</div>
                  <div style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:GRAY}}>{ended.length} soirée{ended.length>1?"s":""}</div>
                </div>
                {ended.map((ev,i)=>(
                  <div key={ev.id} onClick={()=>openEv(ev)} style={{borderRadius:22,overflow:"hidden",marginBottom:14,cursor:"pointer",animation:`evCardIn .45s ${i*.07}s both`,boxShadow:"0 12px 40px rgba(0,0,0,.5)",position:"relative",width:"100%",aspectRatio:"5/6",opacity:.85}}>
                    {ev.poster?<img src={ev.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(20%)"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1C2430,#141A22)"}}/>}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(13,17,23,1) 0%,rgba(13,17,23,.3) 55%,transparent 100%)"}}/>
                    <div style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px",fontSize:9,fontWeight:900,color:"rgba(255,255,255,.6)",letterSpacing:1,backdropFilter:"blur(6px)"}}>✓ TERMINÉE</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"18px 18px 16px"}}>
                      <div style={{fontSize:20,fontWeight:900,color:WHITE,marginBottom:6,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{ev.title}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span style={{fontSize:11,color:"rgba(255,255,255,.55)"}}>{ev.date.split(" ").slice(0,3).join(" ")} · {ev.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aucun résultat */}
            {upcoming.length===0&&ended.length===0&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"70px 20px",gap:14}}>
                <div style={{width:80,height:80,borderRadius:24,background:"rgba(255,255,255,.04)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div style={{fontSize:18,fontWeight:900,color:WHITE}}>Aucun événement</div>
                <div style={{fontSize:13,color:GRAY,textAlign:"center"}}>Aucun événement ne correspond à ta recherche.</div>
              </div>
            )}
          </div>
        );
      })()}
    </div>

    <NavBar current="events" onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>{}} onTickets={()=>navHandler("tickets")} onGroups={()=>setScreen("groups")}/>
  </div>
)}
{screen==="tickets"&&(
  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column"}}>
    <TicketsScreen tickets={tickets} events={events} user={authUser} loading={ticketsLoading}/>
    <NavBar current="tickets" onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>{}} onGroups={()=>setScreen("groups")}/>
  </div>
)}
{screen==="groups"&&(
  <div style={{position:"fixed",inset:0,zIndex:100}}>
    <LightBeams/>
    <GroupsScreen authUser={authUser} supabase={supabase}/>
    <NavBar current="agenda" onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>navHandler("tickets")} onGroups={()=>{}}/>
  </div>
)}
{screen==="adminLogin"&&(
          <div className="sc">
            <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",background:`radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.18) 0%,${BG} 70%)`}}>
              <div style={{width:72,height:72,borderRadius:22,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:`0 0 40px ${PINK}55`}}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div style={{fontSize:24,fontWeight:900,color:WHITE,marginBottom:4,letterSpacing:-.3}}>Espace Admin</div>
              <div style={{fontSize:13,color:GRAY,marginBottom:36}}>No Limit Events · {APP_VERSION}</div>
              <div style={{width:"100%",marginBottom:16}}>
                <input type="password" placeholder="Mot de passe admin" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adminLogin()} className="inp" style={{width:"100%",textAlign:"center",letterSpacing:6,fontSize:16}}/>
              </div>
              {adminErr&&<div style={{background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.3)",borderRadius:10,padding:"10px 14px",color:"#FF4444",fontWeight:700,fontSize:13,marginBottom:16,width:"100%",textAlign:"center"}}>{adminErr}</div>}
              <div onClick={adminLogin} style={{width:"100%",padding:"16px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:14,color:WHITE,cursor:"pointer",letterSpacing:.5,boxShadow:`0 4px 20px ${PINK}44`}}>ACCÉDER AU PANEL</div>
              <div onClick={goMain} style={{marginTop:20,color:GRAY,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Retour à l'app
              </div>
            </div>
          </div>
        )}

        {screen==="admin"&&adminAuth&&(
          <div className="sc">
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

              {/* Header */}
              <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingTop:SAFE_TOP}}>
                <div style={{padding:"10px 14px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:11,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 18px ${PINK}44`}}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <div style={{fontSize:15,fontWeight:900,color:WHITE,letterSpacing:-.2}}>Panel Admin</div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:authUser?"#4ADE80":"#FF4444",boxShadow:authUser?"0 0 6px #4ADE8099":"0 0 6px #FF444499"}}/>
                        <span style={{fontSize:9,color:authUser?"#4ADE80":"#FF6B6B",fontWeight:700}}>{authUser?"Connecté · billets actifs":"Non connecté · gratuits désactivés"}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div onClick={()=>setShowScanner(true)} style={{width:36,height:36,borderRadius:11,background:"rgba(78,205,196,.1)",border:`1px solid ${GREEN}33`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                      <Icon n="eye" s={16} c={GREEN}/>
                    </div>
                    <div onClick={goMain} style={{width:36,height:36,borderRadius:11,background:BG3,border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                      <Icon n="home" s={16} c={GRAY}/>
                    </div>
                  </div>
                </div>
                {/* Onglets */}
                <div style={{display:"flex",padding:"0 6px",overflowX:"auto",scrollbarWidth:"none",gap:2}}>
                  {[["bar","Stats","dashboard",PINK],["calendar","Soirées","events",PINK],["ticket","Billets","tickets","#7B6CF6"],["gift","Gratuits","free",GREEN],["users","Membres","users","#60A5FA"],["image","Médias","media","#FFB347"]].map(([ico,label,t,col])=>(
                    <div key={t} onClick={()=>setAdminTab(t)} style={{flex:1,padding:"9px 2px 8px",textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all .2s",minWidth:52,position:"relative"}}>
                      <Icon n={ico} s={16} c={adminTab===t?col:GRAY}/>
                      <span style={{fontSize:8,fontWeight:800,color:adminTab===t?col:GRAY,letterSpacing:.4,textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>
                      {adminTab===t&&<div style={{position:"absolute",bottom:0,left:"15%",right:"15%",height:2.5,borderRadius:2,background:`linear-gradient(90deg,${col},${col}88)`}}/>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="scroll" style={{padding:"16px 14px 30px",flex:1}}>

                {/* Dashboard */}
                {adminTab==="dashboard"&&(
                  <div>
                    {/* KPI */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                      {[
                        {icon:<Icon n="dollar" s={20} c={PINK}/>,label:"Revenus",val:`CHF ${totalRev}`,sub:"Total encaissé",color:PINK,bg:"rgba(255,0,128,.06)"},
                        {icon:<Icon n="ticket" s={20} c={"#7B6CF6"}/>,label:"Billets",val:totalSold,sub:`sur ${totalCap} places`,color:"#7B6CF6",bg:"rgba(123,108,246,.06)"},
                        {icon:<Icon n="gift" s={20} c={GREEN}/>,label:"Gratuits",val:freeCount,sub:"Invités / Staff",color:GREEN,bg:"rgba(78,205,196,.06)"},
                        {icon:<Icon n="users" s={20} c={"#60A5FA"}/>,label:"Membres",val:adminUsersLoading?"…":adminUsers.length,sub:"Inscrits",color:"#60A5FA",bg:"rgba(96,165,250,.06)"},
                        {icon:<Icon n="globe" s={20} c={"#F59E0B"}/>,label:"Via Web",val:tickets.filter(t=>t.source==="web").length,sub:"Achetés en ligne",color:"#F59E0B",bg:"rgba(245,158,11,.06)"},
                      ].map(({icon,label,val,sub,color,bg},i)=>(
                        <div key={label} style={{background:bg,borderRadius:18,padding:"16px 14px",border:`1px solid ${color}22`,animation:`slideUp .4s ${i*.07}s both`}}>
                          <div style={{marginBottom:10}}>{icon}</div>
                          <div style={{fontSize:22,fontWeight:900,color,lineHeight:1}}>{val}</div>
                          <div style={{fontSize:12,fontWeight:700,color:WHITE,marginTop:4}}>{label}</div>
                          <div style={{fontSize:10,color:GRAY,marginTop:2}}>{sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Graphique ventes */}
                    {(()=>{
                      const paidTix=tickets.filter(t=>t.type!=="free"&&t.createdAt);
                      const n=chartPeriod;
                      const days=Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(n-1-i));return d;});
                      const dayData=days.map(d=>{
                        const key=d.toISOString().slice(0,10);
                        const dayTix=paidTix.filter(t=>t.createdAt&&normDate(t.createdAt)===key);
                        const label=n===7?d.toLocaleDateString("fr-CH",{weekday:"short"}).slice(0,3):d.toLocaleDateString("fr-CH",{day:"numeric",month:"short"}).replace(" ","");
                        return{label,count:dayTix.length,rev:dayTix.reduce((s,t)=>s+(Number(t.price)||0),0),key};
                      });
                      const maxRev=Math.max(...dayData.map(d=>d.rev),1);
                      const totalPeriod=dayData.reduce((s,d)=>s+d.rev,0);
                      const totalCount=dayData.reduce((s,d)=>s+d.count,0);
                      const W=280,H=80,barW=n===7?32:n===14?16:8,gap=n===7?40:n===14?20:9;
                      const evtBreakdown=events.filter(e=>!e.ended).map(e=>({title:e.title,count:paidTix.filter(t=>t.eventId===e.id).length,rev:paidTix.filter(t=>t.eventId===e.id).reduce((s,t)=>s+(Number(t.price)||0),0)})).filter(e=>e.count>0).sort((a,b)=>b.rev-a.rev);
                      return(
                        <div style={{marginBottom:20}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                            <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>ÉVOLUTION DES VENTES</div>
                            <div style={{display:"flex",gap:6}}>
                              {[7,14,30].map(p=>(
                                <div key={p} onClick={()=>setChartPeriod(p)} style={{padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,cursor:"pointer",background:chartPeriod===p?PINK:"rgba(255,255,255,.06)",color:chartPeriod===p?WHITE:GRAY,border:`1px solid ${chartPeriod===p?PINK:BORDER}`}}>{p}J</div>
                              ))}
                            </div>
                          </div>
                          <div style={{background:BG2,borderRadius:18,padding:"16px 14px 10px",border:`1px solid ${BORDER}`,marginBottom:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                              <div><div style={{fontSize:18,fontWeight:900,color:PINK}}>CHF {totalPeriod}</div><div style={{fontSize:9,color:GRAY,marginTop:2}}>{totalCount} billet{totalCount!==1?"s":""} sur {n} jours</div></div>
                              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:GRAY}}>Moy/jour</div><div style={{fontSize:14,fontWeight:800,color:WHITE}}>CHF {Math.round(totalPeriod/n)}</div></div>
                            </div>
                            {totalCount===0?(
                              <div style={{textAlign:"center",color:GRAY,fontSize:11,padding:"20px 0"}}>Aucune vente sur {n} jours</div>
                            ):(
                              <svg viewBox={`0 0 ${W} ${H+14}`} style={{width:"100%",overflow:"visible",display:"block"}}>
                                <defs>
                                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PINK} stopOpacity=".95"/><stop offset="100%" stopColor="#7B2FFF" stopOpacity=".7"/></linearGradient>
                                  <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PINK} stopOpacity=".15"/><stop offset="100%" stopColor={PINK} stopOpacity="0"/></linearGradient>
                                </defs>
                                {[0,25,50,75,100].map(pct=><line key={pct} x1={0} y1={H*(1-pct/100)} x2={W} y2={H*(1-pct/100)} stroke={BORDER} strokeWidth={.5} strokeDasharray="3,4"/>)}
                                {dayData.map((d,i)=>{
                                  const barH=d.rev>0?Math.max(4,Math.round((d.rev/maxRev)*(H-6))):2;
                                  const x=i*gap+2;
                                  return(
                                    <g key={i}>
                                      <rect x={x} y={d.rev>0?H-barH:H-2} width={barW} height={barH} rx={3} fill={d.rev>0?"url(#chartGrad)":"rgba(255,255,255,.04)"}/>
                                      {d.count>0&&n===7&&<text x={x+barW/2} y={H-barH-4} textAnchor="middle" fill={WHITE} fontSize={7} fontWeight="900">{d.count}</text>}
                                      {(n===7||(n===14&&i%2===0)||(n===30&&i%5===0))&&<text x={x+barW/2} y={H+12} textAnchor="middle" fill={GRAY} fontSize={7} fontWeight="700">{d.label}</text>}
                                    </g>
                                  );
                                })}
                              </svg>
                            )}
                          </div>
                          {evtBreakdown.length>0&&(
                            <div style={{background:BG2,borderRadius:14,padding:"12px 14px",border:`1px solid ${BORDER}`}}>
                              <div style={{fontSize:9,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>PAR ÉVÉNEMENT</div>
                              {evtBreakdown.map((e,i)=>{
                                const pct=Math.round((e.rev/Math.max(...evtBreakdown.map(x=>x.rev),1))*100);
                                return(
                                  <div key={i} style={{marginBottom:10}}>
                                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                      <div style={{fontSize:11,fontWeight:700,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{e.title}</div>
                                      <div style={{fontSize:11,fontWeight:900,color:PINK}}>CHF {e.rev} <span style={{color:GRAY,fontWeight:600}}>({e.count})</span></div>
                                    </div>
                                    <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,.06)"}}>
                                      <div style={{height:"100%",borderRadius:4,background:GRAD,width:`${pct}%`,transition:"width .6s ease"}}/>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Soirées actives */}
                    <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>SOIRÉES ACTIVES</div>
                    {events.filter(e=>!e.ended).length===0?(
                      <div style={{textAlign:"center",padding:"24px 0",color:GRAY,fontSize:13}}>Aucune soirée active</div>
                    ):(
                      events.filter(e=>!e.ended).map((ev,i)=>(
                        <div key={ev.id} style={{display:"flex",gap:12,background:BG2,borderRadius:14,padding:"12px",border:`1px solid ${BORDER}`,marginBottom:8,animation:`rowSlide .3s ${i*.06}s both`}}>
                          {ev.poster?<img src={ev.poster} alt="" style={{width:46,height:46,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<div style={{width:46,height:46,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="calendar" s={18} c={WHITE}/></div>}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                            <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.date}</div>
                            <div style={{fontSize:10,color:GRAY,marginTop:4}}>CHF {ev.price}</div>
                          </div>
                        </div>
                      ))
                    )}

                    <div style={{marginTop:24}}>
                      <div onClick={()=>{setAdminAuth(false);setAdminPass("");goMain();}} style={{padding:"14px 0",borderRadius:14,background:"rgba(255,68,68,.07)",border:"1px solid rgba(255,68,68,.2)",textAlign:"center",fontWeight:900,color:"#FF4444",cursor:"pointer",fontSize:13,letterSpacing:.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        <Icon n="logout" s={15} c="#FF4444"/>SE DÉCONNECTER
                      </div>
                    </div>
                  </div>
                )}

                {/* Soirées */}
                {adminTab==="events"&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>SOIRÉES ({events.length})</div>
                      <div onClick={()=>{setEditEv({});setShowEvForm(true);}} style={{background:GRAD,color:WHITE,padding:"9px 16px",borderRadius:20,fontSize:11,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        NOUVEAU
                      </div>
                    </div>
                    {events.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:12}}>🎉</div><div style={{color:GRAY,fontSize:13}}>Aucune soirée</div></div>
                    ):(
                      events.map((ev,i)=><AdminEventRow key={ev.id} ev={ev} index={i} onEdit={(ev)=>{setEditEv(ev);setShowEvForm(true);}} onToggle={toggleSoldOut} onEnd={toggleEnd} onDelete={(id)=>setDelConfirm(id)} onUpload={handleUpload} onPublish={togglePublished} onPhase={switchPhase}/>)
                    )}
                  </div>
                )}

                {/* Billets */}
                {adminTab==="tickets"&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>TOUS ({tickets.length})</div>
                      {tickets.filter(t=>t.type!=="free").length>0&&<div style={{background:"rgba(123,108,246,.1)",border:"1px solid rgba(123,108,246,.25)",color:"#7B6CF6",padding:"5px 12px",borderRadius:12,fontSize:10,fontWeight:900}}>CHF {tickets.filter(t=>t.type!=="free").reduce((s,t)=>s+(Number(t.price)||0),0)}</div>}
                    </div>
                    {tickets.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:12}}>🎟️</div><div style={{color:GRAY,fontSize:13}}>Aucun billet vendu</div></div>
                    ):(
                      tickets.map((t,i)=>(
                        <div key={t.id} style={{background:BG2,borderRadius:14,padding:"12px 14px",marginBottom:8,border:`1px solid ${BORDER}`,animation:`rowSlide .3s ${i*.03}s both`}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.event}</div>
                              <div style={{fontSize:11,color:GRAY,marginTop:2}}>{t.owner}{t.email?` · ${t.email}`:""}</div>
                            </div>
                            <div onClick={()=>setDelTicketConfirm(t.id)} style={{width:32,height:32,borderRadius:8,background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginLeft:10}}>
                              <Icon n="trash" s={13} c="#FF4444"/>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <div style={{background:"rgba(255,255,255,.05)",borderRadius:8,padding:"3px 8px",fontSize:9,fontWeight:700,color:GRAY}}>{t.date}</div>
                            <div style={{background:t.type==="free"?"rgba(78,205,196,.12)":t.status==="valid"?"rgba(255,0,128,.12)":"rgba(136,146,160,.1)",borderRadius:8,padding:"3px 8px",fontSize:9,fontWeight:700,color:t.type==="free"?GREEN:t.status==="valid"?PINK:GRAY}}>{t.type==="free"?"GRATUIT":t.status==="valid"?"VALIDE":"UTILISÉ"}</div>
                            {t.type!=="free"&&<div style={{background:"rgba(255,179,71,.1)",borderRadius:8,padding:"3px 8px",fontSize:9,fontWeight:700,color:"#FFB347"}}>CHF {t.price}</div>}
                            <div style={{background:t.source==="web"?"rgba(96,165,250,.12)":"rgba(136,146,160,.08)",borderRadius:8,padding:"3px 8px",fontSize:9,fontWeight:700,color:t.source==="web"?"#60A5FA":GRAY}}>{t.source==="web"?"🌐 WEB":"📱 APP"}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Gratuits */}
                {adminTab==="free"&&(
                  <div>
                    {!authUser&&(
                      <div style={{background:"rgba(255,68,68,.07)",border:"1px solid rgba(255,68,68,.25)",borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
                        <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,68,68,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div>
                          <div style={{fontSize:13,fontWeight:900,color:"#FF4444",marginBottom:3}}>Connexion requise</div>
                          <div style={{fontSize:11,color:"#FF8888",lineHeight:1.5}}>Connecte-toi avec ton compte email dans l'app, puis reviens ici pour créer des billets gratuits.</div>
                        </div>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>GRATUITS ({tickets.filter(t=>t.type==="free").length})</div>
                      <div onClick={()=>authUser&&setShowFreeForm(true)} style={{background:authUser?`linear-gradient(135deg,${GREEN},#38B2AC)`:"rgba(78,205,196,.15)",color:authUser?BG:GREEN,padding:"9px 16px",borderRadius:20,fontSize:11,fontWeight:900,cursor:authUser?"pointer":"default",display:"flex",alignItems:"center",gap:6,opacity:authUser?1:.5}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={authUser?BG:GREEN} strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        CRÉER
                      </div>
                    </div>
                    {tickets.filter(t=>t.type==="free").length===0?(
                      <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:12}}>🎁</div><div style={{color:GRAY,fontSize:13}}>Aucun billet gratuit</div></div>
                    ):(
                      tickets.filter(t=>t.type==="free").map((t,i)=>(
                        <div key={t.id} style={{background:"rgba(78,205,196,.05)",borderRadius:14,overflow:"hidden",marginBottom:10,border:`1px solid ${GREEN}33`,animation:`rowSlide .3s ${i*.06}s both`}}>
                          <div style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,fontWeight:800,color:WHITE}}>{t.owner}</div>
                              <div style={{fontSize:11,color:GRAY,marginTop:2}}>{t.event}</div>
                              {t.note&&<div style={{fontSize:10,color:GREEN,marginTop:4}}>📝 {t.note}</div>}
                            </div>
                            <div style={{display:"flex",gap:8,flexShrink:0,marginLeft:10}}>
                              <div onClick={()=>setQrTicket(t)} style={{background:`${GREEN}22`,color:GREEN,padding:"8px 12px",borderRadius:10,fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Icon n="eye" s={13} c={GREEN}/> QR</div>
                              <div onClick={()=>setDelTicketConfirm(t.id)} style={{width:34,height:34,background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.2)",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="trash" s={13} c="#FF4444"/></div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* MÉDIAS */}
                {adminTab==="media"&&(
                  <div>
                    <input ref={mediaFileRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={async(e)=>{
                      const files=Array.from(e.target.files);
                      if(!files.length)return;
                      setMediaUploading(true);
                      const targetId=mediaFileRef.current?.dataset?.eventId||null;
                      let ok=0,fail=0,lastErr="";
                      for(const file of files){
                        const res=await dbUploadMedia(file,targetId?Number(targetId):null);
                        if(res&&!res.startsWith("ERR:"))ok++;
                        else{fail++;if(res&&res.startsWith("ERR:"))lastErr=res.replace("ERR:","");}
                      }
                      const items=await dbLoadMedia();
                      const map={};
                      items.forEach(m=>{const k=m.event_id||"about";if(!map[k])map[k]=[];map[k].push(m);});
                      setEvMedia(map);setAboutMedia(map["about"]||[]);
                      setMediaUploading(false);
                      e.target.value="";
                      if(ok>0)showToast(`✅ ${ok} fichier${ok>1?"s":""} ajouté${ok>1?"s":""}!`);
                      if(fail>0)showToast(`❌ Erreur: ${lastErr||"upload échoué"}`);
                    }}/>

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Gestion médias</div>
                      <div onClick={()=>{if(!mediaUploading){mediaFileRef.current.dataset.eventId="";mediaFileRef.current.click();}}} style={{background:"linear-gradient(135deg,#7B2FFF,#FF0080)",color:WHITE,padding:"9px 14px",borderRadius:20,fontSize:11,fontWeight:900,cursor:mediaUploading?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,opacity:mediaUploading?.6:1}}>
                        {mediaUploading?<div style={{width:11,height:11,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                        {mediaUploading?"Upload en cours...":"+ Galerie générale"}
                      </div>
                    </div>

                    {/* Helper reorder */}
                    {(()=>{
                      const reorder=async(list,from,to,setList,mapKey)=>{
                        const arr=[...list];
                        const[item]=arr.splice(from,1);arr.splice(to,0,item);
                        setList(arr);
                        await dbSavePositions(arr);
                        if(mapKey!==undefined){setEvMedia(prev=>({...prev,[mapKey]:arr}));}
                      };
                      const MediaRow=({m,i,list,setList,mapKey})=>(
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid rgba(255,255,255,.04)`}}>
                          <div style={{width:54,height:54,borderRadius:10,overflow:"hidden",flexShrink:0,background:BG3,position:"relative"}}>
                            {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                            {m.type==="video"&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="8" height="8" viewBox="0 0 24 24" fill={WHITE}><polygon points="5 3 19 12 5 21 5 3"/></svg></div>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:10,fontWeight:700,color:GRAY,textTransform:"uppercase"}}>{m.type} · #{i+1}</div>
                          </div>
                          <div style={{display:"flex",gap:4}}>
                            <div onClick={()=>i>0&&reorder(list,i,i-1,setList,mapKey)} style={{width:28,height:28,borderRadius:8,background:i>0?"rgba(123,47,255,.2)":"rgba(255,255,255,.04)",border:`1px solid ${i>0?"rgba(123,47,255,.4)":BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:i>0?"pointer":"default"}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={i>0?"#7B6CF6":GRAY} strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                            </div>
                            <div onClick={()=>i<list.length-1&&reorder(list,i,i+1,setList,mapKey)} style={{width:28,height:28,borderRadius:8,background:i<list.length-1?"rgba(123,47,255,.2)":"rgba(255,255,255,.04)",border:`1px solid ${i<list.length-1?"rgba(123,47,255,.4)":BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:i<list.length-1?"pointer":"default"}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={i<list.length-1?"#7B6CF6":GRAY} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                            <div onClick={async()=>{if(m.id){await dbDeleteMedia(m.id);const items=await dbLoadMedia();const map={};items.forEach(x=>{const k=x.event_id||"about";if(!map[k])map[k]=[];map[k].push(x);});setEvMedia(map);setAboutMedia(map["about"]||[]);}}} style={{width:28,height:28,borderRadius:8,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </div>
                          </div>
                        </div>
                      );
                      return(
                        <div>
                          {/* Galerie générale */}
                          {aboutMedia.length>0&&(
                            <div style={{marginBottom:20,background:BG2,borderRadius:16,padding:"12px 14px",border:`1px solid ${BORDER}`}}>
                              <div style={{fontSize:10,fontWeight:900,color:"#7B6CF6",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Galerie générale ({aboutMedia.length})</div>
                              {aboutMedia.map((m,i)=><MediaRow key={m.id||i} m={m} i={i} list={aboutMedia} setList={setAboutMedia} mapKey={undefined}/>)}
                            </div>
                          )}
                          {/* Par soirée */}
                          <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Par soirée</div>
                          {events.map((ev,ei)=>(
                            <div key={ev.id} style={{background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:`1px solid ${BORDER}`}}>
                              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:(evMedia[ev.id]||[]).length>0?10:0}}>
                                {ev.poster&&<img src={ev.poster} alt="" style={{width:34,height:34,borderRadius:9,objectFit:"cover",flexShrink:0}}/>}
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:12,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                                  <div style={{fontSize:10,color:GRAY}}>{(evMedia[ev.id]||[]).length} média{(evMedia[ev.id]||[]).length!==1?"s":""}</div>
                                </div>
                                <div onClick={()=>{mediaFileRef.current.dataset.eventId=String(ev.id);mediaFileRef.current.click();}} style={{background:"rgba(123,47,255,.15)",border:"1px solid rgba(123,47,255,.3)",color:"#7B6CF6",padding:"7px 12px",borderRadius:12,fontSize:10,fontWeight:800,cursor:"pointer",flexShrink:0}}>+ Ajouter</div>
                              </div>
                              {(evMedia[ev.id]||[]).map((m,mi)=><MediaRow key={m.id||mi} m={m} i={mi} list={evMedia[ev.id]||[]} setList={newList=>setEvMedia(prev=>({...prev,[ev.id]:newList}))} mapKey={ev.id}/>)}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Membres */}
                {adminTab==="users"&&(
                  <div>
                    {/* Compteur total */}
                    <div style={{background:"rgba(96,165,250,.06)",borderRadius:16,padding:"16px",border:"1px solid rgba(96,165,250,.2)",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:48,height:48,borderRadius:14,background:"rgba(96,165,250,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon n="users" s={22} c="#60A5FA"/>
                      </div>
                      <div>
                        <div style={{fontSize:28,fontWeight:900,color:"#60A5FA",lineHeight:1}}>{adminUsersLoading?"…":adminUsers.length}</div>
                        <div style={{fontSize:12,fontWeight:700,color:WHITE,marginTop:2}}>Membres inscrits</div>
                        <div style={{fontSize:10,color:GRAY,marginTop:1}}>Comptes avec profil actif</div>
                      </div>
                    </div>

                    <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>LISTE DES MEMBRES</div>

                    {adminUsersLoading?(
                      <div style={{textAlign:"center",padding:"30px 0",color:GRAY,fontSize:13}}>Chargement…</div>
                    ):adminUsers.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:12}}>👥</div><div style={{color:GRAY,fontSize:13}}>Aucun membre</div></div>
                    ):(
                      adminUsers.map((u,i)=>{
                        const userTickets=tickets.filter(t=>t.email&&u.email&&t.email.toLowerCase()===u.email?.toLowerCase());
                        const joined=u.created_at?new Date(u.created_at).toLocaleDateString("fr-CH",{day:"2-digit",month:"2-digit",year:"2-digit"}):"—";
                        return(
                          <div key={u.id} style={{background:BG2,borderRadius:14,padding:"12px 14px",marginBottom:8,border:`1px solid ${BORDER}`,animation:`rowSlide .3s ${i*.04}s both`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                                <div style={{width:36,height:36,borderRadius:11,background:"rgba(96,165,250,.12)",border:"1px solid rgba(96,165,250,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,fontWeight:900,color:"#60A5FA"}}>
                                  {(u.pseudo||"?")[0].toUpperCase()}
                                </div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.pseudo||<span style={{color:GRAY,fontStyle:"italic"}}>Sans pseudo</span>}</div>
                                  {u.email&&<div style={{fontSize:10,color:"#60A5FA",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>}
                                  <div style={{fontSize:10,color:GRAY,marginTop:1}}>Inscrit le {joined}</div>
                                </div>
                              </div>
                              <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8,alignItems:"center"}}>
                                {u.points>0&&<div style={{background:"rgba(255,179,71,.1)",borderRadius:8,padding:"3px 7px",fontSize:9,fontWeight:800,color:"#FFB347"}}>⭐ {u.points}</div>}
                                <div onClick={()=>setDelUserConfirm(u.id)} style={{width:32,height:32,borderRadius:9,background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                                  <Icon n="trash" s={13} c="#FF4444"/>
                                </div>
                              </div>
                            </div>
                            {(u.instagram||u.snapchat)&&(
                              <div style={{display:"flex",gap:6,marginTop:8}}>
                                {u.instagram&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:7,padding:"3px 8px",fontSize:9,fontWeight:700,color:GRAY}}>📸 {u.instagram}</div>}
                                {u.snapchat&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:7,padding:"3px 8px",fontSize:9,fontWeight:700,color:GRAY}}>👻 {u.snapchat}</div>}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>

              {/* Scanner, EventForm, FreeTicketForm */}
              {showScanner&&<QRScanner tickets={tickets} events={events} onClose={()=>{setShowScanner(false);setAdminTab("dashboard");}}/>}
              {showEvForm&&editEv!==null&&<EventForm ev={editEv} onSave={saveEventFn} onCancel={()=>{setShowEvForm(false);setEditEv(null);setAdminTab("events");}}/>}
              {showFreeForm&&<FreeTicketForm events={events} onSave={saveFreeTicketFn} onCancel={()=>{setShowFreeForm(false);setAdminTab("free");}}/>}

              {/* Confirmer suppression compte */}
              {delUserConfirm&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:400}}>
                  <div style={{background:BG2,borderRadius:"22px 22px 0 0",padding:"20px 20px 36px",width:"100%",border:`1px solid ${BORDER}`,animation:"slideUp .3s both"}}>
                    <div style={{width:36,height:4,background:BORDER,borderRadius:4,margin:"0 auto 18px"}}/>
                    <div style={{fontSize:17,fontWeight:900,color:WHITE,textAlign:"center",marginBottom:6}}>Supprimer ce compte ?</div>
                    <div style={{fontSize:13,color:GRAY,textAlign:"center",marginBottom:22}}>Le profil et les données seront supprimés.</div>
                    <div style={{display:"flex",gap:10}}>
                      <div onClick={()=>setDelUserConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:14,border:`1px solid ${BORDER}`,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",background:BG3}}>ANNULER</div>
                      <div onClick={()=>deleteUserFn(delUserConfirm)} style={{flex:1,padding:"14px 0",borderRadius:14,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmer suppression soirée */}
              {delConfirm&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:400}}>
                  <div style={{background:BG2,borderRadius:"22px 22px 0 0",padding:"20px 20px 36px",width:"100%",border:`1px solid ${BORDER}`,animation:"slideUp .3s both"}}>
                    <div style={{width:36,height:4,background:BORDER,borderRadius:4,margin:"0 auto 18px"}}/>
                    <div style={{fontSize:17,fontWeight:900,color:WHITE,textAlign:"center",marginBottom:6}}>Supprimer la soirée ?</div>
                    <div style={{fontSize:13,color:GRAY,textAlign:"center",marginBottom:22}}>Cette action est irréversible.</div>
                    <div style={{display:"flex",gap:10}}>
                      <div onClick={()=>setDelConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:14,border:`1px solid ${BORDER}`,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",background:BG3}}>ANNULER</div>
                      <div onClick={()=>deleteEventFn(delConfirm)} style={{flex:1,padding:"14px 0",borderRadius:14,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmer suppression billet */}
              {delTicketConfirm&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:400}}>
                  <div style={{background:BG2,borderRadius:"22px 22px 0 0",padding:"20px 20px 36px",width:"100%",border:`1px solid ${BORDER}`,animation:"slideUp .3s both"}}>
                    <div style={{width:36,height:4,background:BORDER,borderRadius:4,margin:"0 auto 18px"}}/>
                    <div style={{fontSize:17,fontWeight:900,color:WHITE,textAlign:"center",marginBottom:6}}>Supprimer ce billet ?</div>
                    <div style={{fontSize:13,color:GRAY,textAlign:"center",marginBottom:22}}>Cette action est irréversible.</div>
                    <div style={{display:"flex",gap:10}}>
                      <div onClick={()=>setDelTicketConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:14,border:`1px solid ${BORDER}`,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",background:BG3}}>ANNULER</div>
                      <div onClick={()=>deleteTicketFn(delTicketConfirm)} style={{flex:1,padding:"14px 0",borderRadius:14,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {screen==="event"&&selEv&&(
          <div className="sc">
            <LightBeams/>
            <div className="scroll" style={{background:"transparent",position:"relative",zIndex:1}}>
              {/* Hero poster */}
              <div style={{height:selEv.poster?320:200,position:"relative",overflow:"hidden"}}>
                {selEv.poster
                  ?<img src={selEv.poster} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",animation:"heroIn .5s both"}}/>
                  :<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${PINK},#7B2FFF)`}}/>
                }
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(13,17,23,.25) 0%,rgba(13,17,23,.0) 40%,rgba(13,17,23,.98) 100%)"}}/>
                <div onClick={goMain} style={{position:"absolute",top:`calc(env(safe-area-inset-top,20px) + 10px)`,left:16,width:40,height:40,borderRadius:13,background:"rgba(13,17,23,.7)",border:"1px solid rgba(255,255,255,.12)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2}}>
                  <Icon n="back" s={16} c={WHITE}/>
                </div>
                {/* Badge catégorie */}
                {selEv.category&&<div style={{position:"absolute",top:`calc(env(safe-area-inset-top,20px) + 14px)`,right:16,background:"rgba(255,0,128,.25)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,0,128,.4)",borderRadius:20,padding:"4px 12px",fontSize:10,fontWeight:800,color:PINK,zIndex:2}}>{selEv.category}</div>}
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 18px",zIndex:2}}>
                  <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                    {selEv.tags&&selEv.tags.map(t=><div key={t} style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:WHITE}}>{t}</div>)}
                  </div>
                  <div style={{fontSize:28,fontWeight:900,color:WHITE,lineHeight:1.15,textShadow:"0 2px 16px rgba(0,0,0,.9)"}}>{selEv.title}</div>
                </div>
              </div>

              <div style={{padding:"16px 16px 30px"}}>
                {/* Infos principales */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  <div style={{background:BG2,borderRadius:16,padding:"14px",border:`1px solid ${BORDER}`,animation:"evCardIn .3s both"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,0,128,.12)",border:"1px solid rgba(255,0,128,.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:WHITE,marginBottom:2}}>{selEv.date}</div>
                    <div style={{fontSize:10,color:GRAY}}>{selEv.time}</div>
                  </div>
                  <div style={{background:BG2,borderRadius:16,padding:"14px",border:`1px solid ${BORDER}`,animation:"evCardIn .3s .06s both"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(123,108,246,.12)",border:"1px solid rgba(123,108,246,.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7B6CF6" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:WHITE,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selEv.location}</div>
                    <div style={{fontSize:10,color:GRAY}}>{selEv.city||"La Chaux-de-Fonds"}</div>
                  </div>
                  <div style={{background:BG2,borderRadius:16,padding:"14px",border:`1px solid ${BORDER}`,animation:"evCardIn .3s .12s both"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(78,205,196,.12)",border:"1px solid rgba(78,205,196,.25)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:WHITE,marginBottom:2}}>16+</div>
                    <div style={{fontSize:10,color:GRAY}}>Pièce d'identité</div>
                  </div>
                  <div style={{background:BG2,borderRadius:16,padding:"14px",border:`1px solid ${BORDER}`,animation:"evCardIn .3s .18s both"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,215,0,.1)",border:"1px solid rgba(255,215,0,.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,fontSize:16}}>🎟️</div>
                    <div style={{fontSize:13,fontWeight:900,color:PINK,marginBottom:2}}>CHF {selEv.price}</div>
                    <div style={{fontSize:10,color:GRAY}}>par billet</div>
                  </div>
                </div>

                {/* Galerie photos de l'event */}
                {evMedia[selEv.id]&&evMedia[selEv.id].length>0&&(
                  <div style={{marginBottom:14,animation:"evCardIn .4s .2s both"}}>
                    <div style={{fontSize:10,fontWeight:900,color:"#7B6CF6",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Photos de l'événement</div>
                    <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
                      {evMedia[selEv.id].map((m,mi)=>(
                        <div key={m.id||mi} onClick={()=>{setGalleryEv({...selEv,media:evMedia[selEv.id]});setGalleryIdx(mi);setScreen("gallery");}} style={{flexShrink:0,width:110,height:80,borderRadius:14,overflow:"hidden",background:BG3,cursor:"pointer",position:"relative"}}>
                          {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                          {m.type==="video"&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.2)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 24 24" fill={WHITE}><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Line-up */}
                {selEv.lineup&&selEv.lineup.length>0&&(
                  <div style={{background:BG2,borderRadius:16,padding:"15px 16px",marginBottom:14,border:`1px solid ${BORDER}`,animation:"evCardIn .4s .22s both"}}>
                    <div style={{fontSize:10,color:PINK,fontWeight:900,letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>🎧 Line-up</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {selEv.lineup.map((dj,i)=>(
                        <div key={dj} style={{padding:"7px 14px",background:`linear-gradient(135deg,${PINK}15,${BG3})`,borderRadius:20,fontSize:12,fontWeight:800,color:WHITE,border:`1px solid ${PINK}25`,animation:`evCardIn .3s ${i*.05}s both`}}>{dj}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dispo billets */}
                {false&&selEv.capacity>0&&!selEv.ended&&(
                  <div style={{background:BG2,borderRadius:16,padding:"14px 16px",marginBottom:14,border:`1px solid ${BORDER}`,animation:"evCardIn .4s .25s both"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:10,fontWeight:900,color:GRAY,letterSpacing:1.5,textTransform:"uppercase"}}>Disponibilité</div>
                      <div style={{fontSize:11,fontWeight:700,color:selEv.ticketsSold/selEv.capacity>0.8?"#FF6B6B":GREEN}}>{selEv.capacity-(selEv.ticketsSold||0)} places restantes</div>
                    </div>
                    <div style={{height:6,borderRadius:6,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:6,background:selEv.ticketsSold/selEv.capacity>0.8?"linear-gradient(90deg,#FF4444,#FF6B6B)":GRAD,width:`${Math.min(100,Math.round((selEv.ticketsSold||0)/selEv.capacity*100))}%`,transition:"width 1.2s ease",boxShadow:`0 0 10px rgba(255,0,128,.4)`}}/>
                    </div>
                    <div style={{fontSize:10,color:GRAY,marginTop:6}}>{selEv.ticketsSold||0} / {selEv.capacity} billets vendus</div>
                  </div>
                )}

                {/* Quantité + achat */}
                {!selEv.ended&&!selEv.soldOut&&(
                  <div style={{background:"rgba(255,0,128,.06)",border:"1px solid rgba(255,0,128,.15)",borderRadius:20,padding:"18px",marginBottom:14,animation:"evCardIn .4s .3s both"}}>
                    <div style={{fontSize:10,color:PINK,fontWeight:900,letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Nombre de billets</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                      <div style={{display:"flex",gap:16,alignItems:"center"}}>
                        <button onClick={()=>changeQty(-1)} style={{width:44,height:44,borderRadius:14,border:`1px solid ${BORDER}`,background:BG3,color:WHITE,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{fontSize:36,fontWeight:900,color:WHITE,animation:qtyAnim?"qtyBounce .3s both":"none",minWidth:44,textAlign:"center"}}>{qty}</span>
                        <button onClick={()=>changeQty(1)} style={{width:44,height:44,borderRadius:14,border:"none",background:GRAD,color:WHITE,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(255,0,128,.4)"}}>+</button>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:GRAY,fontWeight:700,letterSpacing:1,marginBottom:3}}>TOTAL</div>
                        <div style={{fontSize:32,fontWeight:900,color:PINK,lineHeight:1}}>{selEv.price*qty}<span style={{fontSize:14,fontWeight:700,marginLeft:4}}>CHF</span></div>
                      </div>
                    </div>
                    <div onClick={()=>setScreen("payment")} style={{padding:"16px 0",borderRadius:16,background:GRAD,textAlign:"center",fontWeight:900,fontSize:15,color:WHITE,cursor:"pointer",letterSpacing:.5,boxShadow:"0 8px 28px rgba(255,0,128,.45)"}}>
                      ACHETER — CHF {selEv.price*qty}
                    </div>
                  </div>
                )}

                {selEv.ended&&<div style={{background:"rgba(255,255,255,.04)",border:`1px solid ${BORDER}`,borderRadius:16,padding:"16px 0",textAlign:"center",color:GRAY,fontWeight:800,fontSize:13,letterSpacing:.5,marginBottom:14}}>SOIRÉE TERMINÉE</div>}
                {selEv.soldOut&&!selEv.ended&&<div style={{background:"rgba(255,68,68,.06)",border:"1px solid rgba(255,68,68,.25)",borderRadius:16,padding:"16px 0",textAlign:"center",color:"#FF4444",fontWeight:900,fontSize:14,letterSpacing:.5,marginBottom:14}}>COMPLET</div>}

                {!selEv.ended&&(
                  <div onClick={()=>setScreen("vip")} style={{padding:"15px 0",borderRadius:16,background:"linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,180,0,.06))",border:"1px solid rgba(255,215,0,.3)",textAlign:"center",fontWeight:900,fontSize:14,color:"#FFD700",cursor:"pointer",letterSpacing:.5,boxShadow:"0 4px 20px rgba(255,215,0,.1)"}}>
                    👑 RÉSERVER UNE TABLE VIP
                  </div>
                )}
                <div style={{height:30}}/>
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
                  {[["Prénom","Jean","prenom"],["Nom","Dupont","nom"],["Email","jean@example.ch","email"],["Téléphone","+41 79 000 00 00","tel"]].map(([l,ph,key])=>(
                    <div key={key} style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:PINK,fontWeight:900,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>{l}</div>
                      <input placeholder={ph} className="inp" value={buyerInfo[key]||""} onChange={e=>setBuyerInfo(p=>({...p,[key]:e.target.value}))} type={key==="email"?"email":key==="tel"?"tel":"text"}/>
                    </div>
                  ))}
                  {(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0)*qty;const disc=hasD?Math.round(base*0.3*100)/100:0;const total=base-disc;return(
                  <div style={{background:BG2,borderRadius:14,padding:16,marginBottom:20,border:`1px solid ${hasD?"rgba(255,215,0,.3)":BORDER}`,marginTop:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:WHITE,fontWeight:700,marginBottom:8}}><span>{selEv?.title} × {qty}</span><span>CHF {base}</span></div>
                    {hasD&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#FFD700",fontWeight:800,marginBottom:8}}><span>🏆 Réduction Gold -30%</span><span>- CHF {disc}</span></div>}
                    <div style={{borderTop:`1px solid ${BORDER}`,marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:14,fontWeight:900,color:WHITE}}>TOTAL</span>
                      <span style={{fontSize:20,fontWeight:900,color:hasD?"#FFD700":PINK}}>CHF {total}</span>
                    </div>
                  </div>
                  );})()}
                  <Btn onClick={()=>{if(!buyerInfo.prenom||!buyerInfo.nom||!buyerInfo.email)return;setPayStep(1);}}>CONTINUER</Btn>
                </div>
              )}
              {payStep===1&&(
                <div>
                  <div style={{fontSize:15,fontWeight:900,color:WHITE,marginBottom:16}}>Paiement sécurisé 🔒</div>
                  <div style={{background:BG2,borderRadius:14,padding:16,marginBottom:20,border:`1px solid ${BORDER}`}}>
                    {(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0)*qty;const discounted=hasD?Math.round(base*0.7*100)/100:base;const total=withFees(discounted);const fees=feeAmount(discounted);return(<>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:WHITE,fontWeight:700,marginBottom:6}}><span>{selEv?.title} × {qty}</span><span>CHF {discounted}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:GRAY,marginBottom:8}}><span>Frais de service</span><span>CHF {fees}</span></div>
                      <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:14,color:PINK,fontWeight:900}}><span>Total</span><span>CHF {total}</span></div>
                    </>);})()}
                  </div>
                  {payClientSecret?(
                  Capacitor.isNativePlatform()?(
                    <NativePayButton
                      amount={(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0)*qty;return hasD?Math.round(base*0.7*100)/100:base;})()}
                      clientSecret={payClientSecret}
                      onSuccess={()=>{const name=(buyerInfo.prenom+" "+buyerInfo.nom).trim()||"Client";const email=buyerInfo.email||"";addPaidTicket(email,name);setPayStep(2);}}
                      pendingData={{eventId:selEv?.id,event:selEv?.title,date:selEv?.date,time:selEv?.time,location:selEv?.location,buyerName:(buyerInfo.prenom+" "+buyerInfo.nom).trim()||"Client",buyerEmail:buyerInfo.email,qty,unitPrice:(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0);return hasD?Math.round(base*0.7*100)/100:base;})()}}
                    />
                  ):(
                  <Elements stripe={stripePromise} options={{clientSecret:payClientSecret,appearance:{theme:"night",variables:{colorPrimary:"#FF0080",colorBackground:"#1C2430",colorText:"#FFFFFF",colorDanger:"#FF4444",fontFamily:"DM Sans,sans-serif",borderRadius:"12px"}}}}>
                    <StripePayForm
                      amount={(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0)*qty;return hasD?Math.round(base*0.7*100)/100:base;})()}
                      onSuccess={()=>{const name=(buyerInfo.prenom+" "+buyerInfo.nom).trim()||"Client";const email=buyerInfo.email||"";addPaidTicket(email,name);setPayStep(2);}}
                      pendingData={{eventId:selEv?.id,event:selEv?.title,date:selEv?.date,time:selEv?.time,location:selEv?.location,buyerName:(buyerInfo.prenom+" "+buyerInfo.nom).trim()||"Client",buyerEmail:buyerInfo.email,qty,unitPrice:(()=>{const hasD=(profil?.points||0)>=1000;const base=(selEv?.price||0);return hasD?Math.round(base*0.7*100)/100:base;})()}}
                    />
                  </Elements>
                  )):(
                    <div style={{textAlign:"center",padding:30,color:GRAY,fontSize:14}}>⏳ Initialisation…</div>
                  )}
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
          <div style={{position:"fixed",inset:0,zIndex:300,backdropFilter:"blur(6px)",background:"rgba(0,0,0,.75)"}} onClick={()=>setNotifOpen(false)}>
            <style>{`
              @keyframes notifSlide{from{transform:translateX(110%)}to{transform:translateX(0)}}
              @keyframes notifItemIn{from{transform:translateX(24px);opacity:0}to{transform:translateX(0);opacity:1}}
              @keyframes bellShake{0%,100%{transform:rotate(0)}15%{transform:rotate(18deg)}30%{transform:rotate(-14deg)}45%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}75%{transform:rotate(3deg)}}
              @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}
            `}</style>
            <div style={{position:"absolute",top:0,right:0,bottom:0,width:"88%",maxWidth:360,display:"flex",flexDirection:"column",animation:"notifSlide .38s cubic-bezier(.22,1,.36,1) both"}} onClick={e=>e.stopPropagation()}>

              {/* Header */}
              <div style={{background:`linear-gradient(160deg,#1a0a1e,#0D1117)`,borderBottom:`1px solid rgba(255,0,128,.15)`,padding:`calc(env(safe-area-inset-top,44px) + 14px) 18px 18px`,flexShrink:0,boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:15,background:"linear-gradient(135deg,rgba(255,0,128,.25),rgba(123,47,255,.2))",border:"1px solid rgba(255,0,128,.35)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(255,0,128,.2)"}}>
                      <div style={{animation:"bellShake 2.5s ease-in-out 0.5s"}}><Icon n="bell" s={20} c={PINK}/></div>
                    </div>
                    <div>
                      <div style={{fontSize:19,fontWeight:900,color:WHITE,letterSpacing:.3}}>Notifications</div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:GREEN,animation:"liveDot 1.5s ease-in-out infinite"}}/>
                        <div style={{fontSize:10,color:GRAY,fontWeight:600}}>{events.filter(e=>!e.ended).length} soirée{events.filter(e=>!e.ended).length>1?"s":""} à venir</div>
                      </div>
                    </div>
                  </div>
                  <div onClick={()=>setNotifOpen(false)} style={{width:34,height:34,borderRadius:11,background:"rgba(255,255,255,.06)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                </div>
              </div>

              {/* Corps */}
              <div style={{flex:1,overflowY:"auto",overflowX:"hidden",background:"linear-gradient(180deg,#0f0a14,#0D1117)",padding:"16px 14px"}}>

                {/* Bannière activer */}
                <div style={{borderRadius:20,padding:"16px",marginBottom:18,background:"linear-gradient(135deg,rgba(255,0,128,.14),rgba(123,47,255,.1))",border:"1px solid rgba(255,0,128,.22)",position:"relative",overflow:"hidden",animation:"notifItemIn .4s .05s both"}}>
                  <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,0,128,.12),transparent)"}}/>
                  <div style={{position:"absolute",bottom:-20,left:-20,width:70,height:70,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,255,.1),transparent)"}}/>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,position:"relative"}}>
                    <div style={{fontSize:26,animation:"bellShake 2s ease-in-out 1.2s infinite"}}>🔔</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:900,color:WHITE}}>Ne rate aucune soirée !</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:2}}>Sois le premier informé des nouveautés</div>
                    </div>
                  </div>
                  <div onClick={()=>showToast("🔔 Notifications activées !")} style={{background:GRAD,color:WHITE,padding:"12px 0",borderRadius:13,textAlign:"center",fontWeight:900,fontSize:12,cursor:"pointer",letterSpacing:.8,boxShadow:"0 4px 18px rgba(255,0,128,.35)",position:"relative"}}>
                    ACTIVER LES NOTIFICATIONS
                  </div>
                </div>

                {/* Soirées à venir */}
                {events.filter(e=>!e.ended).length>0&&(
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:PINK,boxShadow:`0 0 8px ${PINK}`,animation:"liveDot 1.5s ease-in-out infinite"}}/>
                      <div style={{fontSize:10,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>Prochaines soirées</div>
                    </div>
                    {events.filter(e=>!e.ended).slice(0,4).map((ev,i)=>(
                      <div key={i} onClick={()=>{setNotifOpen(false);setSelEv(ev);setScreen("event");}} style={{borderRadius:16,padding:"11px 13px",marginBottom:8,background:i===0?"rgba(255,0,128,.07)":BG2,border:`1px solid ${i===0?"rgba(255,0,128,.25)":BORDER}`,display:"flex",gap:11,alignItems:"center",cursor:"pointer",animation:`notifItemIn .35s ${.12+i*.07}s both`,position:"relative",overflow:"hidden"}}>
                        {i===0&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(255,0,128,.03),transparent)",pointerEvents:"none"}}/>}
                        {ev.poster
                          ?<img src={ev.poster} alt="" style={{width:48,height:48,borderRadius:12,objectFit:"cover",flexShrink:0,boxShadow:i===0?"0 0 12px rgba(255,0,128,.3)":"none"}}/>
                          :<div style={{width:48,height:48,borderRadius:12,background:GRAD,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎉</div>
                        }
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                          <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.date} · {ev.city||ev.location}</div>
                          <div style={{fontSize:12,fontWeight:700,color:i===0?PINK:GREEN,marginTop:3}}>CHF {ev.price}</div>
                        </div>
                        {i===0&&<div style={{background:GRAD,borderRadius:20,padding:"3px 9px",fontSize:9,fontWeight:900,color:WHITE,flexShrink:0,letterSpacing:.5}}>NOUVEAU</div>}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5" style={{flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instagram */}
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
              <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"20px"}}>
                <div onClick={()=>{setMenuOpen(false);setScreen("profil");}} style={{background:GRAD,borderRadius:16,padding:"16px 18px",marginBottom:20,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22}}>🎉</span>
                  <div><div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser?"Mon Profil 👤":"Se connecter"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>{authUser?(authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom+" ":"")+authUser.email:"Rejoins la communaute"}</div></div>
                </div>
                <div style={{fontSize:10,color:GRAY,fontWeight:900,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>NAVIGATION</div>
                {[["home","Accueil",()=>{setTab("home");setMenuOpen(false);setScreen("main");}],
                  ["ticket","Mes Billets",()=>{setTab("tickets");setMenuOpen(false);setScreen("main");}],
                  ["image","Galerie",()=>{setTab("gallery");setMenuOpen(false);setScreen("main");}],
                  ["calendar","Agenda",()=>{setTab("agenda");setMenuOpen(false);setScreen("main");}],
                  ["star","VIP",()=>{setMenuOpen(false);setScreen("vip");}],
                  ["info","À propos",()=>{setMenuOpen(false);setScreen("about");}],
                  ["users","Mon Profil",()=>{setMenuOpen(false);setScreen("profil");}]
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

        {showEmailConfirm&&(
          <div style={{position:"absolute",inset:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",zIndex:9999,overflow:"hidden"}}>
            <LightBeams/>
            <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,animation:"slideUp .4s both"}}>
              <div style={{textAlign:"center",marginBottom:28}}>
                <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,rgba(0,230,118,.2),rgba(78,205,196,.15))",border:"1px solid rgba(0,230,118,.4)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:"0 0 40px rgba(0,230,118,.25)"}}>
                  <span style={{fontSize:44}}>✅</span>
                </div>
                <div style={{fontSize:28,fontWeight:900,color:WHITE,marginBottom:8}}>Email confirmé !</div>
                <div style={{fontSize:14,color:GRAY,lineHeight:1.7}}>Merci pour ton inscription.<br/>Ton compte est maintenant actif.</div>
              </div>
              <div style={{background:"rgba(0,230,118,.07)",border:"1px solid rgba(0,230,118,.25)",borderRadius:18,padding:"18px 16px",marginBottom:28}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <span style={{fontSize:24}}>🎉</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:900,color:"#00E676",marginBottom:2}}>Bienvenue dans la communauté !</div>
                    <div style={{fontSize:12,color:GRAY,lineHeight:1.5}}>Tu peux maintenant te connecter et accéder à toutes nos soirées.</div>
                  </div>
                </div>
                <div style={{height:1,background:"rgba(0,230,118,.15)",marginBottom:12}}/>
                <div style={{display:"flex",gap:8}}>
                  {[["🎟️","Achète tes billets"],["📸","Rejoins les groupes"],["⭐","Gagne des points"]].map(([ico,txt])=>(
                    <div key={txt} style={{flex:1,textAlign:"center",background:"rgba(0,230,118,.06)",borderRadius:12,padding:"8px 4px"}}>
                      <div style={{fontSize:18,marginBottom:4}}>{ico}</div>
                      <div style={{fontSize:9,color:GRAY,fontWeight:700,lineHeight:1.3}}>{txt}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div onClick={()=>setShowEmailConfirm(false)} style={{padding:"16px 0",borderRadius:14,background:GRAD,textAlign:"center",fontWeight:900,fontSize:16,color:WHITE,cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 30px rgba(255,0,128,.4)"}}>
                COMMENCER 🚀
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
