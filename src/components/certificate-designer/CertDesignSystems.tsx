import { ShieldCheck, Award, Sparkles, Code, BookOpen } from "lucide-react";

export type CertSystemType = "modern-tech" | "university" | "luxury-executive" | "startup" | "future-ai";

type CertProps = {
  studentName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
  verificationUrl: string;
  skills?: string[];
  signatureName?: string;
  signatureRole?: string;
};

export function ModernTechCert({ studentName, courseName, issueDate, certificateId }: CertProps) {
  return (
    <div className="w-[1000px] h-[707px] bg-[#f8fafc] p-12 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-200 shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-xl">
            L
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">LEARNIFY TECH CERTIFICATION</h3>
            <p className="text-[10px] text-slate-500 font-mono">VERIFIED ACCREDITATION</p>
          </div>
        </div>
        <span className="font-mono text-xs text-slate-400">ID: {certificateId}</span>
      </div>

      <div className="my-auto space-y-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Certificate of Competency
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{studentName}</h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          has successfully completed the technical evaluation and demonstrated proficiency in
        </p>
        <h2 className="text-2xl font-bold text-indigo-600">{courseName}</h2>
      </div>

      <div className="flex justify-between items-end border-t border-slate-200 pt-6 text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-900">Issued On</p>
          <p>{issueDate}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-900">Learnify AI Accreditation Board</p>
          <p className="font-mono text-[10px]">Verified SHA-256</p>
        </div>
      </div>
    </div>
  );
}

export function UniversityCert({ studentName, courseName, issueDate, certificateId }: CertProps) {
  return (
    <div className="w-[1000px] h-[707px] bg-[#fffdfa] p-16 flex flex-col justify-between relative overflow-hidden font-serif border-8 border-double border-amber-900/40 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="h-14 w-14 mx-auto border-2 border-amber-800 rounded-full flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-amber-900" />
        </div>
        <h2 className="text-2xl font-bold tracking-widest text-amber-950 uppercase">Learnify Academic Institute</h2>
        <p className="text-xs italic text-amber-800">Established MMXXIV</p>
      </div>

      <div className="text-center space-y-4 my-auto">
        <p className="text-sm italic text-slate-600">Be it known to all that</p>
        <h1 className="text-4xl font-bold text-slate-900 underline decoration-amber-600/30 decoration-2 underline-offset-8">
          {studentName}
        </h1>
        <p className="text-xs italic text-slate-600">having fulfilled all academic requirements is hereby awarded the Diploma in</p>
        <h3 className="text-2xl font-bold text-amber-900">{courseName}</h3>
      </div>

      <div className="flex justify-between items-end text-xs text-amber-950 pt-8 border-t border-amber-900/20">
        <div>
          <p className="font-cursive text-2xl text-slate-800">Vishwajeet S.</p>
          <p className="text-[10px] uppercase font-bold tracking-wider">Dean of Studies</p>
        </div>
        <div className="text-center font-mono text-[10px]">
          <p>Certificate #{certificateId}</p>
          <p>{issueDate}</p>
        </div>
        <div className="text-right">
          <p className="font-cursive text-2xl text-slate-800">Learnify Board</p>
          <p className="text-[10px] uppercase font-bold tracking-wider">Registrar</p>
        </div>
      </div>
    </div>
  );
}

export function LuxuryExecutiveCert({ studentName, courseName, issueDate, certificateId }: CertProps) {
  return (
    <div className="w-[1000px] h-[707px] bg-[#0a1628] p-16 flex flex-col justify-between relative overflow-hidden font-sans border-4 border-[#c9a84c] text-white shadow-2xl">
      <div className="flex justify-between items-center z-10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#c9a84c] uppercase">Executive Credentials</span>
        <Award className="h-8 w-8 text-[#c9a84c]" />
      </div>

      <div className="text-center space-y-6 my-auto z-10">
        <h3 className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]">Executive Certification</h3>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">
          {studentName}
        </h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          has successfully completed the executive leadership curriculum for
        </p>
        <h2 className="text-2xl font-bold text-white">{courseName}</h2>
      </div>

      <div className="flex justify-between items-end text-xs text-slate-400 pt-6 border-t border-white/10 z-10">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#c9a84c]">Issued Date</p>
          <p className="text-white">{issueDate}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-[#c9a84c]">Credential ID</p>
          <p className="text-white font-mono">{certificateId}</p>
        </div>
      </div>
    </div>
  );
}

export function StartupCert({ studentName, courseName, issueDate, certificateId }: CertProps) {
  return (
    <div className="w-[1000px] h-[707px] bg-slate-950 p-12 flex flex-col justify-between relative font-mono text-white border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-indigo-400" />
          <span className="text-xs font-bold tracking-tight text-white">learnify.os / certs</span>
        </div>
        <span className="text-[10px] text-slate-500">status: verified</span>
      </div>

      <div className="space-y-4 my-auto">
        <div className="text-xs text-slate-400">// CREDENTIAL_OBJECT</div>
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-xs text-slate-400">recipient: <span className="text-indigo-400 font-bold">"{studentName}"</span></p>
          <p className="text-xs text-slate-400">achievement: <span className="text-emerald-400 font-bold">"{courseName}"</span></p>
          <p className="text-xs text-slate-400">issued_at: <span className="text-amber-400">"{issueDate}"</span></p>
          <p className="text-xs text-slate-400">sha256_hash: <span className="text-purple-400">"{certificateId}"</span></p>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-4">
        <span>Learnify Credential OS 3.0</span>
        <span>Verified Cryptographic Record</span>
      </div>
    </div>
  );
}

export function FutureAiCert({ studentName, courseName, issueDate, certificateId }: CertProps) {
  return (
    <div className="w-[1000px] h-[707px] bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-16 flex flex-col justify-between relative text-white border border-purple-500/30 shadow-2xl">
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-purple-300">LEARNIFY AI AGENTIC CERTIFICATION</span>
        </div>
        <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          AI VERIFIED
        </span>
      </div>

      <div className="text-center space-y-6 my-auto z-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-400 to-indigo-200">
          {studentName}
        </h1>
        <p className="text-xs text-purple-200/70 max-w-md mx-auto">
          has mastered advanced LLM Agent architectures, prompt engineering, and autonomous systems in
        </p>
        <h2 className="text-3xl font-bold text-white tracking-wide">{courseName}</h2>
      </div>

      <div className="flex justify-between items-end text-xs text-purple-300/60 pt-6 border-t border-purple-500/20 z-10">
        <div>
          <p className="text-[10px] font-bold text-purple-400">ISSUANCE TIMESTAMP</p>
          <p className="text-white">{issueDate}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-purple-400">W3C VERIFIABLE CREDENTIAL ID</p>
          <p className="text-white font-mono">{certificateId}</p>
        </div>
      </div>
    </div>
  );
}
