import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MousePointer2, Type, Image as ImageIcon, Square, Sparkles,
  Variable, Layers, LayoutGrid, ZoomIn, Undo, Redo, Ruler,
  Grid3X3, Upload, Share2, ChevronDown, Download,
  Award, Briefcase, Infinity as InfinityIcon, Star, Shield, Code2,
  Trophy, Crown, Cloud, Target, Brain, BarChart2, LayoutGrid as GridIcon,
  Wand2, CheckCircle2, ChevronRight, AlignCenter, AlignLeft, AlignRight, AlignJustify, Palette
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { toast } from 'sonner';

/* ─────────────────────────────────────────────
   TYPES
─────────────────────────────────────────────── */
type BadgeIconType = 'crown' | 'trophy' | 'code';
type DecorStyle = 'teal-sweep' | 'blue-angular' | 'purple-geometric' | 'green-ribbons' | 'crimson-ribbons';

interface FeatureItem { icon: string; title: string; sub: string; }
interface TemplateConfig {
  id: string; label: string; img: string;
  primary: string; accent: string; certBg: string;
  badgeBg: string; badgeText: string[]; badgeIcon: BadgeIconType;
  decorStyle: DecorStyle; decorColor: string; decorColor2: string;
  verifyBg: string; features: FeatureItem[];
  certIdColor: string; nameColor: string;
}

/* ─────────────────────────────────────────────
   TEMPLATE CONFIGS  (easily extensible to 30+)
─────────────────────────────────────────────── */
const templates: Record<string, TemplateConfig> = {
  navy: {
    id: 'navy', label: 'Navy Gold', img: '/mockup/images/cert-16.png',
    primary: '#1B5E5A', accent: '#D4A843', certBg: '#F8F5EE',
    badgeBg: '#1B5E5A', badgeText: ['VERIFIED', 'CERTIFICATE'], badgeIcon: 'crown',
    decorStyle: 'teal-sweep', decorColor: '#1B5E5A', decorColor2: '#144C49',
    verifyBg: '#1B5E5A', certIdColor: '#1B5E5A', nameColor: '#1B5E5A',
    features: [
      { icon: 'cloud', title: 'AI-Powered Learning', sub: 'Learn intelligently with AI.' },
      { icon: 'layers', title: 'Industry Relevant', sub: 'Skills that matter in real world.' },
      { icon: 'shield', title: 'Career Focused', sub: 'Build skills. Achieve goals.' },
      { icon: 'infinity', title: 'Lifetime Access', sub: 'Learn anytime. Anywhere.' },
    ],
  },
  blue: {
    id: 'blue', label: 'Navy Blue', img: '/mockup/images/cert-28.png',
    primary: '#1E3A8A', accent: '#D4A843', certBg: '#FFFFFF',
    badgeBg: '#1E3A8A', badgeText: ['CERTIFICATE', 'OF ACHIEVEMENT'], badgeIcon: 'crown',
    decorStyle: 'blue-angular', decorColor: '#1E3A8A', decorColor2: '#172554',
    verifyBg: '#1E3A8A', certIdColor: '#D4A843', nameColor: '#1E3A8A',
    features: [
      { icon: 'brain', title: 'AI-Powered Learning', sub: 'Learn intelligently with AI.' },
      { icon: 'chart', title: 'Industry Relevant', sub: 'Skills that matter in real world.' },
      { icon: 'target', title: 'Career Focused', sub: 'Build skills. Achieve goals.' },
      { icon: 'infinity', title: 'Lifetime Access', sub: 'Learn anytime. Anywhere.' },
    ],
  },
  purple: {
    id: 'purple', label: 'Royal Purple', img: '/mockup/images/cert-29.png',
    primary: '#6B21A8', accent: '#D4A843', certBg: '#FFFFFF',
    badgeBg: '#4C1D95', badgeText: ['CERTIFICATE', 'OF ACHIEVEMENT'], badgeIcon: 'trophy',
    decorStyle: 'purple-geometric', decorColor: '#B91C7A', decorColor2: '#7C3AED',
    verifyBg: '#7C3AED', certIdColor: '#D4A843', nameColor: '#9333EA',
    features: [
      { icon: 'chart', title: 'AI-Powered Learning', sub: 'Learn intelligently with AI.' },
      { icon: 'grid', title: 'Industry Relevant', sub: 'Skills that matter in real world.' },
      { icon: 'target', title: 'Career Focused', sub: 'Build skills. Achieve goals.' },
      { icon: 'shield', title: 'Lifetime Access', sub: 'Learn anytime. Anywhere.' },
    ],
  },
  green: {
    id: 'green', label: 'Forest Green', img: '/mockup/images/cert-30.png',
    primary: '#064E3B', accent: '#D4A843', certBg: '#F8F5EE',
    badgeBg: '#064E3B', badgeText: ['CERTIFICATE', 'OF ACHIEVEMENT'], badgeIcon: 'code',
    decorStyle: 'green-ribbons', decorColor: '#065F46', decorColor2: '#047857',
    verifyBg: '#064E3B', certIdColor: '#064E3B', nameColor: '#064E3B',
    features: [
      { icon: 'code', title: 'AI-Powered Learning', sub: 'Learn intelligently with AI.' },
      { icon: 'layers', title: 'Industry Relevant', sub: 'Skills that matter in real world.' },
      { icon: 'target', title: 'Career Focused', sub: 'Build skills. Achieve goals.' },
      { icon: 'infinity', title: 'Lifetime Access', sub: 'Learn anytime. Anywhere.' },
    ],
  },
  crimson: {
    id: 'crimson', label: 'Crimson Gold', img: '/mockup/images/cert-11.png',
    primary: '#7F1D1D', accent: '#D4A843', certBg: '#FDFAF5',
    badgeBg: '#1E3A8A', badgeText: ['VERIFIED', 'CERTIFICATE'], badgeIcon: 'crown',
    decorStyle: 'crimson-ribbons', decorColor: '#9B1C1C', decorColor2: '#7F1D1D',
    verifyBg: '#7F1D1D', certIdColor: '#D4A843', nameColor: '#7F1D1D',
    features: [
      { icon: 'ai', title: 'AI-Powered Learning', sub: 'Smart. Adaptive. Future Ready.' },
      { icon: 'briefcase', title: 'Industry Relevant', sub: 'Practical skills for real world.' },
      { icon: 'target', title: 'Career Focused', sub: 'Build Skills. Achieve Goals.' },
      { icon: 'infinity', title: 'Lifetime Access', sub: 'Learn anytime. Anywhere.' },
    ],
  },
};

// Placeholder "coming soon" templates (extensible slots)
const comingSoon = [
  { id: 'rose', label: 'Rose Gold', color: '#BE185D' },
  { id: 'ocean', label: 'Ocean Blue', color: '#0369A1' },
  { id: 'amber', label: 'Amber Dark', color: '#92400E' },
  { id: 'slate', label: 'Midnight Slate', color: '#1E293B' },
  { id: 'emerald', label: 'Emerald Rich', color: '#065F46' },
];

/* ─────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────── */
interface SelectableProps {
  id: string; selectedId: string | null; onSelect: (id: string) => void;
  className?: string; style?: React.CSSProperties; children: React.ReactNode;
}
const Selectable = ({ id, selectedId, onSelect, className, style, children }: SelectableProps) => {
  const isSelected = id === selectedId;
  return (
    <div className={`absolute cursor-pointer select-none ${className ?? ''}`} style={style}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
      {children}
      {isSelected && (
        <div className="absolute -inset-2 border-[1.5px] border-blue-500 pointer-events-none z-50">
          {['-top-1.5 -left-1.5','-top-1.5 -right-1.5','-bottom-1.5 -left-1.5','-bottom-1.5 -right-1.5',
            'top-1/2 -left-1.5 -translate-y-1/2','top-1/2 -right-1.5 -translate-y-1/2',
            '-top-1.5 left-1/2 -translate-x-1/2','-bottom-1.5 left-1/2 -translate-x-1/2'
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-2.5 h-2.5 bg-white border border-blue-500 shadow-sm`} />
          ))}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-blue-500 rounded-full shadow-sm" />
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-px h-4 bg-blue-500" />
        </div>
      )}
    </div>
  );
};

/* Laurel Wreath SVG – used beside student name and in center seal */
const LaurelLeft = ({ color, size = 40 }: { color: string; size?: number }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 40 65" fill="none">
    <path d="M22 5 Q22 33 22 62" stroke={color} strokeWidth="1.2" />
    {[[22,10,5,6],[22,18,4,14],[22,26,3,22],[22,34,4,30],[22,42,5,38],[22,50,6,46],[22,58,7,54]].map(([sx,sy,ex,ey],i)=>(
      <path key={i} d={`M${sx} ${sy} Q${(sx+ex)/2-4} ${(sy+ey)/2-2} ${ex} ${ey}`}
        stroke={color} strokeWidth="1.2" fill="none"/>
    ))}
    {[[22,10,4,8],[22,18,3,16],[22,26,2,24],[22,34,3,32],[22,42,4,40],[22,50,5,48],[22,58,6,56]].map(([sx,sy,ex,ey],i)=>(
      <ellipse key={`l${i}`} cx={(sx+ex)/2-3} cy={(sy+ey)/2} rx="5" ry="3"
        fill={color} opacity="0.85" transform={`rotate(-30 ${(sx+ex)/2-3} ${(sy+ey)/2})`}/>
    ))}
  </svg>
);

const LaurelRight = ({ color, size = 40 }: { color: string; size?: number }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 40 65" fill="none" style={{ transform: 'scaleX(-1)' }}>
    <path d="M22 5 Q22 33 22 62" stroke={color} strokeWidth="1.2" />
    {[[22,10,5,6],[22,18,4,14],[22,26,3,22],[22,34,4,30],[22,42,5,38],[22,50,6,46],[22,58,7,54]].map(([sx,sy,ex,ey],i)=>(
      <path key={i} d={`M${sx} ${sy} Q${(sx+ex)/2-4} ${(sy+ey)/2-2} ${ex} ${ey}`}
        stroke={color} strokeWidth="1.2" fill="none"/>
    ))}
    {[[22,10,4,8],[22,18,3,16],[22,26,2,24],[22,34,3,32],[22,42,4,40],[22,50,5,48],[22,58,6,56]].map(([sx,sy,ex,ey],i)=>(
      <ellipse key={`l${i}`} cx={(sx+ex)/2-3} cy={(sy+ey)/2} rx="5" ry="3"
        fill={color} opacity="0.85" transform={`rotate(-30 ${(sx+ex)/2-3} ${(sy+ey)/2})`}/>
    ))}
  </svg>
);

/* Badge seal icon */
const BadgeIcon = ({ type, color, size = 22 }: { type: BadgeIconType; color: string; size?: number }) => {
  if (type === 'trophy') return <Trophy size={size} style={{ color }} fill={color} />;
  if (type === 'code') return <span style={{ color, fontFamily: 'monospace', fontWeight: 900, fontSize: size * 0.95 }}>&lt;/&gt;</span>;
  return <Crown size={size} style={{ color }} fill={color} />;
};

/* ─────────────────────────────────────────────
   BACKGROUND DECORATIONS per template
─────────────────────────────────────────────── */
const CertBgDecor = ({ t }: { t: TemplateConfig }) => {
  const { decorStyle: s, decorColor: c1, decorColor2: c2, accent } = t;

  if (s === 'teal-sweep') return (
    <>
      {/* Top-left: two nested curved quarter sweeps */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="320" height="320" viewBox="0 0 320 320" fill="none">
        <path d="M0 0 L320 0 C320 190 190 320 0 320 Z" fill={c1} opacity="0.97"/>
        <path d="M0 0 L260 0 C260 150 150 260 0 260 Z" fill={c2}/>
      </svg>
      {/* Bottom-right: teal curve + gold diagonal strip */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="280" height="220" viewBox="0 0 280 220" fill="none">
        <path d="M280 220 L60 220 C60 110 160 20 280 20 Z" fill={c1} opacity="0.55"/>
        <path d="M280 220 L190 220 L280 130 Z" fill={accent} opacity="0.75"/>
      </svg>
      {/* Gold inset border */}
      <div className="absolute inset-[14px] border-[3.5px] pointer-events-none z-10" style={{ borderColor: accent }}/>
      {/* Top-right corner small gold ornament */}
      <svg className="absolute top-3 right-3 pointer-events-none" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M40 0 L40 40 L0 40" stroke={accent} strokeWidth="3" fill="none"/>
      </svg>
    </>
  );

  if (s === 'blue-angular') return (
    <>
      {/* Top-left: double angular triangle fill */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="320" height="310" viewBox="0 0 320 310" fill="none">
        <polygon points="0,0 310,0 0,310" fill={c1} opacity="0.92"/>
        <polygon points="0,0 230,0 0,225" fill={c2}/>
      </svg>
      {/* Bottom-right: double angular triangle fill */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="300" height="290" viewBox="0 0 300 290" fill="none">
        <polygon points="300,290 0,290 300,0" fill={c1} opacity="0.92"/>
        <polygon points="300,290 70,290 300,60" fill={c2}/>
      </svg>
      {/* Gold ornamental corners */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M5 5 Q40 10 75 5 Q70 40 75 75" stroke={accent} strokeWidth="1.5" fill="none"/>
        <circle cx="40" cy="5" r="2.5" fill={accent}/>
        <circle cx="75" cy="40" r="2.5" fill={accent}/>
        <path d="M20 5 Q40 15 60 5" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.6"/>
        <path d="M75 20 Q65 40 75 60" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.6"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M75 75 Q40 70 5 75 Q10 40 5 5" stroke={accent} strokeWidth="1.5" fill="none"/>
        <circle cx="40" cy="75" r="2.5" fill={accent}/>
        <circle cx="5" cy="40" r="2.5" fill={accent}/>
      </svg>
      {/* Subtle blue dot pattern */}
      {Array.from({length:15}).map((_,i)=>(
        <div key={i} className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ background: c1, opacity: 0.12, left: `${20+i*5}%`, top: `${15+((i*7)%60)}%` }}/>
      ))}
      {/* Gold border */}
      <div className="absolute inset-[14px] border-[2.5px] pointer-events-none z-10" style={{ borderColor: accent }}/>
    </>
  );

  if (s === 'purple-geometric') return (
    <>
      {/* Top-left: overlapping geometric shapes (pink + purple parallelograms) */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="380" height="290" viewBox="0 0 380 290" fill="none">
        {/* Pink/magenta front shape */}
        <polygon points="0,0 160,0 60,290 0,290" fill={c1} opacity="0.9"/>
        {/* Purple mid shape */}
        <polygon points="100,0 280,0 180,250 0,250 0,180 80,180" fill={c2} opacity="0.75"/>
        {/* Lighter purple back shape */}
        <polygon points="230,0 380,0 380,160 280,200 150,200" fill="#9333EA" opacity="0.5"/>
        {/* White triangular highlight */}
        <polygon points="160,0 220,0 140,160 80,160" fill="white" opacity="0.12"/>
      </svg>
      {/* Bottom-right: mirrored */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="380" height="290" viewBox="0 0 380 290" fill="none">
        <polygon points="380,290 220,290 320,0 380,0" fill={c1} opacity="0.9"/>
        <polygon points="280,290 100,290 200,40 380,40 380,110 300,110" fill={c2} opacity="0.75"/>
        <polygon points="150,290 0,290 0,130 100,90 230,90" fill="#9333EA" opacity="0.5"/>
      </svg>
      {/* Gold ornamental corner top-right */}
      <svg className="absolute top-2 right-2 pointer-events-none" width="55" height="55" viewBox="0 0 55 55" fill="none">
        <path d="M5 5 L50 5 L50 50" stroke={accent} strokeWidth="2" fill="none"/>
        <circle cx="28" cy="5" r="2" fill={accent}/>
        <path d="M12 5 L44 5" stroke={accent} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6"/>
      </svg>
      <svg className="absolute bottom-2 left-2 pointer-events-none" width="55" height="55" viewBox="0 0 55 55" fill="none">
        <path d="M50 50 L5 50 L5 5" stroke={accent} strokeWidth="2" fill="none"/>
        <circle cx="28" cy="50" r="2" fill={accent}/>
      </svg>
      {/* Gold diamond top-right area */}
      <div className="absolute top-5 right-5 w-2 h-2 rotate-45 pointer-events-none" style={{ background: accent }}/>
      {/* Gold border */}
      <div className="absolute inset-[14px] border-[2.5px] pointer-events-none z-10" style={{ borderColor: accent }}/>
    </>
  );

  if (s === 'green-ribbons') return (
    <>
      {/* Top-left: diagonal ribbon strips */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="310" height="310" viewBox="0 0 310 310" fill="none">
        {/* Base corner fill */}
        <polygon points="0,0 130,0 0,130" fill={c1}/>
        {/* Strip 1 */}
        <polygon points="130,0 190,0 0,190 0,130" fill={c2} opacity="0.8"/>
        {/* Strip 2 */}
        <polygon points="190,0 240,0 0,240 0,190" fill={c1} opacity="0.7"/>
        {/* Strip 3 */}
        <polygon points="240,0 280,0 0,280 0,240" fill={c2} opacity="0.5"/>
        {/* Strip 4 (faintest) */}
        <polygon points="280,0 310,0 0,310 0,280" fill={c1} opacity="0.3"/>
      </svg>
      {/* Bottom-right: diagonal ribbon strips */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="310" height="310" viewBox="0 0 310 310" fill="none">
        <polygon points="310,310 180,310 310,180" fill={c1}/>
        <polygon points="180,310 120,310 310,120 310,180" fill={c2} opacity="0.8"/>
        <polygon points="120,310 70,310 310,70 310,120" fill={c1} opacity="0.7"/>
        <polygon points="70,310 30,310 310,30 310,70" fill={c2} opacity="0.5"/>
        <polygon points="30,310 0,310 310,0 310,30" fill={c1} opacity="0.3"/>
      </svg>
      {/* L-bracket gold corners */}
      {[['top-0 left-0','M4 30 L4 4 L30 4'],['top-0 right-0','M26 4 L50 4 L50 30'],
        ['bottom-0 left-0','M4 20 L4 46 L30 46'],['bottom-0 right-0','M26 46 L50 46 L50 20']
      ].map(([pos, d], i) => (
        <svg key={i} className={`absolute ${pos} pointer-events-none`} width="54" height="50" viewBox="0 0 54 50" fill="none">
          <path d={d} stroke={accent} strokeWidth="3" fill="none"/>
        </svg>
      ))}
      {/* Gold wavy inner border */}
      <div className="absolute inset-[14px] border-[2px] pointer-events-none z-10" style={{ borderColor: accent }}/>
    </>
  );

  /* crimson-ribbons: same structure, different color + small gold crown top-right */
  return (
    <>
      <svg className="absolute top-0 left-0 pointer-events-none" width="300" height="300" viewBox="0 0 300 300" fill="none">
        <polygon points="0,0 130,0 0,130" fill={c1}/>
        <polygon points="130,0 185,0 0,185 0,130" fill={c2} opacity="0.85"/>
        <polygon points="185,0 230,0 0,230 0,185" fill={c1} opacity="0.7"/>
        <polygon points="230,0 265,0 0,265 0,230" fill={c2} opacity="0.5"/>
        <polygon points="265,0 295,0 0,295 0,265" fill={c1} opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="300" height="300" viewBox="0 0 300 300" fill="none">
        <polygon points="300,300 170,300 300,170" fill={c1}/>
        <polygon points="170,300 115,300 300,115 300,170" fill={c2} opacity="0.85"/>
        <polygon points="115,300 70,300 300,70 300,115" fill={c1} opacity="0.7"/>
        <polygon points="70,300 35,300 300,35 300,70" fill={c2} opacity="0.5"/>
        <polygon points="35,300 5,300 300,5 300,35" fill={c1} opacity="0.3"/>
      </svg>
      {/* Small gold crown top-right */}
      <div className="absolute top-4 right-16 pointer-events-none z-10">
        <Crown size={16} style={{ color: accent }} fill={accent} />
      </div>
      {/* L-bracket corners */}
      {[['top-0 left-0','M4 28 L4 4 L28 4'],['top-0 right-0','M24 4 L48 4 L48 28'],
        ['bottom-0 left-0','M4 18 L4 44 L28 44'],['bottom-0 right-0','M24 44 L48 44 L48 18']
      ].map(([pos, d], i) => (
        <svg key={i} className={`absolute ${pos} pointer-events-none`} width="52" height="48" viewBox="0 0 52 48" fill="none">
          <path d={d} stroke={accent} strokeWidth="3" fill="none"/>
        </svg>
      ))}
      <div className="absolute inset-[14px] border-[2px] pointer-events-none z-10" style={{ borderColor: accent }}/>
    </>
  );
};

/* ─────────────────────────────────────────────
   LEFT BADGE / SEAL (on the ribbon)
─────────────────────────────────────────────── */
const BadgeSeal = ({ t, className }: { t: TemplateConfig; className?: string }) => (
  <div className={`relative flex flex-col items-center ${className ?? ''}`}>
    {/* Ribbon */}
    <svg width="64" height="190" viewBox="0 0 64 190" fill="none" className="absolute top-0 z-10 drop-shadow-md">
      <path d="M4 0 H60 V168 L32 190 L4 168 Z" fill={t.decorColor}/>
      <path d="M10 0 H54 V162 L32 180 L10 162 Z" fill={t.decorColor2} opacity="0.6"/>
    </svg>
    {/* Gold scallop seal ring */}
    <div className="absolute top-[120px] z-20 w-[100px] h-[100px] flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="absolute inset-0">
        {/* Scallop outer ring */}
        {Array.from({length: 18}).map((_, i) => {
          const angle = (i * 20) * Math.PI / 180;
          const cx = 50 + 42 * Math.cos(angle);
          const cy = 50 + 42 * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r="6" fill={t.accent}/>;
        })}
        <circle cx="50" cy="50" r="38" fill={t.badgeBg} stroke={t.accent} strokeWidth="2"/>
        <circle cx="50" cy="50" r="33" fill="none" stroke={t.accent} strokeWidth="0.7" strokeDasharray="2.5 2"/>
        {/* Laurel arcs */}
        <path d="M18 62 Q20 55 25 50 Q22 58 24 65" fill={t.accent} opacity="0.7"/>
        <path d="M82 62 Q80 55 75 50 Q78 58 76 65" fill={t.accent} opacity="0.7"/>
        {/* Stars row */}
        {[-12,0,12].map(x=>(
          <polygon key={x} points={`${50+x},72 ${52+x},77 ${57+x},77 ${53+x},80 ${55+x},85 ${50+x},82 ${45+x},85 ${47+x},80 ${43+x},77 ${48+x},77`}
            fill={t.accent} transform={`scale(0.55) translate(${(50+x)*0.82},${72*0.82})`}/>
        ))}
      </svg>
      {/* Icon + text in center */}
      <div className="relative z-10 flex flex-col items-center">
        <BadgeIcon type={t.badgeIcon} color={t.accent} size={20}/>
        {t.badgeText.map((line, i) => (
          <span key={i} className="text-[7px] font-black tracking-[0.12em] uppercase leading-tight text-center" style={{ color: t.accent }}>
            {line}
          </span>
        ))}
        <div className="flex gap-1 mt-1">
          {[0,1,2].map(i => <Star key={i} size={6} fill={t.accent} style={{ color: t.accent }}/>)}
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   CENTER SEAL (wreath + logo)
─────────────────────────────────────────────── */
const CenterSeal = ({ t }: { t: TemplateConfig }) => (
  <div className="w-[110px] h-[110px] relative flex items-center justify-center">
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="absolute inset-0">
      {/* Laurel wreath path - left side */}
      {[[55,15,30,25],[55,25,24,35],[55,35,20,46],[55,45,22,57],[55,55,26,67],[55,65,32,76],[55,74,40,82]].map(([sx,sy,ex,ey],i)=>(
        <ellipse key={`lw${i}`} cx={(sx+ex)/2-4} cy={(sy+ey)/2} rx="7" ry="3.5"
          fill={t.accent} opacity="0.85" transform={`rotate(-40 ${(sx+ex)/2-4} ${(sy+ey)/2})`}/>
      ))}
      {/* Right side (mirrored) */}
      {[[55,15,80,25],[55,25,86,35],[55,35,90,46],[55,45,88,57],[55,55,84,67],[55,65,78,76],[55,74,70,82]].map(([sx,sy,ex,ey],i)=>(
        <ellipse key={`rw${i}`} cx={(sx+ex)/2+4} cy={(sy+ey)/2} rx="7" ry="3.5"
          fill={t.accent} opacity="0.85" transform={`rotate(40 ${(sx+ex)/2+4} ${(sy+ey)/2})`}/>
      ))}
      {/* Center circle */}
      <circle cx="55" cy="50" r="32" fill="white" stroke={t.accent} strokeWidth="1.5"/>
      <circle cx="55" cy="50" r="28" fill={t.badgeBg} stroke={t.accent} strokeWidth="0.5"/>
      {/* Stars below */}
      {[43,55,67].map(x=>(
        <polygon key={x} points={`${x},88 ${x+1.5},91.5 ${x+5},91.5 ${x+2},93.5 ${x+3.5},97 ${x},95 ${x-3.5},97 ${x-2},93.5 ${x-5},91.5 ${x-1.5},91.5`}
          fill={t.accent}/>
      ))}
    </svg>
    <img src="/images/logo.png" alt="Logo" className="h-8 brightness-0 invert opacity-90 relative z-10"/>
  </div>
);

/* ─────────────────────────────────────────────
   FEATURE ICON
─────────────────────────────────────────────── */
const FeatureIcon = ({ icon, size=14 }: { icon: string; size?: number }) => {
  const props = { size, className: 'shrink-0' };
  const map: Record<string, React.ReactNode> = {
    cloud: <Cloud {...props}/>, layers: <Layers {...props}/>, shield: <Shield {...props}/>,
    infinity: <InfinityIcon {...props}/>, brain: <Brain {...props}/>, chart: <BarChart2 {...props}/>,
    target: <Target {...props}/>, grid: <GridIcon {...props}/>, code: <Code2 {...props}/>,
    briefcase: <Briefcase {...props}/>, award: <Award {...props}/>, ai: <Sparkles {...props}/>,
  };
  return <>{map[icon] ?? <Award {...props}/>}</>;
};

/* ─────────────────────────────────────────────
   QR CODE component – uses free QR server API
─────────────────────────────────────────────── */
const QRCodeDisplay = ({ url, size = 90 }: { url: string; size?: number }) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { margin: 1, width: size * 2 })
      .then(src => setQrSrc(src))
      .catch(err => console.error('qrcode error:', err));
  }, [url, size]);

  return (
    <div className="bg-white p-1 border border-gray-200 rounded shadow-sm flex items-center justify-center" style={{ width: size, height: size }}>
      {qrSrc ? (
        <img src={qrSrc} alt="QR Code" className="w-full h-full object-contain" />
      ) : (
        <div className="text-[8px] text-gray-400">Loading...</div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   PROPERTIES PANEL content
─────────────────────────────────────────────── */
const elementMeta: Record<string, { label: string; font?: string; size?: number; variable?: string }> = {
  logo:           { label: 'Logo', variable: '{{logo}}' },
  'cert-id':      { label: 'Certificate ID', font: 'Sans Bold', size: 13, variable: '{{cert_id}}' },
  title:          { label: 'Cert Title', font: 'Playfair Display', size: 64 },
  certify:        { label: 'Certify Text', font: 'Playfair Italic', size: 16 },
  'student-name': { label: 'Student Name', font: 'Great Vibes', size: 72, variable: '{{student_name}}' },
  completed:      { label: 'Completed Text', font: 'Sans Regular', size: 13 },
  'course-name':  { label: 'Course Name', font: 'Sans Bold', size: 24, variable: '{{course_name}}' },
  desc:           { label: 'Description', font: 'Sans Regular', size: 12 },
  signature:      { label: 'Signature', font: 'Great Vibes', size: 36 },
  'center-seal':  { label: 'Center Seal' },
  date:           { label: 'Date', font: 'Sans Bold', size: 15, variable: '{{completion_date}}' },
  verification:   { label: 'QR + Verify Button', variable: '{{verification_link}}' },
  ribbon:         { label: 'Badge & Ribbon' },
  'bottom-bar':   { label: 'Features Bar' },
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
export function CertificateDesigner() {
  const [selectedElement, setSelectedElement] = useState<string | null>('student-name');
  const [activeTab, setActiveTab] = useState('templates');
  const [rightTab, setRightTab] = useState('properties');
  const [zoom, setZoom] = useState(78);
  const [selectedTemplate, setSelectedTemplate] = useState('navy');
  const [downloading, setDownloading] = useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit zoom based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const padding = 24; // padding on mobile
      const availableWidth = width - padding * 2;
      if (availableWidth < 860) {
        const optimalZoom = Math.floor((availableWidth / 860) * 100);
        setZoom(Math.max(30, Math.min(100, optimalZoom)));
      } else {
        setZoom(78); // default desktop zoom
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = templates[selectedTemplate];

  const [contentData, setContentData] = useState({
    student_name: 'Vishwajeet',
    cert_id: 'LAI-2026-05-00248',
    course_name: 'Cloud Computing Essentials',
    completion_date: 'May 25, 2026',
    instructor_name: 'Vishwajeet S.',
    instructor_title: 'Founder & CEO, Learnify AI',
    verification_link: 'https://learnify.ai/verify/LAI-2026-05-00248',
    badge_subtitle: 'has demonstrated the knowledge and skills\nrequired to complete the course.',
  });

  const updateField = (key: string, val: string) =>
    setContentData(d => ({ ...d, [key]: val }));

  /* Shared capture helper — hides selection handles & removes zoom before capture */
  const captureCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const el = certRef.current;
    if (!el) return null;
    // Hide selection chrome + reset scale
    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const prevSelected = selectedElement;
    setSelectedElement(null);
    // Wait one frame for React to remove selection overlay
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    let canvas: HTMLCanvasElement | null = null;
    try {
      canvas = await html2canvas(el, {
        scale: 3, useCORS: true, allowTaint: false,
        backgroundColor: t.certBg, logging: false,
        width: 860, height: 610,
      });
    } catch (err) { console.error('html2canvas error:', err); }
    // Restore transform & selection
    el.style.transform = prevTransform;
    setSelectedElement(prevSelected);
    return canvas;
  }, [selectedElement, t.certBg]);

  /* Download as PNG */
  const handleDownloadPNG = useCallback(async () => {
    setDownloading(true);
    const canvas = await captureCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `certificate-${contentData.student_name.replace(/\s+/g, '_')}-${contentData.cert_id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("Certificate exported successfully as PNG!");
    } else {
      toast.error("Failed to generate image download");
    }
    setDownloading(false);
  }, [captureCanvas, contentData]);

  /* Download as PDF — generates a PDF document and downloads directly */
  const handleDownloadPDF = useCallback(async () => {
    setDownloading(true);
    const canvas = await captureCanvas();
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [860, 610]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 860, 610);
      pdf.save(`certificate-${contentData.student_name.replace(/\s+/g, '_')}-${contentData.cert_id}.pdf`);
      toast.success("Certificate exported successfully as PDF!");
    } else {
      toast.error("Failed to generate PDF");
    }
    setDownloading(false);
  }, [captureCanvas, contentData]);

  const selectedMeta = selectedElement ? elementMeta[selectedElement] : null;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0B1929] text-slate-200 overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-great-vibes { font-family: 'Great Vibes', cursive; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .checkerboard-bg {
          background-color: #e5e7eb;
          background-image: linear-gradient(45deg,#d1d5db 25%,transparent 25%,transparent 75%,#d1d5db 75%,#d1d5db),
                            linear-gradient(45deg,#d1d5db 25%,transparent 25%,transparent 75%,#d1d5db 75%,#d1d5db);
          background-size:20px 20px; background-position:0 0,10px 10px;
        }
        .cert-input:focus { outline: none; background: rgba(0,0,0,0.04); border-radius: 4px; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>

      {/* ── TOP MENU BAR ── */}
      <div className="h-12 bg-[#0B1929] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center font-black text-white text-xs">L</div>
          <span className="text-white font-bold text-sm hidden md:block">Learnify AI</span>
          <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block"/>
          <span className="text-slate-400 text-xs font-medium hidden sm:block">Certificate Designer Pro</span>

          {/* Mobile Side Panel Toggles */}
          <button 
            onClick={() => { setMobileLeftOpen(!mobileLeftOpen); setMobileRightOpen(false); }}
            className={`lg:hidden flex items-center gap-1 px-2 py-1 text-xs font-bold rounded transition-colors ${mobileLeftOpen ? 'bg-teal-900 text-yellow-400' : 'text-slate-300 border border-slate-700'}`}
          >
            <LayoutGrid size={13}/>
            <span className="hidden xs:inline">Templates</span>
          </button>
          <button 
            onClick={() => { setMobileRightOpen(!mobileRightOpen); setMobileLeftOpen(false); }}
            className={`lg:hidden flex items-center gap-1 px-2 py-1 text-xs font-bold rounded transition-colors ${mobileRightOpen ? 'bg-teal-900 text-yellow-400' : 'text-slate-300 border border-slate-700'}`}
          >
            <Palette size={13}/>
            <span className="hidden xs:inline">Properties</span>
          </button>
        </div>
        <div className="flex items-center gap-0.5 hidden md:flex">
          {['File','Edit','View','Insert','Templates','Brand Kit','AI Tools','Resize'].map(m=>(
            <button key={m} className="px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors">{m}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"/>
            <span className="text-[10px] text-slate-400">Autosaved</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white border border-slate-700 hover:bg-slate-800 rounded transition-colors hidden sm:flex">
            <Share2 size={13}/> Share
          </button>
          {/* Download dropdown */}
          <div className="flex items-center gap-1">
            <button onClick={handleDownloadPNG} disabled={downloading}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-[#0B1929] bg-[#D4A843] hover:bg-[#e8c06a] rounded-l transition-colors shadow-[0_0_12px_rgba(212,168,67,0.3)] disabled:opacity-60">
              <Download size={13}/> <span className="hidden sm:inline">{downloading ? 'Exporting...' : 'Export PNG'}</span>
              <span className="sm:hidden">PNG</span>
            </button>
            <button onClick={handleDownloadPDF}
              className="px-2.5 py-1.5 text-xs font-bold text-[#0B1929] bg-[#D4A843] hover:bg-[#e8c06a] rounded-r border-l border-[#b88e35] transition-colors">PDF</button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT TOOL RAIL ── */}
        <div className="w-14 bg-[#0B1929] border-r border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 z-10">
          {[
            { id:'select', icon: MousePointer2, label:'Select' },
            { id:'text',   icon: Type,          label:'Text' },
            { id:'image',  icon: ImageIcon,     label:'Image' },
            { id:'shapes', icon: Square,         label:'Shapes' },
            { id:'magic',  icon: Sparkles,       label:'AI Magic' },
            { id:'vars',   icon: Variable,       label:'Variables' },
            { id:'layers', icon: Layers,         label:'Layers' },
          ].map(tool=>(
            <button key={tool.id}
              className={`p-2.5 rounded-lg transition-colors group relative ${tool.id==='select'?'bg-teal-900 text-yellow-400':'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tool.icon size={17}/>
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {tool.label}
              </div>
            </button>
          ))}
        </div>

        {/* ── LEFT CONTENT PANEL ── */}
        <div className={`w-[276px] bg-slate-900 border-r border-slate-800 flex-col shrink-0 z-20 transition-all duration-200 ${
          mobileLeftOpen 
            ? 'fixed inset-y-0 left-14 top-12 bottom-0 shadow-2xl flex border-r border-slate-800' 
            : 'hidden lg:flex'
        }`}>
          {mobileLeftOpen && (
            <div className="p-2 border-b border-slate-800 flex justify-end lg:hidden shrink-0">
              <button onClick={() => setMobileLeftOpen(false)} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 border border-slate-800 rounded">
                Close ×
              </button>
            </div>
          )}
          {/* Tabs */}
          <div className="flex bg-[#0B1929] px-1 pt-1.5 border-b border-slate-800 shrink-0">
            {[
              { id:'templates', icon: LayoutGrid, label:'Templates' },
              { id:'elements',  icon: Sparkles,   label:'Elements' },
              { id:'text',      icon: Type,        label:'Text' },
              { id:'uploads',   icon: Upload,      label:'Uploads' },
            ].map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-t transition-all ${activeTab===tab.id?'bg-slate-900 text-yellow-400':'text-slate-600 hover:text-slate-300 hover:bg-slate-800/40'}`}>
                <tab.icon size={14}/>
                <span className="text-[8px] uppercase font-bold tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* ─ TEMPLATES TAB ─ */}
            {activeTab==='templates' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Certificate Templates</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">5 active &middot; 5 coming soon</p>
                  </div>
                  <button className="text-[10px] text-yellow-400 hover:text-yellow-300 font-semibold">Browse All</button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {Object.values(templates).map(tmpl=>(
                    <div key={tmpl.id} className="group cursor-pointer" onClick={()=>setSelectedTemplate(tmpl.id)}>
                      <div className={`aspect-[1.41] rounded overflow-hidden border-2 transition-all ${selectedTemplate===tmpl.id?'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.25)]':'border-slate-700 hover:border-slate-500'} relative`}>
                        <img src={tmpl.img} alt={tmpl.label} className="w-full h-full object-cover"/>
                        {selectedTemplate===tmpl.id&&(
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                            <CheckCircle2 size={10} className="text-gray-900"/>
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] font-semibold text-center mt-1.5 ${selectedTemplate===tmpl.id?'text-yellow-400':'text-slate-400 group-hover:text-slate-200'}`}>{tmpl.label}</p>
                    </div>
                  ))}
                </div>
                {/* Coming soon slots */}
                <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-2">Coming Soon</h3>
                <div className="grid grid-cols-2 gap-2">
                  {comingSoon.map(cs=>(
                    <div key={cs.id} className="aspect-[1.41] rounded border border-dashed border-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-slate-500 transition-colors">
                      <div className="w-5 h-5 rounded-full" style={{ background: cs.color }}/>
                      <span className="text-[9px] text-slate-600">{cs.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─ ELEMENTS TAB ─ */}
            {activeTab==='elements' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
                <div>
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Badges & Seals</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {[Award,Star,Shield].map((Icon,i)=>(
                      <div key={i} className="aspect-square bg-slate-800 rounded border border-slate-700 flex items-center justify-center hover:border-yellow-400 cursor-pointer group transition-colors">
                        <Icon size={22} className="text-slate-500 group-hover:text-yellow-400"/>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dividers & Lines</h2>
                  <div className="space-y-2">
                    {['M0 8 H15 L20 2 L25 8 H40','M0 8 Q20 2 40 8','M0 8 H40'].map((d,i)=>(
                      <div key={i} className="h-10 bg-slate-800 rounded border border-slate-700 flex items-center justify-center hover:border-yellow-400 cursor-pointer group transition-colors">
                        <svg width="44" height="16" viewBox="0 0 44 16">
                          <path d={d} stroke="#64748b" strokeWidth="1.5" fill="none" className="group-hover:stroke-yellow-400"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Corner Frames</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {['Bracket','Ornamental','Curved','Minimal'].map(name=>(
                      <div key={name} className="h-14 bg-slate-800 rounded border border-slate-700 flex items-center justify-center hover:border-yellow-400 cursor-pointer group transition-colors text-[9px] text-slate-500 group-hover:text-yellow-400">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─ TEXT TAB ─ */}
            {activeTab==='text' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2.5">
                {[
                  { preview: 'CERTIFICATE', cls: 'font-playfair text-[18px] tracking-[0.15em] font-semibold', label: 'Title – Playfair Display' },
                  { preview: 'Student Name', cls: 'font-great-vibes text-[26px] text-yellow-400', label: 'Name – Great Vibes' },
                  { preview: 'Course Title Bold', cls: 'font-sans text-[14px] font-bold text-slate-200', label: 'Course – Sans Bold' },
                  { preview: 'Body / certify text', cls: 'font-playfair italic text-[13px] text-slate-300', label: 'Italic Body' },
                  { preview: 'LABEL TEXT', cls: 'font-sans text-[9px] tracking-[0.2em] font-bold text-slate-400', label: 'Small Caps' },
                ].map((s,i)=>(
                  <button key={i} className="w-full py-3 px-3 bg-slate-800 border border-slate-700 rounded hover:border-slate-500 text-left transition-colors">
                    <span className={`block mb-1 ${s.cls}`}>{s.preview}</span>
                    <span className="text-[9px] text-slate-600">{s.label}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* ─ UPLOADS TAB ─ */}
            {activeTab==='uploads' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center text-center hover:border-yellow-400 cursor-pointer group transition-colors mb-4">
                  <Upload size={20} className="text-slate-500 group-hover:text-yellow-400 mb-2"/>
                  <p className="text-xs text-slate-300 font-medium">Drag files here</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">SVG, PNG, JPG, GIF</p>
                </div>
                <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-2">Uploaded Assets</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video bg-slate-800 rounded border border-slate-700 flex items-center justify-center p-2 cursor-pointer hover:border-slate-500">
                    <img src="/images/logo.png" alt="Logo" className="object-contain h-full"/>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── CENTER CANVAS AREA ── */}
        <div className="flex-1 checkerboard-bg relative overflow-hidden flex flex-col">
          {/* Canvas toolbar */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-0.5 flex items-center gap-0.5 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={()=>setZoom(v=>Math.max(30,v-10))}>
              <span className="text-[11px] font-semibold text-gray-700 w-10 text-center">{zoom}%</span>
              <ChevronDown size={12} className="text-gray-500"/>
            </div>
            <div className="w-px h-5 bg-gray-200 mx-0.5"/>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={()=>setZoom(v=>Math.max(30,v-10))}><ZoomIn size={14} className="rotate-180"/></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={()=>setZoom(v=>Math.min(150,v+10))}><ZoomIn size={14}/></button>
            <div className="w-px h-5 bg-gray-200 mx-0.5"/>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Undo size={14}/></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Redo size={14}/></button>
            <div className="w-px h-5 bg-gray-200 mx-0.5"/>
            <button className="p-1.5 text-blue-600 bg-blue-50 rounded"><Ruler size={14}/></button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Grid3X3 size={14}/></button>
            <div className="w-px h-5 bg-gray-200 mx-0.5"/>
            <button onClick={()=>setZoom(78)} className="px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-100 rounded">Fit</button>
          </div>

          <div ref={containerRef} className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 md:p-16"
            onClick={()=>setSelectedElement(null)}>
            {/* ─── THE CERTIFICATE ─── */}
            <div
              ref={certRef}
              id="certificate-canvas"
              className="relative w-[860px] h-[610px] rounded-sm shadow-2xl shrink-0 overflow-hidden"
              style={{ background: t.certBg, transform: `scale(${zoom/100})`, transformOrigin: 'center center' }}
            >
              {/* Per-template background decoration */}
              <CertBgDecor t={t}/>

              {/* ── LEFT BADGE + RIBBON ── */}
              <Selectable id="ribbon" selectedId={selectedElement} onSelect={setSelectedElement} className="top-0 left-[68px] w-[110px] h-[240px]">
                <BadgeSeal t={t}/>
              </Selectable>

              {/* ── HEADER: LOGO ── */}
              <Selectable id="logo" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[28px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <img src="/images/logo.png" alt="Learnify AI" className="h-12"/>
                <div className="flex items-center gap-2">
                  <div className="h-px w-12" style={{ background: t.accent }}/>
                  <span className="text-[10px] text-gray-500 tracking-[0.15em] font-semibold">Learn Smarter. Grow Faster.</span>
                  <div className="h-px w-12" style={{ background: t.accent }}/>
                </div>
              </Selectable>

              {/* ── CERT ID ── */}
              <Selectable id="cert-id" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[32px] right-[46px] text-right">
                <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Certificate ID</div>
                <div className="text-[13px] font-bold tracking-wider" style={{ color: t.certIdColor }}>{contentData.cert_id}</div>
                {/* small decorative diamond under cert id */}
                <div className="flex justify-end mt-1.5">
                  <div className="w-1.5 h-1.5 rotate-45" style={{ background: t.accent }}/>
                </div>
              </Selectable>

              {/* ── DIVIDER ORNAMENT (center, below logo) ── */}
              <div className="absolute top-[103px] left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
                <div className="h-px w-24" style={{ background: t.accent, opacity: 0.4 }}/>
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: t.accent }}/>
                <div className="h-px w-24" style={{ background: t.accent, opacity: 0.4 }}/>
              </div>

              {/* ── CERTIFICATE TITLE ── */}
              <Selectable id="title" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[112px] w-full flex flex-col items-center">
                <h1 className="font-playfair tracking-[0.18em] font-semibold leading-none mb-2.5"
                  style={{ color: t.primary, fontSize: 62 }}>CERTIFICATE</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-px w-14 opacity-80" style={{ background: t.accent }}/>
                    <div className="w-1 h-1 rotate-45" style={{ background: t.accent }}/>
                  </div>
                  <span className="tracking-[0.3em] text-[11.5px] font-bold" style={{ color: t.accent }}>OF COMPLETION</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rotate-45" style={{ background: t.accent }}/>
                    <div className="h-px w-14 opacity-80" style={{ background: t.accent }}/>
                  </div>
                </div>
                {/* small diamond ornament */}
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-px w-6 opacity-40" style={{ background: t.accent }}/>
                  <div className="w-1.5 h-1.5 rotate-45" style={{ background: t.accent }}/>
                  <div className="h-px w-6 opacity-40" style={{ background: t.accent }}/>
                </div>
              </Selectable>

              {/* ── CERTIFY TEXT ── */}
              <Selectable id="certify" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[240px] w-full text-center">
                <p className="font-playfair italic text-gray-500" style={{ fontSize: 15 }}>This is to certify that</p>
              </Selectable>

              {/* ── STUDENT NAME with laurel wreaths ── */}
              <Selectable id="student-name" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[262px] w-full flex justify-center items-center gap-2">
                <LaurelLeft color={t.accent} size={34}/>
                <div className="relative">
                  <h2 className="font-great-vibes leading-none whitespace-nowrap" style={{ color: t.nameColor, fontSize: 74 }}>
                    {contentData.student_name}
                  </h2>
                  <div className="absolute bottom-[-4px] left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(to right, transparent, ${t.accent}, transparent)` }}/>
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45" style={{ background: t.accent }}/>
                </div>
                <LaurelRight color={t.accent} size={34}/>
              </Selectable>

              {/* ── HAS COMPLETED ── */}
              <Selectable id="completed" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[378px] w-full text-center">
                <p className="text-gray-500 tracking-wide" style={{ fontSize: 13 }}>has successfully completed the course</p>
              </Selectable>

              {/* ── COURSE NAME ── */}
              <Selectable id="course-name" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[400px] w-full text-center">
                <h3 className="font-bold tracking-[0.03em]" style={{ color: t.primary, fontSize: 23 }}>
                  {contentData.course_name}
                </h3>
              </Selectable>

              {/* ── DESCRIPTION ── */}
              <Selectable id="desc" selectedId={selectedElement} onSelect={setSelectedElement} className="top-[436px] w-full text-center px-[140px]">
                <p className="text-gray-500 leading-relaxed text-center" style={{ fontSize: 11.5 }}>
                  and has demonstrated the knowledge and skills required to complete the course.
                </p>
              </Selectable>

              {/* ── FOOTER ── */}

              {/* Signature */}
              <Selectable id="signature" selectedId={selectedElement} onSelect={setSelectedElement} className="bottom-[72px] left-[78px] w-[185px] text-center">
                <div className="font-great-vibes -rotate-2 mb-0.5" style={{ color: t.nameColor, fontSize: 34 }}>
                  {contentData.instructor_name}
                </div>
                <div className="h-[1px] w-full bg-gray-300 mb-1.5"/>
                <div className="font-bold text-gray-700 text-[11px] tracking-wide uppercase">{contentData.instructor_name}</div>
                <div className="text-[9.5px] text-gray-500 tracking-wider mt-0.5">{contentData.instructor_title}</div>
              </Selectable>

              {/* Center Seal */}
              <Selectable id="center-seal" selectedId={selectedElement} onSelect={setSelectedElement} className="bottom-[46px] left-1/2 -translate-x-1/2">
                <CenterSeal t={t}/>
              </Selectable>

              {/* Date */}
              <Selectable id="date" selectedId={selectedElement} onSelect={setSelectedElement} className="bottom-[72px] right-[240px] w-[145px] text-center">
                <div className="font-bold text-gray-800 mb-1.5 h-9 flex items-end justify-center tracking-wide" style={{ fontSize: 14 }}>
                  {contentData.completion_date}
                </div>
                <div className="h-[1px] w-full bg-gray-300 mb-1.5"/>
                <div className="text-[9.5px] text-gray-500 uppercase tracking-widest font-semibold">Date of Completion</div>
              </Selectable>

              {/* QR Code + Verify Button */}
              <Selectable id="verification" selectedId={selectedElement} onSelect={setSelectedElement} className="bottom-[56px] right-[46px] flex flex-col items-center gap-1.5">
                <QRCodeDisplay url={contentData.verification_link} size={86}/>
                <button className="text-white text-[10px] font-bold px-3 py-1 rounded w-full text-center"
                  style={{ background: t.verifyBg }}>Verify Certificate</button>
              </Selectable>

              {/* ── BOTTOM FEATURES BAR ── */}
              <Selectable id="bottom-bar" selectedId={selectedElement} onSelect={setSelectedElement} className="bottom-0 left-0 right-0 h-[50px]">
                <div className="absolute inset-0 border-t border-gray-200 bg-white/50 flex items-center">
                  {t.features.map((f,i)=>(
                    <React.Fragment key={i}>
                      {i>0&&<div className="h-7 w-px bg-gray-200 shrink-0"/>}
                      <div className="flex-1 flex items-center gap-2 px-3">
                        <div style={{ color: t.primary }} className="shrink-0"><FeatureIcon icon={f.icon} size={13}/></div>
                        <div>
                          <div className="text-[9px] font-bold text-gray-700 leading-tight">{f.title}</div>
                          <div className="text-[8px] text-gray-400 leading-tight">{f.sub}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </Selectable>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={`w-[290px] bg-slate-900 border-l border-slate-800 flex-col shrink-0 z-20 transition-all duration-200 ${
          mobileRightOpen 
            ? 'fixed inset-y-0 right-0 top-12 bottom-0 shadow-2xl flex border-l border-slate-800' 
            : 'hidden lg:flex'
        }`}>
          {mobileRightOpen && (
            <div className="p-2 border-b border-slate-800 flex justify-end lg:hidden shrink-0">
              <button onClick={() => setMobileRightOpen(false)} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 border border-slate-800 rounded">
                Close ×
              </button>
            </div>
          )}
          {/* Tab header */}
          <div className="flex border-b border-slate-800 shrink-0">
            {['properties','content'].map(tab=>(
              <button key={tab} onClick={()=>setRightTab(tab)}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${rightTab===tab?'text-yellow-400 border-b-2 border-yellow-400':'text-slate-500 hover:text-slate-300'}`}>
                {tab==='properties'?'Properties':'Content Manager'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* ─ PROPERTIES ─ */}
            {rightTab==='properties' && (
              <div className="p-4 space-y-5">
                {/* Selected element */}
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Selected Element</div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Type size={10} className="text-blue-400"/>
                    </div>
                    <span className="text-[12px] font-semibold text-white">{selectedMeta?.label ?? 'Nothing selected'}</span>
                  </div>
                </div>

                {selectedMeta?.variable && (
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Variable Binding</div>
                    <div className="bg-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Bound to:</span>
                      <span className="text-[11px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{selectedMeta.variable}</span>
                    </div>
                    <button className="w-full mt-1.5 text-[10px] text-slate-400 hover:text-white border border-dashed border-slate-700 hover:border-slate-500 rounded py-1.5 transition-colors">
                      Change Binding
                    </button>
                  </div>
                )}

                {selectedMeta?.font && (
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Font</div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:border-slate-500">
                      <span className="text-[12px] text-slate-200 font-playfair">{selectedMeta.font}</span>
                      <ChevronDown size={12} className="text-slate-500"/>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 flex-1 flex items-center justify-between cursor-pointer hover:border-slate-500">
                        <span className="text-[11px] text-slate-200">{selectedMeta.size ?? 16}</span>
                        <ChevronDown size={10} className="text-slate-500"/>
                      </div>
                      {['B','I','U'].map(b=>(
                        <button key={b} className={`w-8 h-8 rounded border border-slate-700 text-[11px] font-bold hover:border-slate-500 transition-colors ${b==='B'?'bg-slate-700 text-white':'text-slate-400'}`}>{b}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Color</div>
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded border border-slate-600 cursor-pointer" style={{ background: t.primary }}/>
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-300">
                      {t.primary}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Position & Size</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[['X','430'],['Y','280'],['W','400'],['H','80']].map(([label,val])=>(
                      <div key={label} className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500 font-bold w-3">{label}</span>
                        <span className="text-[11px] text-slate-300">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Alignment</div>
                  <div className="flex gap-1">
                    {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon,i)=>(
                      <button key={i} className={`flex-1 py-1.5 rounded border transition-colors ${i===1?'border-yellow-400/50 bg-yellow-400/10 text-yellow-400':'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}>
                        <Icon size={13} className="mx-auto"/>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template theme switcher */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2.5">Template Theme</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(templates).map(tmpl=>(
                      <button key={tmpl.id} title={tmpl.label} onClick={()=>setSelectedTemplate(tmpl.id)}
                        className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative"
                        style={{ background: tmpl.primary, borderColor: selectedTemplate===tmpl.id?'#D4A843':'#475569', boxShadow: selectedTemplate===tmpl.id?'0 0 10px rgba(212,168,67,0.35)':'none' }}>
                        {selectedTemplate===tmpl.id&&<div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-yellow-400 rounded-full"/></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─ CONTENT MANAGER ─ */}
            {rightTab==='content' && (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Certificate Fields</h3>
                  <div className="space-y-3">
                    {[
                      { key:'student_name', label:'Student Name', icon:'&#128100;', mono: false },
                      { key:'cert_id', label:'Certificate ID', icon:'&#128278;', mono: true },
                      { key:'course_name', label:'Course Name', icon:'&#128218;', mono: false },
                      { key:'completion_date', label:'Completion Date', icon:'&#128197;', mono: false },
                      { key:'instructor_name', label:'Instructor Name', icon:'&#9997;&#65039;', mono: false },
                      { key:'instructor_title', label:'Instructor Title', icon:'&#127991;', mono: false },
                    ].map(f=>(
                      <div key={f.key}>
                        <label className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                        <input
                          value={(contentData as any)[f.key]}
                          onChange={e=>updateField(f.key, e.target.value)}
                          className={`w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-2 text-[12px] focus:border-yellow-400/60 focus:outline-none text-white transition-colors ${f.mono?'font-mono':''}`}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Verification URL</label>
                      <input
                        value={contentData.verification_link}
                        onChange={e=>updateField('verification_link', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-2 text-[10px] font-mono focus:border-yellow-400/60 focus:outline-none text-teal-400 transition-colors"
                      />
                      <p className="text-[9px] text-slate-600 mt-1">QR code updates automatically</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Template Theme</h3>
                  <div className="space-y-2">
                    {Object.values(templates).map(tmpl=>(
                      <button key={tmpl.id} onClick={()=>setSelectedTemplate(tmpl.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${selectedTemplate===tmpl.id?'border-yellow-400/50 bg-yellow-400/5':'border-slate-700 hover:border-slate-600'}`}>
                        <div className="w-6 h-6 rounded-full border-2 border-white/20 shrink-0" style={{ background: tmpl.primary }}/>
                        <span className="text-[11px] font-medium text-slate-200">{tmpl.label}</span>
                        {selectedTemplate===tmpl.id&&<CheckCircle2 size={13} className="text-yellow-400 ml-auto shrink-0"/>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Bulk Generate</h3>
                  <div className="space-y-2">
                    <button className="w-full py-2 px-3 bg-slate-800 border border-dashed border-slate-600 rounded text-[11px] text-slate-400 hover:border-yellow-400/50 hover:text-yellow-400 transition-colors flex items-center gap-2">
                      <Upload size={12}/> Upload CSV File
                    </button>
                    <button className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-400 hover:border-slate-500 transition-colors flex items-center gap-2">
                      <Wand2 size={12}/> Generate All Certificates
                    </button>
                    <div className="flex gap-2">
                      <button onClick={handleDownloadPNG} disabled={downloading}
                        className="flex-1 py-2 px-2 rounded text-[10px] font-bold text-[#0B1929] transition-colors flex items-center gap-1 justify-center disabled:opacity-60"
                        style={{ background: t.accent }}>
                        <Download size={11}/> PNG
                      </button>
                      <button onClick={handleDownloadPDF}
                        className="flex-1 py-2 px-2 rounded text-[10px] font-bold text-white transition-colors flex items-center gap-1 justify-center"
                        style={{ background: t.primary }}>
                        <Download size={11}/> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
