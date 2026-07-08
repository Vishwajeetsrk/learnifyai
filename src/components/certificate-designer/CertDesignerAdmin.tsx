import { useState, useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCanvaTemplates, saveCanvaTemplate, deleteCanvaTemplate, seedAllTemplates } from "@/lib/canva-cert.functions";
import { listTemplates, saveTemplate, deleteTemplate, listCertificates, verifyCertificateByCode } from "@/lib/certificate-admin.functions";
import { getCertificateAnalytics } from "@/lib/cert.functions";
import { issueAndEmailCertificate } from "@/lib/cert-email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DesignerWorkspace } from "./DesignerWorkspace";
import * as Recharts from "recharts";
const { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } = Recharts;
import { LayoutDashboard, Award, LayoutTemplate, Palette, ShieldCheck, CheckCircle2, Wallet, Users, Mail, BarChart3, Sparkles, ShoppingBag, Settings as SettingsIcon, Search, Bell, HelpCircle, Plus, ChevronDown, Download, Share2, QrCode, Linkedin, Eye, Copy, Heart, MoreVertical, Filter, Grid, List, Upload, RefreshCw, ExternalLink, ChevronRight, Check, Crown, FileText, Clock, Zap, Type, Image as ImageIcon, Square, Ribbon, FileSpreadsheet, Layers, Sparkle, Sliders, Maximize2, Undo, Redo, RotateCcw, AlertCircle, X, Lock, ChevronLeft, BookOpen, TrendingUp, TrendingDown, UserCheck, Hash, Tag, Trash2, Edit3, Save, Globe, Smartphone } from "lucide-react";

const P = "#6B5BFB", SG = "#10B981", WO = "#F59E0B", ER = "#EF4444";
const IN = "#3B82F6", TX = "#0F172A", BL = "#94A3B8";
const BD = "#E5E7EB", CR = "#8B5CF6", PK = "#EC4899", CY = "#06B6D4";

type CanvaTemplate = { id: string; name: string; category: string; bg_image_url: string; thumbnail_url: string | null; fields_json: any; theme_colors: any; created_at: string; updated_at: string; created_by: string | null; };
type CertRecord = { id: string; code: string; user_id: string; score: number; created_at: string; course?: { title: string } | null; user?: { email: string } | null; };

const CATEGORY_PILLS = ["All","Professional","Academic","Modern","Minimal","Luxury","Creative","Corporate","Technology","AI","Workshop","Bootcamp","Internship","Canva"];
function fd(d:string) { try{return new Date(d).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return d} }

export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkFile, setBulkFile] = useState<File|null>(null);
  const [bulkRecords, setBulkRecords] = useState<any[]>([]);
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [analyticsView, setAnalyticsView] = useState("6m");
  const [allCertsSearch, setAllCertsSearch] = useState("");
  const [categories, setCategories] = useState<{id:string;name:string;count:number;color:string}[]>([
    {id:"1",name:"Professional",count:12,color:P},{id:"2",name:"Academic",count:8,color:IN},{id:"3",name:"Creative",count:6,color:CR},{id:"4",name:"Technology",count:5,color:CY},{id:"5",name:"Corporate",count:4,color:TX},{id:"6",name:"Workshop",count:3,color:WO},
  ]);
  const [settings, setSettings] = useState({ brandName:"Learnify AI", supportEmail:"support@learnify.ai", defaultExpiryDays:365, requireVerification:true, allowDownload:true, allowLinkedInShare:true, emailNotifications:true, autoEmailOnIssue:true, publicGallery:false, theme:"light", notificationEmail:"admin@learnify.ai", smtpProvider:"resend" });
  const [newCatName, setNewCatName] = useState("");
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [designerTemplate, setDesignerTemplate] = useState<any>(null);
  const [showDesignerWorkspace, setShowDesignerWorkspace] = useState(false);
  const [bulkIssueForm, setBulkIssueForm] = useState({ name:"", email:"", course:"", score:85 });

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);
  const doListCerts = useServerFn(listCertificates);
  const doVerify = useServerFn(verifyCertificateByCode);
  const doAnalytics = useServerFn(getCertificateAnalytics);
  const doIssueBulk = useServerFn(issueAndEmailCertificate);
  const doListTmpl = useServerFn(listTemplates);
  const doSaveTmpl = useServerFn(saveTemplate);
  const doDelTmpl = useServerFn(deleteTemplate);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["canva-cert-templates"],
    queryFn: async () => { const r = await doList(); return (r ?? []) as CanvaTemplate[]; },
  });
  const { data: analyticsRaw, refetch: refetchAnalytics } = useQuery({
    queryKey: ["cert-analytics"],
    queryFn: async () => { const r = await doAnalytics(); return r ?? { totalIssued:0, totalVerified:0, activeTemplates:0, monthlyGrowth:[], recentIssues:[] }; },
  });
  const analytics = analyticsRaw ?? { totalIssued:0, totalVerified:0, activeTemplates:0, monthlyGrowth:[] as number[], recentIssues:[] as any[] };
  const { data: allCerts = [] } = useQuery({
    queryKey: ["all-certificates"],
    queryFn: async () => { const r = await doListCerts(); return (r ?? []) as unknown as CertRecord[]; },
    enabled: activeTab === "allcerts",
  });
  const { data: certTemplates = [] } = useQuery({
    queryKey: ["cert-templates"],
    queryFn: async () => { const r = await doListTmpl(); return r ?? []; },
    enabled: activeTab === "templates",
  });

  const filteredTemplates = useMemo(() => templates.filter(t => {
    const ms = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const mc = selectedCategory === "All" || t.category.toLowerCase() === selectedCategory.toLowerCase();
    return ms && mc;
  }), [templates, search, selectedCategory]);

  const filteredCerts = useMemo(() => allCerts.filter(c => {
    if (!allCertsSearch) return true;
    const s = allCertsSearch.toLowerCase();
    return c.code?.toLowerCase().includes(s) || c.course?.title?.toLowerCase().includes(s) || c.user?.email?.includes(s);
  }), [allCerts, allCertsSearch]);

  const analyticsChartData = useMemo(() => {
    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const months = analyticsView === "12m" ? 12 : 6;
    const data = analytics.monthlyGrowth ?? [];
    const start = Math.max(0, data.length - months);
    return data.slice(start).map((v: number, i: number) => ({ month: labels[(now.getMonth() - months + 1 + i + 12) % 12], value: v }));
  }, [analytics, analyticsView]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;
    setVerifying(true); setVerificationResult(null);
    try { const res = await doVerify({ data: { code: verificationCode.trim() } }); setVerificationResult(res as any); }
    catch(e: any) { setVerificationResult({ found: false, error: e.message }); }
    finally { setVerifying(false); }
  };

  const handleBulkIssueAll = async () => {
    if (bulkRecords.length === 0) { toast.error("No records to issue"); return; }
    let success = 0, failed = 0;
    for (const rec of bulkRecords) {
      try { await doIssueBulk({ data: { userEmail: rec.email, userName: rec.name, courseName: rec.course, scorePercentage: rec.score ?? 85, autoEmail: true } }); success++; }
      catch { failed++; }
    }
    setBulkResult({ success, failed, total: bulkRecords.length });
    if (failed === 0) toast.success("Issued " + success + " certificate(s) successfully");
    else toast.warning("Issued " + success + ", " + failed + " failed");
  };

  const handleBulkUploadCSV = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      if (lines.length < 2) { toast.error("CSV must have header + at least 1 row"); return; }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const nameIdx = headers.findIndex(h => h.includes("name"));
      const emailIdx = headers.findIndex(h => h.includes("email"));
      const courseIdx = headers.findIndex(h => h.includes("course"));
      const scoreIdx = headers.findIndex(h => h.includes("score"));
      if (nameIdx < 0 || emailIdx < 0 || courseIdx < 0) { toast.error("CSV must have name, email, and course columns"); return; }
      const records = lines.slice(1).map(line => {
        const cols = line.split(",").map(c => c.trim());
        return { name: cols[nameIdx] || "", email: cols[emailIdx] || "", course: cols[courseIdx] || "", score: scoreIdx >= 0 ? Number(cols[scoreIdx]) || 85 : 85 };
      }).filter(r => r.name && r.email && r.course);
      setBulkRecords(records);
      if (records.length > 0) { setBulkStep(2); toast.success("Loaded " + records.length + " records"); }
      else toast.error("No valid records found in CSV");
    };
    reader.readAsText(file);
  };

  const handleSeed = async () => {
    try { const res = await doSeed(); toast.success("Seeded: " + res.created + " created, " + res.updated + " updated"); qc.invalidateQueries({ queryKey: ["canva-cert-templates"] }); }
    catch(e: any) { toast.error(e.message); }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const colors = [P, IN, CR, CY, WO, SG, PK, TX];
    setCategories(prev => [...prev, { id: String(Date.now()), name: newCatName.trim(), count: 0, color: colors[prev.length % colors.length] }]);
    setNewCatName(""); setShowNewCatInput(false);
    toast.success("Category \u0022" + newCatName.trim() + "\u0022 added");
  };

  const handleDeleteCategory = (id: string) => { setCategories(prev => prev.filter(c => c.id !== id)); toast.success("Category removed"); };

  const updateSetting = (key: string, val: any) => { setSettings(prev => ({ ...prev, [key]: val })); toast.success("Setting updated"); };

  const bulkAddFormEntry = () => {
    if (!bulkIssueForm.name || !bulkIssueForm.email || !bulkIssueForm.course) { toast.error("Fill all fields"); return; }
    setBulkRecords(prev => [...prev, { ...bulkIssueForm }]);
    setBulkIssueForm({ name: "", email: "", course: "", score: 85 });
    toast.success("Added to list");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none z-30">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl" style={{backgroundColor:"#6B5BFB"}}>
            <div className="flex items-center justify-center h-full text-white"><Award className="h-5 w-5" /></div>
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 tracking-tight">Learnify AI</h1>
            <p className="text-[11px] text-slate-500 font-medium">Credential OS 3.0</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div className="space-y-1">
            <button onClick={()=>setActiveTab("overview")} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all " + (activeTab==="overview"?"bg-purple-50 text-purple-700 font-semibold":"text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <div className="pt-2">
              <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                <div className="flex items-center gap-3"><Award className="h-4 w-4" /> Certificates</div>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
              <div className="ml-7 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                {[{k:"overview",l:"Overview"},{k:"allcerts",l:"All Certificates"},{k:"templates",l:"Templates"},{k:"designer",l:"Designer"},{k:"bulk",l:"Bulk Issue"},{k:"verification",l:"Verification"},{k:"analytics",l:"Analytics"},{k:"categories",l:"Categories"},{k:"settings",l:"Settings"}].map(n => (
                  <button key={n.k} onClick={()=>setActiveTab(n.k)} className={"w-full text-left py-1.5 text-xs " + (activeTab===n.k?"font-bold text-purple-700":"text-slate-500 hover:text-slate-900")}>{n.l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900">Learnify Support</p>
              <p className="text-[10px] text-slate-500">Online Assistant</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br" style={{background:"linear-gradient(135deg,#6B5BFB,#3B82F6)"}}>
                <div className="flex items-center justify-center h-full text-white text-xs font-bold ring-2 ring-purple-300 rounded-full">VS</div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Admin</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-y-auto">
        <header className="h-16 px-8 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                {activeTab==="overview"&&"Certificate System"}{activeTab==="allcerts"&&"All Certificates"}{activeTab==="bulk"&&"Bulk Issue Certificates"}
                {activeTab==="designer"&&"Certificate Designer"}{activeTab==="templates"&&"Certificate Templates"}{activeTab==="verification"&&"Verification Center"}
                {activeTab==="analytics"&&"Analytics"}{activeTab==="categories"&&"Categories"}{activeTab==="settings"&&"Settings"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab==="overview"&&"Create, manage and issue professional certificates with ease."}
                {activeTab==="allcerts"&&"View and manage all issued certificates."}
                {activeTab==="bulk"&&"Upload a list of recipients and issue certificates in bulk."}
                {activeTab==="designer"&&"Design beautiful, verifiable certificates with ease."}
                {activeTab==="templates"&&"Choose a template or create your own beautiful certificate."}
                {activeTab==="verification"&&"Verify the authenticity of any certificate."}
                {activeTab==="analytics"&&"Track certificate performance and metrics."}
                {activeTab==="categories"&&"Organize templates by categories."}
                {activeTab==="settings"&&"Configure your certificate system."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 bg-white shadow-sm">
              <ExternalLink className="h-3.5 w-3.5" /> View Gallery
            </button>
            <button className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 relative bg-white shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{backgroundColor:"#6B5BFB"}} />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div className="h-8 w-8 rounded-full" style={{background:"linear-gradient(135deg,#6B5BFB,#3B82F6)"}}>
                <div className="flex items-center justify-center h-full text-white text-xs font-bold ring-2 ring-purple-300 rounded-full">VS</div>
              </div>
              <div className="text-left text-xs hidden sm:block">
                <p className="font-bold text-slate-900 leading-none">Admin</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              {k:"overview",l:"Overview",i:"LayoutDashboard"},{k:"allcerts",l:"All Certificates",i:"Award"},{k:"templates",l:"Templates",i:"LayoutTemplate"},{k:"designer",l:"Designer",i:"Palette"},
              {k:"bulk",l:"Bulk Issue",i:"Upload"},{k:"verification",l:"Verification",i:"ShieldCheck"},{k:"analytics",l:"Analytics",i:"BarChart3"},{k:"categories",l:"Categories",i:"Layers"},{k:"settings",l:"Settings",i:"SettingsIcon"},
            ].map(n => {
              const icons: Record<string,any> = {LayoutDashboard,Award,LayoutTemplate,Palette,Upload,ShieldCheck,BarChart3,Layers,SettingsIcon};
              const Icon = icons[n.i]||LayoutDashboard;
              return (
                <button key={n.k} onClick={()=>setActiveTab(n.k)} className={"px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all " + (activeTab===n.k?"bg-purple-50 text-purple-700 border border-purple-200 shadow-sm":"text-slate-600 hover:text-slate-900")}>
                  <Icon className="h-3.5 w-3.5" /> {n.l}
                </button>
              );
            })}
          </div>
          {(activeTab==="templates"||activeTab==="designer") && (
            <Button onClick={activeTab==="templates"?()=>setActiveTab("designer"):handleSeed}
              className="text-white font-bold text-xs px-4 h-9 rounded-xl shadow-md" style={{backgroundColor:"#6B5BFB"}}>
              <Plus className="h-4 w-4 mr-1.5" /> {activeTab==="templates"?"New Template":"Seed Templates"}
            </Button>
          )}
        </div>
        <main className="p-8 space-y-8 flex-1">
          {activeTab==="overview"&&(
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {l:"Certificates Issued",v:analytics.totalIssued??0,i:FileText,c:"#6B5BFB"},
                  {l:"Verifications",v:analytics.totalVerified??0,i:ShieldCheck,c:"#10B981"},
                  {l:"Active Templates",v:analytics.activeTemplates??0,i:LayoutTemplate,c:"#3B82F6"},
                  {l:"Canva Templates",v:templates.length,i:Palette,c:"#F59E0B"},
                ].map(s=>(
                  <div key={s.l} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-medium">{s.l}</span>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{backgroundColor:s.c+"15",color:s.c}}>
                        <s.i className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{(s.v).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Monthly Certificates</h3>
                    <span className="text-xs text-slate-500">12 Month Trend</span>
                  </div>
                  {analyticsChartData.length > 0 ? (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsChartData}>
                          <defs>
                            <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6B5BFB" stopOpacity={0.3}/><stop offset="95%" stopColor="#6B5BFB" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" tick={{fontSize:10}} stroke="#94A3B8" />
                          <YAxis tick={{fontSize:10}} stroke="#94A3B8" />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#6B5BFB" fill="url(#colorV)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-xs">No data available</div>
                  )}
                </div>
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {label:"Create Certificate",icon:FileText,color:"#6B5BFB",tab:"designer"},
                      {label:"AI Designer",icon:Sparkles,color:"#3B82F6",tab:"designer"},
                      {label:"Bulk Issue",icon:Upload,color:"#10B981",tab:"bulk"},
                      {label:"Template Library",icon:LayoutTemplate,color:"#F59E0B",tab:"templates"},
                      {label:"Verification",icon:ShieldCheck,color:"#0F172A",tab:"verification"},
                      {label:"Analytics",icon:BarChart3,color:"#EC4899",tab:"analytics"},
                    ].map(a => (
                      <button key={a.label} onClick={()=>setActiveTab(a.tab)}
                        className="p-4 rounded-xl border text-left space-y-2 transition-all hover:shadow-sm" style={{borderColor:a.color+"30",backgroundColor:a.color+"08"}}>
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{backgroundColor:a.color}}>
                          <a.icon className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">{a.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-slate-900">Recent Issues</h3>
                    <div className="space-y-2.5">
                      {(analytics.recentIssues??[]).slice(0,4).map((r:any,i:number) => (
                        <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="font-bold text-slate-900">{r.course}</p>
                              <p className="text-[10px] text-slate-500">{r.date}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{r.count} issued</Badge>
                        </div>
                      ))}
                      {(!analytics.recentIssues||analytics.recentIssues.length===0)&&(
                        <p className="text-xs text-slate-400 text-center py-4">No recent issues</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl text-white flex items-center justify-between gap-6 flex-wrap shadow-xl" style={{background:"linear-gradient(135deg,#6B5BFB,#3B82F6)"}}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Credential OS 3.0</h3>
                    <p className="text-xs" style={{color:"rgba(255,255,255,0.7)"}}>Enterprise Credential Management System</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs flex-wrap" style={{color:"rgba(255,255,255,0.7)"}}>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Unlimited</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Custom Branding</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Advanced Analytics</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Bulk Issue</span>
                </div>
              </div>
            </div>
          )}
          {activeTab==="allcerts"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search by name, email, or course..." value={allCertsSearch} onChange={e=>setAllCertsSearch(e.target.value)} className="pl-9 h-9 text-xs rounded-xl bg-white" />
                </div>
                <Button variant="outline" size="sm" className="text-xs rounded-xl"><Filter className="h-3.5 w-3.5 mr-1" /> Filter</Button>
                <Button variant="outline" size="sm" className="text-xs rounded-xl"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Code</th>
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Course</th>
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Recipient</th>
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Score</th>
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Issued</th>
                        <th className="text-left px-4 py-3 font-bold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCerts.slice(0,20).map((c:any) => (
                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold" style={{color:"#6B5BFB"}}>{c.code}</td>
                          <td className="px-4 py-3 font-medium">{c.course?.title ?? "N/A"}</td>
                          <td className="px-4 py-3 text-slate-600">{c.user?.email ?? "N/A"}</td>
                          <td className="px-4 py-3"><Badge variant={c.score>=80?"default":"secondary"} className="text-[10px]">{c.score??"N/A"}</Badge></td>
                          <td className="px-4 py-3 text-slate-500">{c.created_at?fd(c.created_at):"N/A"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button className="p-1.5 rounded-lg hover:bg-slate-100"><Eye className="h-3.5 w-3.5 text-slate-500" /></button>
                              <button className="p-1.5 rounded-lg hover:bg-slate-100"><Download className="h-3.5 w-3.5 text-slate-500" /></button>
                              <button className="p-1.5 rounded-lg hover:bg-slate-100"><Mail className="h-3.5 w-3.5 text-slate-500" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCerts.length===0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No certificates found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[11px] text-slate-500">{filteredCerts.length} certificate(s)</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg">Previous</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg">Next</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab==="templates"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search templates..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 h-9 text-xs rounded-xl bg-white" />
                </div>
                <Button variant="outline" size="sm" onClick={handleSeed} className="text-xs rounded-xl"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Seed All</Button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {CATEGORY_PILLS.map(cat => (
                  <button key={cat} onClick={()=>setSelectedCategory(cat)}
                    className={"px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all " + (selectedCategory===cat?"text-white shadow-md":"bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-slate-900")}
                    style={selectedCategory===cat?{backgroundColor:"#6B5BFB",boxShadow:"0 4px 14px rgba(107,91,251,0.2)"}:{}}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTemplates.map(t => (
                  <div key={t.id} className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all duration-300 flex flex-col relative">
                    <div className="aspect-[1.414] relative bg-gradient-to-br from-slate-900 to-indigo-950 p-4 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-400 border border-amber-400/20 backdrop-blur-md">{t.category||"Professional"}</span>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80"><Eye className="h-3.5 w-3.5" /></button>
                          <button className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80"><Heart className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <div className="my-auto text-center z-10 text-white">
                        <h4 className="font-serif font-bold text-sm line-clamp-1">{t.name}</h4>
                        <p className="text-[10px] text-slate-300">Certificate of Completion</p>
                      </div>
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4 z-20">
                        <Button size="sm" onClick={()=>{setDesignerTemplate(t);setShowDesignerWorkspace(true)}} className="text-white text-xs font-semibold px-4 rounded-xl" style={{backgroundColor:"#6B5BFB"}}>Use Template</Button>
                        <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 text-xs rounded-xl" onClick={async()=>{if(confirm("Delete?")) {await doDelete({data:{id:t.id}});qc.invalidateQueries({queryKey:["canva-cert-templates"]});toast.success("Deleted")}}}>Delete</Button>
                      </div>
                    </div>
                    <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                      <span className="font-medium text-slate-900 line-clamp-1">{t.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{color:"#6B5BFB",backgroundColor:"rgba(107,91,251,0.1)",borderColor:"rgba(107,91,251,0.2)"}}>Free</span>
                    </div>
                  </div>
                ))}
                {filteredTemplates.length===0&&!isLoading&&(
                  <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                    <Palette className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600">No templates found</p>
                    <p className="text-xs mt-1">Click "Seed All" to import 30 Canva templates</p>
                    <Button onClick={handleSeed} size="sm" className="mt-4 text-white text-xs rounded-xl" style={{backgroundColor:"#6B5BFB"}}>Seed Templates</Button>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab==="designer"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              {showDesignerWorkspace&&designerTemplate ? (
                <div className="h-[calc(100vh-200px)]">
                  <DesignerWorkspace
                    initialTemplate={{
                      id: designerTemplate.id,
                      name: designerTemplate.name,
                      type: designerTemplate.type || "Certificate",
                      layout: designerTemplate.layout || "classic",
                      bg_image_url: designerTemplate.bg_image_url||"",
                      config_json: { elements: [], design: { accent_color:"#6B5BFB", bg_color:"#FFFFFF", text_color:"#0F172A", font_family:"Playfair Display", border_style:"double", border_width:10, corner_style:"rounded", background_pattern:"none", layout:"classic" } },
                    }}
                    onSave={async (tmpl) => { await doSave({data:{...designerTemplate,...tmpl}}); qc.invalidateQueries({queryKey:["canva-cert-templates"]}); toast.success("Saved"); setShowDesignerWorkspace(false); }}
                    onClose={()=>setShowDesignerWorkspace(false)}
                  />
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Palette className="h-16 w-16 mx-auto mb-4" style={{color:"#C4B5FD"}} />
                  <h3 className="font-bold text-lg text-slate-900">Certificate Designer</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Select a template to start designing, or create from scratch</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={()=>setActiveTab("templates")} className="text-white text-sm px-6 rounded-xl shadow-md" style={{backgroundColor:"#6B5BFB"}}>
                      <LayoutTemplate className="h-4 w-4 mr-2" /> Browse Templates
                    </Button>
                    <Button variant="outline" onClick={()=>{setDesignerTemplate({id:"new",name:"New Certificate",type:"Certificate",layout:"classic",category:"Professional",bg_image_url:"",thumbnail_url:null,fields_json:null,theme_colors:null});setShowDesignerWorkspace(true)}} className="text-sm rounded-xl">
                      <Plus className="h-4 w-4 mr-2" /> Start from Scratch
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab==="bulk"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6 text-xs font-semibold">
                  {["Upload Recipients","Review & Map","Customize","Review & Send"].map((s,i) => (
                    <div key={i} className={"flex items-center gap-2 " + (bulkStep===i+1?"":"text-slate-400")} style={bulkStep===i+1?{color:"#6B5BFB"}:{}}>
                      <span className={"h-6 w-6 rounded-full flex items-center justify-center text-xs " + (bulkStep===i+1?"text-white":"bg-slate-100 text-slate-500")} style={bulkStep===i+1?{backgroundColor:"#6B5BFB"}:bulkStep>i+1?{backgroundColor:"rgba(16,185,129,0.2)",color:"#10B981"}:{}}>
                        {bulkStep>i+1?<Check className="h-3.5 w-3.5" />:i+1}
                      </span>
                      {s}
                    </div>
                  ))}
                </div>
                <Button onClick={handleBulkIssueAll} disabled={bulkRecords.length===0} className="text-white font-bold text-xs px-5 h-9 rounded-xl shadow-md" style={{backgroundColor:"#6B5BFB"}}>
                  <Upload className="h-3.5 w-3.5 mr-1.5" /> Issue All ({bulkRecords.length})
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Upload Recipients</h3>
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  <div className="flex gap-2">
                    <Button onClick={handleBulkUploadCSV} variant="outline" className="text-xs font-bold rounded-xl" style={{color:"#6B5BFB",borderColor:"rgba(107,91,251,0.3)"}}>
                      <Upload className="h-3.5 w-3.5 mr-1" /> Upload CSV File
                    </Button>
                  </div>
                  <div className="border-2 border-dashed rounded-2xl p-8 text-center space-y-3" style={{borderColor:"rgba(107,91,251,0.3)",backgroundColor:"rgba(107,91,251,0.03)"}}>
                    <div className="h-10 w-10 mx-auto rounded-xl flex items-center justify-center" style={{backgroundColor:"rgba(107,91,251,0.1)",color:"#6B5BFB"}}>
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900">Drag & drop your CSV file here</p>
                    <p className="text-[10px] text-slate-500">or</p>
                    <Button variant="outline" size="sm" onClick={handleBulkUploadCSV} className="text-xs font-semibold rounded-xl">Choose File</Button>
                    <p className="text-[10px] text-slate-400">CSV with columns: name, email, course, score (optional)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-slate-200" />
                    <span className="text-[10px] text-slate-400 font-medium">OR Add Manually</span>
                    <div className="flex-1 border-t border-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Name" value={bulkIssueForm.name} onChange={e=>setBulkIssueForm(p=>({...p,name:e.target.value}))} className="h-8 text-xs rounded-xl" />
                    <Input placeholder="Email" value={bulkIssueForm.email} onChange={e=>setBulkIssueForm(p=>({...p,email:e.target.value}))} className="h-8 text-xs rounded-xl" />
                    <Input placeholder="Course" value={bulkIssueForm.course} onChange={e=>setBulkIssueForm(p=>({...p,course:e.target.value}))} className="h-8 text-xs rounded-xl" />
                    <Button onClick={bulkAddFormEntry} variant="outline" className="h-8 text-xs rounded-xl"><Plus className="h-3 w-3 mr-1" /> Add</Button>
                  </div>
                </div>
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Recipients ({bulkRecords.length})</h3>
                    {bulkRecords.length>0&&(
                      <Button variant="ghost" size="sm" onClick={()=>{setBulkRecords([]);setBulkStep(1);setBulkResult(null)}} className="text-xs text-red-500 h-7 rounded-lg">Clear All</Button>
                    )}
                  </div>
                  {bulkResult ? (
                    <div className="text-center py-8 space-y-3">
                      <div className={"h-16 w-16 mx-auto rounded-full flex items-center justify-center " + (bulkResult.failed===0?"bg-emerald-100 text-emerald-600":"bg-amber-100 text-amber-600")}>
                        {bulkResult.failed===0?<CheckCircle2 className="h-8 w-8" />:<AlertCircle className="h-8 w-8" />}
                      </div>
                      <p className="font-bold text-slate-900">Issued {bulkResult.success}/{bulkResult.total}</p>
                      <p className="text-xs text-slate-500">{bulkResult.failed} failed</p>
                      <Button variant="outline" size="sm" onClick={()=>{setBulkRecords([]);setBulkStep(1);setBulkResult(null)}} className="text-xs rounded-xl">Start Over</Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {bulkRecords.map((r,i)=>(
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{backgroundColor:"#6B5BFB"}}>{i+1}</div>
                            <div>
                              <p className="font-bold text-slate-900">{r.name}</p>
                              <p className="text-[10px] text-slate-500">{r.email} &bull; {r.course}</p>
                            </div>
                          </div>
                          <button onClick={()=>setBulkRecords(prev=>prev.filter((_,j)=>j!==i))} className="p-1 rounded hover:bg-slate-200">
                            <X className="h-3 w-3 text-slate-400" />
                          </button>
                        </div>
                      ))}
                      {bulkRecords.length===0&&(
                        <p className="text-xs text-slate-400 text-center py-8">Upload a CSV or add entries manually</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab==="verification"&&(
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
                <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center" style={{backgroundColor:"rgba(107,91,251,0.1)",color:"#6B5BFB"}}>
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Verify a Certificate</h3>
                  <p className="text-sm text-slate-500 mt-1">Enter the unique certificate code to verify authenticity</p>
                </div>
                <div className="flex gap-3 max-w-md mx-auto">
                  <Input placeholder="Enter certificate code (e.g., LRN-CERT-XXXXXX)" value={verificationCode} onChange={e=>setVerificationCode(e.target.value.toUpperCase())}
                    onKeyDown={e=>e.key==="Enter"&&handleVerify()} className="flex-1 h-10 text-xs rounded-xl" />
                  <Button onClick={handleVerify} disabled={verifying} className="text-white text-xs font-bold px-6 rounded-xl h-10 shadow-md" style={{backgroundColor:"#6B5BFB"}}>
                    {verifying?"Verifying...":"Verify"}
                  </Button>
                </div>
                {verificationResult && (
                  <div className={"p-6 rounded-2xl border text-left " + (verificationResult.found?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200")}>
                    {verificationResult.found ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-bold">Certificate Verified Successfully</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm p-4 rounded-xl bg-white/50">
                          <div><span className="text-xs text-slate-500">Code</span><p className="font-mono font-bold text-slate-900">{verificationResult.cert.code}</p></div>
                          <div><span className="text-xs text-slate-500">Course</span><p className="font-bold text-slate-900">{verificationResult.cert.course?.title||"N/A"}</p></div>
                          <div><span className="text-xs text-slate-500">Issued</span><p className="font-bold text-slate-900">{verificationResult.cert.created_at?fd(verificationResult.cert.created_at):"N/A"}</p></div>
                          <div><span className="text-xs text-slate-500">Score</span><p className="font-bold text-slate-900">{verificationResult.cert.score??"N/A"}</p></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <div>
                          <p className="font-bold">Certificate Not Found</p>
                          <p className="text-xs text-red-500">The code you entered does not match any issued certificate.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab==="analytics"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {l:"Total Issued",v:analytics.totalIssued??0,i:FileText,c:"#6B5BFB"},
                  {l:"Verified",v:analytics.totalVerified??0,i:ShieldCheck,c:"#10B981"},
                  {l:"Active Templates",v:analytics.activeTemplates??0,i:LayoutTemplate,c:"#3B82F6"},
                ].map(s=>(
                  <div key={s.l} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">{s.l}</span>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{backgroundColor:s.c+"15",color:s.c}}><s.i className="h-4 w-4" /></div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{s.v.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Monthly Trend</h3>
                    <div className="flex gap-1">
                      <button onClick={()=>setAnalyticsView("6m")} className={"px-3 py-1 text-xs rounded-lg font-semibold " + (analyticsView==="6m"?"text-white":"text-slate-500 hover:bg-slate-100")} style={analyticsView==="6m"?{backgroundColor:"#6B5BFB",color:"white"}:{}}>6M</button>
                      <button onClick={()=>setAnalyticsView("12m")} className={"px-3 py-1 text-xs rounded-lg font-semibold " + (analyticsView==="12m"?"text-white":"text-slate-500 hover:bg-slate-100")} style={analyticsView==="12m"?{backgroundColor:"#6B5BFB",color:"white"}:{}}>12M</button>
                    </div>
                  </div>
                  {analyticsChartData.length>0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" tick={{fontSize:11}} stroke="#94A3B8" />
                          <YAxis tick={{fontSize:11}} stroke="#94A3B8" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#6B5BFB" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-xs">No data available</div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Recent Activity</h3>
                  <div className="space-y-3">
                    {(analytics.recentIssues??[]).map((r:any,i:number)=>(
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{backgroundColor:"rgba(107,91,251,0.1)",color:"#6B5BFB"}}>
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{r.course}</p>
                            <p className="text-[10px] text-slate-500">{r.date} &bull; {r.count} certificate(s)</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">Issued</Badge>
                      </div>
                    ))}
                    {(!analytics.recentIssues||analytics.recentIssues.length===0)&&(
                      <p className="text-xs text-slate-400 text-center py-8">No activity recorded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab==="categories"&&(
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Manage Categories</h3>
                <Button onClick={()=>setShowNewCatInput(!showNewCatInput)} className="text-white text-xs font-bold px-4 h-9 rounded-xl shadow-md" style={{backgroundColor:"#6B5BFB"}}>
                  <Plus className="h-4 w-4 mr-1.5" /> Add Category
                </Button>
              </div>
              {showNewCatInput&&(
                <div className="flex items-center gap-3 p-4 rounded-2xl border" style={{backgroundColor:"rgba(107,91,251,0.05)",borderColor:"rgba(107,91,251,0.2)"}}>
                  <Input placeholder="Category name" value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddCategory()} className="flex-1 h-9 text-xs rounded-xl bg-white" />
                  <Button onClick={handleAddCategory} size="sm" className="text-white text-xs rounded-xl" style={{backgroundColor:"#6B5BFB"}}><Check className="h-3.5 w-3.5 mr-1" /> Add</Button>
                  <Button onClick={()=>{setShowNewCatInput(false);setNewCatName("")}} variant="outline" size="sm" className="text-xs rounded-xl">Cancel</Button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat=>(
                  <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor:cat.color+"20",color:cat.color}}>
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                        <p className="text-[11px] text-slate-500">{cat.count} templates</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100"><Edit3 className="h-3.5 w-3.5 text-slate-500" /></button>
                      <button onClick={()=>handleDeleteCategory(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab==="settings"&&(
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Globe className="h-4 w-4" style={{color:"#6B5BFB"}} /> Brand Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Brand Name</Label>
                    <Input value={settings.brandName} onChange={e=>updateSetting("brandName",e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Support Email</Label>
                    <Input value={settings.supportEmail} onChange={e=>updateSetting("supportEmail",e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Notification Email</Label>
                    <Input value={settings.notificationEmail} onChange={e=>updateSetting("notificationEmail",e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">SMTP Provider</Label>
                    <Select value={settings.smtpProvider} onValueChange={v=>updateSetting("smtpProvider",v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resend">Resend</SelectItem>
                        <SelectItem value="brevo">Brevo</SelectItem>
                        <SelectItem value="gmail">Gmail SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><ShieldCheck className="h-4 w-4" style={{color:"#6B5BFB"}} /> Certificate Defaults</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Default Expiry (days)</Label>
                    <Input type="number" value={settings.defaultExpiryDays} onChange={e=>updateSetting("defaultExpiryDays",Number(e.target.value))} className="h-9 text-xs rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {k:"requireVerification",l:"Require Verification",d:"Certificates must be verified before they are considered valid"},
                    {k:"allowDownload",l:"Allow Download",d:"Recipients can download their certificates as PDF"},
                    {k:"allowLinkedInShare",l:"Allow LinkedIn Share",d:"Recipients can share certificates on LinkedIn"},
                    {k:"emailNotifications",l:"Email Notifications",d:"Send email notifications for certificate events"},
                    {k:"autoEmailOnIssue",l:"Auto-Email on Issue",d:"Automatically email certificates when issued"},
                    {k:"publicGallery",l:"Public Gallery",d:"Show certificates in public gallery"},
                  ].map(s=>(
                    <div key={s.k} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.l}</p>
                        <p className="text-[10px] text-slate-500">{s.d}</p>
                      </div>
                      <Switch checked={(settings as any)[s.k]} onCheckedChange={v=>updateSetting(s.k,v)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="text-white text-xs font-bold px-6 h-9 rounded-xl shadow-md" style={{backgroundColor:"#6B5BFB"}}>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save All Settings
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
