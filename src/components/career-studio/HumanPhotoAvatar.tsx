import { cn } from "@/lib/utils";

interface HumanPhotoAvatarProps {
  photoUrl?: string | null;
  aiSpeaking?: boolean;
  viseme?: string;
  avatarName?: string;
  avatarTitle?: string;
  className?: string;
}

const VISEME_OPENNESS: Record<string, number> = {
  X: 0,
  A: 0.35,
  B: 0.6,
  C: 0.85,
  D: 1,
  E: 0.45,
  O: 0.55,
};

export function HumanPhotoAvatar({
  photoUrl,
  aiSpeaking = false,
  viseme = "X",
  avatarName = "Your Coach",
  avatarTitle = "AI Interviewer",
  className = "w-full h-full",
}: HumanPhotoAvatarProps) {
  const openness = aiSpeaking ? (VISEME_OPENNESS[viseme] ?? 0.5) : 0;
  const mouthW = 26 + openness * 8;
  const mouthH = 4 + openness * 14;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950 flex items-center justify-center">
        {/* Photo / Fallback */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={avatarName}
            className="w-full h-full object-cover"
            style={{
              transformOrigin: "50% 100%",
              animation: aiSpeaking
                ? "human-talk-bob 0.6s ease-in-out infinite"
                : "human-idle-breathe 4s ease-in-out infinite",
            }}
          />
        ) : (
          <div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-3xl shadow-xl"
            style={{ transformOrigin: "50% 100%" }}
          >
            {avatarName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "AI"}
          </div>
        )}

        {/* Soft vignette for cinematic look */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,6,23,0.55))]" />

        {/* Talking mouth overlay when speaking */}
        {aiSpeaking && (
          <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
            <svg
              width="120"
              height="40"
              viewBox="0 0 120 40"
              className="drop-shadow-lg"
              style={{ animation: "mouth-talk 0.18s ease-in-out infinite alternate" }}
            >
              <ellipse
                cx="60"
                cy="20"
                rx={mouthW}
                ry={mouthH}
                fill="rgba(30,41,59,0.92)"
                stroke="rgba(2,6,23,0.6)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}

        {/* Blink eyelids overlay */}
        <div className="absolute inset-x-0 top-1/4 flex justify-center gap-10 pointer-events-none">
          <div
            className="w-8 h-10 rounded-full bg-slate-950"
            style={{ animation: "human-blink 4.2s infinite" }}
          />
          <div
            className="w-8 h-10 rounded-full bg-slate-950"
            style={{ animation: "human-blink 4.2s infinite" }}
          />
        </div>

        {/* Live Speaking / Waving Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white shadow-md z-10">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              aiSpeaking ? "bg-emerald-400 animate-ping" : "bg-indigo-400",
            )}
          />
          <span>{aiSpeaking ? "Speaking & Explaining..." : "Listening & Observing"}</span>
        </div>

        {/* Audio Equalizer Wave when speaking */}
        {aiSpeaking && (
          <div className="absolute bottom-2 inset-x-0 flex items-end justify-center gap-[3px] pointer-events-none h-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="w-[4px] rounded-full bg-indigo-400/80"
                style={{
                  animation: "eq-bounce 0.4s ease-in-out infinite alternate",
                  animationDelay: `${i * 0.045}s`,
                  animationDuration: `${0.3 + (i % 5) * 0.06}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Avatar Identity Footer */}
      <div className="mt-2.5 text-center space-y-0.5">
        <div className="text-xs font-black text-foreground flex items-center justify-center gap-1.5">
          <span>{avatarName}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[9px] font-extrabold border border-indigo-200 dark:border-indigo-800">
            Human AI Coach
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-semibold">{avatarTitle}</p>
      </div>

      <style>{`
        @keyframes human-idle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes human-talk-bob {
          0%, 100% { transform: translateY(0) scale(1.01); }
          50% { transform: translateY(-1.5px) scale(1.02); }
        }
        @keyframes human-blink {
          0%, 94%, 100% { transform: scaleY(0.06); opacity: 0.9; }
          96% { transform: scaleY(1); opacity: 0.95; }
        }
        @keyframes mouth-talk {
          0% { transform: translateY(1px); }
          100% { transform: translateY(-1px); }
        }
        @keyframes eq-bounce {
          0% { height: 3px; }
          100% { height: 20px; }
        }
      `}</style>
    </div>
  );
}
