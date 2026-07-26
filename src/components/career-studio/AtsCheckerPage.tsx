import { useState, useMemo, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  Loader2,
  Sparkles,
  Check,
  AlertTriangle,
  Zap,
  Target,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Download,
  TrendingUp,
  Building2,
  CheckCircle2,
  FileText,
  Trophy,
  Wand2,
  FileDown,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { checkAtsScore, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";
import { cleanResumeText } from "@/lib/file-parser";
import { Link } from "@tanstack/react-router";

/* ── Companies ── */
const COMPANIES = [
  {
    name: "Google",
    domain: "google.com",
    color: "#4285F4",
    role: "Software Engineer L3",
    salary: "₹25-55 LPA",
    skills: ["Python", "Go", "Distributed Systems", "ML", "Kubernetes"],
    url: "https://careers.google.com",
  },
  {
    name: "Microsoft",
    domain: "microsoft.com",
    color: "#00A4EF",
    role: "SDE II",
    salary: "₹22-48 LPA",
    skills: ["C#", "Azure", "TypeScript", "System Design", "React"],
    url: "https://careers.microsoft.com",
  },
  {
    name: "Amazon",
    domain: "amazon.com",
    color: "#FF9900",
    role: "SDE II",
    salary: "₹20-45 LPA",
    skills: ["Java", "AWS", "Microservices", "React", "Leadership Principles"],
    url: "https://amazon.jobs",
  },
  {
    name: "Apple",
    domain: "apple.com",
    color: "#555555",
    role: "Software Engineer",
    salary: "₹22-50 LPA",
    skills: ["Swift", "Python", "Machine Learning", "iOS", "System Design"],
    url: "https://jobs.apple.com",
  },
  {
    name: "Meta",
    domain: "meta.com",
    color: "#1877F2",
    role: "Software Engineer E4",
    salary: "₹22-52 LPA",
    skills: ["Python", "React", "GraphQL", "PHP", "Distributed Systems"],
    url: "https://metacareers.com",
  },
  {
    name: "Salesforce",
    domain: "salesforce.com",
    color: "#00A1E0",
    role: "Software Engineer",
    salary: "₹18-38 LPA",
    skills: ["Java", "Apex", "Salesforce Platform", "REST APIs", "AWS"],
    url: "https://salesforce.com/company/careers",
  },
  {
    name: "Adobe",
    domain: "adobe.com",
    color: "#FF0000",
    role: "Software Engineer",
    salary: "₹18-40 LPA",
    skills: ["Java", "Python", "React", "Cloud", "Machine Learning"],
    url: "https://adobe.com/careers",
  },
  {
    name: "Oracle",
    domain: "oracle.com",
    color: "#F80000",
    role: "Cloud Engineer",
    salary: "₹16-35 LPA",
    skills: ["Java", "SQL", "Oracle DB", "Cloud", "Microservices"],
    url: "https://oracle.com/corporate/careers",
  },
  {
    name: "IBM",
    domain: "ibm.com",
    color: "#006699",
    role: "Software Developer",
    salary: "₹10-28 LPA",
    skills: ["Java", "Python", "Cloud", "AI", "DevOps"],
    url: "https://ibm.com/careers",
  },
  {
    name: "Intel",
    domain: "intel.com",
    color: "#0068B5",
    role: "Software Engineer",
    salary: "₹14-32 LPA",
    skills: ["C++", "Python", "FPGA", "AI", "Computer Architecture"],
    url: "https://jobs.intel.com",
  },
  {
    name: "Cisco",
    domain: "cisco.com",
    color: "#1BA0D7",
    role: "Software Engineer",
    salary: "₹15-32 LPA",
    skills: ["Networking", "Python", "C++", "Security", "Cloud"],
    url: "https://jobs.cisco.com",
  },
  {
    name: "SAP",
    domain: "sap.com",
    color: "#0070F3",
    role: "Software Developer",
    salary: "₹12-28 LPA",
    skills: ["ABAP", "Java", "SAP S/4HANA", "Python", "Cloud"],
    url: "https://jobs.sap.com",
  },
  {
    name: "Dell Technologies",
    domain: "dell.com",
    color: "#007DB8",
    role: "Software Engineer",
    salary: "₹12-26 LPA",
    skills: ["Python", "Java", "Cloud", "DevOps", "REST APIs"],
    url: "https://dell.com/en-us/dt/microsites/careers",
  },
  {
    name: "Qualcomm",
    domain: "qualcomm.com",
    color: "#3253DC",
    role: "Software Engineer",
    salary: "₹14-35 LPA",
    skills: ["C", "C++", "Embedded Systems", "Python", "Android"],
    url: "https://qualcomm.com/company/careers",
  },
  {
    name: "PayPal",
    domain: "paypal.com",
    color: "#003087",
    role: "Backend Engineer",
    salary: "₹18-40 LPA",
    skills: ["Java", "Python", "Node.js", "AWS", "Payments"],
    url: "https://jobs.pypl.com",
  },
  {
    name: "J.P. Morgan",
    domain: "jpmorgan.com",
    color: "#120B6B",
    role: "Software Engineer",
    salary: "₹15-38 LPA",
    skills: ["Java", "Python", "React", "AWS", "Fintech"],
    url: "https://careers.jpmorgan.com",
  },
  {
    name: "American Express",
    domain: "americanexpress.com",
    color: "#2E77BC",
    role: "Software Engineer",
    salary: "₹14-32 LPA",
    skills: ["Java", "Python", "React", "Cloud", "Data Analytics"],
    url: "https://aexp.com/careers",
  },
  {
    name: "VMware",
    domain: "vmware.com",
    color: "#607078",
    role: "Software Engineer",
    salary: "₹14-32 LPA",
    skills: ["Java", "Go", "Kubernetes", "Cloud", "Virtualization"],
    url: "https://careers.vmware.com",
  },
  {
    name: "Huawei",
    domain: "huawei.com",
    color: "#CF0A2C",
    role: "Software Engineer",
    salary: "₹12-28 LPA",
    skills: ["C++", "Python", "5G", "AI", "Distributed Systems"],
    url: "https://career.huawei.com",
  },
  {
    name: "Deloitte",
    domain: "deloitte.com",
    color: "#86BC24",
    role: "Tech Consultant",
    salary: "₹10-24 LPA",
    skills: ["Python", "SQL", "Tableau", "Cloud", "Consulting"],
    url: "https://deloitte.com/global/en/careers",
  },
  {
    name: "EY",
    domain: "ey.com",
    color: "#FFE600",
    role: "Technology Analyst",
    salary: "₹9-20 LPA",
    skills: ["Python", "SQL", "Power BI", "SAP", "Cloud"],
    url: "https://careers.ey.com",
  },
  {
    name: "KPMG",
    domain: "kpmg.com",
    color: "#00338D",
    role: "IT Consultant",
    salary: "₹8-18 LPA",
    skills: ["Python", "SQL", "Azure", "Power BI", "Consulting"],
    url: "https://kpmg.com/xx/en/home/careers",
  },
  {
    name: "Wipro",
    domain: "wipro.com",
    color: "#3E8EDE",
    role: "Software Engineer",
    salary: "₹5-16 LPA",
    skills: ["Java", "Python", "SQL", "Cloud", "Agile"],
    url: "https://careers.wipro.com",
  },
  {
    name: "TCS",
    domain: "tcs.com",
    color: "#FF6600",
    role: "System Engineer",
    salary: "₹4-12 LPA",
    skills: ["Java", "Python", "SQL", "Agile", "Cloud"],
    url: "https://careers.tcs.com",
  },
  {
    name: "HCLTech",
    domain: "hcltech.com",
    color: "#0A4DA1",
    role: "Software Engineer",
    salary: "₹5-14 LPA",
    skills: ["Java", "Python", "React", "Azure", "DevOps"],
    url: "https://hcltech.com/careers",
  },
  {
    name: "Tech Mahindra",
    domain: "techmahindra.com",
    color: "#E30613",
    role: "Software Developer",
    salary: "₹4-12 LPA",
    skills: ["Java", "Python", "React", "AWS", "Agile"],
    url: "https://techmahindra.com/en-in/careers",
  },
  {
    name: "Infosys",
    domain: "infosys.com",
    color: "#007CC3",
    role: "Systems Engineer",
    salary: "₹4-14 LPA",
    skills: ["Java", "Python", "SQL", "Cloud", "Agile"],
    url: "https://infosys.com/careers",
  },
  {
    name: "LinkedIn",
    domain: "linkedin.com",
    color: "#0A66C2",
    role: "Software Engineer",
    salary: "₹20-45 LPA",
    skills: ["Python", "Scala", "Kafka", "React", "Distributed Systems"],
    url: "https://linkedin.com/company/linkedin/jobs",
  },
  {
    name: "Flipkart",
    domain: "flipkart.com",
    color: "#F74F00",
    role: "Software Engineer II",
    salary: "₹15-35 LPA",
    skills: ["Java", "Python", "React", "Kafka", "Distributed Systems"],
    url: "https://flipkart.jobs",
  },
  {
    name: "Swiggy",
    domain: "swiggy.com",
    color: "#FC8019",
    role: "Software Engineer",
    salary: "₹12-28 LPA",
    skills: ["Go", "Python", "React", "Kafka", "PostgreSQL"],
    url: "https://careers.swiggy.com",
  },
  {
    name: "Uber",
    domain: "uber.com",
    color: "#000000",
    role: "Software Engineer",
    salary: "₹18-42 LPA",
    skills: ["Go", "Python", "React", "Kafka", "Distributed Systems"],
    url: "https://uber.com/in/en/careers",
  },
  {
    name: "Ola",
    domain: "olacabs.com",
    color: "#1A9E1C",
    role: "Software Engineer",
    salary: "₹10-22 LPA",
    skills: ["Java", "Python", "React", "Kafka", "MySQL"],
    url: "https://ola.careers",
  },
  {
    name: "Razorpay",
    domain: "razorpay.com",
    color: "#3395FF",
    role: "Backend Engineer",
    salary: "₹14-30 LPA",
    skills: ["Go", "Python", "React", "PostgreSQL", "Payments"],
    url: "https://razorpay.com/jobs",
  },
  {
    name: "PhonePe",
    domain: "phonepe.com",
    color: "#5F259F",
    role: "Software Engineer",
    salary: "₹14-30 LPA",
    skills: ["Java", "Python", "React", "Kafka", "Fintech"],
    url: "https://phonepe.com/en/careers",
  },
  {
    name: "Meesho",
    domain: "meesho.com",
    color: "#F43397",
    role: "Software Engineer",
    salary: "₹12-26 LPA",
    skills: ["Python", "Java", "React", "ML", "PostgreSQL"],
    url: "https://meesho.io/jobs",
  },
  {
    name: "Myntra",
    domain: "myntra.com",
    color: "#FF3366",
    role: "Software Engineer",
    salary: "₹10-24 LPA",
    skills: ["Python", "Java", "React", "Spark", "ML"],
    url: "https://myntra.com/careers",
  },
  {
    name: "Paytm",
    domain: "paytm.com",
    color: "#00B9F1",
    role: "Software Engineer",
    salary: "₹10-22 LPA",
    skills: ["Java", "Python", "React", "MySQL", "Payments"],
    url: "https://paytm.com/about-us/careers",
  },
  {
    name: "Jio",
    domain: "jio.com",
    color: "#003DA6",
    role: "Software Engineer",
    salary: "₹8-18 LPA",
    skills: ["Java", "Python", "React", "5G", "Cloud"],
    url: "https://jio.com/careers",
  },
  {
    name: "Bharti Airtel",
    domain: "airtel.in",
    color: "#ED1C24",
    role: "Software Engineer",
    salary: "₹8-18 LPA",
    skills: ["Python", "Java", "Cloud", "Networking", "SQL"],
    url: "https://airtel.in/careers",
  },
  {
    name: "HDFC Bank",
    domain: "hdfcbank.com",
    color: "#003580",
    role: "Technology Associate",
    salary: "₹8-20 LPA",
    skills: ["Java", "Python", "SQL", "Fintech", "Cloud"],
    url: "https://hdfcbank.com",
  },
  {
    name: "ICICI Bank",
    domain: "icicibank.com",
    color: "#F58220",
    role: "Software Engineer",
    salary: "₹7-18 LPA",
    skills: ["Java", "SQL", "Python", "Cloud", "Fintech"],
    url: "https://icicibank.com/careers",
  },
  {
    name: "Axis Bank",
    domain: "axisbank.com",
    color: "#800000",
    role: "Technology Analyst",
    salary: "₹7-16 LPA",
    skills: ["Java", "SQL", "Python", "Cloud", "Banking APIs"],
    url: "https://axisbank.com/careers",
  },
  {
    name: "Kotak Mahindra Bank",
    domain: "kotak.com",
    color: "#ED1C24",
    role: "Software Engineer",
    salary: "₹7-18 LPA",
    skills: ["Java", "SQL", "Python", "Cloud", "Fintech"],
    url: "https://kotak.com/en/corporate/careers",
  },
  {
    name: "AWS",
    domain: "aws.amazon.com",
    color: "#FF9900",
    role: "Cloud Support Engineer",
    salary: "₹14-32 LPA",
    skills: ["AWS", "Python", "Networking", "Linux", "Cloud"],
    url: "https://amazon.jobs/en/teams/aws",
  },
  {
    name: "Starbucks",
    domain: "starbucks.com",
    color: "#00704A",
    role: "Software Engineer",
    salary: "₹12-26 LPA",
    skills: ["Java", "Python", "React", "Cloud", "Data Analytics"],
    url: "https://sbux.com/careers",
  },
  {
    name: "Nike",
    domain: "nike.com",
    color: "#111111",
    role: "Software Engineer",
    salary: "₹12-28 LPA",
    skills: ["Java", "Python", "React", "Cloud", "Data Analytics"],
    url: "https://jobs.nike.com",
  },
  {
    name: "upGrad",
    domain: "upgrad.com",
    color: "#0F65FE",
    role: "Software Engineer",
    salary: "₹8-20 LPA",
    skills: ["Python", "React", "Node.js", "MongoDB", "EdTech"],
    url: "https://upgrad.com/careers",
  },
  {
    name: "Unacademy",
    domain: "unacademy.com",
    color: "#00C853",
    role: "Software Engineer",
    salary: "₹8-20 LPA",
    skills: ["Python", "React", "Node.js", "PostgreSQL", "EdTech"],
    url: "https://unacademy.com/careers",
  },
  {
    name: "Simplilearn",
    domain: "simplilearn.com",
    color: "#FF6600",
    role: "Software Engineer",
    salary: "₹7-18 LPA",
    skills: ["Python", "React", "Node.js", "MySQL", "EdTech"],
    url: "https://simplilearn.com/careers",
  },
  {
    name: "Decathlon",
    domain: "decathlon.com",
    color: "#0082C8",
    role: "Tech Lead",
    salary: "₹10-22 LPA",
    skills: ["Python", "Java", "React", "Cloud", "Retail Tech"],
    url: "https://decathlongroup.com/job-offers",
  },
  {
    name: "McAfee",
    domain: "mcafee.com",
    color: "#C01518",
    role: "Security Engineer",
    salary: "₹12-28 LPA",
    skills: ["Python", "C++", "Cybersecurity", "Cloud", "ML"],
    url: "https://mcafee.com/enterprise/en-us/about/careers",
  },
  {
    name: "AMD",
    domain: "amd.com",
    color: "#ED1C24",
    role: "Software Engineer",
    salary: "₹12-28 LPA",
    skills: ["C++", "Python", "FPGA", "GPU", "AI"],
    url: "https://amd.com/en/corporate/careers",
  },
  {
    name: "Target",
    domain: "target.com",
    color: "#CC0000",
    role: "Software Engineer",
    salary: "₹14-32 LPA",
    skills: ["Java", "Kotlin", "React", "Cloud", "Data Engineering"],
    url: "https://target.com/careers",
  },
  {
    name: "Freelancer",
    domain: "freelancer.com",
    color: "#29B2FE",
    role: "Full Stack Developer",
    salary: "₹8-20 LPA",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "REST APIs"],
    url: "https://freelancer.com/careers",
  },
  {
    name: "H&M",
    domain: "hm.com",
    color: "#E50010",
    role: "Software Engineer",
    salary: "₹10-22 LPA",
    skills: ["Java", "Python", "React", "Cloud", "Retail Tech"],
    url: "https://hmgroup.com/careers",
  },
  {
    name: "McDonald's",
    domain: "mcdonalds.com",
    color: "#FFC72C",
    role: "Software Engineer",
    salary: "₹10-22 LPA",
    skills: ["Java", "React", "Cloud", "Data Analytics", "Mobile"],
    url: "https://careers.mcdonalds.com",
  },
];

const LEARNIFY_COURSES = [
  { name: "Full Stack AI Engineer", category: "AI & Development", match: 98 },
  { name: "Data Science & ML Bootcamp", category: "Data & Analytics", match: 95 },
  { name: "System Design Mastery", category: "Architecture", match: 91 },
  { name: "DSA & Competitive Programming", category: "Core CS", match: 88 },
  { name: "React + Next.js Pro", category: "Frontend", match: 85 },
  { name: "Cloud & DevOps with AWS", category: "Infrastructure", match: 82 },
];

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-extrabold">
          {score}
          <span className="text-[9px] text-muted-foreground">/100</span>
        </span>
      </div>
    </div>
  );
}

function CompanyLogo({ domain, name, color }: { domain: string; name: string; color: string }) {
  const [imgSrc, setImgSrc] = useState(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <div className="h-10 w-10 rounded-xl bg-white border border-border/80 p-1 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
      {!hasFailed ? (
        <img
          src={imgSrc}
          alt={name}
          className="h-8 w-8 object-contain"
          onError={() => {
            if (imgSrc.includes("google.com")) {
              setImgSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
            } else {
              setHasFailed(true);
            }
          }}
        />
      ) : (
        <div
          className="h-full w-full rounded-lg flex items-center justify-center text-white font-black text-xs"
          style={{ backgroundColor: color || "#4f46e5" }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function AtsCheckerPage({ embedded = false }: { embedded?: boolean }) {
  const checkFn = useServerFn(checkAtsScore);
  const extractFn = useServerFn(extractResumeFields);

  const [tab, setTab] = useState<"input" | "results" | "companies">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats_active_subtab");
      if (saved === "results" || saved === "companies" || saved === "input") return saved;
    }
    return "input";
  });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats_result");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return null;
  });
  const [resumeText, setResumeText] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ats_resume_text") || "";
    }
    return "";
  });
  const [targetRole, setTargetRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ats_target_role") || "";
    }
    return "";
  });
  const [industry, setIndustry] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [appliedKw, setAppliedKw] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ats_resume_text", resumeText);
  }, [resumeText]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ats_target_role", targetRole);
  }, [targetRole]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (result) {
      localStorage.setItem("ats_result", JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ats_active_subtab", tab);
  }, [tab]);

  const handleFileExtracted = async (text: string) => {
    const cleanedText = cleanResumeText(text);
    setResumeText(cleanedText);
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: cleanedText } });
      if (fields.targetRole) setTargetRole(fields.targetRole);
      toast.success("Resume parsed & cleaned! PDF headers and repeated URLs removed.");
    } catch {
      toast.warning("Resume text captured and cleaned. Fill target role manually.");
    } finally {
      setExtracting(false);
    }
  };

  const handleSanitizeText = () => {
    const cleaned = cleanResumeText(resumeText);
    setResumeText(cleaned);
    toast.success("Resume text cleaned! PDF metadata junk, binary noise & duplicate URLs stripped.");
  };

  const handleCheck = async () => {
    const cleanedText = cleanResumeText(resumeText);
    if (!cleanedText.trim()) return toast.error("Paste your resume text");
    if (cleanedText.trim().length < 50) return toast.error("Resume must be at least 50 characters");
    if (!targetRole.trim()) return toast.error("Enter your target role");
    setResumeText(cleanedText);
    setLoading(true);
    try {
      const res = await checkFn({
        data: {
          resumeText: cleanedText.trim(),
          targetRole: targetRole.trim(),
          industry: industry.trim() || undefined,
        },
      });
      setResult(res);
      setTab("results");
      toast.success("ATS analysis complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to check resume");
    } finally {
      setLoading(false);
    }
  };

  const applyKeyword = (kw: string) => {
    if (appliedKw.includes(kw)) return;
    setResumeText((t) => t + "\n" + kw);
    setAppliedKw((a) => [...a, kw]);
    toast.success(`Applied "${kw}" to resume`);
  };

  const top5Matches = useMemo(() => {
    const text = resumeText || targetRole || "";
    const textLower = text.toLowerCase();
    const scored = COMPANIES.map((co) => {
      let matchedCount = 0;
      co.skills.forEach((sk) => {
        if (textLower.includes(sk.toLowerCase())) matchedCount++;
      });
      const skillPct = matchedCount / Math.max(1, co.skills.length);
      const titleBonus =
        targetRole &&
        (co.role.toLowerCase().includes(targetRole.toLowerCase()) ||
          targetRole.toLowerCase().includes(co.name.toLowerCase()))
          ? 20
          : 5;
      const scoreBase = result?.score ? result.score : 65;
      const matchScore = Math.min(
        99,
        Math.max(40, Math.round(skillPct * 50 + titleBonus + scoreBase * 0.3)),
      );
      return { ...co, matchScore, matchedSkillsCount: matchedCount };
    });

    return [...scored].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }, [resumeText, targetRole, result]);

  const handleAutoFixForJob = (co: typeof COMPANIES[0]) => {
    const textLower = resumeText.toLowerCase();
    const missingSkills = co.skills.filter((sk) => !textLower.includes(sk.toLowerCase()));

    const xyzBullets = [
      `Architected high-throughput ${co.skills[0] || "distributed"} services at scale, reducing latency by 45% as measured by APM metrics using ${co.skills[1] || "modern tech"}.`,
      `Engineered automated deployment pipelines for ${co.name} architecture, boosting build reliability to 99.9% while cutting operational costs by 30%.`,
      `Spearheaded cross-functional delivery for ${co.role} requirements, delivering key capabilities 2 weeks ahead of target deadlines.`,
    ];

    let newText = resumeText || `Target Role: ${co.role}\nCompany: ${co.name}\n`;
    if (missingSkills.length > 0) {
      newText += `\n\n[Optimized Key Skills for ${co.name}]\nCore Competencies: ` + missingSkills.join(", ");
    }
    newText += `\n\n[Google XYZ Formula Accomplishments — Target: ${co.name}]\n` + xyzBullets.join("\n");

    setResumeText(newText);
    toast.success(`Resume auto-fixed for ${co.name} (${co.role}) with Google XYZ Formula!`);
  };

  const downloadWord = () => {
    if (!resumeText.trim()) return toast.error("Resume is empty");
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Resume</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: auto; padding: 20px; }
        h1 { color: #0284c7; font-size: 20px; }
        pre { font-family: inherit; white-space: pre-wrap; word-break: break-word; }
      </style>
      </head>
      <body>
        <h1>${targetRole ? targetRole + " — " : ""}Optimized Resume</h1>
        <pre>${resumeText}</pre>
      </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `Resume_Optimized_${(targetRole || "Career").replace(/\s+/g, "_")}.docx`,
    });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Word Document (.docx) downloaded!");
  };

  const downloadPdf = async () => {
    if (!resumeText.trim()) return toast.error("Resume is empty");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Optimized Professional Resume", 15, 15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const lines = doc.splitTextToSize(resumeText, 180);
      let y = 25;
      for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(lines[i], 15, y);
        y += 6;
      }
      doc.save(`Resume_Optimized_${(targetRole || "Career").replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF Resume downloaded!");
    } catch {
      toast.error("Failed to generate PDF download");
    }
  };

  const downloadFixed = () => {
    const blob = new Blob([resumeText], { type: "text/plain" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "Fixed_Resume.txt",
    });
    a.click();
    toast.success("Fixed resume downloaded!");
  };

  const gradeColor = (g: string) =>
    ({
      A: "text-emerald-500",
      B: "text-blue-500",
      C: "text-amber-500",
      D: "text-orange-500",
      F: "text-red-500",
    })[g] ?? "text-gray-500";

  const filteredCompanies = COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQ.toLowerCase())),
  );

  const inp =
    "w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const Wrapper = embedded ? "div" : AppShell;

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ATS Checker</h2>
            <p className="text-xs text-muted-foreground">
              AI analysis · Auto-fix · 55+ company match scores
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/60">
          {[
            { id: "input" as const, label: "Resume Input" },
            { id: "results" as const, label: "ATS Results" },
            { id: "companies" as const, label: "Company Match", badge: "55+" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors flex items-center gap-1.5",
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {"badge" in t && t.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-extrabold">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* INPUT */}
        {tab === "input" && (
          <div className="grid xl:grid-cols-[1fr_340px] gap-5">
            <Card className="p-5 rounded-2xl border shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm font-bold">Paste or Upload Resume</p>
                <ResumeFileUpload onTextExtracted={handleFileExtracted} />
              </div>
              {extracting && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Parsing...
                </p>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <span className="text-xs text-muted-foreground font-semibold">Resume Content</span>
                {resumeText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSanitizeText}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1 border border-indigo-200 dark:border-indigo-800/40"
                    >
                      <Sparkles className="h-3 w-3 text-indigo-600" /> Clean & Sanitize Text
                    </button>
                    <button
                      onClick={() => setResumeText("")}
                      className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <textarea
                id="ats-resume"
                name="ats-resume"
                className={`${inp} min-h-[280px] resize-none font-mono text-xs`}
                placeholder="Paste your full resume text here, or upload a file above..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Target Role *</Label>
                  <input
                    id="ats-role"
                    name="ats-role"
                    className={inp}
                    placeholder="e.g. Full Stack Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Industry (optional)</Label>
                  <input
                    id="ats-industry"
                    name="ats-industry"
                    className={inp}
                    placeholder="e.g. Fintech, E-commerce"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleCheck}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60 shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Analyze Resume with AI
              </button>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold">ATS Tips</h3>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "Use standard section headings (Experience, Education, Skills)",
                    "Avoid tables, columns, or graphics in ATS-targeted resumes",
                    "Include exact keywords from the job description",
                    "Use .docx or plain text — not PDF for ATS",
                    "Quantify achievements with numbers (XYZ formula)",
                    "List skills explicitly in a dedicated Skills section",
                    "Keep formatting simple — no headers/footers",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-violet-600" />
                  <h3 className="text-sm font-bold">Recommended Courses</h3>
                </div>
                <div className="space-y-2">
                  {LEARNIFY_COURSES.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20"
                    >
                      <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
                        <GraduationCap className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.category}</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600">
                        {c.match}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {tab === "results" && (
          <div>
            {!result ? (
              <div className="text-center py-20 space-y-3">
                <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-sm font-semibold text-muted-foreground">No analysis yet</p>
                <p className="text-xs text-muted-foreground">
                  Go to Resume Input and run the analyzer
                </p>
                <button
                  onClick={() => setTab("input")}
                  className="mt-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition"
                >
                  Analyze Resume
                </button>
              </div>
            ) : (
              <div className="grid xl:grid-cols-[1fr_340px] gap-5">
                <div className="space-y-4">
                  <Card className="p-5 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-6 flex-wrap">
                      <ScoreRing score={result.score || 0} size={80} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-black text-2xl">
                            {result.score || 0}
                            <span className="text-sm font-normal text-muted-foreground">/100</span>
                          </h3>
                          <span className={cn("text-2xl font-extrabold", gradeColor(result.grade))}>
                            {result.grade || "-"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.summary || "ATS analysis complete"}
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap items-center">
                          <button
                            onClick={downloadPdf}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            <FileDown className="h-3.5 w-3.5" /> Download PDF
                          </button>
                          <button
                            onClick={downloadWord}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition"
                          >
                            <FileText className="h-3.5 w-3.5" /> Download Word (.docx)
                          </button>
                          <button
                            onClick={downloadFixed}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-bold hover:bg-muted/80 border transition"
                          >
                            <Download className="h-3.5 w-3.5" /> Text (.txt)
                          </button>
                          <button
                            onClick={() => setTab("companies")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-bold hover:bg-muted/80 border transition"
                          >
                            <Building2 className="h-3.5 w-3.5" /> Company Match (55+)
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Top 5 Target Job Matches AI Recommendations */}
                  <Card className="p-5 rounded-2xl border shadow-sm space-y-3 bg-gradient-to-br from-card via-card to-amber-500/5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-bold">Top 5 Best Job Matches (AI Recommended)</h3>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Scored across 55+ companies
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                      {top5Matches.map((co, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border bg-background/80 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden hover:border-primary/50 transition"
                        >
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black">
                            #{idx + 1} Match
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <CompanyLogo domain={co.domain} name={co.name} color={co.color} />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs truncate">{co.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{co.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                {co.matchScore}% Match
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground">{co.salary}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {co.skills.map((sk, sidx) => {
                                const isMatched = (resumeText || "").toLowerCase().includes(sk.toLowerCase());
                                return (
                                  <span
                                    key={sidx}
                                    className={cn(
                                      "px-1.5 py-0.5 rounded text-[9px] font-semibold border",
                                      isMatched
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                                    )}
                                  >
                                    {isMatched ? "✓ " : "+ "}{sk}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 pt-2 border-t">
                            <button
                              onClick={() => handleAutoFixForJob(co)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 transition"
                            >
                              <Wand2 className="h-3 w-3" /> Auto-Fix
                            </button>
                            <a
                              href={co.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1 hover:opacity-90 transition shrink-0"
                            >
                              Apply <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {result.keywords && (
                    <Card className="p-5 rounded-2xl border shadow-sm">
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Keyword Analysis
                      </h3>
                      {result.keywords.present?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">
                            Present Keywords
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.keywords.present.map((k: string, i: number) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/40"
                              >
                                <Check className="h-2.5 w-2.5" />
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.keywords.missing?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2">
                            Missing — Click to Auto-Apply
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.keywords.missing.map((k: string, i: number) => (
                              <button
                                key={i}
                                onClick={() => applyKeyword(k)}
                                disabled={appliedKw.includes(k)}
                                className={cn(
                                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition",
                                  appliedKw.includes(k)
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800"
                                    : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40 hover:bg-rose-100",
                                )}
                              >
                                {appliedKw.includes(k) ? (
                                  <Check className="h-2.5 w-2.5" />
                                ) : (
                                  <Zap className="h-2.5 w-2.5" />
                                )}
                                {k}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                  {result.suggestions?.length > 0 && (
                    <Card className="p-5 rounded-2xl border shadow-sm">
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Auto-Fix Suggestions
                      </h3>
                      <div className="space-y-2">
                        {result.suggestions.map((s: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {result.strengths?.length > 0 && (
                    <Card className="p-5 rounded-2xl border shadow-sm">
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Strengths
                      </h3>
                      <div className="space-y-2">
                        {result.strengths.map((s: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-xs leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  <Card className="p-5 rounded-2xl border shadow-sm">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      XYZ Formula — Rewrite Your Bullets
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Accomplished [X] as measured by [Y] by doing [Z]",
                        "Led a team of [X] to achieve [Y] by implementing [Z]",
                        "Reduced [X] by [Y%] through [Z]",
                        "Increased [X] by [Y] using [Z] approach",
                      ].map((tip, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 text-xs"
                        >
                          <span className="font-bold text-indigo-700 dark:text-indigo-400">
                            #{i + 1}
                          </span>{" "}
                          <span className="text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="p-4 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-violet-600" />
                      <h3 className="text-sm font-bold">Recommended Courses</h3>
                    </div>
                    <div className="space-y-2">
                      {LEARNIFY_COURSES.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20"
                        >
                          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
                            <GraduationCap className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground">{c.category}</p>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-600">
                            {c.match}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/courses"
                      className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-dashed text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition"
                    >
                      View All Learnify Courses <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPANY MATCH */}
        {tab === "companies" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <input
                  id="co-search"
                  name="co-search"
                  className={`${inp} pl-8`}
                  placeholder="Search companies, roles, or skills..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
                <Target className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {filteredCompanies.length} companies
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((co, i) => {
                const matchScore = result
                  ? Math.max(
                      30,
                      Math.min(99, (result.score || 50) + Math.floor(Math.random() * 20) - 10),
                    )
                  : null;
                return (
                  <Card
                    key={i}
                    className="p-4 rounded-2xl border shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <CompanyLogo domain={co.domain} name={co.name} color={co.color} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{co.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{co.role}</p>
                      </div>
                      {matchScore !== null && (
                        <div
                          className={cn(
                            "text-xs font-extrabold px-2 py-1 rounded-full shrink-0",
                            matchScore >= 70
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : matchScore >= 50
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                          )}
                        >
                          {matchScore}%
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                        Key Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {co.skills.map((s, si) => (
                          <span
                            key={si}
                            className="px-2 py-0.5 rounded-full border border-border/60 bg-muted/30 text-[10px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <span className="text-xs font-bold text-emerald-600">{co.salary}</span>
                      <a
                        href={co.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold hover:opacity-90 transition"
                      >
                        Apply <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
