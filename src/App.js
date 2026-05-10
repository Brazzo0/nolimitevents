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
const SAFE_TOP="env(safe-area-inset-top, 20px)";
const SAFE_BOT="env(safe-area-inset-bottom, 8px)";

const initialEvents=[];

const initialTickets=[];
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


function TicketsScreen({tickets,events,user}){
  const [tab,setTab]=useState(0);
  const tabs=["À venir","Passés","Tous"];
  const now=new Date();
  const myTickets=tickets.filter(t=>!user||(t.email&&user.email&&t.email.toLowerCase()===user.email.toLowerCase())||t.owner===user.email);
  const filtered=myTickets.filter(t=>{
    const ev=events.find(e=>e.id===t.eventId);
    const d=ev?new Date(ev.date):null;
    if(tab===0)return t.status!=="cancelled"&&(!d||d>=now);
    if(tab===1)return t.status!=="cancelled"&&d&&d<now;
    return true;
  });
  const statusColor={valid:"#00E676",used:"#888",cancelled:"#FF4444"};
  const statusLabel={valid:"✓ Valide",used:"Utilisé",cancelled:"Annulé"};
  return React.createElement("div",{style:{minHeight:"100vh",background:"#0D0D0D",color:"#fff",fontFamily:"system-ui",paddingBottom:80}},
    React.createElement("div",{style:{padding:"60px 20px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
      React.createElement("div",{style:{fontSize:24,fontWeight:800}},"🎟️ Mes Billets"),
      myTickets.length>0&&React.createElement("div",{style:{background:"rgba(255,0,128,0.15)",border:"1px solid rgba(255,0,128,0.4)",color:"#FF0080",padding:"4px 12px",borderRadius:20,fontSize:13,fontWeight:700}},myTickets.length+" billet"+(myTickets.length>1?"s":""))
    ),
    React.createElement("div",{style:{display:"flex",gap:8,padding:"0 20px 16px"}},
      tabs.map((t,i)=>React.createElement("button",{key:t,onClick:()=>setTab(i),style:{padding:"8px 18px",borderRadius:20,border:"1px solid "+(tab===i?"#FF0080":"#333"),background:tab===i?"#FF0080":"transparent",color:tab===i?"#fff":"#888",fontSize:14,fontWeight:600,cursor:"pointer"}},t))
    ),
    React.createElement("div",{style:{padding:"0 16px"}},
      filtered.length===0?
        React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",gap:10}},
          React.createElement("div",{style:{fontSize:52}},"🎟️"),
          React.createElement("div",{style:{fontSize:18,fontWeight:700}},"Aucun billet"),
          React.createElement("div",{style:{fontSize:14,color:"#666"}},"Achète des billets pour les prochains events !")
        ):
        filtered.map(t=>{
          const ev=events.find(e=>e.id===t.eventId);
          const sc=statusColor[t.status]||"#00E676";
          const sl=statusLabel[t.status]||"✓ Valide";
          return React.createElement("div",{key:t.id,style:{display:"flex",gap:14,background:"#1A1A1A",borderRadius:16,padding:14,border:"1px solid #2A2A2A",marginBottom:12}},
            React.createElement("div",{style:{position:"relative",flexShrink:0}},
              ev&&ev.poster?
                React.createElement("img",{src:ev.poster,style:{width:70,height:85,borderRadius:10,objectFit:"cover"}}):
                React.createElement("div",{style:{width:70,height:85,borderRadius:10,background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}},"🎉"),
              React.createElement("div",{style:{position:"absolute",bottom:4,left:0,right:0,textAlign:"center",fontSize:9,fontWeight:700,padding:"2px 4px",borderRadius:6,background:sc+"22",color:sc,border:"1px solid "+sc+"55"}},sl)
            ),
            React.createElement("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4}},
              React.createElement("div",{style:{fontSize:15,fontWeight:800}},(ev&&ev.title)||t.event||"Soirée"),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"📅 "+(ev&&ev.date?new Date(ev.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):t.date||"—")),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"📍 "+(ev&&ev.location||t.location||"Eden Night Club")),
              React.createElement("div",{style:{fontSize:12,color:"#888"}},"🎟️ "+(t.type||"Standard")+" · CHF "+(t.price||"—")),
              t.note&&React.createElement("div",{style:{fontSize:11,color:"#FF0080",marginTop:2}},"📝 "+t.note)
            )
          );
        })
    )
  );
}

function GroupsScreen({authUser,supabase}){
  const [groups,setGroups]=useState([]);
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmoji,setNewEmoji]=useState("🔥");
  const [creating,setCreating]=useState(false);
  const [copied,setCopied]=useState(null);
  const EMOJIS=["🦁","🔥","🌙","🎉","⚡","👑","💎","🚀","🎯","💫"];

  useEffect(()=>{
    if(!authUser)return;
    supabase.from("group_members").select("group_id,groups(id,name,emoji)").eq("user_id",authUser.id).then(({data})=>{
      if(data)setGroups(data.map(d=>d.groups).filter(Boolean));
    });
  },[authUser]);

  async function fetchGroups(){
    setLoading(true);
    const{data}=await supabase.from("group_members").select("group_id,groups(id,name,emoji,owner_id)").eq("user_id",authUser.id);
    if(data){
      const gs=data.map(d=>d.groups).filter(Boolean);
      const withCounts=await Promise.all(gs.map(async g=>{
        const{count}=await supabase.from("group_members").select("*",{count:"exact",head:true}).eq("group_id",g.id);
        return{...g,member_count:count||1};
      }));
      setGroups(withCounts);
    }
    setLoading(false);
  }




  const createGroup=async()=>{
    if(!newName.trim()||!authUser)return;
    setCreating(true);
    const{data,error}=await supabase.from("groups").insert({name:newName.trim(),emoji:newEmoji,owner_id:authUser.id}).select().single();
    if(!error&&data){
      await supabase.from("group_members").insert({group_id:data.id,user_id:authUser.id,role:"owner"});
      setGroups(p=>[...p,data]);
      setNewName("");setShowCreate(false);
    }
    setCreating(false);
  };

  const copyInvite=(g)=>{
    navigator.clipboard.writeText("https://nolimitevents.vercel.app/join/"+g.id);
    setCopied(g.id);setTimeout(()=>setCopied(null),2000);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,#1a0a2e 0%,#0D0D0D 40%,#1a0010 100%)",zIndex:100,display:"flex",flexDirection:"column"}}>
      <div style={{margin:"50px 16px 16px",background:"linear-gradient(135deg,#7B2FFF,#FF0080)",borderRadius:24,padding:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 30px rgba(123,47,255,0.4)",flexShrink:0}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>MES GROUPES</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{groups.length===0?"Crée ton premier groupe":groups.length+" groupe"+(groups.length>1?"s":"")}</div>
        </div>
        <div onClick={()=>setShowCreate(true)} style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.95)",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7B2FFF",fontWeight:700}}>＋</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 100px"}}>
        {groups.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 16px",gap:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              {["🦁","🔥","🌙","🎉","⚡"].map((e,i)=>(
                <div key={i} style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{e}</div>
              ))}
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:8}}>Crée ton premier groupe</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>Invite tes amis pour synchroniser vos events et cumuler des points ensemble.</div>
            </div>
            <div onClick={()=>setShowCreate(true)} style={{width:"100%",padding:"16px 0",borderRadius:30,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:700,fontSize:17,color:"#fff",cursor:"pointer"}}>+ Créer un groupe</div>
          </div>
        ):(
          <div>
            {groups.map(g=>(
              <div key={g.id} style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.08)",borderRadius:20,padding:"16px",marginBottom:12,border:"1px solid rgba(255,255,255,0.1)"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.emoji||"👥"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{g.name}</div>
                </div>
                <div onClick={()=>copyInvite(g)} style={{padding:"8px 14px",background:copied===g.id?"#00C853":"linear-gradient(135deg,#FF0080,#FF3399)",color:"#fff",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {copied===g.id?"✓ Copié !":"Inviter"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
        {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
          <div key={s} onClick={()=>{if(s==="agenda"){}else if(s==="events"){window.dispatchEvent(new CustomEvent("navigate",{detail:"events"}));}else if(s==="tickets"){window.dispatchEvent(new CustomEvent("navigate",{detail:"tickets"}));}else if(s==="profil"){window.dispatchEvent(new CustomEvent("navigate",{detail:"profil"}));}else{window.dispatchEvent(new CustomEvent("navigate",{detail:s}));}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
            <Icon n={ico} s={20} c={s==="agenda"?"#FF0080":"#8892A0"}/>
            <span style={{fontSize:9,fontWeight:700,color:s==="agenda"?"#FF0080":"#8892A0"}}>{label}</span>
            {s==="agenda"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
          </div>
        ))}
      </div>
      {showCreate&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{width:"100%",maxWidth:420,background:"#141414",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>Créer un groupe</span>
              <div onClick={()=>setShowCreate(false)} style={{background:"#222",color:"#888",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✕</div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:10}}>Icône</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {EMOJIS.map(e=>(
                  <div key={e} onClick={()=>setNewEmoji(e)} style={{width:46,height:46,borderRadius:12,fontSize:24,background:newEmoji===e?"rgba(255,0,128,0.2)":"#222",border:"2px solid "+(newEmoji===e?"#FF0080":"transparent"),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:13,color:"#888",marginBottom:8}}>Nom du groupe</div>
              <input style={{width:"100%",padding:"14px",background:"#222",border:"1px solid #333",borderRadius:12,color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"}} placeholder="Ex: La team Eden 🔥" value={newName} onChange={e=>setNewName(e.target.value)} maxLength={30}/>
            </div>
            <div onClick={createGroup} style={{padding:"14px",background:newName.trim()&&!creating?"linear-gradient(135deg,#FF0080,#FF3399)":"#333",color:"#fff",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer",textAlign:"center",opacity:newName.trim()&&!creating?1:0.5}}>
              {creating?"Création...":"Créer "+newEmoji+" "+newName}
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
    <div style={{display:"flex",background:BG2,borderTop:"1px solid "+BORDER,paddingTop:8,paddingBottom:SAFE_BOT,flexShrink:0,position:"fixed",bottom:0,left:0,right:0,zIndex:200}}>
      {tabs.map(([s,label,ico])=>(
        <div key={s} onClick={()=>{
          if(s==="profil"&&onProfil){onProfil();}
          else if(s==="events"&&onEvents){onEvents();}
          else if(s==="tickets"){if(onTickets)onTickets();}
          else if(s==="agenda"){if(onGroups)onGroups();}
          else{onNav(s);}
        }} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:current===s?"rgba(255,0,128,.15)":"transparent",transition:"all .2s"}}>
            <Icon n={ico} s={20} c={current===s?PINK:GRAY}/>
          </div>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:.3,color:current===s?PINK:GRAY}}>{label}</span>
          {current===s&&<div style={{width:16,height:2.5,borderRadius:2,background:GRAD}}/>}
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
  const [onbStep,setOnbStep]=useState(0);
  const [onbDone,setOnbDone]=useState(false);
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [regPrenom,setRegPrenom]=useState("");
  const [regNom,setRegNom]=useState("");
  const [regEmail,setRegEmail]=useState("");
  const [regPass,setRegPass]=useState("");
  const [regErr,setRegErr]=useState("");
  const [regDone,setRegDone]=useState(false);
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
  const [delTicketConfirm,setDelTicketConfirm]=useState(null);
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
  useEffect(()=>{
    if(screen==="splash"){
      const t=setTimeout(()=>{
        setScreen("onboarding");
      },2500);
      return()=>clearTimeout(t);
    }
  },[screen,authUser]);

  const goMain=()=>{setSelEv(null);setPayStep(0);setScreen("main");};
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user||null);
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
    else{setLoginEmail("");setLoginPass("");setScreen("main");}
  };
  const doRegister=async()=>{
    setRegErr("");
    if(!regPrenom||!regNom||!regEmail||!regPass){setRegErr("Remplis tous les champs !");return;}
    if(regPass.length<6){setRegErr("Mot de passe trop court (6 min)");return;}
    const{error}=await supabase.auth.signUp({email:regEmail,password:regPass,options:{data:{prenom:regPrenom,nom:regNom}}});
    if(error){setRegErr(error.message);}
    else{setRegDone(true);}
  };
  const doLogout=async()=>{await supabase.auth.signOut();setAuthUser(null);setScreen("main");};
  const loadProfil=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){setProfil(data);setProfilPseudo(data.pseudo||"");setProfilInsta(data.instagram||"");setProfilSnap(data.snapchat||"");}
    else{await supabase.from("profiles").insert({id:uid,pseudo:"",instagram:"",snapchat:"",points:0});setProfil({pseudo:"",instagram:"",snapchat:"",points:0});}
  };
  const saveProfil=async()=>{
    if(!authUser)return;
    setProfilSaving(true);setProfilErr("");
    if(profilPseudo&&profilPseudo.length<3){setProfilErr("Pseudo trop court (3 min)");setProfilSaving(false);return;}
    const{error}=await supabase.from("profiles").upsert({id:authUser.id,pseudo:profilPseudo,instagram:profilInsta,snapchat:profilSnap,points:profil?.points||0});
    if(error){setProfilErr("Pseudo déjà pris !");} else{setProfil(p=>({...p,pseudo:profilPseudo,instagram:profilInsta,snapchat:profilSnap}));setProfilEdit(false);}
    setProfilSaving(false);
  };
  useEffect(()=>{if(authUser)loadProfil(authUser.id);},[authUser]);
  const openEv=(ev)=>{setSelEv(events.find(e=>e.id===ev.id));setQty(1);setScreen("event");};
  const changeQty=(d)=>{setQty(q=>Math.min(10,Math.max(1,q+d)));setQtyAnim(true);setTimeout(()=>setQtyAnim(false),300);};
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
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
  const deleteTicketFn=async(id)=>{await dbDeleteTicket(id);setTickets(p=>p.filter(t=>t.id!==id));setDelTicketConfirm(null);showToast("🗑️ Billet supprimé");};
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
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",paddingBottom:"60px"}}>


              {tab==="home"&&(
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  <div className="scroll" style={{padding:"0 0 20px"}}>
                    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.2),rgba(255,51,153,.05))",borderRadius:"0 0 24px 24px",padding:"50px 16px 16px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <img src={LOGO} alt="" onClick={tapLogo} style={{width:65,height:65,objectFit:"contain",filter:"drop-shadow(0 0 14px rgba(255,0,128,.7))",animation:"pulse 2s ease-in-out infinite",cursor:"pointer"}}/>
                          <div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{new Date().getHours()<12?"Bonjour":new Date().getHours()<18?"Bon apres-midi":"Bonsoir"}</div>
                            <div style={{fontSize:15,fontWeight:900,color:WHITE}}>{authUser&&authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom:"No Limiter"} !</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>

                          <div onClick={()=>setNotifOpen(true)} style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                            <Icon n="bell" s={16} c={WHITE}/>
                            <div style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:PINK}}/>
                          </div>
                        </div>
                      </div>
                      <div style={{position:"relative",marginBottom:12}}>
                        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={14} c={GRAY}/></div>
                        <input type="text" placeholder="Rechercher une soiree..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:WHITE,fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:GRAY,cursor:"pointer",fontSize:16}}>x</div>}
                      </div>
                      <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
                        {[
                          ["trophy","Fidelite",()=>setScreen("profil")],
                          ["ticket","Billets",()=>setTab("tickets")],
                          ["star","VIP",()=>setScreen("vip")],
                          ["users","Profil",()=>setScreen("profil")]
                        ].map(([ico,label,action])=>(
                          <div key={label} onClick={action} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
                            <div style={{width:50,height:50,borderRadius:"50%",background:"transparent",border:"2px solid "+PINK,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Icon n={ico} s={20} c={PINK} fill={ico==="star"?PINK:"none"}/>
                            </div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",textAlign:"center",letterSpacing:.5}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {authUser&&(
                      <div style={{margin:"0 16px 16px",background:BG2,borderRadius:16,padding:"14px 16px",border:"1px solid "+BORDER}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,165,0,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB347" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
</div>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <div style={{fontSize:13,fontWeight:800,color:"#FFB347"}}>Bronze</div>
                              <div style={{fontSize:11,color:GRAY}}>{profil?profil.points||0:0} pts</div>
                            </div>
                            <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,.1)",overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#FFB347,#FF8C00)",width:((profil?profil.points||0:0)/500*100)+"%",transition:"width 1s ease"}}/>
                            </div>
                            <div style={{fontSize:10,color:GRAY,marginTop:3}}>Encore {500-(profil?profil.points||0:0)} pts pour Argent</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!search&&events.filter(e=>!e.ended).length>0&&(
                      <div style={{margin:"0 16px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{fontSize:16,fontWeight:900,color:WHITE}}>A la une</div>
                          <div onClick={()=>setScreen("events")} style={{fontSize:12,color:PINK,fontWeight:700,cursor:"pointer"}}>Voir tout</div>
                        </div>
                        <div style={{borderRadius:20,overflow:"hidden",position:"relative",height:190,background:BG2,cursor:"pointer"}} onClick={()=>{const ev=events.filter(e=>!e.ended)[0];if(ev)openEv(ev);}}>
                          {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].poster?<img src={events.filter(e=>!e.ended)[0].poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,rgba(255,0,128,.3),rgba(255,51,153,.1))"}}/>}
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(13,17,23,.95) 100%)"}}/>
                          <div style={{position:"absolute",top:12,left:12,background:GRAD,color:WHITE,fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:20,animation:"pulse 2s ease-in-out infinite"}}>⭐ A LA UNE</div>
                          <div style={{position:"absolute",bottom:14,left:14,right:14}}>
                            <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:2}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].title}</div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].date} • {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].location}</div>
                            <div style={{fontSize:13,fontWeight:900,color:PINK,marginTop:4}}>CHF {events.filter(e=>!e.ended)[0]&&events.filter(e=>!e.ended)[0].price}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!search&&events.filter(e=>!e.ended).length>0&&(
                      <div style={{margin:"0 16px 16px"}}>
                        <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:10}}>A venir</div>
                        {events.filter(e=>!e.ended).map((ev,i)=>(
                          <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,cursor:"pointer",animation:"rowSlide .4s "+i*.08+"s both"}}>
                            <div style={{width:52,height:52,borderRadius:12,background:GRAD,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                              {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[1]||"?"}</div><div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div></div>}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:14,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                              <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.location} • {ev.time}</div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:13,fontWeight:900,color:PINK}}>CHF {ev.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

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
                  ):(
                    <div>
                      {(()=>{const upcoming=myTickets.filter(t=>t.status==="valid"||t.status==="upcoming");return upcoming.length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:11,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>A Venir</div>
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

              {tab==="events"&&(<div style={{position:"fixed",top:0,left:0,right:0,bottom:60,background:"#0D1117",zIndex:50,overflowY:"auto",padding:"70px 16px 20px"}}><div style={{fontSize:22,fontWeight:900,color:"#FFFFFF",marginBottom:20}}>TEST EVENTS</div></div>)}{tab==="events_old"&&(
                <div style={{position:"absolute",inset:0,overflowY:"auto",padding:"20px 16px",paddingBottom:80,zIndex:2,background:BG}}>
                  <div style={{fontSize:22,fontWeight:900,color:WHITE,marginBottom:6}}>Evenements</div>
                  <div style={{fontSize:13,color:PINK,fontWeight:700,marginBottom:20}}>La Chaux-de-Fonds</div>
                  <div style={{marginBottom:20}}>
                    <CalendarWidget events={events}/>
                  </div>
                  {events.length===0?(
                    <div style={{textAlign:"center",padding:"60px 0"}}>
                      <div style={{fontSize:48,marginBottom:16}}>🎉</div>
                      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8}}>Aucun evenement</div>
                      <div style={{fontSize:13,color:GRAY}}>Reviens bientot !</div>
                    </div>
                  ):(
                    <div>
                      {events.filter(e=>!e.ended).length>0&&(
                        <div style={{marginBottom:24}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:GRAD,borderRadius:4}}/>
                            <div style={{fontSize:12,fontWeight:900,color:PINK,letterSpacing:2,textTransform:"uppercase"}}>A venir</div>
                            <div style={{background:"rgba(255,0,128,.15)",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,color:PINK}}>{events.filter(e=>!e.ended).length}</div>
                          </div>
                          {events.filter(e=>!e.ended).map((ev,i)=>(
                            <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,cursor:"pointer",animation:"rowSlide .4s "+i*.08+"s both"}}>
                              <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,background:GRAD}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
                                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                  <div style={{fontSize:14,fontWeight:900,color:WHITE}}>{ev.date.split(" ")[1]||"?"}</div>
                                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div>
                                </div>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.location}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:1}}>{ev.date} • {ev.time}</div>
                              </div>
                              <div style={{textAlign:"right",flexShrink:0}}>
                                <div style={{fontSize:14,fontWeight:900,color:PINK}}>CHF {ev.price}</div>
                                <div style={{fontSize:9,color:GRAY,marginTop:2,background:BG3,padding:"2px 8px",borderRadius:10}}>{ev.category||"Soiree"}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {events.filter(e=>e.ended).length>0&&(
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <div style={{width:3,height:18,background:BG3,borderRadius:4,border:"1px solid "+BORDER}}/>
                            <div style={{fontSize:12,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase"}}>Terminees</div>
                          </div>
                          {events.filter(e=>e.ended).map((ev,i)=>(
                            <div key={ev.id} style={{display:"flex",gap:12,alignItems:"center",background:BG2,borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid "+BORDER,opacity:.6}}>
                              <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,background:BG3}}>
                                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%"}}/>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,fontWeight:800,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                                <div style={{fontSize:11,color:GRAY,marginTop:2}}>{ev.date}</div>
                              </div>
                              <div style={{background:"rgba(255,255,255,.1)",padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:900,color:GRAY}}>TERMINEE</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {tab==="agenda"&&(
                <div style={{position:"absolute",inset:0,zIndex:10}}>
                  {React.createElement(GroupsScreen,{authUser:authUser,supabase:supabase})}
                </div>
              )}
              {false&&(
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

              </div>
              )}

              <NavBar current={tab} onNav={navHandler} onProfil={()=>setScreen("profil")} onEvents={()=>setScreen("events")} onTickets={()=>setScreen("tickets")} onGroups={()=>setScreen("groups")}/>
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
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Chaque soiree est une nouvelle surprise. Decouvre les meilleurs evenements pres de chez toi.</div>
        </div>
      )}
      {onbStep===1&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Vos billets, simplifies</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>QR code securise, achat en 2 clics, acces VIP exclusifs. Tout dans ta poche.</div>
        </div>
      )}
      {onbStep===2&&(
        <div style={{animation:"slideUp .4s both"}}>
          <div style={{width:100,height:100,borderRadius:28,background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px",boxShadow:"0 0 60px rgba(255,0,128,.5)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:"#FFFFFF",marginBottom:12,lineHeight:1.2}}>Partagez l experience</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>Rejoins la communaute No Limit. Retrouve tes amis, partage tes soirees et vis l experience a fond.</div>
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
  <div style={{position:"absolute",inset:0,background:"#0D1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,zIndex:100}}>
    <img src={LOGO} alt="" style={{width:80,height:80,objectFit:"contain",marginBottom:20,filter:"drop-shadow(0 0 20px rgba(255,0,128,.6))",animation:"pulse 2s ease-in-out infinite"}}/>
    <div style={{fontSize:24,fontWeight:900,color:"#FFFFFF",marginBottom:6,letterSpacing:1}}>Connexion</div>
    <div style={{fontSize:13,color:"#8892A0",marginBottom:28}}>Content de te revoir !</div>
    <input type="email" placeholder="Adresse email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>
    <input type="password" placeholder="Mot de passe" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
    {loginErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center"}}>{loginErr}</div>}
    <div onClick={doLogin} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE CONNECTER</div>
    <div style={{fontSize:13,color:"#8892A0",marginBottom:20}}>Pas encore de compte ? <span onClick={()=>setScreen("register")} style={{color:"#FF0080",fontWeight:700,cursor:"pointer"}}>S inscrire</span></div>
    <div onClick={()=>setScreen("main")} style={{fontSize:12,color:"#8892A0",cursor:"pointer"}}>Continuer sans compte</div>
  </div>
)}
{screen==="register"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{padding:"60px 24px 40px"}}>
      <img src={LOGO} alt="" style={{width:60,height:60,objectFit:"contain",display:"block",margin:"0 auto 16px",filter:"drop-shadow(0 0 16px rgba(255,0,128,.6))"}}/>
      <div style={{fontSize:24,fontWeight:900,color:"#FFFFFF",marginBottom:6,letterSpacing:1,textAlign:"center"}}>Créer un compte</div>
      <div style={{fontSize:13,color:"#8892A0",marginBottom:28,textAlign:"center"}}>Rejoins la communaute No Limit !</div>
      {regDone?(
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>🎉</div>
          <div style={{fontSize:20,fontWeight:900,color:"#FFFFFF",marginBottom:8}}>Compte cree !</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:24}}>Verifie ton email pour confirmer ton compte.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",letterSpacing:1}}>SE CONNECTER</div>
        </div>
      ):(
        <div>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            <input type="text" placeholder="Prenom" value={regPrenom} onChange={e=>setRegPrenom(e.target.value)} style={{flex:1,padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            <input type="text" placeholder="Nom" value={regNom} onChange={e=>setRegNom(e.target.value)} style={{flex:1,padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <input type="email" placeholder="Adresse email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>
          <input type="password" placeholder="Mot de passe (6 min)" value={regPass} onChange={e=>setRegPass(e.target.value)} style={{width:"100%",padding:"14px 16px",background:"#141A22",border:"1.5px solid #1E2A38",borderRadius:14,color:"#FFFFFF",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
          {regErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:12,textAlign:"center"}}>{regErr}</div>}
          <div onClick={doRegister} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>CREER MON COMPTE</div>
          <div style={{fontSize:13,color:"#8892A0",textAlign:"center"}}>Deja un compte ? <span onClick={()=>setScreen("login")} style={{color:"#FF0080",fontWeight:700,cursor:"pointer"}}>Se connecter</span></div>
        </div>
      )}
    </div>
  </div>
)}
{screen==="profil"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{background:"linear-gradient(135deg,rgba(255,0,128,.25),rgba(255,51,153,.05))",padding:"60px 24px 30px",textAlign:"center",position:"relative"}}>
      <div style={{width:86,height:86,borderRadius:"50%",background:"linear-gradient(135deg,#FF0080,#FF3399)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,color:"#FFFFFF",margin:"0 auto 14px",boxShadow:"0 0 40px rgba(255,0,128,.5)"}}>
        {authUser?(authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom[0].toUpperCase():"U"):"?"}
      </div>
      <div style={{fontSize:21,fontWeight:900,color:"#FFFFFF",marginBottom:2}}>
        {authUser?((authUser.user_metadata&&authUser.user_metadata.prenom?authUser.user_metadata.prenom+" ":"")+(authUser.user_metadata&&authUser.user_metadata.nom?authUser.user_metadata.nom:""))||"Utilisateur":"Non connecte"}
      </div>
      {profil&&profil.pseudo&&<div style={{fontSize:13,color:"#FF0080",fontWeight:700,marginBottom:4}}>{"@"+profil.pseudo}</div>}
      <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:16}}>{authUser?authUser.email:""}</div>
      <div style={{display:"flex",justifyContent:"center",gap:20}}>
        {[["🎟️",tickets.filter(t=>authUser&&t.email===authUser.email).length,"Billets"],["⭐",profil?profil.points||0:0,"Points"],["📅",events.filter(e=>!e.ended).length,"Events"]].map(([emoji,val,label])=>(
          <div key={label} style={{textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:"#FFFFFF"}}>{val}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"20px 24px 40px"}}>
      {authUser?(
        <div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase"}}>Mon Pseudo Social</div>
              <div onClick={()=>setProfilEdit(!profilEdit)} style={{fontSize:11,fontWeight:700,color:"#FF0080",cursor:"pointer"}}>{profilEdit?"ANNULER":"MODIFIER"}</div>
            </div>
            {profilEdit?(
              <div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Pseudo @</div>
                  <input type="text" placeholder="tonpseudo" value={profilPseudo} onChange={e=>setProfilPseudo(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Instagram</div>
                  <input type="text" placeholder="@toninstagram" value={profilInsta} onChange={e=>setProfilInsta(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Snapchat</div>
                  <input type="text" placeholder="tonsnapchat" value={profilSnap} onChange={e=>setProfilSnap(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"#1C2430",border:"1.5px solid #1E2A38",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                {profilErr&&<div style={{color:"#FF4444",fontSize:12,fontWeight:700,marginBottom:8,textAlign:"center"}}>{profilErr}</div>}
                <div onClick={saveProfil} style={{padding:"13px 0",borderRadius:12,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:13,color:"#FFFFFF",cursor:"pointer",letterSpacing:1}}>{profilSaving?"SAUVEGARDE...":"SAUVEGARDER"}</div>
              </div>
            ):(
              <div>
                {[["@",profil&&profil.pseudo?"@"+profil.pseudo:"Non defini","Pseudo"],["📸",profil&&profil.instagram?profil.instagram:"Non renseigne","Instagram"],["👻",profil&&profil.snapchat?profil.snapchat:"Non renseigne","Snapchat"]].map(([icon,val,label])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #1E2A38"}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,0,128,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                    <div><div style={{fontSize:10,color:"#8892A0",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:13,color:"#FFFFFF",fontWeight:600,marginTop:1}}>{val}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{background:"#141A22",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1E2A38"}}>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Mon Compte</div>
            {[["📧","Email",authUser.email],["👤","Prenom",(authUser.user_metadata&&authUser.user_metadata.prenom)||"-"],["👤","Nom",(authUser.user_metadata&&authUser.user_metadata.nom)||"-"]].map(([icon,label,val])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #1E2A38"}}>
                <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,0,128,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                <div><div style={{fontSize:10,color:"#8892A0",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div><div style={{fontSize:13,color:"#FFFFFF",fontWeight:600,marginTop:1}}>{val}</div></div>
              </div>
            ))}
          </div>
          <div onClick={doLogout} style={{width:"100%",padding:"15px 0",borderRadius:14,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",textAlign:"center",fontWeight:900,fontSize:14,color:"#FF4444",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE DECONNECTER</div>
        </div>
      ):(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>👤</div>
          <div style={{fontSize:18,fontWeight:900,color:"#FFFFFF",marginBottom:8}}>Pas encore connecte</div>
          <div style={{fontSize:13,color:"#8892A0",marginBottom:24}}>Connecte-toi pour acceder a tes billets et ton profil.</div>
          <div onClick={()=>setScreen("login")} style={{padding:"15px 0",borderRadius:14,background:"linear-gradient(135deg,#FF0080,#FF3399)",textAlign:"center",fontWeight:900,fontSize:15,color:"#FFFFFF",cursor:"pointer",marginBottom:12,letterSpacing:1}}>SE CONNECTER</div>
          <div onClick={()=>setScreen("register")} style={{padding:"15px 0",borderRadius:14,background:"transparent",border:"1.5px solid #FF0080",textAlign:"center",fontWeight:900,fontSize:15,color:"#FF0080",cursor:"pointer",letterSpacing:1}}>CREER UN COMPTE</div>
        </div>
      )}
      <div onClick={()=>setScreen("main")} style={{padding:"15px 0",borderRadius:14,textAlign:"center",fontWeight:900,fontSize:13,color:"#8892A0",cursor:"pointer",letterSpacing:1}}>RETOUR</div>
    </div>
  </div>
)}
{screen==="about"&&(
  <div style={{position:"absolute",inset:0,background:"#0D1117",overflowY:"auto",zIndex:100}}>
    <div style={{position:"relative",height:320,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,0,128,.15),rgba(255,51,153,.05))"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 60%,rgba(255,0,128,.25),transparent 70%)"}}/>
      <img src={LOGO} alt="" style={{width:120,height:120,objectFit:"contain",position:"relative",zIndex:2,animation:"aboutPulse 3s ease-in-out infinite",filter:"drop-shadow(0 0 40px rgba(255,0,128,.8))"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",marginTop:16}}>
        <div style={{fontSize:26,fontWeight:900,color:"#FFFFFF",letterSpacing:2,textTransform:"uppercase"}}>No Limit Events</div>
        <div style={{fontSize:13,color:"#FF0080",fontWeight:700,marginTop:4,letterSpacing:3,textTransform:"uppercase"}}>La Chaux-de-Fonds</div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,#0D1117)"}}/>
    </div>
    <div style={{padding:"0 20px 40px"}}>
      <div style={{background:"#141A22",borderRadius:20,padding:20,marginBottom:16,border:"1px solid #1E2A38"}}>
        <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Notre Histoire</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.7}}>Fondée en 2026 à La Chaux-de-Fonds, No Limit Events est née d une passion simple : créer des soirées inoubliables. Chaque événement est pensé pour offrir une expérience unique, où la musique, l ambiance et les gens se rejoignent pour former quelque chose d exceptionnel.</div>
      </div>
      <div style={{background:"#141A22",borderRadius:20,padding:20,marginBottom:16,border:"1px solid #1E2A38"}}>
        <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>Nos Valeurs</div>
        {[["🎉","Expériences Uniques","Chaque soirée est une nouvelle surprise, une nouvelle aventure."],["🔥","Ambiance Incomparable","Du Hip-Hop à l Afro, on crée l atmosphère qui te fait bouger."],["👑","Accès VIP","Des offres exclusives pour vivre la soirée différemment."],["❤️","Communauté","Plus qu un événement, une famille de fêtards passionnés."]].map(([emoji,title,desc])=>(
          <div key={title} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,0,128,.1)",border:"1px solid rgba(255,0,128,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{emoji}</div>
            <div><div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:3}}>{title}</div><div style={{fontSize:12,color:"#8892A0",lineHeight:1.5}}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[["2026","Fondée"],["16+","Âge minimum"],["100%","Passion"]].map(([val,label])=>(
          <div key={label} style={{background:"#141A22",borderRadius:16,padding:"16px 10px",textAlign:"center",border:"1px solid #1E2A38"}}>
            <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#FF0080,#FF3399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{val}</div>
            <div style={{fontSize:10,color:"#8892A0",fontWeight:700,marginTop:4,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
          </div>
        ))}
      </div>
      {aboutMedia.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Nos Soirées</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {aboutMedia.map((m,i)=>(
              <div key={i} style={{borderRadius:16,overflow:"hidden",aspectRatio:"1",background:"#141A22"}}>
                {m.type==="video"?<video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} autoPlay muted loop playsInline/>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div onClick={()=>window.open("https://www.instagram.com/nolimit_eventss","_blank")} style={{background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",borderRadius:16,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:16}}>
        <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📸</div>
        <div><div style={{fontSize:14,fontWeight:900,color:"#FFFFFF"}}>@nolimit_eventss</div><div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:2}}>Suis-nous sur Instagram</div></div>
        <div style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:18}}>→</div>
      </div>
      <div onClick={()=>setScreen("main")} style={{borderRadius:16,padding:"15px 0",textAlign:"center",fontWeight:900,fontSize:14,color:"#FF0080",cursor:"pointer",border:"1.5px solid #FF0080",letterSpacing:1}}>RETOUR</div>
    </div>
  </div>
)}
{screen==="events"&&(
  <div style={{position:"fixed",inset:0,background:"#0D1117",zIndex:100,display:"flex",flexDirection:"column",WebkitOverflowScrolling:"touch"}}>
    <div style={{padding:"50px 16px 12px",background:"linear-gradient(135deg,rgba(255,0,128,.15),rgba(255,51,153,.05))",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:22,fontWeight:900,color:"#FFFFFF"}}>Evenements</div>
        <div style={{fontSize:11,color:"#FF0080",fontWeight:700}}>La Chaux-de-Fonds</div>
      </div>
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1}}><Icon n="search" s={14} c="#8892A0"/></div>
        <input type="text" placeholder="Rechercher un evenement..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"#FFFFFF",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        {search&&<div onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#8892A0",cursor:"pointer",fontSize:16}}>x</div>}
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
        {["Tous","Hip-Hop","Festival","Electronic","Afro","Latin"].map(f=>(
          <div key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:20,background:filter===f?"linear-gradient(135deg,#FF0080,#FF3399)":"rgba(255,255,255,.08)",color:filter===f?"#FFFFFF":"#8892A0",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{f}</div>
        ))}
      </div>
    </div>
    <div style={{overflowY:"auto",flex:1,padding:"16px 16px 80px",WebkitOverflowScrolling:"touch",overscrollBehavior:"contain"}}>
      <div style={{marginBottom:16}}>
        <CalendarWidget events={events}/>
      </div>
      {events.filter(e=>!e.ended&&(filter==="Tous"||e.category===filter)&&(search===""||e.title.toLowerCase().includes(search.toLowerCase()))).length>0&&(
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:3,height:16,background:"linear-gradient(135deg,#FF0080,#FF3399)",borderRadius:4}}/>
            <div style={{fontSize:11,fontWeight:900,color:"#FF0080",letterSpacing:2,textTransform:"uppercase"}}>A venir</div>
          </div>
          {events.filter(e=>!e.ended&&(filter==="Tous"||e.category===filter)&&(search===""||e.title.toLowerCase().includes(search.toLowerCase()))).map((ev,i)=>(
            <div key={ev.id} onClick={()=>openEv(ev)} style={{display:"flex",gap:12,alignItems:"center",background:"#141A22",borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid #1E2A38",cursor:"pointer"}}>
              <div style={{width:64,height:64,borderRadius:14,overflow:"hidden",flexShrink:0,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}>
                {ev.poster?<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:16,fontWeight:900,color:"#FFFFFF"}}>{ev.date.split(" ")[1]||"?"}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ev.date.split(" ")[2]||""}</div>
                </div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800,color:"#FFFFFF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.location} • {ev.time}</div>
                <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                  <div style={{background:"rgba(255,0,128,.15)",padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,color:"#FF0080"}}>{ev.category||"Soiree"}</div>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:14,fontWeight:900,color:"#FF0080"}}>CHF {ev.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {events.filter(e=>e.ended).length>0&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:3,height:16,background:"#1E2A38",borderRadius:4}}/>
            <div style={{fontSize:11,fontWeight:900,color:"#8892A0",letterSpacing:2,textTransform:"uppercase"}}>Terminees</div>
          </div>
          {events.filter(e=>e.ended).map((ev,i)=>(
            <div key={ev.id} style={{display:"flex",gap:12,alignItems:"center",background:"#141A22",borderRadius:16,padding:"12px 14px",marginBottom:10,border:"1px solid #1E2A38",opacity:.5}}>
              <div style={{width:64,height:64,borderRadius:14,overflow:"hidden",flexShrink:0,background:"#1C2430"}}>
                {ev.poster&&<img src={ev.poster} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800,color:"#8892A0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                <div style={{fontSize:11,color:"#8892A0",marginTop:2}}>{ev.date}</div>
              </div>
              <div style={{background:"rgba(255,255,255,.1)",padding:"3px 10px",borderRadius:20,fontSize:9,fontWeight:900,color:"#8892A0"}}>TERMINEE</div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#141A22",borderTop:"1px solid #1E2A38",paddingTop:8,paddingBottom:20,display:"flex",zIndex:200}}>
      {[["home","Accueil","home"],["events","Events","calendar"],["tickets","Billets","ticket"],["agenda","Groupes","users"],["profil","Profil","users"]].map(([s,label,ico])=>(
        <div key={s} onClick={()=>{if(s==="events"){}else if(s==="profil"){setScreen("profil");}else{setTab(s);setScreen("main");}}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 0"}}>
          <Icon n={ico} s={20} c={s==="events"?"#FF0080":"#8892A0"}/>
          <span style={{fontSize:9,fontWeight:700,color:s==="events"?"#FF0080":"#8892A0"}}>{label}</span>
          {s==="events"&&<div style={{width:16,height:2.5,borderRadius:2,background:"linear-gradient(135deg,#FF0080,#FF3399)"}}/>}
        </div>
      ))}
    </div>
  </div>
)}
{screen==="groups"&&<GroupsScreen authUser={authUser} supabase={supabase}/>}
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
                  {[["bar","Stats","dashboard"],["calendar","Soirées","events"],["ticket","Billets","tickets"],["gift","Gratuits","free"],["eye","Scanner","scanner"],["upload","Ajouter","add"]].map(([ico,label,t])=>(
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
                {adminTab==="tickets"&&(
                  <div style={{padding:"0 16px 20px"}}>
                    <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>TOUS LES BILLETS ({tickets.length})</div>
                    {tickets.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0",color:GRAY,fontSize:13}}>Aucun billet</div>
                    ):(
                      tickets.map(t=>(
                        <div key={t.id} style={{background:BG2,borderRadius:16,padding:"14px 16px",marginBottom:10,border:"1px solid "+BORDER,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.event}</div>
                            <div style={{fontSize:10,color:GRAY,marginTop:2}}>{t.owner} - {t.date}</div>
                            <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                              <div style={{fontSize:9,fontWeight:900,fontFamily:"monospace",color:PINK}}>{t.id}</div>
                              <div style={{background:t.status==="valid"?"rgba(255,0,128,.15)":"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:t.status==="valid"?PINK:GRAY}}>{t.status==="valid"?"VALIDE":"A VENIR"}</div>
                              <div style={{background:"rgba(255,255,255,.05)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:WHITE}}>CHF {t.price}</div>
                            </div>
                          </div>
                          <div onClick={()=>setDelTicketConfirm(t.id)} style={{marginLeft:12,width:36,height:36,borderRadius:10,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                            <Icon n="trash" s={15} c="#FF4444"/>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {delTicketConfirm&&(
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:30}}>
                    <div style={{background:BG2,borderRadius:20,padding:24,width:"100%",border:"1px solid "+BORDER}}>
                      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8,textAlign:"center"}}>Supprimer ce billet ?</div>
                      <div style={{fontSize:12,color:GRAY,marginBottom:20,textAlign:"center"}}>Cette action est irreversible.</div>
                      <div style={{display:"flex",gap:10}}>
                        <div onClick={()=>setDelTicketConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:50,background:BG3,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",border:"1px solid "+BORDER}}>ANNULER</div>
                        <div onClick={()=>deleteTicketFn(delTicketConfirm)} style={{flex:1,padding:"14px 0",borderRadius:50,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                      </div>
                    </div>
                  </div>
                )}
                {adminTab==="tickets"&&(
                  <div style={{padding:"0 16px 20px"}}>
                    <div style={{fontSize:11,fontWeight:900,color:GRAY,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>TOUS LES BILLETS ({tickets.length})</div>
                    {tickets.length===0?(
                      <div style={{textAlign:"center",padding:"40px 0",color:GRAY,fontSize:13}}>Aucun billet</div>
                    ):(
                      tickets.map(t=>(
                        <div key={t.id} style={{background:BG2,borderRadius:16,padding:"14px 16px",marginBottom:10,border:"1px solid "+BORDER,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:800,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.event}</div>
                            <div style={{fontSize:10,color:GRAY,marginTop:2}}>{t.owner} - {t.date}</div>
                            <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                              <div style={{fontSize:9,fontWeight:900,fontFamily:"monospace",color:PINK}}>{t.id}</div>
                              <div style={{background:t.status==="valid"?"rgba(255,0,128,.15)":"rgba(136,146,160,.1)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:t.status==="valid"?PINK:GRAY}}>{t.status==="valid"?"VALIDE":"A VENIR"}</div>
                              <div style={{background:"rgba(255,255,255,.05)",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color:WHITE}}>CHF {t.price}</div>
                            </div>
                          </div>
                          <div onClick={()=>setDelTicketConfirm(t.id)} style={{marginLeft:12,width:36,height:36,borderRadius:10,background:"rgba(204,0,0,.15)",border:"1px solid rgba(204,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                            <Icon n="trash" s={15} c="#FF4444"/>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {delTicketConfirm&&(
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:30}}>
                    <div style={{background:BG2,borderRadius:20,padding:24,width:"100%",border:"1px solid "+BORDER}}>
                      <div style={{fontSize:16,fontWeight:900,color:WHITE,marginBottom:8,textAlign:"center"}}>Supprimer ce billet ?</div>
                      <div style={{fontSize:12,color:GRAY,marginBottom:20,textAlign:"center"}}>Cette action est irreversible.</div>
                      <div style={{display:"flex",gap:10}}>
                        <div onClick={()=>setDelTicketConfirm(null)} style={{flex:1,padding:"14px 0",borderRadius:50,background:BG3,textAlign:"center",fontWeight:900,color:GRAY,cursor:"pointer",border:"1px solid "+BORDER}}>ANNULER</div>
                        <div onClick={()=>deleteTicketFn(delTicketConfirm)} style={{flex:1,padding:"14px 0",borderRadius:50,background:"#CC0000",textAlign:"center",fontWeight:900,color:WHITE,cursor:"pointer"}}>SUPPRIMER</div>
                      </div>
                    </div>
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
                            <div onClick={()=>setDelTicketConfirm(t.id)} style={{background:"rgba(255,68,68,.1)",color:"#FF4444",padding:"7px 10px",borderRadius:10,cursor:"pointer"}}><Icon n="trash" s={13} c="#FF4444"/></div>
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
      </div>
    </div>
  );
}
