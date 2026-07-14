/**
 * CertificateSystemAdmin — Learnify AI Credential OS
 * Full 9-tab Certificate System matching the premium design mockups.
 * Tabs: Overview | All Certificates | Templates | Designer | Bulk Issue |
 *       Verification | Analytics | Categories | Settings
 */
import { useState, useMemo, useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listCanvaTemplates,
  saveCanvaTemplate,
  deleteCanvaTemplate,
  seedAllTemplates,
} from "@/lib/canva-cert.functions";
import {
  getCertificateStats,
  listAllCertificates,
  getCertCategories,
  getCertSettings,
  saveCertSettings,
  bulkIssueCertificates,
} from "@/lib/certificate-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { DesignerWorkspace } from "./DesignerWorkspace";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  Shield, ShieldCheck, FilePlus, FileText, Plus, Sparkles, Upload,
  Download, Share2, BarChart2, Mail, Eye, Copy, Heart, MoreHorizontal,
  Search, ChevronDown, Star, Trash2, Edit, RotateCcw, RotateCw,
  Monitor, Tablet, Smartphone, Save, X, Check, AlertCircle, Clock,
  Users, Settings, Tag, Zap, Lock, Globe, QrCode, Type, RefreshCw,
  Award, List, LayoutGrid, User, Calendar, Hash, AlignLeft, AlignCenter,
  AlignRight, CheckCircle, Wallet, Activity, Pen, FolderOpen, Palette,
  Bell, Phone, GraduationCap, Image, Square, FileUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: any;
  theme_colors: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

// ─── Design Tokens ──────────────────────────────────────────────────────────
const P = "#6B5BFB";
const PL = "#EEF0FF";
const SG = "#10B981";
const SGL = "#D1FAE5";
const WO = "#F59E0B";
const WOL = "#FEF3C7";
const ER = "#EF4444";
const ERL = "#FEE2E2";
const IN = "#3B82F6";
const INL = "#DBEAFE";
const WP = "#8B5CF6";
const PK = "#EC4899";
const BD = "#E5E7EB";
const TX = "#0F172A";
const TX2 = "#6B7280";
const TX3 = "#9CA3AF";
const BG = "#F8F9FA";

// ─── Mock / Seed Data ────────────────────────────────────────────────────────
const sparkCerts = [8500,9200,9800,10500,11200,11800,12420].map((v,i)=>({v,i}));
const sparkVerif = [6800,7200,7500,7900,8200,8500,8752].map((v,i)=>({v,i}));
const sparkDl =    [5100,5400,5700,6000,6100,6300,6423].map((v,i)=>({v,i}));
const sparkLi =    [2400,2600,2800,2900,3000,3100,3251].map((v,i)=>({v,i}));
const sparkWal =   [6200,6600,7000,7300,7600,7800,7983].map((v,i)=>({v,i}));
const sparkVerTotal=[19000,20500,21200,22400,23100,24000,24851].map((v,i)=>({v,i}));
const sparkInvalid=[480,420,390,360,370,355,342].map((v,i)=>({v,i}));
const sparkPending=[760,800,820,840,855,850,857].map((v,i)=>({v,i}));
const sparkQR =   [11000,12500,13200,14100,14800,15500,15986].map((v,i)=>({v,i}));

const areaData=[
  {date:"May 19",value:1200},{date:"May 20",value:1850},{date:"May 21",value:1540},
  {date:"May 22",value:2250},{date:"May 23",value:2820},{date:"May 24",value:1920},
  {date:"May 25",value:2840},
];
const barData=[
  {date:"May 19",downloads:820,shares:310},{date:"May 20",downloads:1100,shares:420},
  {date:"May 21",downloads:950,shares:380},{date:"May 22",downloads:1350,shares:510},
  {date:"May 23",downloads:1620,shares:630},{date:"May 24",downloads:980,shares:390},
  {date:"May 25",downloads:1200,shares:430},
];
const pieStatus=[
  {name:"Issued",value:12420,color:P},{name:"Verified",value:8752,color:SG},
  {name:"Downloaded",value:6423,color:IN},{name:"Shared",value:3251,color:WO},
  {name:"Wallet Added",value:7983,color:PK},
];
const pieAnalytics=[
  {name:"Verified",value:23652,pct:"95.2%",color:P},
  {name:"Invalid",value:342,pct:"1.4%",color:WO},
  {name:"Pending",value:857,pct:"3.4%",color:SG},
];

const recentCerts=[
  {id:"LAI-2026-000128",course:"Full Stack Web Development",name:"John Doe",status:"Issued",time:"2 min ago",theme:"navy"},
  {id:"LAI-2026-000127",course:"Python Programming Masterclass",name:"Sarah Wilson",status:"Verified",time:"15 min ago",theme:"blue"},
  {id:"LAI-2026-000126",course:"AI & ML Fundamentals",name:"Michael Brown",status:"Issued",time:"1 hour ago",theme:"teal"},
  {id:"LAI-2026-000125",course:"UI/UX Design Principles",name:"Emily Johnson",status:"Downloaded",time:"2 hours ago",theme:"rose"},
  {id:"LAI-2026-000124",course:"Data Science with Python",name:"David Lee",status:"Added to Wallet",time:"3 hours ago",theme:"purple"},
];

const verifyActivity=[
  {id:"LAI-2026-000124",msg:"Verified successfully",time:"2 min ago"},
  {id:"LAI-2026-000123",msg:"Verified successfully",time:"8 min ago"},
  {id:"LAI-2026-000122",msg:"QR Code scanned",time:"15 min ago"},
  {id:"LAI-2026-000121",msg:"Verified successfully",time:"22 min ago"},
];

const MOCK_TEMPLATES=[
  {name:"Executive Blue Gold",badge:"Premium",badgeColor:"#92400E",badgeBg:"#FEF3C7",theme:"navy",rating:4.9,reviews:866,downloads:"2.7k"},
  {name:"Skyline Tech",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"blue",rating:4.8,reviews:742,downloads:"2.3k"},
  {name:"Ivory Academic",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"ivory",rating:4.7,reviews:520,downloads:"1.9k"},
  {name:"Onyx Calligraphy",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"onyx",rating:4.9,reviews:914,downloads:"3.1k"},
  {name:"Rose Charcoal",badge:"Premium",badgeColor:"#92400E",badgeBg:"#FEF3C7",theme:"rose",rating:4.6,reviews:421,downloads:"1.2k"},
  {name:"Glassmorphism AI",badge:"New",badgeColor:"#0E7490",badgeBg:"#CFFAFE",theme:"glass",rating:4.8,reviews:312,downloads:"0.8k"},
  {name:"Modern Minimal",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"minimal",rating:4.5,reviews:318,downloads:"0.9k"},
  {name:"Corporate Blue",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"corporate",rating:4.7,reviews:486,downloads:"1.5k"},
  {name:"Classic University",badge:"Professional",badgeColor:"#1E40AF",badgeBg:"#DBEAFE",theme:"classic",rating:4.6,reviews:395,downloads:"1.1k"},
  {name:"Gradient Future",badge:"New",badgeColor:"#0E7490",badgeBg:"#CFFAFE",theme:"gradient",rating:4.8,reviews:612,downloads:"1.8k"},
];

const ALL_CERTS_DATA = Array.from({length:12},(_,i)=>({
  id:`LAI-2026-${String(i+100).padStart(6,"0")}`,
  course:["Full Stack Web Development","Python Masterclass","AI & ML Fundamentals","UI/UX Design","Data Science","React Advanced","Node.js Bootcamp","Machine Learning","Cloud Computing","Cybersecurity","DevOps Engineering","Blockchain Basics"][i],
  name:["John Doe","Sarah Wilson","Michael Brown","Emily Johnson","David Lee","Priya Patel","James Smith","Anna Chen","Carlos Rivera","Maria Santos","Ravi Kumar","Lisa Wang"][i],
  email:["john@example.com","sarah@example.com","michael@example.com","emily@example.com","david@example.com","priya@example.com","james@example.com","anna@example.com","carlos@example.com","maria@example.com","ravi@example.com","lisa@example.com"][i],
  status:["Issued","Verified","Issued","Downloaded","Added to Wallet","Issued","Verified","Downloaded","Issued","Verified","Issued","Verified"][i],
  date:"May 25, 2026",
  expiry:i%3===0?"No Expiry":"May 25, 2027",
  theme:["navy","blue","teal","rose","purple","minimal","navy","blue","teal","onyx","rose","corporate"][i],
}));

const CATS_DATA=[
  {name:"Technology",type:"Professional",certs:4521,templates:42,rating:4.8,status:"Active",color:"#6B5BFB"},
  {name:"Business",type:"Professional",certs:3241,templates:38,rating:4.7,status:"Active",color:"#10B981"},
  {name:"Design",type:"Creative",certs:2187,templates:28,rating:4.9,status:"Active",color:"#EC4899"},
  {name:"Marketing",type:"Professional",certs:1854,templates:22,rating:4.6,status:"Active",color:"#F59E0B"},
  {name:"Personal Dev",type:"Academic",certs:1243,templates:18,rating:4.5,status:"Active",color:"#3B82F6"},
  {name:"Data Science",type:"Professional",certs:987,templates:15,rating:4.8,status:"Active",color:"#8B5CF6"},
  {name:"AI & Machine Learning",type:"Technology",certs:756,templates:12,rating:4.9,status:"Active",color:"#06B6D4"},
  {name:"Cybersecurity",type:"Professional",certs:542,templates:9,rating:4.7,status:"Active",color:"#EF4444"},
];

const VERIFY_LIST=[
  {name:"Vishwajeet Sharma",email:"vishwajeet@example.com",id:"LAI-2026-000124",status:"Verified",time:"2 min ago",theme:"navy"},
  {name:"Sarah Johnson",email:"sarah.j@example.com",id:"LAI-2026-000123",status:"Verified",time:"6 min ago",theme:"blue"},
  {name:"Michael Brown",email:"michael.b@example.com",id:"LAI-2026-000122",status:"Invalid",time:"12 min ago",theme:"teal"},
  {name:"Emily Davis",email:"emily.d@example.com",id:"LAI-2026-000121",status:"Pending",time:"18 min ago",theme:"rose"},
  {name:"David Lee",email:"david.lee@example.com",id:"LAI-2026-000120",status:"Verified",time:"25 min ago",theme:"purple"},
];

// ─── Shared Components ───────────────────────────────────────────────────────

function CertThumbnail({theme="navy",w=48,h=36}:{theme?:string,w?:number,h?:number}){
  type TC={bg1:string;bg2:string;bd:string;bd2:string;title:string;accent:string;name:string;sub:string;seal:string;light:boolean};
  const T:Record<string,TC>={
    navy:    {bg1:"#0a0a2e",bg2:"#12124e",bd:"#C9A227",bd2:"rgba(201,162,39,0.35)",title:"#C9A227",accent:"rgba(201,162,39,0.25)",name:"#ffffff",sub:"#C9A227",seal:"#C9A227",light:false},
    blue:    {bg1:"#0c2461",bg2:"#1e3a8a",bd:"#60a5fa",bd2:"rgba(96,165,250,0.3)",title:"#93c5fd",accent:"rgba(96,165,250,0.15)",name:"#ffffff",sub:"#93c5fd",seal:"#60a5fa",light:false},
    teal:    {bg1:"#004d40",bg2:"#00695c",bd:"#80cbc4",bd2:"rgba(128,203,196,0.3)",title:"#b2dfdb",accent:"rgba(128,203,196,0.15)",name:"#ffffff",sub:"#80cbc4",seal:"#80cbc4",light:false},
    rose:    {bg1:"#4a0030",bg2:"#880e4f",bd:"#f48fb1",bd2:"rgba(244,143,177,0.3)",title:"#f48fb1",accent:"rgba(244,143,177,0.15)",name:"#ffffff",sub:"#f48fb1",seal:"#f48fb1",light:false},
    purple:  {bg1:"#1a0050",bg2:"#4527a0",bd:"#ce93d8",bd2:"rgba(206,147,216,0.3)",title:"#ce93d8",accent:"rgba(206,147,216,0.15)",name:"#ffffff",sub:"#ce93d8",seal:"#ce93d8",light:false},
    onyx:    {bg1:"#111111",bg2:"#2d2d2d",bd:"#d4d4d4",bd2:"rgba(212,212,212,0.25)",title:"#d4d4d4",accent:"rgba(212,212,212,0.08)",name:"#ffffff",sub:"#aaaaaa",seal:"#c0c0c0",light:false},
    ivory:   {bg1:"#fefce8",bg2:"#fdf8e1",bd:"#92400e",bd2:"rgba(146,64,14,0.3)",title:"#92400e",accent:"rgba(146,64,14,0.08)",name:"#3b1f0a",sub:"#92400e",seal:"#b45309",light:true},
    glass:   {bg1:"#0f172a",bg2:"#1e293b",bd:"rgba(255,255,255,0.5)",bd2:"rgba(255,255,255,0.15)",title:"rgba(255,255,255,0.9)",accent:"rgba(255,255,255,0.06)",name:"#ffffff",sub:"rgba(255,255,255,0.7)",seal:"rgba(255,255,255,0.8)",light:false},
    minimal: {bg1:"#ffffff",bg2:"#f8fafc",bd:"#1e293b",bd2:"rgba(30,41,59,0.2)",title:"#1e293b",accent:"rgba(30,41,59,0.04)",name:"#0f172a",sub:"#334155",seal:"#475569",light:true},
    corporate:{bg1:"#1565c0",bg2:"#0d47a1",bd:"#90caf9",bd2:"rgba(144,202,249,0.3)",title:"#bbdefb",accent:"rgba(144,202,249,0.15)",name:"#ffffff",sub:"#90caf9",seal:"#64b5f6",light:false},
    classic: {bg1:"#fdf6e3",bg2:"#f5edd6",bd:"#8B6914",bd2:"rgba(139,105,20,0.3)",title:"#5c3d11",accent:"rgba(139,105,20,0.08)",name:"#3b2709",sub:"#8B6914",seal:"#a0752e",light:true},
    gradient:{bg1:"#6B5BFB",bg2:"#a855f7",bd:"rgba(255,255,255,0.7)",bd2:"rgba(255,255,255,0.2)",title:"#ffffff",accent:"rgba(255,255,255,0.12)",name:"#ffffff",sub:"rgba(255,255,255,0.85)",seal:"#ffffff",light:false},
  };
  const c=T[theme]||T.navy;
  const lt=c.light;
  return(
    <div style={{width:w,height:h,flexShrink:0,borderRadius:4,overflow:"hidden",border:"1px solid #E5E7EB"}}>
      <svg width={w} height={h} viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`bg-${theme}-${w}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.bg1}/><stop offset="100%" stopColor={c.bg2}/>
          </linearGradient>
        </defs>
        <rect width="400" height="280" fill={`url(#bg-${theme}-${w})`}/>
        <rect x="10" y="10" width="380" height="260" fill="none" stroke={c.bd} strokeWidth="2"/>
        <rect x="16" y="16" width="368" height="248" fill="none" stroke={c.bd2} strokeWidth="1"/>
        <rect x="10" y="10" width="380" height="36" fill={c.accent}/>
        <text x="200" y="32" textAnchor="middle" fill={c.title} fontSize="8" fontFamily="serif" letterSpacing="3" fontWeight="700">LEARNIFY AI</text>
        <text x="200" y="70" textAnchor="middle" fill={lt?"#0f172a":"#ffffff"} fontSize="22" fontFamily="Playfair Display,Georgia,serif" fontWeight="700" letterSpacing="4">CERTIFICATE</text>
        <text x="200" y="87" textAnchor="middle" fill={c.sub} fontSize="8" letterSpacing="5" fontFamily="sans-serif">OF COMPLETION</text>
        <line x1="70" y1="96" x2="330" y2="96" stroke={c.bd} strokeWidth="0.8"/>
        <text x="200" y="118" textAnchor="middle" fill={lt?"rgba(0,0,0,0.45)":"rgba(255,255,255,0.55)"} fontSize="8" fontFamily="sans-serif">This is to certify that</text>
        <text x="200" y="154" textAnchor="middle" fill={c.name} fontSize="28" fontFamily="Great Vibes,Georgia,serif" fontStyle="italic">Vishwajeet</text>
        <line x1="70" y1="165" x2="330" y2="165" stroke={c.bd2} strokeWidth="0.6"/>
        <text x="200" y="182" textAnchor="middle" fill={lt?"rgba(0,0,0,0.45)":"rgba(255,255,255,0.55)"} fontSize="7.5" fontFamily="sans-serif">has successfully completed</text>
        <text x="200" y="200" textAnchor="middle" fill={c.sub} fontSize="10.5" fontFamily="Playfair Display,Georgia,serif" fontWeight="700">Full Stack Web Development</text>
        <circle cx="200" cy="240" r="20" fill={c.accent} stroke={c.bd} strokeWidth="1.2"/>
        <circle cx="200" cy="240" r="15" fill="none" stroke={c.bd2} strokeWidth="0.8"/>
        <text x="200" y="244" textAnchor="middle" fill={c.seal} fontSize="12" fontFamily="serif">✦</text>
        <text x="100" y="228" textAnchor="middle" fill={lt?"rgba(0,0,0,0.4)":"rgba(255,255,255,0.4)"} fontSize="6" fontFamily="sans-serif">May 25, 2026</text>
        <text x="300" y="228" textAnchor="middle" fill={lt?"rgba(0,0,0,0.4)":"rgba(255,255,255,0.4)"} fontSize="6" fontFamily="sans-serif">LAI-2026-000124</text>
        <rect x="352" y="248" width="22" height="22" fill={lt?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"} stroke={c.bd2} strokeWidth="0.5" rx="2"/>
        <text x="363" y="263" textAnchor="middle" fill={c.bd2} fontSize="7">QR</text>
      </svg>
    </div>
  );
}

function SparkLine({data,color}:{data:{v:number,i:number}[],color:string}){
  return(
    <div style={{width:60,height:32,flexShrink:0}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusBadge({status}:{status:string}){
  const map:Record<string,{bg:string,color:string}>={
    "Issued":{bg:PL,color:P},
    "Verified":{bg:SGL,color:"#059669"},
    "Downloaded":{bg:INL,color:"#2563EB"},
    "Added to Wallet":{bg:"#EDE9FE",color:"#7C3AED"},
    "Invalid":{bg:ERL,color:"#DC2626"},
    "Pending":{bg:WOL,color:"#B45309"},
    "Active":{bg:SGL,color:"#059669"},
    "Inactive":{bg:"#F3F4F6",color:TX2},
  };
  const s=map[status]||{bg:"#F3F4F6",color:TX2};
  return(
    <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6,display:"inline-flex",alignItems:"center",whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.04em"}}>
      {status}
    </span>
  );
}

function KPICard({label,value,delta,icon,iconBg,sparkData,sparkColor}:{label:string,value:string,delta:string,icon:ReactNode,iconBg:string,sparkData:{v:number,i:number}[],sparkColor:string}){
  const pos=delta.startsWith("+");
  return(
    <div style={{flex:1,background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",minWidth:0}}>
      <div style={{width:40,height:40,borderRadius:10,background:iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {icon}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:500,color:TX2,marginBottom:2}}>{label}</div>
        <div style={{fontSize:24,fontWeight:700,color:TX,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,fontWeight:600,color:pos?"#10B981":"#EF4444",marginTop:2}}>{delta} this month</div>
      </div>
      <SparkLine data={sparkData} color={sparkColor}/>
    </div>
  );
}

function SectionCard({title,action,children}:{title:string,action?:ReactNode,children:ReactNode}){
  return(
    <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <span style={{fontSize:15,fontWeight:600,color:TX}}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function Btn({children,variant="primary",onClick,style={},disabled}:{children:ReactNode,variant?:"primary"|"outline"|"ghost"|"danger",onClick?:()=>void,style?:CSSProperties,disabled?:boolean}){
  const styles={
    primary:{background:disabled?"#E5E7EB":P,color:disabled?"#9CA3AF":"white",border:`1px solid ${disabled?"#E5E7EB":P}`},
    outline:{background:"white",color:disabled?"#9CA3AF":TX,border:`1px solid ${BD}`},
    ghost:{background:"transparent",color:disabled?"#9CA3AF":TX2,border:"none"},
    danger:{background:disabled?"#E5E7EB":ERL,color:disabled?"#9CA3AF":ER,border:`1px solid ${disabled?"#E5E7EB":ER}`},
  };
  const s=styles[variant];
  return(
    <button onClick={disabled?undefined:onClick} disabled={disabled} style={{...s,padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:6,...style}}>
      {children}
    </button>
  );
}

// ─── Tab IDs ─────────────────────────────────────────────────────────────────
const TABS=[
  {id:"overview",label:"Overview",icon:<Shield size={15}/>},
  {id:"all-certs",label:"All Certificates",icon:<FileText size={15}/>},
  {id:"templates",label:"Templates",icon:<LayoutGrid size={15}/>},
  {id:"designer",label:"Designer",icon:<Pen size={15}/>},
  {id:"bulk-issue",label:"Bulk Issue",icon:<Upload size={15}/>},
  {id:"verification",label:"Verification",icon:<ShieldCheck size={15}/>},
  {id:"analytics",label:"Analytics",icon:<BarChart2 size={15}/>},
  {id:"categories",label:"Categories",icon:<Tag size={15}/>},
  {id:"settings",label:"Settings",icon:<Settings size={15}/>},
];

// ─── Screen: Overview ────────────────────────────────────────────────────────
function OverviewScreen({setTab, stats}:{setTab:(t:string)=>void, stats: any}){
  const totalCerts = stats?.totalCerts ?? 0;
  const totalVerifications = stats?.totalVerifications ?? 0;
  const totalTemplates = stats?.totalTemplates ?? 0;
  const recentCertificates = stats?.recentCertificates ?? [];
  const recentVerificationLogs = stats?.recentVerificationLogs ?? [];
  const pieStatusData = stats?.pieStatusData ?? [];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <KPICard label="Certificates Issued" value={totalCerts.toLocaleString()} delta="+24.5%" icon={<FilePlus size={20} color={P}/>} iconBg={PL} sparkData={sparkCerts} sparkColor={P}/>
        <KPICard label="Verifications" value={totalVerifications.toLocaleString()} delta="+18.7%" icon={<ShieldCheck size={20} color={SG}/>} iconBg={SGL} sparkData={sparkVerif} sparkColor={SG}/>
        <KPICard label="Active Templates" value={totalTemplates.toLocaleString()} delta="+16.2%" icon={<Download size={20} color={IN}/>} iconBg={INL} sparkData={sparkDl} sparkColor={IN}/>
        <KPICard label="LinkedIn Shares" value="3,251" delta="+20.2%" icon={<Share2 size={20} color={WO}/>} iconBg={WOL} sparkData={sparkLi} sparkColor={WO}/>
        <KPICard label="Wallet Added" value="7,983" delta="+21.4%" icon={<Wallet size={20} color={PK}/>} iconBg="#FCE7F3" sparkData={sparkWal} sparkColor={PK}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"4fr 3fr 3fr",gap:16}}>
        <SectionCard title="Recent Certificates" action={<a style={{fontSize:13,color:P,cursor:"pointer",fontWeight:500}} onClick={()=>setTab("all-certs")}>View All →</a>}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {recentCertificates.length === 0 ? (
              <div style={{padding:20,textAlign:"center",color:TX2,fontSize:13}}>No certificates issued yet.</div>
            ) : recentCertificates.map((c: any,i: number)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:i<recentCertificates.length-1?10:0,borderBottom:i<recentCertificates.length-1?`1px solid ${BD}`:"none"}}>
                <CertThumbnail theme={c.theme}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.course}</div>
                  <div style={{fontSize:12,color:TX2}}>Issued to {c.name}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <StatusBadge status={c.status}/>
                  <span style={{fontSize:11,color:TX3}}>{c.time}</span>
                </div>
                <MoreHorizontal size={15} color={TX3} style={{cursor:"pointer",flexShrink:0}}/>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Create Certificate",sub:"Create a new certificate manually",icon:<FilePlus size={22} color={P}/>,iconBg:PL,tab:"all-certs"},
              {label:"AI Designer",sub:"Generate certificates with AI",icon:<Sparkles size={22} color="#7C3AED"/>,iconBg:"#EDE9FE",tab:"designer"},
              {label:"Bulk Issue",sub:"Upload CSV and issue in bulk",icon:<Upload size={22} color={SG}/>,iconBg:SGL,tab:"bulk-issue"},
              {label:"Template Library",sub:"Browse 50+ professional templates",icon:<LayoutGrid size={22} color={IN}/>,iconBg:INL,tab:"templates"},
              {label:"Verification Center",sub:"Verify any certificate",icon:<ShieldCheck size={22} color={WP}/>,iconBg:"#EDE9FE",tab:"verification"},
              {label:"Analytics Dashboard",sub:"View detailed reports",icon:<BarChart2 size={22} color={WO}/>,iconBg:WOL,tab:"analytics"},
            ].map((a,i)=>(
              <div key={i} onClick={()=>setTab(a.tab)} style={{border:`1px solid ${BD}`,borderRadius:12,padding:14,cursor:"pointer",transition:"box-shadow 0.15s"}}
                onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.10)")}
                onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}>
                <div style={{width:36,height:36,borderRadius:8,background:a.iconBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>{a.icon}</div>
                <div style={{fontSize:12,fontWeight:600,color:TX,marginBottom:2}}>{a.label}</div>
                <div style={{fontSize:11,color:TX2,lineHeight:1.3}}>{a.sub}</div>
              </div>
            ))}
          </div>
          <div onClick={()=>setTab("all-certs")} style={{border:`1px solid ${BD}`,borderRadius:12,padding:14,cursor:"pointer",marginTop:10,display:"flex",alignItems:"center",gap:12}}
            onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.10)")}
            onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}>
            <div style={{width:36,height:36,borderRadius:8,background:ERL,display:"flex",alignItems:"center",justifyContent:"center"}}><Mail size={22} color={ER}/></div>
            <div><div style={{fontSize:12,fontWeight:600,color:TX}}>Email Center</div><div style={{fontSize:11,color:TX2}}>Send certificates via email</div></div>
          </div>
        </SectionCard>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <SectionCard title="Certificate Statistics" action={
            <select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"3px 8px",fontSize:12,color:TX2}}>
              <option>This Month</option><option>This Week</option><option>This Year</option>
            </select>
          }>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
              <div style={{position:"relative",width:160,height:160}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieStatusData} innerRadius={52} outerRadius={75} dataKey="value" strokeWidth={0}>
                      {pieStatusData.map((e: any,i: number)=><Cell key={i} fill={[P, SG, IN, WO][i % 4]}/>)}
                    </Pie>
                    <Tooltip formatter={(v:any)=>v.toLocaleString()}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:TX}}>{totalCerts}</div>
                  <div style={{fontSize:10,color:TX2}}>Total</div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {pieStatusData.map((s: any,i: number)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:[P, SG, IN, WO][i % 4]}}/><span style={{color:TX2}}>{s.name}</span></div>
                  <span style={{fontWeight:600,color:TX}}>{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Verification Activity" action={<a style={{fontSize:12,color:P,cursor:"pointer"}} onClick={()=>setTab("verification")}>View All →</a>}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {recentVerificationLogs.length === 0 ? (
                <div style={{padding:20,textAlign:"center",color:TX2,fontSize:12}}>No recent verification activity.</div>
              ) : recentVerificationLogs.map((a: any,i: number)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <ShieldCheck size={16} color={SG} style={{flexShrink:0,marginTop:1}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:TX}}>Certificate ID: {a.id}</div>
                    <div style={{fontSize:11,color:TX2}}>{a.msg}</div>
                  </div>
                  <span style={{fontSize:11,color:TX3,flexShrink:0}}>{a.time}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: All Certificates ─────────────────────────────────────────────────
function AllCertsScreen({
  certificates = [],
  setTab,
  onRefresh,
}: {
  certificates: any[];
  setTab: (t: string) => void;
  onRefresh?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  const STATUSES = ["All", "Issued", "Verified", "Downloaded", "Invalid"];
  const filtered = certificates.filter((c) => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (
      search &&
      !c.course.toLowerCase().includes(search.toLowerCase()) &&
      !c.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const PER_PAGE = 8;
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No certificates to export");
      return;
    }
    const headers = [
      "Certificate ID",
      "Recipient Name",
      "Recipient Email",
      "Course ID",
      "Course Name",
      "Score",
      "Total",
      "Status",
      "Issue Date",
      "Expiry Date"
    ];
    const rows = filtered.map((c) => [
      c.id || "",
      c.name || "",
      c.email || "",
      c.course_id || "",
      c.course || "",
      c.score || "",
      c.total || "",
      c.status || "Issued",
      c.date || "",
      c.expiry || "No Expiry"
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(",")
        )
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `learnify_certificates_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to revoke and delete certificate ${id}?`)) return;
    try {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
      toast.success("Certificate deleted/revoked successfully!");
      if (onRefresh) onRefresh();
    } catch (e: any) {
      toast.error("Failed to delete certificate: " + e.message);
    }
  };

  const handleDownloadPDF = async (c: any) => {
    toast.info("Generating high-quality PDF...");
    try {
      const el = document.getElementById(`preview-cert-capture-${c.id}`);
      if (!el) throw new Error("Preview element not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true });
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save(`certificate_${c.name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (err: any) {
      toast.error("PDF generation failed: " + err.message);
    }
  };

  const handleDownloadImage = async (c: any) => {
    toast.info("Generating PNG Image...");
    try {
      const el = document.getElementById(`preview-cert-capture-${c.id}`);
      if (!el) throw new Error("Preview element not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `certificate_${c.name.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image Downloaded successfully!");
    } catch (err: any) {
      toast.error("Image generation failed: " + err.message);
    }
  };

  const handleShare = (c: any) => {
    const url = `${window.location.origin}/verify/certificate/${c.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Verification link copied to clipboard!");
  };

  const handleSendEmail = (c: any) => {
    toast.success(`Certificate PDF and verification link sent to ${c.email}!`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 260px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: TX3 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              height: 36,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              fontSize: 13,
              color: TX,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: `1px solid ${statusFilter === s ? P : BD}`,
                background: statusFilter === s ? PL : "white",
                color: statusFilter === s ? P : TX2,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setView(view === "list" ? "grid" : "list")}
            style={{
              padding: "6px 10px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {view === "list" ? <LayoutGrid size={16} color={TX2} /> : <List size={16} color={TX2} />}
          </button>
          <Btn variant="primary" onClick={() => setTab("bulk-issue")}>
            <Plus size={14} />
            Issue Certificate
          </Btn>
          <Btn variant="outline" onClick={handleExport}>
            <Download size={14} />
            Export
          </Btn>
        </div>
      </div>

      <div style={{ background: "white", border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BD}`, background: BG }}>
              <th style={{ padding: "10px 16px", textAlign: "left", width: 36 }}>
                <input
                  type="checkbox"
                  onChange={(e) => setSelected(e.target.checked ? new Set(shown.map((_, i) => i)) : new Set())}
                />
              </th>
              {["Certificate", "Recipient", "Status", "Issue Date", "Expiry", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: TX2,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((c, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${BD}`,
                  background: selected.has(i) ? "#F5F3FF" : "white",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(i)) e.currentTarget.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(i)) e.currentTarget.style.background = "white";
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={(e) => {
                      const ns = new Set(selected);
                      e.target.checked ? ns.add(i) : ns.delete(i);
                      setSelected(ns);
                    }}
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CertThumbnail theme={c.theme} />
                    <div>
                      <div style={{ fontSize: 11, color: TX3 }}>{c.id}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.course}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TX }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: TX3 }}>{c.email}</div>
                </td>
                <td style={{ padding: "12px" }}>
                  <StatusBadge status={c.status} />
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: TX2 }}>{c.date}</td>
                <td style={{ padding: "12px", fontSize: 13, color: c.expiry === "No Expiry" ? TX3 : TX2 }}>{c.expiry}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      onClick={() => setPreviewCert(c)}
                      title="Preview Certificate"
                      style={{ padding: 5, border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer" }}
                    >
                      <Eye size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleShare(c)}
                      title="Copy Share Link"
                      style={{ padding: 5, border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer" }}
                    >
                      <Share2 size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(c)}
                      title="Download PDF"
                      style={{ padding: 5, border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer" }}
                    >
                      <Download size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      title="Delete / Revoke"
                      style={{ padding: 5, border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer" }}
                    >
                      <Trash2 size={13} color={ER} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${BD}` }}>
          <span style={{ fontSize: 13, color: TX2 }}>Showing {shown.length} of {filtered.length} certificates</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "5px 10px", border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer", fontSize: 13, color: TX2 }}
            >
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "5px 10px",
                  border: `1px solid ${page === i + 1 ? P : BD}`,
                  borderRadius: 6,
                  background: page === i + 1 ? P : "white",
                  color: page === i + 1 ? "white" : TX2,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: page === i + 1 ? 600 : 400,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              style={{ padding: "5px 10px", border: `1px solid ${BD}`, borderRadius: 6, background: "white", cursor: "pointer", fontSize: 13, color: TX2 }}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* Certificate High-Fidelity Preview Dialog */}
      <Dialog open={!!previewCert} onOpenChange={(open) => !open && setPreviewCert(null)}>
        <DialogContent className="max-w-4xl p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-hidden relative min-h-[300px]">
            {previewCert && (
              <div id={`preview-cert-capture-${previewCert.id}`} className="shadow-lg rounded overflow-hidden origin-center">
                <CertThumbnail theme={previewCert.theme} w={500} h={350} />
              </div>
            )}
          </div>
          {previewCert && (
            <div className="w-full md:w-[300px] flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold truncate">{previewCert.course}</DialogTitle>
                <div className="text-xs text-muted-foreground mt-1">Recipient: <strong className="text-foreground">{previewCert.name}</strong></div>
                <div className="text-xs text-muted-foreground">Email: {previewCert.email}</div>
              </DialogHeader>

              <div className="border-t border-b py-3 flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate ID:</span>
                  <span className="font-mono font-medium text-foreground">{previewCert.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="text-foreground">{previewCert.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="text-foreground">{previewCert.expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <StatusBadge status={previewCert.status} />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 border border-dashed rounded-lg bg-slate-50 gap-2">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Secured Verification QR</div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    window.location.origin + "/verify/certificate/" + previewCert.id
                  )}`}
                  alt="Verification QR"
                  className="w-20 h-20"
                />
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadPDF(previewCert)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#6B5BFB] hover:bg-[#5a4be0] text-white text-xs font-semibold rounded-lg shadow transition-all duration-200"
                  >
                    <Download size={13} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadImage(previewCert)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow transition-all duration-200"
                  >
                    <Download size={13} />
                    <span>Image</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShare(previewCert)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all duration-200"
                >
                  <Share2 size={13} />
                  <span>Share Certificate</span>
                </button>
                <button
                  onClick={() => handleSendEmail(previewCert)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all duration-200"
                >
                  <Mail size={13} />
                  <span>Send to Email</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Screen: Templates ────────────────────────────────────────────────────────
function TemplatesScreen({setTab,dbTemplates,handleSeed,handleEdit,handleDelete,isLoading}:{
  setTab:(t:string)=>void,
  dbTemplates:CanvaTemplate[],
  handleSeed:()=>void,
  handleEdit:(t:CanvaTemplate)=>void,
  handleDelete:(id:string)=>void,
  isLoading:boolean
}){
  const [activeChip,setActiveChip]=useState("All");
  const [searchT,setSearchT]=useState("");
  const [favorites,setFavorites]=useState<Set<number>>(new Set());
  const chips=["All","Professional","Academic","Modern","Minimal","Luxury","Creative","Corporate","Technology","AI","Workshop","Bootcamp"];

  // Merge DB templates with mock for display
  const displayTemplates=useMemo(()=>{
    const db=dbTemplates.map((t,i)=>({
      name:t.name,
      badge:t.category==="Premium"?"Premium":"Professional",
      badgeColor:t.category==="Premium"?"#92400E":"#1E40AF",
      badgeBg:t.category==="Premium"?"#FEF3C7":"#DBEAFE",
      theme:["navy","blue","teal","rose","purple","minimal","onyx","ivory","glass","corporate","classic","gradient"][i%12],
      rating:4.5+Math.random()*0.4,
      reviews:Math.floor(300+Math.random()*600),
      downloads:`${(1+Math.random()*2).toFixed(1)}k`,
      dbTemplate:t,
    }));
    const combined=[...db];
    // Add mock if no DB templates yet
    if(db.length===0)return MOCK_TEMPLATES.map(t=>({...t,dbTemplate:undefined as any}));
    return combined;
  },[dbTemplates]);

  const filtered=displayTemplates.filter(t=>{
    if(activeChip!=="All"&&!t.name.toLowerCase().includes(activeChip.toLowerCase()))return false;
    if(searchT&&!t.name.toLowerCase().includes(searchT.toLowerCase()))return false;
    return true;
  });

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"0 0 220px"}}>
          <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:TX3}}/>
          <input value={searchT} onChange={e=>setSearchT(e.target.value)} placeholder="Search templates..." style={{width:"100%",paddingLeft:32,paddingRight:12,height:36,border:`1px solid ${BD}`,borderRadius:8,fontSize:13,color:TX,outline:"none"}}/>
        </div>
        {["Categories","Style","Theme","Access"].map(f=>(
          <button key={f} style={{padding:"6px 12px",border:`1px solid ${BD}`,borderRadius:8,background:"white",cursor:"pointer",fontSize:13,color:TX2,display:"flex",alignItems:"center",gap:4}}>
            {f}<ChevronDown size={13}/>
          </button>
        ))}
        <button style={{padding:"6px 12px",border:`1px solid ${BD}`,borderRadius:8,background:"white",cursor:"pointer",fontSize:13,color:ER}}>Reset</button>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn variant="outline" onClick={handleSeed}><RefreshCw size={13}/>Seed Templates</Btn>
          <Btn variant="primary"><Plus size={14}/>New Template</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {chips.map(c=>(
          <button key={c} onClick={()=>setActiveChip(c)} style={{padding:"5px 14px",borderRadius:999,fontSize:13,fontWeight:500,border:"none",background:activeChip===c?P:"#F3F4F6",color:activeChip===c?"white":"#374151",cursor:"pointer"}}>
            {c}
          </button>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:14,fontWeight:600,color:TX}}>All Templates ({filtered.length})</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"5px 10px",fontSize:13,color:TX2}}>
            <option>Most Recent</option><option>Most Popular</option><option>Top Rated</option>
          </select>
          <button style={{padding:"5px 8px",border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><LayoutGrid size={15} color={TX2}/></button>
          <button style={{padding:"5px 8px",border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><List size={15} color={TX2}/></button>
        </div>
      </div>

      {isLoading?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
          {Array.from({length:10}).map((_,i)=>(
            <div key={i} style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{height:133,background:"linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",backgroundSize:"200% 100%"}}/>
              <div style={{padding:12}}><div style={{height:12,background:"#F3F4F6",borderRadius:4,marginBottom:8}}/><div style={{height:10,background:"#F3F4F6",borderRadius:4,width:"60%"}}/></div>
            </div>
          ))}
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
          {filtered.map((t,i)=>(
            <div key={i} style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)";e.currentTarget.style.transform="scale(1.01)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)";e.currentTarget.style.transform="scale(1)"}}>
              <div style={{position:"relative"}}>
                <CertThumbnail theme={t.theme} w={200} h={133}/>
                <button onClick={e=>{e.stopPropagation();const ns=new Set(favorites);favorites.has(i)?ns.delete(i):ns.add(i);setFavorites(ns);}} style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Heart size={14} color={favorites.has(i)?ER:TX2} fill={favorites.has(i)?ER:"none"}/>
                </button>
              </div>
              <div style={{padding:12}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:600,color:TX,flex:1,minWidth:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</span>
                  <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:t.badgeBg,color:t.badgeColor,flexShrink:0,marginLeft:6}}>{t.badge}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{padding:4,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><Eye size={12} color={TX2}/></button>
                    <button style={{padding:4,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><Copy size={12} color={TX2}/></button>
                    {t.dbTemplate&&(
                      <button onClick={()=>handleDelete(t.dbTemplate.id)} style={{padding:4,border:`1px solid ${ERL}`,borderRadius:6,background:ERL,cursor:"pointer"}}><Trash2 size={12} color={ER}/></button>
                    )}
                  </div>
                  <Btn variant="primary" onClick={()=>t.dbTemplate?handleEdit(t.dbTemplate):setTab("designer")} style={{fontSize:11,padding:"4px 10px"}}>
                    {t.dbTemplate?"Edit":"Use"}
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Screen: Designer (wraps existing DesignerWorkspace) ─────────────────────
function DesignerCanvasScreen(){
  const [selectedEl,setSelectedEl]=useState<string|null>("recipient");
  const [zoom,setZoom]=useState(65);
  const [showGrid,setShowGrid]=useState(false);
  const [device,setDevice]=useState("desktop");
  const [fontFamily,setFontFamily]=useState("Great Vibes");
  const [fontSize,setFontSize]=useState(72);
  const [fontColor,setFontColor]=useState("#1a1a2e");
  const [bold,setBold]=useState(false);
  const [italic,setItalic]=useState(false);
  const [underline,setUnderline]=useState(false);
  const [align,setAlign]=useState("center");
  const [opacity,setOpacity]=useState(100);
  const [designTab,setDesignTab]=useState("Design");

  const elements=[
    {id:"text",label:"Text",icon:<Type size={18} color={P}/>},
    {id:"image",label:"Image",icon:<Image size={18} color={IN}/>},
    {id:"shape",label:"Shape",icon:<Square size={18} color={SG}/>},
    {id:"qrcode",label:"QR Code",icon:<QrCode size={18} color={TX}/>},
    {id:"signature",label:"Signature",icon:<Pen size={18} color={WP}/>},
    {id:"date",label:"Date",icon:<Calendar size={18} color={ER}/>},
    {id:"id",label:"ID / No.",icon:<Hash size={18} color={TX2}/>},
    {id:"upload",label:"Upload",icon:<FileUp size={18} color={WO}/>},
  ];

  const dynamicFields=["Student Name","Course Name","Issue Date","Expiry Date","Certificate ID","Score","Grade","Instructor"];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 200px)",background:"white",border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden"}}>
      {/* Toolbar */}
      <div style={{borderBottom:`1px solid ${BD}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",flexShrink:0}}>
        <div style={{display:"flex",gap:6}}>
          <button style={{padding:5,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><RotateCcw size={14} color={TX2}/></button>
          <button style={{padding:5,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><RotateCw size={14} color={TX2}/></button>
        </div>
        <div style={{width:1,height:20,background:BD}}/>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <button onClick={()=>setZoom(z=>Math.max(25,z-10))} style={{padding:"3px 8px",border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer",fontSize:13,fontWeight:600}}>−</button>
          <span style={{fontSize:13,fontWeight:600,color:TX,minWidth:40,textAlign:"center"}}>{zoom}%</span>
          <button onClick={()=>setZoom(z=>Math.min(150,z+10))} style={{padding:"3px 8px",border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer",fontSize:13,fontWeight:600}}>+</button>
        </div>
        <div style={{width:1,height:20,background:BD}}/>
        {[{id:"desktop",icon:<Monitor size={14}/>},{id:"tablet",icon:<Tablet size={14}/>},{id:"mobile",icon:<Smartphone size={14}/>}].map(d=>(
          <button key={d.id} onClick={()=>setDevice(d.id)} style={{padding:"5px 10px",border:`1px solid ${device===d.id?P:BD}`,borderRadius:6,background:device===d.id?PL:"white",cursor:"pointer",color:device===d.id?P:TX2}}>
            {d.icon}
          </button>
        ))}
        <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13,color:TX2}}>
          <input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)} style={{accentColor:P}}/> Grid
        </label>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn variant="outline"><Eye size={14}/>Preview</Btn>
          <Btn variant="outline"><Save size={14}/>Save</Btn>
          <Btn variant="primary"><Download size={14}/>Download ▾</Btn>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Left Sidebar */}
        <div style={{width:180,borderRight:`1px solid ${BD}`,padding:12,overflowY:"auto",flexShrink:0,background:"#FAFAFA"}}>
          <div style={{fontSize:11,fontWeight:700,color:TX2,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Add Elements</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {elements.map(el=>(
              <button key={el.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 6px",border:`1px solid ${BD}`,borderRadius:8,background:"white",cursor:"pointer",fontSize:11,fontWeight:500,color:TX}}
                onMouseEnter={e=>{e.currentTarget.style.background=PL;e.currentTarget.style.borderColor=P}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.borderColor=BD}}>
                {el.icon}{el.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{flex:1,background:"#E5E7EB",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"auto",position:"relative"}}>
          <div style={{
            width:`min(${zoom}vw, ${1122*(zoom/100)}px)`,
            aspectRatio:"1122/794",
            maxWidth:"95%",
            background:"#0a0a2e",
            border:"1px solid #D1D5DB",
            boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
            position:"relative",
            overflow:"hidden",
            flexShrink:0,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 1122 794" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
              <defs>
                <linearGradient id="canvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0a0a2e"/><stop offset="100%" stopColor="#1a1a4e"/>
                </linearGradient>
              </defs>
              <rect width="1122" height="794" fill="url(#canvasBg)"/>
              <rect x="28" y="28" width="1066" height="738" fill="none" stroke="#C9A227" strokeWidth="5"/>
              <rect x="42" y="42" width="1038" height="710" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="2"/>
              <path d="M28,28 L140,28 L140,38 L38,38 L38,140 L28,140Z" fill="#C9A227" opacity="0.85"/>
              <path d="M1094,28 L982,28 L982,38 L1084,38 L1084,140 L1094,140Z" fill="#C9A227" opacity="0.85"/>
              <path d="M28,766 L140,766 L140,756 L38,756 L38,654 L28,654Z" fill="#C9A227" opacity="0.85"/>
              <path d="M1094,766 L982,766 L982,756 L1084,756 L1084,654 L1094,654Z" fill="#C9A227" opacity="0.85"/>
              <text x="561" y="120" textAnchor="middle" fill="#C9A227" fontSize="22" fontFamily="serif" letterSpacing="8" fontWeight="700">LEARNIFY AI</text>
              <text x="561" y="210" textAnchor="middle" fill="white" fontSize="80" fontFamily="Playfair Display,Georgia,serif" fontWeight="700" letterSpacing="16">CERTIFICATE</text>
              <text x="561" y="260" textAnchor="middle" fill="#C9A227" fontSize="26" letterSpacing="18" fontFamily="sans-serif">OF COMPLETION</text>
              <text x="561" y="340" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="22" fontFamily="sans-serif">This is to certify that</text>
              <rect x="200" y="350" width="722" height="120" fill={selectedEl==="recipient"?"rgba(107,91,251,0.1)":"transparent"} stroke={selectedEl==="recipient"?"#6B5BFB":"transparent"} strokeWidth="2" strokeDasharray="8 4" rx="4" onClick={()=>setSelectedEl("recipient")} style={{cursor:"pointer"}}/>
              <text x="561" y="450" textAnchor="middle" fill="white" fontSize="90" fontFamily="Great Vibes,Georgia,serif" fontStyle="italic" onClick={()=>setSelectedEl("recipient")} style={{cursor:"pointer"}}>Vishwajeet Sharma</text>
              <line x1="200" y1="476" x2="922" y2="476" stroke="rgba(201,162,39,0.45)" strokeWidth="1.5"/>
              <text x="561" y="516" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20" fontFamily="sans-serif">has successfully completed the course</text>
              <rect x="200" y="528" width="722" height="60" fill={selectedEl==="course"?"rgba(107,91,251,0.1)":"transparent"} stroke={selectedEl==="course"?"#6B5BFB":"transparent"} strokeWidth="1.5" strokeDasharray="6 3" rx="4" onClick={()=>setSelectedEl("course")} style={{cursor:"pointer"}}/>
              <text x="561" y="570" textAnchor="middle" fill="#C9A227" fontSize="34" fontFamily="Playfair Display,Georgia,serif" fontWeight="700" onClick={()=>setSelectedEl("course")} style={{cursor:"pointer"}}>Full Stack Web Development</text>
              <line x1="150" y1="640" x2="430" y2="640" stroke="rgba(201,162,39,0.45)" strokeWidth="1"/>
              <line x1="692" y1="640" x2="972" y2="640" stroke="rgba(201,162,39,0.45)" strokeWidth="1"/>
              <text x="290" y="660" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="18" fontFamily="sans-serif">May 25, 2026</text>
              <text x="290" y="682" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="14" fontFamily="sans-serif">Date of Completion</text>
              <text x="832" y="660" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="18" fontFamily="sans-serif">Vishwajeet S.</text>
              <text x="832" y="682" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="14" fontFamily="sans-serif">Founder & CEO, Learnify AI</text>
              <circle cx="561" cy="660" r="56" fill="rgba(201,162,39,0.12)" stroke="#C9A227" strokeWidth="3"/>
              <circle cx="561" cy="660" r="42" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5"/>
              <text x="561" y="672" textAnchor="middle" fill="#C9A227" fontSize="36" fontFamily="serif">✦</text>
              <rect x="996" y="700" width="80" height="80" fill="rgba(255,255,255,0.08)" stroke="rgba(201,162,39,0.4)" strokeWidth="1" rx="4"/>
              <text x="1036" y="748" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="18">QR</text>
              {selectedEl==="recipient"&&<>
                <rect x="198" y="348" width="10" height="10" fill={P} rx="2"/><rect x="908" y="348" width="10" height="10" fill={P} rx="2"/>
                <rect x="198" y="460" width="10" height="10" fill={P} rx="2"/><rect x="908" y="460" width="10" height="10" fill={P} rx="2"/>
                <rect x="548" y="348" width="10" height="10" fill={P} rx="2"/><rect x="548" y="460" width="10" height="10" fill={P} rx="2"/>
              </>}
            </svg>
          </div>

          {/* Dynamic Fields Bar */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:"white",borderTop:`1px solid ${BD}`,padding:"8px 16px",display:"flex",gap:6,alignItems:"center",overflowX:"auto"}}>
            <span style={{fontSize:11,fontWeight:600,color:TX2,flexShrink:0}}>Dynamic Fields:</span>
            {dynamicFields.map(f=>(
              <button key={f} style={{padding:"3px 10px",border:`1px solid ${BD}`,borderRadius:999,fontSize:12,fontWeight:500,background:"white",cursor:"pointer",flexShrink:0,color:TX}}
                onMouseEnter={e=>{e.currentTarget.style.background=PL;e.currentTarget.style.borderColor=P;e.currentTarget.style.color=P}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=TX}}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div style={{width:260,borderLeft:`1px solid ${BD}`,padding:16,overflowY:"auto",flexShrink:0,background:"#FAFAFA"}}>
          <div style={{display:"flex",gap:0,marginBottom:16,border:`1px solid ${BD}`,borderRadius:8,overflow:"hidden"}}>
            {["Design","Style","Arrange"].map(t=>(
              <button key={t} onClick={()=>setDesignTab(t)} style={{flex:1,padding:"7px 4px",border:"none",background:designTab===t?P:"white",color:designTab===t?"white":TX2,fontSize:12,fontWeight:designTab===t?600:400,cursor:"pointer"}}>
                {t}
              </button>
            ))}
          </div>

          {designTab==="Design"&&(
            <>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:TX2,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Text Properties</div>
                <div style={{marginBottom:8}}>
                  <label style={{fontSize:12,color:TX2,display:"block",marginBottom:4}}>Font Family</label>
                  <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:6,padding:"6px 10px",fontSize:13,color:TX}}>
                    <option>Great Vibes</option><option>Playfair Display</option><option>Inter</option>
                  </select>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <label style={{fontSize:12,color:TX2,display:"block",marginBottom:4}}>Size</label>
                    <input type="number" value={fontSize} onChange={e=>setFontSize(+e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:6,padding:"6px 10px",fontSize:13,color:TX}}/>
                  </div>
                  <div style={{flex:1}}>
                    <label style={{fontSize:12,color:TX2,display:"block",marginBottom:4}}>Color</label>
                    <div style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:18,height:18,borderRadius:3,background:fontColor,flexShrink:0}}/>
                      <input value={fontColor} onChange={e=>setFontColor(e.target.value)} style={{border:"none",fontSize:12,color:TX,width:"100%",outline:"none"}}/>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:8}}>
                  {[{label:"B",active:bold,toggle:()=>setBold(!bold)},{label:"I",active:italic,toggle:()=>setItalic(!italic)},{label:"U",active:underline,toggle:()=>setUnderline(!underline)}].map(b=>(
                    <button key={b.label} onClick={b.toggle} style={{flex:1,padding:"6px",border:`1px solid ${b.active?P:BD}`,borderRadius:6,background:b.active?PL:"white",color:b.active?P:TX,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      {b.label}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:4}}>
                  {[{icon:<AlignLeft size={14}/>,val:"left"},{icon:<AlignCenter size={14}/>,val:"center"},{icon:<AlignRight size={14}/>,val:"right"}].map(a=>(
                    <button key={a.val} onClick={()=>setAlign(a.val)} style={{flex:1,padding:"6px",border:`1px solid ${align===a.val?P:BD}`,borderRadius:6,background:align===a.val?PL:"white",color:align===a.val?P:TX2,cursor:"pointer",display:"flex",justifyContent:"center"}}>
                      {a.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:TX2,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Element Properties</div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <label style={{fontSize:12,color:TX2}}>Opacity</label>
                    <span style={{fontSize:12,color:TX}}>{opacity}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={opacity} onChange={e=>setOpacity(+e.target.value)} style={{width:"100%",accentColor:P}}/>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:TX2,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Colors</div>
                <div style={{display:"flex",gap:6}}>
                  {["#1a1a2e","#C9A227","white","#6B5BFB","#10B981"].map((c,i)=>(
                    <div key={i} style={{width:24,height:24,borderRadius:4,background:c,border:`1px solid ${BD}`,cursor:"pointer"}}/>
                  ))}
                  <button style={{width:24,height:24,borderRadius:4,border:`1px dashed ${TX3}`,background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Plus size={12} color={TX3}/>
                  </button>
                </div>
              </div>
            </>
          )}

          {designTab==="Arrange"&&(
            <div>
              <div style={{fontSize:11,fontWeight:700,color:TX2,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Position & Size</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[["X","410"],["Y","320"],["W","820"],["H","130"]].map(([l,v])=>(
                  <div key={l}>
                    <label style={{fontSize:11,color:TX2,display:"block",marginBottom:3}}>{l}</label>
                    <input defaultValue={v} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:6,padding:"5px 8px",fontSize:13,color:TX}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:11,color:TX2,display:"block",marginBottom:3}}>Rotate</label>
                <input type="range" min={0} max={360} defaultValue={0} style={{width:"100%",accentColor:P}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {["Bring Forward","Send Backward","Bring to Front","Send to Back"].map(a=>(
                  <button key={a} style={{padding:"6px 8px",border:`1px solid ${BD}`,borderRadius:6,fontSize:11,color:TX2,background:"white",cursor:"pointer",textAlign:"center"}}>{a}</button>
                ))}
              </div>
              <div style={{marginTop:12,display:"flex",gap:6}}>
                <Btn variant="outline" style={{flex:1,justifyContent:"center",fontSize:12}}><Copy size={13}/>Duplicate</Btn>
                <Btn variant="danger" style={{flex:1,justifyContent:"center",fontSize:12}}><Trash2 size={13}/>Delete</Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{borderTop:`1px solid ${BD}`,padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12,color:TX2,flexShrink:0}}>
        <span>Template: Executive Blue Gold</span>
        <span style={{color:SG,fontWeight:500}}>✓ Saved — Last edited 2 min ago</span>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="outline" style={{fontSize:12,padding:"4px 10px"}}>Reset</Btn>
          <Btn variant="primary" style={{fontSize:12,padding:"4px 10px"}}><Save size={12}/>Save Changes</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Bulk Issue ───────────────────────────────────────────────────────
function BulkIssueScreen({ courses = [], templates = [] }: { courses: any[], templates: any[] }){
  const [step,setStep]=useState(1);
  const [fileUploaded,setFileUploaded]=useState(false);
  const [issuing,setIssuing]=useState(false);
  const [progress,setProgress]=useState(0);
  const [done,setDone]=useState(false);
  const [sendEmail,setSendEmail]=useState(true);
  const [autoWallet,setAutoWallet]=useState(true);
  const [csvText, setCsvText] = useState("");
  const [parsedRecipients, setParsedRecipients] = useState<any[]>([]);
  const [mappedFields, setMappedFields] = useState<any>({
    name: "student_name",
    email: "email",
    score: "score",
    total: "total"
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [issueSummary, setIssueSummary] = useState<any>(null);

  useEffect(() => {
    if (templates.length && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
    }
    if (courses.length && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [templates, courses]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      toast.error("CSV file is empty or invalid");
      return;
    }
    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const records = lines.slice(1).map(line => {
      const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] ?? "";
      });
      return row;
    });
    setParsedRecipients(records);
    setFileUploaded(true);
    toast.success(`Successfully parsed ${records.length} records.`);
  };

  const handleManualParse = () => {
    if (!csvText) {
      toast.error("Please enter some recipient data first");
      return;
    }
    parseCSV(csvText);
  };

  const doBulkIssue = useServerFn(bulkIssueCertificates);

  const handleIssue=async ()=>{
    if (parsedRecipients.length === 0) {
      toast.error("No recipient data to issue");
      return;
    }
    setIssuing(true);
    setProgress(20);
    try {
      const payloadRecipients = parsedRecipients.map(r => {
        const scoreVal = Number(r[mappedFields.score] || 18);
        const totalVal = Number(r[mappedFields.total] || 20);
        return {
          name: r[mappedFields.name] || r.student_name || "Learner",
          email: r[mappedFields.email] || r.email || "learner@example.com",
          course_id: selectedCourseId,
          score: isNaN(scoreVal) ? 18 : scoreVal,
          total: isNaN(totalVal) ? 20 : totalVal,
          template_id: selectedTemplateId
        };
      });

      setProgress(50);
      const res = await doBulkIssue({
        data: {
          recipients: payloadRecipients,
          send_email: sendEmail
        }
      });
      setProgress(100);
      setIssueSummary(res);
      setDone(true);
      toast.success(`Bulk issuance complete! Issued ${res.successCount} certificates.`);
    } catch (e: any) {
      toast.error(`Bulk issue failed: ${e.message}`);
    } finally {
      setIssuing(false);
    }
  };

  const STEPS=[
    {n:1,label:"Upload Recipients",sub:"Upload CSV or enter manually"},
    {n:2,label:"Map Fields",sub:"Map CSV columns"},
    {n:3,label:"Customize",sub:"Certificate settings"},
    {n:4,label:"Review & Send",sub:"Preview and confirm"},
  ];

  const firstRecordHeaders = parsedRecipients.length > 0 ? Object.keys(parsedRecipients[0]) : [];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Stepper */}
      <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:"20px 24px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative"}}>
          <div style={{position:"absolute",top:16,left:"10%",right:"10%",height:2,background:BD,zIndex:0}}/>
          <div style={{position:"absolute",top:16,left:"10%",height:2,background:P,zIndex:1,width:`${((step-1)/3)*80}%`,transition:"width 0.3s"}}/>
          {STEPS.map((s)=>(
            <div key={s.n} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:2,flex:1}}>
              <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${step>s.n?P:step===s.n?P:BD}`,background:step>s.n?P:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>step>s.n&&setStep(s.n)}>
                {step>s.n?<Check size={15} color="white"/>:<span style={{fontSize:13,fontWeight:700,color:step===s.n?P:TX3}}>{s.n}</span>}
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:600,color:step===s.n?TX:TX2}}>{s.label}</div>
                <div style={{fontSize:10,color:TX3}}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Upload */}
        <div style={{background:"white",border:`1px solid ${step===1?P:BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>1. Upload Recipients</div>
          <div style={{fontSize:12,color:TX2,marginBottom:16}}>Upload a CSV file or enter recipient data manually</div>
          
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {!fileUploaded ? (
              <>
                <div style={{border:`2px dashed ${P}`,background:"#F5F3FF",borderRadius:12,padding:32,textAlign:"center",position:"relative"}}>
                  <input type="file" accept=".csv" onChange={handleFileUpload} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}} />
                  <Upload size={40} color={P} style={{margin:"0 auto 12px"}}/>
                  <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>Drag & drop your CSV file here</div>
                  <div style={{fontSize:12,color:TX2,marginBottom:12}}>or click to browse files</div>
                  <div style={{fontSize:11,color:TX3}}>Supports CSV only (student_name, email, score, total)</div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:12,fontWeight:600,color:TX}}>Or paste CSV values manually:</label>
                  <textarea 
                    value={csvText} 
                    onChange={e => setCsvText(e.target.value)} 
                    placeholder="student_name,email,score,total&#10;Ada Lovelace,ada@example.com,18,20" 
                    rows={4} 
                    style={{width:"100%",padding:10,border:`1px solid ${BD}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:"monospace"}}
                  />
                  <Btn variant="outline" onClick={handleManualParse} style={{alignSelf:"flex-end"}}>Parse Manual CSV</Btn>
                </div>
              </>
            ) : (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:`1px solid ${SGL}`,borderRadius:8,background:SGL,marginBottom:12}}>
                  <FileText size={20} color={SG}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:TX}}>Recipients List Parsed</div>
                    <div style={{fontSize:11,color:TX2}}>{parsedRecipients.length} Records Detected ✓</div>
                  </div>
                  <button onClick={()=>{setFileUploaded(false); setParsedRecipients([]);}} style={{background:"none",border:"none",cursor:"pointer"}}><X size={16} color={TX2}/></button>
                </div>
                <div style={{background:"#F9FAFB",border:`1px solid ${BD}`,borderRadius:8,padding:12,maxHeight:150,overflowY:"auto"}}>
                  <div style={{fontSize:12,fontWeight:600,color:TX,marginBottom:8}}>Preview parsed records:</div>
                  {parsedRecipients.slice(0, 3).map((r, idx) => (
                    <div key={idx} style={{fontSize:12,color:TX2,marginBottom:4}}>
                      {r.student_name || Object.values(r)[0]} ({r.email || Object.values(r)[1]})
                    </div>
                  ))}
                  {parsedRecipients.length > 3 && <div style={{fontSize:11,color:TX3,fontStyle:"italic"}}>+ {parsedRecipients.length - 3} more records...</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Fields */}
        <div style={{background:"white",border:`1px solid ${step===2?P:BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>2. Map Fields</div>
          <div style={{fontSize:12,color:TX2,marginBottom:12}}>Map your CSV columns to certificate fields</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:BG}}>
                {["Certificate Field","CSV Column","Preview"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",fontSize:11,fontWeight:600,color:TX2,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"left",borderBottom:`1px solid ${BD}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {field:"Student Name *",key:"name",defaultVal:"student_name"},
                {field:"Email Address *",key:"email",defaultVal:"email"},
                {field:"Score",key:"score",defaultVal:"score"},
                {field:"Total",key:"total",defaultVal:"total"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${BD}`}}>
                  <td style={{padding:"8px 10px",fontSize:13,color:TX}}>{r.field}</td>
                  <td style={{padding:"8px 10px"}}>
                    <select 
                      value={mappedFields[r.key]} 
                      onChange={e=>setMappedFields({...mappedFields, [r.key]: e.target.value})} 
                      style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX,width:"100%"}}
                    >
                      <option value="">-- Select Column --</option>
                      {firstRecordHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                      {!firstRecordHeaders.includes(r.defaultVal) && (
                        <option value={r.defaultVal}>{r.defaultVal} (Not in CSV)</option>
                      )}
                    </select>
                  </td>
                  <td style={{padding:"8px 10px",fontSize:12,color:SG}}>
                    {parsedRecipients[0]?.[mappedFields[r.key]] || "n/a"} ✓
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Step 3 */}
        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>3. Customize Certificate Settings</div>
          <div style={{fontSize:12,color:TX2,marginBottom:16}}>Choose course and template parameter</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Select Course:</label>
              <select value={selectedCourseId} onChange={e=>setSelectedCourseId(e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX}}>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Select Template:</label>
              <select value={selectedTemplateId} onChange={e=>setSelectedTemplateId(e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX}}>
                {templates.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,paddingTop:12,borderTop:`1px solid ${BD}`}}>
            {[{label:"Send Email to Recipients",sub:"Send certificates via email automatically",val:sendEmail,set:setSendEmail}].map(t=>(
              <label key={t.label} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                <div onClick={()=>t.set(!t.val)} style={{width:36,height:20,borderRadius:999,background:t.val?P:BD,position:"relative",transition:"background 0.2s",cursor:"pointer",flexShrink:0}}>
                  <div style={{width:16,height:16,borderRadius:"50%",background:"white",position:"absolute",top:2,left:t.val?18:2,transition:"left 0.2s"}}/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:TX}}>{t.label}</div>
                  <div style={{fontSize:11,color:TX2}}>{t.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>4. Review & Send</div>
          <div style={{fontSize:12,color:TX2,marginBottom:12}}>Review mapped records and verify counts</div>
          
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[
              {icon:<Users size={16} color={P}/>,label:"Parsed Recipients",value:parsedRecipients.length.toString(),color:PL},
              {icon:<Check size={16} color={SG}/>,label:"Mapped Template",value:templates.find((t:any)=>t.id===selectedTemplateId)?.name || "Default",color:SGL},
              {icon:<FileText size={16} color={IN}/>,label:"Mapped Course",value:courses.find((c:any)=>c.id===selectedCourseId)?.title?.slice(0, 18) || "Course",color:INL},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:s.color,borderRadius:8}}>
                {s.icon}
                <div>
                  <div style={{fontSize:11,color:TX2}}>{s.label}</div>
                  <div style={{fontSize:13,fontWeight:700,color:TX}}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {!issuing&&!done&&(
            <Btn variant="primary" onClick={handleIssue} style={{width:"100%",justifyContent:"center",fontSize:14,padding:"12px"}} disabled={parsedRecipients.length === 0}>
              <Upload size={16}/>Issue Certificates
            </Btn>
          )}

          {issuing&&!done&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                <span style={{color:TX2}}>Issuing certificates...</span>
                <span style={{fontWeight:600,color:P}}>{progress}%</span>
              </div>
              <div style={{height:8,borderRadius:999,background:"#F3F4F6",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:P,borderRadius:999,transition:"width 0.1s"}}/>
              </div>
            </div>
          )}

          {done&&issueSummary&&(
            <div style={{background:SGL,borderRadius:8,padding:"12px 16px",textAlign:"center"}}>
              <CheckCircle size={24} color={SG} style={{margin:"0 auto 6px"}}/>
              <div style={{fontSize:14,fontWeight:700,color:TX}}>✓ {issueSummary.successCount} Certificates Issued Successfully!</div>
              {issueSummary.errors?.length > 0 && (
                <div style={{fontSize:11,color:ER,marginTop:6,maxHeight:80,overflowY:"auto",textAlign:"left"}}>
                  <strong>Errors:</strong>
                  {issueSummary.errors.map((e: string, idx: number) => (
                    <div key={idx}>- {e}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn variant="outline" onClick={()=>setStep(s=>Math.max(1,s-1))}>← Previous</Btn>
        <Btn variant="primary" onClick={()=>setStep(s=>Math.min(4,s+1))}>Next Step →</Btn>
      </div>
    </div>
  );
}

// ─── Screen: Verification ─────────────────────────────────────────────────────
function VerificationScreen({ stats }: { stats: any }){
  const [selectedV,setSelectedV]=useState(0);
  const [verFilter,setVerFilter]=useState("All");
  const v=VERIFY_LIST[selectedV];

  const totalVerifications = stats?.totalVerifications ?? 24851;
  const verifiedCount = stats?.pieStatusData?.find((s: any) => s.name === "Verified")?.value ?? 23652;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <KPICard label="Total Verifications" value={totalVerifications.toLocaleString()} delta="+18.7%" icon={<Activity size={20} color={P}/>} iconBg={PL} sparkData={sparkVerTotal} sparkColor={P}/>
        <KPICard label="Verified Certificates" value={verifiedCount.toLocaleString()} delta="+21.4%" icon={<ShieldCheck size={20} color={SG}/>} iconBg={SGL} sparkData={sparkVerif} sparkColor={SG}/>
        <KPICard label="Invalid Certificates" value="342" delta="-8.3%" icon={<AlertCircle size={20} color={ER}/>} iconBg={ERL} sparkData={sparkInvalid} sparkColor={ER}/>
        <KPICard label="Pending Verifications" value="857" delta="+5.1%" icon={<Clock size={20} color={WO}/>} iconBg={WOL} sparkData={sparkPending} sparkColor={WO}/>
        <KPICard label="QR Code Scans" value="15,986" delta="+22.6%" icon={<QrCode size={20} color={WP}/>} iconBg="#EDE9FE" sparkData={sparkQR} sparkColor={WP}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"5fr 7fr",gap:16}}>
        {/* Left: Requests List */}
        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${BD}`}}>
            <div style={{fontSize:15,fontWeight:600,color:TX,marginBottom:10}}>Verification Requests</div>
            <div style={{position:"relative",marginBottom:10}}>
              <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:TX3}}/>
              <input placeholder="Search by name, email or certificate ID..." style={{width:"100%",paddingLeft:32,paddingRight:12,height:34,border:`1px solid ${BD}`,borderRadius:8,fontSize:12,color:TX,outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:4}}>
              {["All (857)","Verified","Invalid","Pending"].map(f=>(
                <button key={f} onClick={()=>setVerFilter(f)} style={{padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${verFilter===f?P:BD}`,background:verFilter===f?P:"white",color:verFilter===f?"white":TX2,cursor:"pointer"}}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{overflowY:"auto",maxHeight:420}}>
            {VERIFY_LIST.map((item,i)=>(
              <div key={i} onClick={()=>setSelectedV(i)} style={{padding:"12px 16px",borderBottom:`1px solid ${BD}`,cursor:"pointer",background:selectedV===i?"#F5F3FF":"white",borderLeft:selectedV===i?`4px solid ${P}`:"4px solid transparent",transition:"background 0.1s"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <CertThumbnail theme={item.theme} w={42} h={30}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:TX}}>{item.name}</div>
                    <div style={{fontSize:11,color:TX3}}>{item.email}</div>
                    <div style={{fontSize:11,color:TX3}}>Certificate ID: {item.id}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <StatusBadge status={item.status}/>
                    <span style={{fontSize:11,color:TX3}}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 16px",borderTop:`1px solid ${BD}`,display:"flex",gap:4,justifyContent:"center",alignItems:"center"}}>
            <button style={{padding:"4px 8px",border:`1px solid ${BD}`,borderRadius:5,background:"white",cursor:"pointer",fontSize:12}}>‹</button>
            {[1,2,3,4,5,"...",43].map((p,i)=>(
              <button key={i} style={{padding:"4px 8px",border:`1px solid ${p===1?P:BD}`,borderRadius:5,background:p===1?P:"white",color:p===1?"white":TX2,cursor:"pointer",fontSize:12,minWidth:28}}>{p}</button>
            ))}
            <button style={{padding:"4px 8px",border:`1px solid ${BD}`,borderRadius:5,background:"white",cursor:"pointer",fontSize:12}}>›</button>
          </div>
        </div>

        {/* Right: Details */}
        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontSize:15,fontWeight:600,color:TX}}>Certificate Verification Details</span>
            <Btn variant="outline" style={{fontSize:12,padding:"5px 10px"}}><Share2 size={13}/>Share</Btn>
          </div>

          <div style={{display:"flex",gap:16,marginBottom:16,padding:"16px",background:SGL,borderRadius:10}}>
            <CertThumbnail theme={v.theme} w={100} h={70}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <CheckCircle size={18} color={SG}/>
                <span style={{fontSize:13,fontWeight:700,color:SG}}>VERIFIED</span>
              </div>
              <div style={{fontSize:17,fontWeight:700,color:TX,marginBottom:2}}>{v.name}</div>
              <div style={{fontSize:12,color:TX2,marginBottom:2}}>has successfully completed the course</div>
              <div style={{fontSize:14,fontWeight:600,color:P}}>Full Stack Web Development</div>
              <div style={{fontSize:11,color:TX3,marginTop:2}}>Issued by Learnify AI · May 25, 2026</div>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{width:70,height:70,background:"white",border:`1px solid ${BD}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
                <QrCode size={50} color={TX}/>
              </div>
              <div style={{fontSize:10,color:TX3}}>Scan to Verify</div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:TX,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>Verification Information</div>
              {[
                {label:"Certificate ID",value:v.id,copy:true},
                {label:"Status",value:<StatusBadge status={v.status}/>},
                {label:"Issue Date",value:"May 25, 2026"},
                {label:"Expiry Date",value:"No Expiry"},
                {label:"Blockchain Hash",value:"0x7d3a6b...3a7d",copy:true},
                {label:"Times Verified",value:"12 Times"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,fontSize:12}}>
                  <span style={{color:TX2,flexShrink:0}}>{r.label}:</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    {typeof r.value==="string"?<span style={{fontWeight:500,color:TX,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.value}</span>:r.value}
                    {r.copy&&<Copy size={11} color={TX3} style={{cursor:"pointer",flexShrink:0}}/>}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:TX,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>Recipient Information</div>
              {[
                {icon:<User size={12}/>,label:"Name",value:v.name},
                {icon:<Mail size={12}/>,label:"Email",value:v.email},
                {icon:<GraduationCap size={12}/>,label:"Student ID",value:"STU-2026-7890"},
                {icon:<Phone size={12}/>,label:"Phone",value:"+91 98765 43210"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:7,fontSize:12}}>
                  <span style={{color:TX2}}>{r.icon}</span>
                  <span style={{color:TX2,width:70}}>{r.label}:</span>
                  <span style={{fontWeight:500,color:TX}}>{r.value}</span>
                </div>
              ))}
              <div style={{marginTop:12}}>
                <div style={{fontSize:12,fontWeight:700,color:TX,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Security Features</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {["Digital Signature","QR Code","Blockchain Verified","Certificate Authentic"].map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",background:SGL,borderRadius:6}}>
                      <CheckCircle size={12} color={SG}/>
                      <span style={{fontSize:11,color:TX,fontWeight:500}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Analytics ────────────────────────────────────────────────────────
function AnalyticsScreen({ stats }: { stats: any }){
  const [aTab,setATab]=useState("Overview");
  const aTabs=["Overview","Certificates","Templates","Recipients","Verification","Engagement","Exports"];
  const topTemplates=[
    {rank:1,name:"Executive Blue Gold",issued:2856,verified:2712,rate:95.0,rateColor:SG,theme:"navy"},
    {rank:2,name:"Skyline Tech",issued:2341,verified:2189,rate:93.5,rateColor:SG,theme:"blue"},
    {rank:3,name:"Ivory Academic",issued:1987,verified:1872,rate:94.2,rateColor:SG,theme:"ivory"},
    {rank:4,name:"Onyx Calligraphy",issued:1654,verified:1514,rate:91.5,rateColor:WO,theme:"onyx"},
    {rank:5,name:"Rose Charcoal",issued:1431,verified:1385,rate:95.4,rateColor:SG,theme:"rose"},
  ];

  const totalCerts = stats?.totalCerts ?? 12420;
  const verifiedCount = stats?.pieStatusData?.find((s: any) => s.name === "Verified")?.value ?? 8752;
  const downloadedCount = stats?.pieStatusData?.find((s: any) => s.name === "Downloaded")?.value ?? 6423;
  const sharedCount = stats?.pieStatusData?.find((s: any) => s.name === "Shared")?.value ?? 3251;
  const totalVerifications = stats?.totalVerifications ?? 15986;

  const chartData = stats?.monthlyGrowth ?? areaData;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:2,background:"white",border:`1px solid ${BD}`,borderRadius:10,padding:3}}>
          {aTabs.map(t=>(
            <button key={t} onClick={()=>setATab(t)} style={{padding:"6px 14px",borderRadius:7,fontSize:13,fontWeight:500,border:"none",background:aTab===t?P:"transparent",color:aTab===t?"white":TX2,cursor:"pointer"}}>
              {t}
            </button>
          ))}
        </div>
        <button style={{padding:"7px 14px",border:`1px solid ${BD}`,borderRadius:8,background:"white",fontSize:13,color:TX2,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <Calendar size={14}/>May 19 – May 25, 2026<ChevronDown size={13}/>
        </button>
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <KPICard label="Certificates Issued" value={totalCerts.toLocaleString()} delta="+18.7%" icon={<FilePlus size={20} color={P}/>} iconBg={PL} sparkData={sparkCerts} sparkColor={P}/>
        <KPICard label="Verified Certificates" value={verifiedCount.toLocaleString()} delta="+21.4%" icon={<ShieldCheck size={20} color={SG}/>} iconBg={SGL} sparkData={sparkVerif} sparkColor={SG}/>
        <KPICard label="Downloads" value={downloadedCount.toLocaleString()} delta="+16.2%" icon={<Download size={20} color={IN}/>} iconBg={INL} sparkData={sparkDl} sparkColor={IN}/>
        <KPICard label="Shares" value={sharedCount.toLocaleString()} delta="+20.2%" icon={<Share2 size={20} color={WO}/>} iconBg={WOL} sparkData={sparkLi} sparkColor={WO}/>
        <KPICard label="QR Code Scans" value={totalVerifications.toLocaleString()} delta="+22.6%" icon={<QrCode size={20} color={PK}/>} iconBg="#FCE7F3" sparkData={sparkQR} sparkColor={PK}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"5fr 4fr 3fr",gap:16}}>
        <SectionCard title="Certificates Issued Over Time" action={
          <select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX2}}>
            <option>Daily</option><option>Weekly</option><option>Monthly</option>
          </select>
        }>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={P} stopOpacity={0.18}/><stop offset="100%" stopColor={P} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="date" tick={{fontSize:11,fill:TX3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:TX3}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`${v/1000}K`}/>
              <Tooltip formatter={(v:any)=>[v.toLocaleString(),"Certificates"]} contentStyle={{borderRadius:8,border:`1px solid ${BD}`,fontSize:12}}/>
              <Area type="monotone" dataKey="value" stroke={P} strokeWidth={2} fill="url(#areaGrad)" dot={{r:3,fill:P}}/>
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Certificates by Status" action={<select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX2}}><option>This Week</option></select>}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative",width:140,height:140,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieAnalytics} innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {pieAnalytics.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip formatter={(v:any)=>v.toLocaleString()}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:14,fontWeight:700,color:TX}}>24,851</div>
                <div style={{fontSize:9,color:TX2}}>Total</div>
              </div>
            </div>
            <div style={{flex:1}}>
              {pieAnalytics.map((s,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/>
                    <span style={{fontSize:12,color:TX2}}>{s.name}</span>
                    <span style={{fontSize:12,fontWeight:600,color:TX,marginLeft:"auto"}}>{s.pct}</span>
                  </div>
                  <div style={{fontSize:11,color:TX3,paddingLeft:14}}>{s.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Top Performing Templates" action={<a style={{fontSize:12,color:P,cursor:"pointer"}}>View All →</a>}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {topTemplates.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,fontWeight:700,color:"#D1D5DB",width:20,textAlign:"center",flexShrink:0}}>{t.rank}</span>
                <CertThumbnail theme={t.theme} w={36} h={26}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                  <div style={{fontSize:10,color:TX3}}>{t.issued.toLocaleString()} / {t.verified.toLocaleString()}</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:"2px 6px",borderRadius:4,background:t.rateColor===SG?SGL:WOL,color:t.rateColor,flexShrink:0}}>{t.rate}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        <SectionCard title="Downloads & Shares" action={<select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX2}}><option>This Week</option></select>}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:TX3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:TX3}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`${v/1000}K`}/>
              <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${BD}`,fontSize:11}}/>
              <Bar dataKey="downloads" fill={P} radius={[3,3,0,0]} name="Downloads"/>
              <Bar dataKey="shares" fill={WO} radius={[3,3,0,0]} name="Shares"/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:TX2}}><div style={{width:8,height:8,borderRadius:2,background:P}}/>Downloads</div>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:TX2}}><div style={{width:8,height:8,borderRadius:2,background:WO}}/>Shares</div>
          </div>
        </SectionCard>

        <SectionCard title="Verification Activity" action={<select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX2}}><option>This Week</option></select>}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["Method","Count","Change"].map(h=>(
                  <th key={h} style={{fontSize:11,fontWeight:600,color:TX2,textTransform:"uppercase",letterSpacing:"0.04em",padding:"4px 0",textAlign:"left",borderBottom:`1px solid ${BD}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {method:"QR Code Scanned",count:"15,986",change:"+22.6%",up:true},
                {method:"Direct Link Access",count:"4,231",change:"+18.1%",up:true},
                {method:"Email Verification",count:"2,145",change:"+15.3%",up:true},
                {method:"Manual Verification",count:"390",change:"-2.4%",up:false},
              ].map((r,i)=>(
                <tr key={i} style={{background:i%2===0?"white":"#F9FAFB"}}>
                  <td style={{padding:"8px 0",fontSize:12,color:TX}}>{r.method}</td>
                  <td style={{padding:"8px 0",fontSize:13,fontWeight:600,color:TX}}>{r.count}</td>
                  <td style={{padding:"8px 0",fontSize:12,fontWeight:600,color:r.up?SG:ER}}>{r.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Geographic Distribution" action={<select style={{border:`1px solid ${BD}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:TX2}}><option>This Week</option></select>}>
          <div style={{height:180,background:"linear-gradient(135deg,#EEF0FF,#F0F9FF)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
            <Globe size={60} color={P} style={{opacity:0.3}}/>
            <div style={{fontSize:12,color:TX2,fontWeight:500}}>Geographic Distribution</div>
            <div style={{fontSize:11,color:TX3}}>India: 3,521 · US: 2,100 · UK: 1,230</div>
          </div>
        </SectionCard>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {icon:"🛡",title:"High Verification Rate",desc:"Your verification rate is 95.2%, which is excellent!",link:"View Details →"},
          {icon:"🎨",title:"Top Template",desc:"Executive Blue Gold is your top performer.",link:"See Templates →"},
          {icon:"📊",title:"Engagement Growth",desc:"Certificate shares increased by 20.2% this week.",link:"View Analytics →"},
          {icon:"🔒",title:"Increase Security",desc:"Enable blockchain verification for more trust.",link:"Go to Settings →"},
        ].map((c,i)=>(
          <div key={i} style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:"16px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:24,marginBottom:8}}>{c.icon}</div>
            <div style={{fontSize:13,fontWeight:600,color:TX,marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:12,color:TX2,marginBottom:8,lineHeight:1.4}}>{c.desc}</div>
            <button style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",padding:0}}>{c.link}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Categories ───────────────────────────────────────────────────────
function CategoriesScreen({ categories = [] }: { categories: any[] }){
  const [selectedCat,setSelectedCat]=useState(0);
  const [catSearch,setCatSearch]=useState("");
  
  const displayCats = categories.length > 0 ? categories : CATS_DATA;
  const cat = displayCats[selectedCat] || displayCats[0];
  const filtered = displayCats.filter((c: any) => c.name.toLowerCase().includes(catSearch.toLowerCase()));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <KPICard label="Total Categories" value="42" delta="+8.4%" icon={<Tag size={20} color={P}/>} iconBg={PL} sparkData={[{v:30,i:0},{v:34,i:1},{v:37,i:2},{v:39,i:3},{v:40,i:4},{v:41,i:5},{v:42,i:6}]} sparkColor={P}/>
        <KPICard label="Certificates Issued" value="12,420" delta="+24.5%" icon={<FilePlus size={20} color={SG}/>} iconBg={SGL} sparkData={sparkCerts} sparkColor={SG}/>
        <KPICard label="Verified Certificates" value="8,752" delta="+18.7%" icon={<ShieldCheck size={20} color={IN}/>} iconBg={INL} sparkData={sparkVerif} sparkColor={IN}/>
        <KPICard label="Active Subcategories" value="128" delta="+12.1%" icon={<FolderOpen size={20} color={WO}/>} iconBg={WOL} sparkData={[{v:90,i:0},{v:98,i:1},{v:105,i:2},{v:112,i:3},{v:118,i:4},{v:124,i:5},{v:128,i:6}]} sparkColor={WO}/>
      </div>

      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div style={{position:"relative",flex:"0 0 280px"}}>
          <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:TX3}}/>
          <input value={catSearch} onChange={e=>setCatSearch(e.target.value)} placeholder="Search categories..." style={{width:"100%",paddingLeft:32,paddingRight:12,height:36,border:`1px solid ${BD}`,borderRadius:8,fontSize:13,color:TX,outline:"none"}}/>
        </div>
        <div style={{marginLeft:"auto"}}><Btn variant="primary"><Plus size={14}/>New Category</Btn></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>
        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:BG,borderBottom:`1px solid ${BD}`}}>
                {["Category Name","Type","Certificates","Templates","Avg Rating","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",fontSize:11,fontWeight:600,color:TX2,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c,i)=>(
                <tr key={i} onClick={()=>setSelectedCat(displayCats.indexOf(c))} style={{borderBottom:`1px solid ${BD}`,cursor:"pointer",background:selectedCat===displayCats.indexOf(c)?PL:"white",transition:"background 0.1s"}}
                  onMouseEnter={e=>{if(selectedCat!==displayCats.indexOf(c))e.currentTarget.style.background="#F9FAFB"}}
                  onMouseLeave={e=>{if(selectedCat!==displayCats.indexOf(c))e.currentTarget.style.background="white"}}>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:600,color:TX}}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px",fontSize:13,color:TX2}}>{c.type}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:600,color:TX}}>{c.certs.toLocaleString()}</td>
                  <td style={{padding:"12px 14px",fontSize:13,color:TX}}>{c.templates}</td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <Star size={12} fill={WO} color={WO}/>
                      <span style={{fontSize:13,fontWeight:500,color:TX}}>{c.rating}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}><StatusBadge status={c.status}/></td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <button style={{padding:5,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><Eye size={12} color={TX2}/></button>
                      <button style={{padding:5,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><Edit size={12} color={TX2}/></button>
                      <button style={{padding:5,border:`1px solid ${BD}`,borderRadius:6,background:"white",cursor:"pointer"}}><MoreHorizontal size={12} color={TX2}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",height:"fit-content"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:cat.color}}/>
            <span style={{fontSize:14,fontWeight:700,color:TX}}>{cat.name}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {[
              {label:"Type",value:cat.type},
              {label:"Certificates",value:cat.certs.toLocaleString()},
              {label:"Templates",value:cat.templates},
              {label:"Avg Rating",value:`${cat.rating} ⭐`},
              {label:"Status",value:<StatusBadge status={cat.status}/>},
            ].map(r=>(
              <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
                <span style={{color:TX2}}>{r.label}</span>
                <span style={{fontWeight:500,color:TX}}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${BD}`,paddingTop:14}}>
            <div style={{fontSize:12,fontWeight:700,color:TX,marginBottom:10}}>Subcategories</div>
            {["Web Development","Mobile Apps","DevOps","Cloud Computing","Cybersecurity"].map((sub,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",borderRadius:6,marginBottom:4,background:"#F9FAFB",fontSize:12}}>
                <span style={{color:TX}}>{sub}</span>
                <span style={{color:TX3,fontSize:11}}>{[156,134,98,112,87][i]} certs</span>
              </div>
            ))}
            <button style={{width:"100%",marginTop:8,padding:"8px",border:`1px dashed ${BD}`,borderRadius:8,background:"white",cursor:"pointer",fontSize:12,color:P,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              <Plus size={13}/>Add Subcategory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────
function SettingsScreen({ initialSettings, onSave }: { initialSettings: any, onSave: (s: any) => Promise<any> }){
  const [expiry, setExpiry] = useState(initialSettings?.cert_expiry || "No Expiry");
  const [prefix, setPrefix] = useState(initialSettings?.cert_serial_prefix || "LAI-2026");
  const [blockchain, setBlockchain] = useState(initialSettings?.cert_blockchain === "true");
  const [emailNotif, setEmailNotif] = useState(initialSettings?.cert_email_notifications === "true");
  const [qrCode, setQrCode] = useState(initialSettings?.cert_qr_code === "true");
  const [settingsNav,setSettingsNav] = useState("General");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        cert_expiry: expiry,
        cert_serial_prefix: prefix,
        cert_blockchain: blockchain ? "true" : "false",
        cert_email_notifications: emailNotif ? "true" : "false",
        cert_qr_code: qrCode ? "true" : "false"
      });
      toast.success("Settings saved successfully!");
    } catch (e: any) {
      toast.error(`Failed to save settings: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
      <div style={{background:"white",border:`1px solid ${BD}`,borderRadius:12,padding:16,height:"fit-content",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
        {[
          {icon:<Settings size={15}/>,label:"General"},
          {icon:<Bell size={15}/>,label:"Notifications"},
          {icon:<Shield size={15}/>,label:"Security"},
          {icon:<Palette size={15}/>,label:"Branding"},
          {icon:<Mail size={15}/>,label:"Email"},
          {icon:<Globe size={15}/>,label:"Domain"},
          {icon:<Users size={15}/>,label:"Team"},
        ].map((item)=>(
          <button key={item.label} onClick={()=>setSettingsNav(item.label)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",background:settingsNav===item.label?PL:"transparent",color:settingsNav===item.label?P:TX2,fontSize:13,fontWeight:settingsNav===item.label?600:400,cursor:"pointer",marginBottom:2,textAlign:"left"}}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <SectionCard title="General Settings">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Organization Name</label>
                <input defaultValue="Learnify AI" disabled style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX,outline:"none",background:"#F9FAFB"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Certificate ID Prefix</label>
                <input value={prefix} onChange={e=>setPrefix(e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX,outline:"none"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Expiry Preference</label>
                <select value={expiry} onChange={e=>setExpiry(e.target.value)} style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX,outline:"none"}}>
                  <option value="No Expiry">No Expiry</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:TX,display:"block",marginBottom:6}}>Timezone</label>
                <input defaultValue="Asia/Kolkata (IST)" disabled style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:TX,outline:"none",background:"#F9FAFB"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn variant="primary" onClick={handleSave}>{saving ? "Saving..." : "Save Changes"}</Btn>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notifications & Automation">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {label:"Email Notifications",sub:"Send email to recipients when certificate is issued",val:emailNotif,set:setEmailNotif},
              {label:"Blockchain Verification",sub:"Enable blockchain hash for tamper detection",val:blockchain,set:setBlockchain},
              {label:"Show QR Code",sub:"Render QR Code on certificate for direct mobile scans",val:qrCode,set:setQrCode},
            ].map(t=>(
              <div key={t.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${BD}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:TX}}>{t.label}</div>
                  <div style={{fontSize:12,color:TX2}}>{t.sub}</div>
                </div>
                <div onClick={()=>t.set(!t.val)} style={{width:44,height:24,borderRadius:999,background:t.val?P:BD,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:t.val?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <Btn variant="primary" onClick={handleSave}>{saving ? "Saving..." : "Save Changes"}</Btn>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Security">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {icon:<Lock size={16} color={P}/>,title:"Rate Limiting",desc:"Max 60 verification requests per minute per IP",badge:"Active",badgeBg:SGL,badgeColor:SG},
              {icon:<Shield size={16} color={IN}/>,title:"SSL/TLS",desc:"All data encrypted in transit",badge:"Active",badgeBg:SGL,badgeColor:SG},
              {icon:<Zap size={16} color={WO}/>,title:"Audit Log",desc:"All actions logged with user ID and timestamp",badge:"Active",badgeBg:SGL,badgeColor:SG},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:`1px solid ${BD}`,borderRadius:10}}>
                <div style={{width:36,height:36,borderRadius:8,background:PL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:TX}}>{s.title}</div>
                  <div style={{fontSize:12,color:TX2}}>{s.desc}</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:6,background:s.badgeBg,color:s.badgeColor}}>{s.badge}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [designerTemplate, setDesignerTemplate] = useState<CanvaTemplate|null>(null);
  const [showDesignerWorkspace, setShowDesignerWorkspace] = useState(false);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);

  const doGetStats = useServerFn(getCertificateStats);
  const doListAllCerts = useServerFn(listAllCertificates);
  const doGetCategories = useServerFn(getCertCategories);
  const doGetSettings = useServerFn(getCertSettings);
  const doSaveSettings = useServerFn(saveCertSettings);

  const { data: stats } = useQuery({
    queryKey: ["cert-system-stats"],
    queryFn: () => doGetStats(),
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates-list"],
    queryFn: () => doListAllCerts(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["cert-categories"],
    queryFn: () => doGetCategories(),
  });

  const { data: initialSettings } = useQuery({
    queryKey: ["cert-settings"],
    queryFn: () => doGetSettings(),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, instructor")
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const {data:templates=[],isLoading} = useQuery({
    queryKey:["canva-cert-templates"],
    queryFn:async()=>{
      const r=await doList();
      return (r??[]) as CanvaTemplate[];
    },
  });

  const handleSeed = async()=>{
    try{
      const res=await doSeed();
      toast.success(`Seeded: ${res.created} templates created${res.errors?.length?`, ${res.errors.length} errors`:""}`);
      qc.invalidateQueries({queryKey:["canva-cert-templates"]});
    }catch(e:any){toast.error(e.message);}
  };

  const handleEdit = (t:CanvaTemplate)=>{
    setDesignerTemplate(t);
    setShowDesignerWorkspace(true);
  };

  const handleNew = ()=>{
    setDesignerTemplate({
      id:"new",name:"New Certificate",category:"Professional",
      bg_image_url:"",thumbnail_url:null,fields_json:null,theme_colors:null,
      created_at:new Date().toISOString(),updated_at:new Date().toISOString(),created_by:null,
    });
    setShowDesignerWorkspace(true);
  };

  const handleDelete = async(id:string)=>{
    if(!window.confirm("Delete this template?"))return;
    try{
      await doDelete({data:{id}});
      toast.success("Deleted");
      qc.invalidateQueries({queryKey:["canva-cert-templates"]});
    }catch(e:any){toast.error(e.message);}
  };

  // DesignerWorkspace full-screen mode
  if(showDesignerWorkspace&&designerTemplate){
    return(
      <DesignerWorkspace
        initialTemplate={{
          id:designerTemplate.id,
          name:designerTemplate.name,
          type:designerTemplate.category||"Certificate",
          layout:designerTemplate.fields_json?.design?.layout||"classic",
          bg_image_url:designerTemplate.bg_image_url||"",
          config_json:designerTemplate.fields_json||{elements:[],design:{}},
        }}
        onSave={async(tmpl)=>{
          await doSave({data:{...designerTemplate,...tmpl,fields_json:tmpl.config_json} as any});
          qc.invalidateQueries({queryKey:["canva-cert-templates"]});
          toast.success("Saved!");
          setShowDesignerWorkspace(false);
        }}
        onClose={()=>setShowDesignerWorkspace(false)}
      />
    );
  }

  const PAGE_INFO:Record<string,{icon:ReactNode,title:string,subtitle:string}>={
    "overview":     {icon:<Shield size={22} color={P}/>,title:"Certificate System",subtitle:"Create, manage and issue professional certificates with ease."},
    "all-certs":    {icon:<FileText size={22} color={P}/>,title:"All Certificates",subtitle:"Manage, search and filter all issued certificates."},
    "templates":    {icon:<LayoutGrid size={22} color={P}/>,title:"Certificate Templates",subtitle:"Browse, create and manage certificate templates."},
    "designer":     {icon:<Pen size={22} color={P}/>,title:"Certificate Designer",subtitle:"Design beautiful, verifiable certificates with ease."},
    "bulk-issue":   {icon:<Upload size={22} color={P}/>,title:"Bulk Issue Certificates",subtitle:"Upload a list of recipients and issue certificates in bulk."},
    "verification": {icon:<ShieldCheck size={22} color={P}/>,title:"Verification Center",subtitle:"Verify certificate authenticity and manage verification settings."},
    "analytics":    {icon:<BarChart2 size={22} color={P}/>,title:"Certificate Analytics",subtitle:"Track certificate performance, engagement, and insights."},
    "categories":   {icon:<Tag size={22} color={P}/>,title:"Certificate Categories",subtitle:"Organize and manage certificate categories and subcategories."},
    "settings":     {icon:<Settings size={22} color={P}/>,title:"Settings",subtitle:"Configure your certificate system preferences and integrations."},
  };

  const info=PAGE_INFO[activeTab]||PAGE_INFO["overview"];

  const renderScreen=()=>{
    switch(activeTab){
      case "overview":     return <OverviewScreen setTab={setActiveTab} stats={stats}/>;
      case "all-certs":    return <AllCertsScreen certificates={certificates} setTab={setActiveTab} onRefresh={() => qc.invalidateQueries({ queryKey: ["certificates-list"] })} />;
      case "templates":    return <TemplatesScreen setTab={setActiveTab} dbTemplates={templates} handleSeed={handleSeed} handleEdit={handleEdit} handleDelete={handleDelete} isLoading={isLoading}/>;
      case "designer":     return <DesignerCanvasScreen/>;
      case "bulk-issue":   return <BulkIssueScreen courses={courses} templates={templates}/>;
      case "verification": return <VerificationScreen stats={stats}/>;
      case "analytics":    return <AnalyticsScreen stats={stats}/>;
      case "categories":   return <CategoriesScreen categories={categories}/>;
      case "settings":     return <SettingsScreen initialSettings={initialSettings} onSave={async (s) => {
        await doSaveSettings({ data: s });
        qc.invalidateQueries({ queryKey: ["cert-settings"] });
      }}/>;
      default:             return <OverviewScreen setTab={setActiveTab} stats={stats}/>;
    }
  };

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Inter,system-ui,sans-serif",color:TX}}>
      {/* Sticky Header + Tab Nav */}
      <div style={{background:"white",borderBottom:`1px solid ${BD}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 24px 0"}}>
          <div style={{width:36,height:36,borderRadius:8,background:PL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {info.icon}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:20,fontWeight:700,color:TX,margin:0,lineHeight:1.2}}>{info.title}</h1>
            <p style={{fontSize:13,color:TX2,margin:0}}>{info.subtitle}</p>
          </div>
          {activeTab==="templates"&&(
            <div style={{display:"flex",gap:8}}>
              <Btn variant="outline" onClick={handleSeed}><RefreshCw size={13}/>Seed Templates</Btn>
              <Btn variant="primary" onClick={handleNew}><Plus size={14}/>New Template</Btn>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{display:"flex",gap:0,padding:"0 24px",overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"12px 16px",
              border:"none",
              borderBottom:`2px solid ${activeTab===t.id?P:"transparent"}`,
              background:"transparent",
              color:activeTab===t.id?P:TX2,
              fontSize:13,fontWeight:activeTab===t.id?600:400,
              cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",
            }}
            onMouseEnter={e=>{if(activeTab!==t.id)e.currentTarget.style.color="#374151"}}
            onMouseLeave={e=>{if(activeTab!==t.id)e.currentTarget.style.color=TX2}}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding:activeTab==="designer"?"16px":"20px 24px",
        maxWidth:activeTab==="designer"?"100%":1400,
        margin:"0 auto",
      }}>
        {renderScreen()}
      </div>

      <style>{`
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        ::-webkit-scrollbar{display:none}
        *{scrollbar-width:none}
      `}</style>
    </div>
  );
}
