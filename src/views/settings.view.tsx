import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { saveProfileField } from "@/lib/profile-save.functions";
import {
  Loader2,
  Upload,
  Trash2,
  User as UserIcon,
  Wallet,
  Bell,
  Settings as SettingsIcon,
  Check,
  X,
  Plus,
  IndianRupee,
  CreditCard,
  ArrowDownToLine,
  Globe,
  KeyRound,
  XCircle,
  Building2,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
  Info,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Gamepad2,
  Music2,
} from "lucide-react";
import { SkillBadge, SKILL_LOGOS } from "@/components/SkillBadge";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  processCashfreePayout,
} from "@/lib/payment.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfileBorderClass, PROFILE_BORDERS } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const SKILL_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Command Line",
  "React",
  "Git & GitHub",
  "NumPy",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "Figma",
  "UI/UX",
  "API Design",
];

type SocialLinks = {
  github?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  tiktok?: string;
};
type NotifPrefs = {
  new_subscriber: boolean;
  new_comment: boolean;
  new_sale: boolean;
  email: boolean;
  inapp: boolean;
};
type Payout = {
  method?: "bank" | "upi";
  upi_id?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
};
type Defaults = { price_inr: number; category: string; level: string };

export default function SettingsPage() {
  const { user, hasRole, isAdmin } = useAuth();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");

  /* ── State ── */
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [work, setWork] = useState("");
  const [education, setEducation] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState<string>("");
  const [links, setLinks] = useState<SocialLinks>({});
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [nameColor, setNameColor] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);
  const [bannerSignedUrl, setBannerSignedUrl] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputBanner = useRef<HTMLInputElement>(null);
  const [profileBorder, setProfileBorder] = useState("none");

  /* ── Cartoon Character customization ── */
  const [cartoonOpen, setCartoonOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("avataaars");
  const [seed, setSeed] = useState("Learnify");
  const [savingCartoon, setSavingCartoon] = useState(false);
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState("transparent");
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  const BORDER_OPTIONS = [
    { id: "none", label: "None" },
    ...PROFILE_BORDERS.map((b) => ({ id: b.id, label: b.label })),
  ];

  // Granular customization states
  const [skinColor, setSkinColor] = useState("ffdbb4"); // Default skin
  const [hairGender, setHairGender] = useState<"male" | "female">("male"); // Short vs Long hair filter
  const [hairStyle, setHairStyle] = useState("shortFlat"); // Default hair style
  const [hairColor, setHairColor] = useState("4a3728"); // Default hair color
  const [mouthStyle, setMouthStyle] = useState("default"); // Default mouth
  const [eyesStyle, setEyesStyle] = useState("default"); // Default eyes
  const [clothingStyle, setClothingStyle] = useState("shirtCrewNeck"); // Default clothes
  const [clothingColor, setClothingColor] = useState("3c4f76"); // Default clothes color
  const [accessoriesStyle, setAccessoriesStyle] = useState("none"); // Default accessories
  const [eyebrowsStyle, setEyebrowsStyle] = useState("default"); // Default eyebrows
  const [noseStyle, setNoseStyle] = useState("default"); // Default nose

  const CARTOON_STYLES = [
    { id: "avataaars", label: "Casual Character" },
    { id: "adventurer", label: "Adventurer" },
    { id: "bottts", label: "Robot" },
    { id: "pixel-art", label: "Pixel Art" },
    { id: "fun-emoji", label: "Fun Emoji" },
    { id: "lorelei", label: "Lorelei" },
  ];

  function buildCartoonUrl(overrides: any = {}) {
    const s = {
      selectedStyle,
      seed,
      skinColor,
      hairGender,
      hairStyle,
      hairColor,
      mouthStyle,
      eyesStyle,
      clothingStyle,
      clothingColor,
      accessoriesStyle,
      eyebrowsStyle,
      noseStyle,
      profileBorder,
      avatarBackgroundColor,
      ...overrides,
    };

    const baseUrl = `https://api.dicebear.com/10.x/${s.selectedStyle}/svg?seed=${encodeURIComponent(s.seed)}`;
    let params = "";

    if (s.selectedStyle === "avataaars") {
      params += `&skinColor=${s.skinColor}`;
      if (s.hairStyle === "noHair") {
        params += `&topProbability=0`;
      } else {
        params += `&topVariant=${s.hairStyle}`;
      }
      params += `&hairColor=${s.hairColor}`;

      const mappedMouth =
        {
          default: "default",
          smile: "smile",
          sad: "sad",
          concerned: "concerned",
          disbelief: "disbelief",
          grimace: "grimace",
          scream: "screamOpen",
          tongue: "tongue",
        }[s.mouthStyle as string] || s.mouthStyle;

      const mappedEyes =
        {
          default: "default",
          happy: "happy",
          wink: "wink",
          surprised: "surprised",
          squint: "squint",
          side: "side",
          hearts: "hearts",
          close: "closed",
        }[s.eyesStyle as string] || s.eyesStyle;

      const mappedEyebrows =
        {
          default: "defaultNatural",
          angry: "angryNatural",
          flat: "flatNatural",
          raised: "raisedExcitedNatural",
          sad: "sadConcernedNatural",
          unibrow: "unibrowNatural",
          up: "upDownNatural",
        }[s.eyebrowsStyle as string] || s.eyebrowsStyle;

      const mappedAcc = s.accessoriesStyle === "wayfarer" ? "wayfarers" : s.accessoriesStyle;

      params += `&mouthVariant=${mappedMouth}`;
      params += `&eyesVariant=${mappedEyes}`;
      params += `&eyebrowsVariant=${mappedEyebrows}`;
      params += `&clothesVariant=${s.clothingStyle}`;
      params += `&clothesColor=${s.clothingColor}`;
      if (mappedAcc && mappedAcc !== "none") {
        params += `&accessoriesVariant=${mappedAcc}`;
      } else {
        params += `&accessoriesProbability=0`;
      }
    } else if (s.selectedStyle === "adventurer") {
      params += `&skinColor=${s.skinColor}`;
      params += `&hairColor=${s.hairColor}`;
      if (s.hairStyle === "noHair") {
        params += `&hairProbability=0`;
      } else {
        const hairMap: Record<string, string> = {
          theCaesar: "short01",
          shortFlat: "short02",
          shortRound: "short03",
          shortWaved: "short04",
          shortCurly: "short05",
          shaggyMullet: "short06",
          straight01: "long01",
          straight02: "long02",
          curly: "long03",
          curvy: "long04",
          bob: "long05",
          miaWallace: "long06",
          bun: "long07",
          dreads: "long08",
          bigHair: "long09",
        };
        const mappedHair =
          hairMap[s.hairStyle as string] || (s.hairGender === "male" ? "short01" : "long01");
        params += `&hairVariant=${mappedHair}`;
        params += `&hairProbability=100`;
      }
      const mouthMap: Record<string, string> = {
        default: "variant01",
        smile: "variant02",
        sad: "variant03",
        concerned: "variant04",
        disbelief: "variant05",
        grimace: "variant06",
        scream: "variant07",
        tongue: "variant08",
      };
      params += `&mouthVariant=${mouthMap[s.mouthStyle as string] || "variant01"}`;
      const eyesMap: Record<string, string> = {
        default: "variant01",
        happy: "variant02",
        wink: "variant03",
        surprised: "variant04",
        squint: "variant05",
        side: "variant06",
        hearts: "variant07",
        close: "variant08",
      };
      params += `&eyesVariant=${eyesMap[s.eyesStyle as string] || "variant01"}`;
      const eyebrowsMap: Record<string, string> = {
        default: "variant01",
        angry: "variant02",
        flat: "variant03",
        raised: "variant04",
        sad: "variant05",
        unibrow: "variant06",
        up: "variant07",
      };
      params += `&eyebrowsVariant=${eyebrowsMap[s.eyebrowsStyle as string] || "variant01"}`;
      if (s.accessoriesStyle && s.accessoriesStyle !== "none") {
        const accMap: Record<string, string> = {
          prescription01: "variant01",
          round: "variant02",
          sunglasses: "variant03",
          wayfarer: "variant04",
          kurt: "variant05",
        };
        params += `&glassesVariant=${accMap[s.accessoriesStyle as string] || "variant01"}`;
        params += `&glassesProbability=100`;
      } else {
        params += `&glassesProbability=0`;
      }
    } else if (s.selectedStyle === "bottts") {
      params += `&baseColor=${s.clothingColor}`;
      if (s.hairStyle === "noHair") {
        params += `&topProbability=0`;
      } else {
        const topMap: Record<string, string> = {
          shortFlat: "antenna",
          shortRound: "bulb01",
          shortCurly: "horns",
          shortWaved: "radar",
          theCaesar: "pyramid",
          shaggyMullet: "lights",
          straight01: "pyramid",
          straight02: "antenna",
          curly: "bulb01",
          curvy: "radar",
          bob: "horns",
          miaWallace: "lights",
          bun: "glowingBulb01",
          dreads: "glowingBulb02",
          bigHair: "antennaCrooked",
        };
        params += `&topVariant=${topMap[s.hairStyle as string] || "antenna"}`;
        params += `&topProbability=100`;
      }
      const eyesMap: Record<string, string> = {
        default: "round",
        happy: "happy",
        wink: "bulging",
        surprised: "glow",
        squint: "sensor",
        side: "robocop",
        hearts: "hearts",
        close: "dizzy",
      };
      params += `&eyesVariant=${eyesMap[s.eyesStyle as string] || "round"}`;
      const mouthMap: Record<string, string> = {
        default: "smile01",
        smile: "smile02",
        sad: "grill01",
        concerned: "grill02",
        disbelief: "diagram",
        grimace: "grill03",
        scream: "square01",
        tongue: "bite",
      };
      params += `&mouthVariant=${mouthMap[s.mouthStyle as string] || "smile01"}`;
      params += `&mouthProbability=100`;
      if (s.accessoriesStyle && s.accessoriesStyle !== "none") {
        const sidesMap: Record<string, string> = {
          prescription01: "antenna01",
          round: "round",
          sunglasses: "cables01",
          wayfarer: "cables02",
          kurt: "square",
        };
        params += `&sidesVariant=${sidesMap[s.accessoriesStyle as string] || "antenna01"}`;
        params += `&sidesProbability=100`;
      } else {
        params += `&sidesProbability=0`;
      }
    } else if (s.selectedStyle === "pixel-art") {
      params += `&skinColor=${s.skinColor}`;
      params += `&clothingColor=${s.clothingColor}`;
      params += `&hairColor=${s.hairColor}`;
      if (s.hairStyle === "noHair") {
        params += `&hairProbability=0`;
      } else {
        const hairMap: Record<string, string> = {
          theCaesar: "short01",
          shortFlat: "short02",
          shortRound: "short03",
          shortWaved: "short04",
          shortCurly: "short05",
          shaggyMullet: "short06",
          straight01: "long01",
          straight02: "long02",
          curly: "long03",
          curvy: "long04",
          bob: "long05",
          miaWallace: "long06",
          bun: "long07",
          dreads: "long08",
          bigHair: "long09",
        };
        params += `&hairVariant=${hairMap[s.hairStyle as string] || (s.hairGender === "male" ? "short01" : "long01")}`;
        params += `&hairProbability=100`;
      }
      const eyesMap: Record<string, string> = {
        default: "variant01",
        happy: "variant02",
        wink: "variant03",
        surprised: "variant04",
        squint: "variant05",
        side: "variant06",
        hearts: "variant07",
        close: "variant08",
      };
      params += `&eyesVariant=${eyesMap[s.eyesStyle as string] || "variant01"}`;
      const mouthMap: Record<string, string> = {
        default: "happy01",
        smile: "happy02",
        sad: "sad01",
        concerned: "sad02",
        disbelief: "sad03",
        grimace: "sad04",
        scream: "happy05",
        tongue: "happy06",
      };
      params += `&mouthVariant=${mouthMap[s.mouthStyle as string] || "happy01"}`;
      const clothingMap: Record<string, string> = {
        shirtCrewNeck: "variant01",
        shirtVNeck: "variant02",
        hoodie: "variant03",
        collarAndSweater: "variant04",
        blazerAndShirt: "variant05",
        overall: "variant06",
        graphicShirt: "variant07",
      };
      params += `&clothesVariant=${clothingMap[s.clothingStyle as string] || "variant01"}`;
      if (s.accessoriesStyle && s.accessoriesStyle !== "none") {
        const accMap: Record<string, string> = {
          prescription01: "light01",
          round: "light02",
          sunglasses: "dark01",
          wayfarer: "dark02",
          kurt: "dark03",
        };
        params += `&glassesVariant=${accMap[s.accessoriesStyle as string] || "light01"}`;
        params += `&glassesProbability=100`;
      } else {
        params += `&glassesProbability=0`;
      }
    } else if (s.selectedStyle === "fun-emoji") {
      params += `&backgroundColor=${s.clothingColor}`;
      const eyesMap: Record<string, string> = {
        default: "plain",
        happy: "cute",
        wink: "wink",
        surprised: "stars",
        squint: "pissed",
        side: "shades",
        hearts: "love",
        close: "closed",
      };
      params += `&eyesVariant=${eyesMap[s.eyesStyle as string] || "plain"}`;
      const mouthMap: Record<string, string> = {
        default: "plain",
        smile: "wideSmile",
        sad: "sad",
        concerned: "shy",
        disbelief: "pissed",
        grimace: "sick",
        scream: "shout",
        tongue: "tongueOut",
      };
      params += `&mouthVariant=${mouthMap[s.mouthStyle as string] || "plain"}`;
    } else if (s.selectedStyle === "lorelei") {
      params += `&skinColor=${s.skinColor}`;
      params += `&hairColor=${s.hairColor}`;
      params += `&clothingColor=${s.clothingColor}`;
      const hairMap: Record<string, string> = {
        theCaesar: "variant01",
        shortFlat: "variant02",
        shortRound: "variant03",
        shortWaved: "variant04",
        shortCurly: "variant05",
        shaggyMullet: "variant06",
        noHair: "variant48",
        straight01: "variant10",
        straight02: "variant11",
        curly: "variant12",
        curvy: "variant13",
        bob: "variant14",
        miaWallace: "variant15",
        bun: "variant16",
        dreads: "variant17",
        bigHair: "variant18",
      };
      params += `&hairVariant=${hairMap[s.hairStyle as string] || "variant01"}`;
      const eyesMap: Record<string, string> = {
        default: "variant01",
        happy: "variant02",
        wink: "variant03",
        surprised: "variant04",
        squint: "variant05",
        side: "variant06",
        hearts: "variant07",
        close: "variant08",
      };
      params += `&eyesVariant=${eyesMap[s.eyesStyle as string] || "variant01"}`;
      const mouthMap: Record<string, string> = {
        default: "happy01",
        smile: "happy02",
        sad: "sad01",
        concerned: "sad02",
        disbelief: "sad03",
        grimace: "sad04",
        scream: "happy05",
        tongue: "happy06",
      };
      params += `&mouthVariant=${mouthMap[s.mouthStyle as string] || "happy01"}`;
      const eyebrowsMap: Record<string, string> = {
        default: "variant01",
        angry: "variant02",
        flat: "variant03",
        raised: "variant04",
        sad: "variant05",
        unibrow: "variant06",
        up: "variant07",
      };
      params += `&eyebrowsVariant=${eyebrowsMap[s.eyebrowsStyle as string] || "variant01"}`;
      if (s.accessoriesStyle && s.accessoriesStyle !== "none") {
        const accMap: Record<string, string> = {
          prescription01: "variant01",
          round: "variant02",
          sunglasses: "variant03",
          wayfarer: "variant04",
          kurt: "variant05",
        };
        params += `&glassesVariant=${accMap[s.accessoriesStyle as string] || "variant01"}`;
        params += `&glassesProbability=100`;
      } else {
        params += `&glassesProbability=0`;
      }
      const noseMap: Record<string, string> = {
        default: "variant01",
        variant02: "variant02",
        variant03: "variant03",
        variant04: "variant04",
        variant05: "variant05",
        variant06: "variant06",
      };
      params += `&noseVariant=${noseMap[s.noseStyle as string] || "variant01"}`;
    }

    if (s.profileBorder && s.profileBorder !== "none") {
      params += `&profile_border=${s.profileBorder}`;
    }

    if (s.avatarBackgroundColor && s.avatarBackgroundColor !== "transparent" && s.selectedStyle !== "fun-emoji") {
      params += `&backgroundColor=${s.avatarBackgroundColor}`;
    }

    return baseUrl + params;
  }

  const currentCartoonUrl = buildCartoonUrl();
  const [previewNonce, setPreviewNonce] = useState(0);
  useEffect(() => {
    setAvatarPreviewError(false);
  }, [currentCartoonUrl]);
  useEffect(() => {
    setPreviewNonce((n) => n + 1);
  }, [currentCartoonUrl]);
  const doSaveField = useServerFn(saveProfileField);

  async function saveCartoonAvatar() {
    if (!user) return;
    setSavingCartoon(true);
    try {
      await doSaveField({ data: { field: "avatar_url", value: currentCartoonUrl } });
      setAvatarSignedUrl(currentCartoonUrl);
      const borderMatch = currentCartoonUrl.match(/[?&]profile_border=([^&]+)/);
      if (borderMatch) setProfileBorder(decodeURIComponent(borderMatch[1]));
      toast.success("Character avatar updated!");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["profile-full"] }),
        qc.invalidateQueries({ queryKey: ["profile-mini"] }),
        qc.invalidateQueries({ queryKey: ["public-profile"] }),
        qc.invalidateQueries({ queryKey: ["profile"] }),
        qc.refetchQueries({ queryKey: ["profile-full"] }),
        qc.refetchQueries({ queryKey: ["profile-mini"] }),
      ]);
      setCartoonOpen(false);
    } catch (e: any) {
      console.error("[Settings] Save error:", e);
      toast.error(e?.message ?? "Failed to save avatar");
    } finally {
      setSavingCartoon(false);
    }
  }

  /* ── Parse existing avatar into cartoon controls ── */
  useEffect(() => {
    if (!cartoonOpen) return;
    const url = profileQ.data?.avatar_url;
    if (!url || !url.includes("api.dicebear.com")) return;
    try {
      const u = new URL(url);
      const pathParts = u.pathname.split("/");
      const styleFromUrl = pathParts.find((p) => CARTOON_STYLES.some((s) => s.id === p));
      if (styleFromUrl) setSelectedStyle(styleFromUrl);
      const seedVal = u.searchParams.get("seed") || "Learnify";
      setSeed(seedVal);
      if (u.searchParams.has("skinColor")) setSkinColor(u.searchParams.get("skinColor")!);
      // Hair: avataaars uses "top", adventurer/pixel-art/lorelei use "hair"
      // v10.x uses Variant suffix; fall back to v7.x params for backwards compat
      if (u.searchParams.has("topVariant")) setHairStyle(u.searchParams.get("topVariant")!);
      else if (u.searchParams.has("top")) setHairStyle(u.searchParams.get("top")!);
      else if (u.searchParams.has("hair")) setHairStyle(u.searchParams.get("hair")!);
      if (u.searchParams.has("hairColor")) setHairColor(u.searchParams.get("hairColor")!);
      if (u.searchParams.has("mouthVariant")) setMouthStyle(u.searchParams.get("mouthVariant")!);
      else if (u.searchParams.has("mouth")) setMouthStyle(u.searchParams.get("mouth")!);
      if (u.searchParams.has("eyesVariant")) setEyesStyle(u.searchParams.get("eyesVariant")!);
      else if (u.searchParams.has("eyes")) setEyesStyle(u.searchParams.get("eyes")!);
      if (u.searchParams.has("clothesVariant"))
        setClothingStyle(u.searchParams.get("clothesVariant")!);
      else if (u.searchParams.has("clothing"))
        setClothingStyle(u.searchParams.get("clothing")!);
      if (u.searchParams.has("clothesColor"))
        setClothingColor(u.searchParams.get("clothesColor")!);
      else if (u.searchParams.has("clothingColor"))
        setClothingColor(u.searchParams.get("clothingColor")!);
      if (
        u.searchParams.has("accessoriesVariant") ||
        u.searchParams.get("accessoriesProbability") === "0"
      ) {
        setAccessoriesStyle(u.searchParams.get("accessoriesVariant") || "none");
      }
      if (u.searchParams.has("eyebrowsVariant"))
        setEyebrowsStyle(u.searchParams.get("eyebrowsVariant")!);
      else if (u.searchParams.has("eyebrows"))
        setEyebrowsStyle(u.searchParams.get("eyebrows")!);
      if (u.searchParams.has("noseVariant")) setNoseStyle(u.searchParams.get("noseVariant")!);
      else if (u.searchParams.has("nose")) setNoseStyle(u.searchParams.get("nose")!);
      // Hair gender: detect from available hair options
      const hairVal = u.searchParams.get("topVariant") || u.searchParams.get("top") || u.searchParams.get("hair") || "";
      const femaleHair = ["long", "longBob", "bun", "pigtails", "ponytail", "braids"];
      if (femaleHair.some((h) => hairVal.toLowerCase().includes(h.toLowerCase()))) {
        setHairGender("female");
      }
      if (u.searchParams.has("profile_border"))
        setProfileBorder(u.searchParams.get("profile_border")!);
      if (u.searchParams.has("backgroundColor")) {
        setAvatarBackgroundColor(u.searchParams.get("backgroundColor")!);
      } else {
        setAvatarBackgroundColor("transparent");
      }
    } catch {}
  }, [cartoonOpen]);

  function randomizeSeed() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    for (let i = 0; i < 8; i++) res += chars[Math.floor(Math.random() * chars.length)];
    setSeed(res);
  }

  function randomizeAllFeatures() {
    const style = CARTOON_STYLES[Math.floor(Math.random() * CARTOON_STYLES.length)].id;
    setSelectedStyle(style);

    const borderPool = BORDER_OPTIONS.filter((b) => b.id !== "none");
    const border = borderPool[Math.floor(Math.random() * borderPool.length)].id;
    setProfileBorder(border);

    const newSeed = Math.random().toString(36).substring(2, 10);
    setSeed(newSeed);

    const skins = ["ffdbb4", "edb98a", "fd9841", "d08b5b", "ae5d29", "614335"];
    setSkinColor(skins[Math.floor(Math.random() * skins.length)]);

    const hairColors = ["2c1b18", "4a3728", "724124", "b58143", "c93305", "ecdcbf", "f59797"];
    setHairColor(hairColors[Math.floor(Math.random() * hairColors.length)]);

    const clothColors = [
      "262e3d",
      "3c4f76",
      "a7e0e2",
      "92b558",
      "e53935",
      "ffb300",
      "6f2da8",
      "e2b4bd",
      "5c6f68",
    ];
    setClothingColor(clothColors[Math.floor(Math.random() * clothColors.length)]);

    const bgColors = [
      "transparent",
      "b6e3f4",
      "c0aede",
      "d1d4f9",
      "ffd5dc",
      "ffdfb4",
      "c9f2c9",
      "f3f4f6",
      "ffd000",
    ];
    setAvatarBackgroundColor(bgColors[Math.floor(Math.random() * bgColors.length)]);

    const maleHairs = [
      "theCaesar",
      "shortFlat",
      "shortRound",
      "shortWaved",
      "shortCurly",
      "shaggyMullet",
      "noHair",
    ];
    const femaleHairs = [
      "straight01",
      "straight02",
      "curly",
      "curvy",
      "bob",
      "miaWallace",
      "bun",
      "dreads",
      "bigHair",
    ];
    const isMale = Math.random() > 0.5;
    setHairGender(isMale ? "male" : "female");
    setHairStyle(
      isMale
        ? maleHairs[Math.floor(Math.random() * maleHairs.length)]
        : femaleHairs[Math.floor(Math.random() * femaleHairs.length)],
    );

    const eyes = ["default", "happy", "wink", "surprised", "squint", "side", "hearts", "close"];
    setEyesStyle(eyes[Math.floor(Math.random() * eyes.length)]);

    const mouths = [
      "default",
      "smile",
      "sad",
      "concerned",
      "disbelief",
      "grimace",
      "scream",
      "tongue",
    ];
    setMouthStyle(mouths[Math.floor(Math.random() * mouths.length)]);

    const accessories = ["none", "prescription01", "round", "sunglasses", "wayfarer", "kurt"];
    setAccessoriesStyle(accessories[Math.floor(Math.random() * accessories.length)]);

    const clothes = [
      "shirtCrewNeck",
      "shirtVNeck",
      "hoodie",
      "collarAndSweater",
      "blazerAndShirt",
      "overall",
      "graphicShirt",
    ];
    setClothingStyle(clothes[Math.floor(Math.random() * clothes.length)]);

    toast.success("Randomized all features!");
  }

  async function removeOldBanner(old: string | null, newPath?: string) {
    if (!old) return;
    try {
      const bucketBase = supabase.storage.from("avatars").getPublicUrl("").data.publicUrl;
      if (old.startsWith(bucketBase)) {
        const oldPath = old.replace(bucketBase + (bucketBase.endsWith("/") ? "" : "/"), "");
        if (oldPath && oldPath !== newPath)
          await supabase.storage.from("avatars").remove([oldPath]);
      } else if (!old.startsWith("http") && old !== newPath) {
        await supabase.storage.from("avatars").remove([old]);
      }
    } catch {
      /* non-blocking — old file removal should never break upload */
    }
  }

  async function handleBannerUpload(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB");
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    setUploadingBanner(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/cover-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const publicUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      setBannerSignedUrl(publicUrl);
      await removeOldBanner(profileQ.data?.banner_url ?? null, path);
      await doSaveField({ data: { field: "banner_url", value: publicUrl } });
      toast.success("Cover image updated");
      qc.invalidateQueries({ queryKey: ["profile-full"] });
      qc.invalidateQueries({ queryKey: ["public-profile"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.refetchQueries({ queryKey: ["profile-full"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploadingBanner(false);
    }
  }

  async function removeBanner() {
    if (!user) return;
    await removeOldBanner(profileQ.data?.banner_url ?? null);
    try {
      await doSaveField({ data: { field: "banner_url", value: null } });
    } catch (e: any) {
      return toast.error(e?.message || "Failed to remove cover image");
    }
    setBannerSignedUrl(null);
    toast.success("Cover image removed");
    qc.invalidateQueries({ queryKey: ["profile-full"] });
    qc.invalidateQueries({ queryKey: ["public-profile"] });
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.refetchQueries({ queryKey: ["profile-full"] });
  }

  const [prefs, setPrefs] = useState<NotifPrefs>({
    new_subscriber: true,
    new_comment: true,
    new_sale: true,
    email: true,
    inapp: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const [payout, setPayout] = useState<Payout>({ method: "bank" });
  const [defaults, setDefaults] = useState<Defaults>({
    price_inr: 0,
    category: "General",
    level: "Beginner",
  });
  const [savingExtra, setSavingExtra] = useState(false);

  // Branding (Team / admin)
  const [orgName, setOrgName] = useState("");
  const [orgLogoUrl, setOrgLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [invCompanyName, setInvCompanyName] = useState("");
  const [invLegalName, setInvLegalName] = useState("");
  const [invGstin, setInvGstin] = useState("");
  const [invPrefix, setInvPrefix] = useState("INV");
  const [invFooter, setInvFooter] = useState("");
  const [invLogoUrl, setInvLogoUrl] = useState("");
  const [invContact, setInvContact] = useState("");
  const [savingBranding, setSavingBranding] = useState(false);

  // Wallet
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmt, setTopupAmt] = useState("500");
  const [topupSubmitting, setTopupSubmitting] = useState(false);
  const createOrder = useServerFn(createCashfreeOrder);
  const verifyTopup = useServerFn(verifyCashfreePayment);
  const processPayout = useServerFn(processCashfreePayout);
  const [wdOpen, setWdOpen] = useState(false);
  const [wdAmt, setWdAmt] = useState("500");
  const [wdMethod, setWdMethod] = useState<"bank" | "upi">("upi");
  const [wdDest, setWdDest] = useState("");
  const [wdSubmitting, setWdSubmitting] = useState(false);

  const topupPresets = [200, 500, 1000, 2500, 5000, 10000];

  /* ── Queries ── */
  const profileQ = useQuery({
    enabled: !!user,
    queryKey: ["profile-full", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 0,
  });

  const walletQ = useQuery({
    enabled: !!user,
    queryKey: ["wallet-tx", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, amount_inr, type, status, description, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const subQ = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_subscriptions")
        .select(
          "id, plan_id, status, current_period_start, current_period_end, pricing_plans(name, interval, price_inr)",
        )
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const payoutDestQ = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["payout-dest", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("payout_destination")
        .eq("id", user!.id)
        .maybeSingle();
      return (data?.payout_destination ?? null) as Payout | null;
    },
  });

  const wdHistoryQ = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_withdrawals")
        .select("id, amount_inr, method, status, created_at, admin_notes, destination")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  /* ── Hydrate state from profile ── */
  useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setUsername(p.username ?? "");
    setBio(p.bio ?? "");
    setLocation(p.location ?? "");
    setWork(p.work ?? "");
    setEducation(p.education ?? "");
    setWebsite(p.website ?? "");
    setSkills(p.skills ?? []);
    setLinks((p.social_links ?? {}) as SocialLinks);
    setNameColor((p as any).name_color ?? "");
    setPrefs((prev) => ({ ...prev, ...((p.notif_prefs ?? {}) as Partial<NotifPrefs>) }));
    setPayout((p.payout_destination ?? { method: "bank" }) as Payout);
    setDefaults(
      (p.default_course_settings ?? {
        price_inr: 0,
        category: "General",
        level: "Beginner",
      }) as Defaults,
    );
    setOrgName(p.org_name ?? "");
    setOrgLogoUrl(p.org_logo_url ?? "");
    setBrandColor(p.brand_color ?? "#7c3aed");
    setInvCompanyName(p.invoice_company_name ?? "");
    setInvLegalName(p.invoice_legal_name ?? "");
    setInvGstin(p.invoice_gstin ?? "");
    setInvPrefix(p.invoice_prefix ?? "INV");
    setInvFooter(p.invoice_footer ?? "");
    setInvLogoUrl(p.invoice_logo_url ?? "");
    setInvContact(p.invoice_contact ?? "");
  }, [profileQ.data]);

  useEffect(() => {
    const path = profileQ.data?.avatar_url;
    if (!path) {
      setAvatarSignedUrl(null);
      setProfileBorder("none");
      return;
    }
    const borderMatch = path.match(/[?&]profile_border=([^&]+)/);
    if (borderMatch) {
      setProfileBorder(decodeURIComponent(borderMatch[1]));
    } else {
      setProfileBorder("none");
    }

    if (path.startsWith("http")) {
      setAvatarSignedUrl(path);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarSignedUrl(data.publicUrl);
  }, [profileQ.data?.avatar_url]);

  useEffect(() => {
    const path = profileQ.data?.banner_url;
    if (!path) {
      setBannerSignedUrl(null);
      return;
    }
    if (path.startsWith("http") && !path.includes("supabase.co")) {
      setBannerSignedUrl(path);
      return;
    }
    if (path.includes("supabase.co")) {
      setBannerSignedUrl(path);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setBannerSignedUrl(data.publicUrl);
    }
  }, [profileQ.data?.banner_url]);

  useEffect(() => {
    if (profileQ.data) {
      setShowBanner(profileQ.data.show_banner ?? true);
    }
  }, [profileQ.data]);

  /* ── Username availability ── */
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user!.id)
        .maybeSingle();
      setUsernameAvailable(!data);
      setUsernameChecking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [username, user?.id]);

  /* ── Profile save ── */
  async function saveProfile() {
    if (!user) return;
    if (!fullName.trim()) return toast.error("Name cannot be empty");
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        work: work.trim() || null,
        education: education.trim() || null,
        website: website.trim() || null,
        skills: skills.length ? skills : [],
        social_links: links,
        name_color: nameColor || null,
        show_banner: profileQ.data?.show_banner ?? true,
      } as any)
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["profile-full"] }),
      qc.refetchQueries({ queryKey: ["profile-full"] }),
    ]);
  }

  /* ── Avatar ── */
  async function handleAvatarUpload(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB");
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const publicUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      const old = profileQ.data?.avatar_url;
      if (old) {
        const bucketBase = supabase.storage.from("avatars").getPublicUrl("").data.publicUrl;
        if (old.startsWith(bucketBase)) {
          const oldPath = old.replace(bucketBase + (bucketBase.endsWith("/") ? "" : "/"), "");
          if (oldPath && oldPath !== path) await supabase.storage.from("avatars").remove([oldPath]);
        } else if (!old.startsWith("http") && old !== path) {
          await supabase.storage.from("avatars").remove([old]);
        }
      }
      const finalUrl =
        profileBorder && profileBorder !== "none"
          ? `${publicUrl}?profile_border=${profileBorder}`
          : publicUrl;
      try {
        await doSaveField({ data: { field: "avatar_url", value: finalUrl } });
      } catch (e: any) {
        return toast.error(e?.message || "Failed to save photo");
      }
      toast.success("Photo updated");
      qc.invalidateQueries({ queryKey: ["profile-full"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    if (!user) return;
    const old = profileQ.data?.avatar_url;
    if (old) {
      const bucketBase = supabase.storage.from("avatars").getPublicUrl("").data.publicUrl;
      if (old.startsWith(bucketBase)) {
        const oldPath = old.replace(bucketBase + (bucketBase.endsWith("/") ? "" : "/"), "");
        if (oldPath) await supabase.storage.from("avatars").remove([oldPath]);
      } else if (!old.startsWith("http")) {
        await supabase.storage.from("avatars").remove([old]);
      }
    }
    try {
      await doSaveField({ data: { field: "avatar_url", value: null } });
    } catch (e: any) {
      return toast.error(e?.message || "Failed to remove photo");
    }
    toast.success("Photo removed");
    qc.invalidateQueries({ queryKey: ["profile-full"] });
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  /* ── Password ── */
  async function changePassword() {
    if (!user?.email) return;
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    setPwdSaving(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPwd,
    });
    if (signErr) {
      setPwdSaving(false);
      return toast.error("Current password is incorrect");
    }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    toast.success("Password updated");
  }

  /* ── Notifications save ── */
  async function saveNotifs() {
    if (!user) return;
    setSavingNotifs(true);
    try {
      await doSaveField({ data: { field: "notif_prefs", value: prefs } });
      toast.success("Notification preferences saved");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save notification preferences");
    }
    setSavingNotifs(false);
  }

  /* ── Extra settings save (payout + defaults) ── */
  async function saveExtra() {
    if (!user) return;
    setSavingExtra(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        payout_destination: payout,
        default_course_settings: defaults,
      })
      .eq("id", user.id);
    setSavingExtra(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  /* ── Wallet topup ── */
  async function submitTopup() {
    const n = Number(topupAmt);
    if (!n || n < 50 || n > 100000) return toast.error("Amount between ₹50 and ₹100,000");
    setTopupSubmitting(true);
    try {
      const order = await createOrder({ data: { amountInr: n } });
      await loadCashfree();
      const cf = new (window as any).Cashfree({ mode: "production" });
      cf.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_modal",
      }).then(async (result: any) => {
        if (result.error) {
          toast.error(result.error.message);
          setTopupSubmitting(false);
          return;
        }
        if (result.payment?.payment_status === "PAID") {
          await verifyTopup({
            data: {
              amountInr: n,
              method: "online",
              cashfree_order_id: order.order_id,
            },
          });
          toast.success(`₹${n.toLocaleString("en-IN")} added to wallet`);
          qc.invalidateQueries({ queryKey: ["wallet-tx"] });
          setTopupOpen(false);
        }
        setTopupSubmitting(false);
      });
    } catch (err: any) {
      toast.error(err.message || "Top-up failed");
      setTopupSubmitting(false);
    }
  }

  /* ── Withdraw ── */
  function autofillWd(m: "bank" | "upi") {
    const p = payoutDestQ.data;
    if (!p) return "";
    if (m === "upi") return p.upi_id ?? "";
    return [p.account_name, p.account_number, p.ifsc].filter(Boolean).join(" · ");
  }
  useEffect(() => {
    if (!wdOpen) return;
    setWdMethod(payoutDestQ.data?.method ?? "upi");
    setWdDest(autofillWd(payoutDestQ.data?.method ?? "upi"));
  }, [wdOpen, payoutDestQ.data]);

  async function submitWd() {
    if (!user) return;
    const n = Number(wdAmt);
    if (!n || n < 100) return toast.error("Minimum withdrawal is ₹100");
    if (n > balance) return toast.error("Insufficient balance");
    if (!wdDest.trim()) return toast.error("Destination required");
    setWdSubmitting(true);
    try {
      await processPayout({ data: { amountInr: n, method: wdMethod, destination: wdDest.trim() } });
      toast.success("Withdrawal processed");
      setWdOpen(false);
      qc.invalidateQueries({ queryKey: ["withdrawals"] });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setWdSubmitting(false);
    }
  }

  /* ── Computed ── */
  const balance = (walletQ.data ?? [])
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);

  const initials = (profileQ.data?.full_name ?? user?.email ?? "U")
    .toString()
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isPhone = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Settings</div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            Your account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Profile, billing, notifications, and security.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            className={`${isPhone ? "grid grid-cols-2" : isAdmin ? "grid grid-cols-5" : "grid grid-cols-4"} w-full md:w-auto`}
          >
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4" />
              <span className="ml-1.5">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Wallet className="h-4 w-4" />
              <span className="ml-1.5">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              <span className="ml-1.5">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="h-4 w-4" />
              <span className="ml-1.5">Settings</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="branding">
                <Building2 className="h-4 w-4" />
                <span className="ml-1.5">Branding</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* ═══ PROFILE ═══ */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <h2 className="font-display font-semibold flex items-center gap-2 text-lg">
                  <UserIcon className="h-4.5 w-4.5 text-primary" /> Profile Settings
                </h2>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 rounded-full hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <Link to="/u/$id" params={{ id: user?.id ?? "" }}>
                    <ExternalLink className="h-3.5 w-3.5" /> View Public Profile
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Avatar
                  className={cn(
                    "h-24 w-24 border-4 border-card shadow-md shrink-0",
                    getProfileBorderClass(avatarSignedUrl),
                  )}
                >
                  {avatarSignedUrl ? <AvatarImage src={avatarSignedUrl} /> : null}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatarUpload(f);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload photo
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => setCartoonOpen(true)}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Customize
                    Character
                  </Button>
                  {profileQ.data?.avatar_url ? (
                    <Button size="sm" type="button" variant="outline" onClick={removeAvatar}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                  <p className="w-full text-[10px] text-muted-foreground text-center sm:text-left">
                    Recommended 1:1 ratio &lt; 5 MB
                  </p>
                </div>
              </div>

              {/* Profile Border Customization */}
              <div className="grid gap-2 border bg-card/40 p-4 rounded-xl">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Profile Border Style
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={profileBorder}
                    onValueChange={async (val) => {
                      setProfileBorder(val);
                      const currentUrl = profileQ.data?.avatar_url;
                      // Build the new URL with border
                      let nextUrl = "";
                      if (currentUrl) {
                        if (currentUrl.includes("api.dicebear.com")) {
                          const urlObj = new URL(currentUrl);
                          if (val === "none") urlObj.searchParams.delete("profile_border");
                          else urlObj.searchParams.set("profile_border", val);
                          nextUrl = urlObj.toString();
                        } else {
                          const baseUrl = currentUrl.split(/[?#]/)[0];
                          nextUrl = val === "none" ? baseUrl : `${baseUrl}?profile_border=${val}`;
                        }
                      } else {
                        // No avatar yet — create a default DiceBear avatar with border
                        const defaultUrl = new URL("https://api.dicebear.com/10.x/avataaars/svg");
                        defaultUrl.searchParams.set("seed", seed || "Learnify");
                        defaultUrl.searchParams.set("backgroundColor", "transparent");
                        if (val !== "none") defaultUrl.searchParams.set("profile_border", val);
                        nextUrl = defaultUrl.toString();
                      }
                      try {
                        await doSaveField({ data: { field: "avatar_url", value: nextUrl } });
                      } catch (e: any) {
                        return toast.error(e?.message || "Failed to update border");
                      }
                      await Promise.all([
                        qc.invalidateQueries({ queryKey: ["profile-full"] }),
                        qc.invalidateQueries({ queryKey: ["profile-mini"] }),
                        qc.invalidateQueries({ queryKey: ["profile"] }),
                        qc.refetchQueries({ queryKey: ["profile-full"] }),
                        qc.refetchQueries({ queryKey: ["profile-mini"] }),
                      ]);
                      toast.success("Profile border updated!");
                    }}
                  >
                    <SelectTrigger className="w-48 text-xs">
                      <SelectValue placeholder="Select a border" />
                    </SelectTrigger>
                    <SelectContent>
                      {BORDER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={async () => {
                      const avail = BORDER_OPTIONS.filter((b) => b.id !== "none");
                      const rand = avail[Math.floor(Math.random() * avail.length)].id;
                      setProfileBorder(rand);
                      const currentUrl = profileQ.data?.avatar_url;
                      let nextUrl = "";
                      if (currentUrl) {
                        if (currentUrl.includes("api.dicebear.com")) {
                          const urlObj = new URL(currentUrl);
                          urlObj.searchParams.set("profile_border", rand);
                          nextUrl = urlObj.toString();
                        } else {
                          const baseUrl = currentUrl.split(/[?#]/)[0];
                          nextUrl = `${baseUrl}?profile_border=${rand}`;
                        }
                      } else {
                        const defaultUrl = new URL("https://api.dicebear.com/10.x/avataaars/svg");
                        defaultUrl.searchParams.set("seed", seed || "Learnify");
                        defaultUrl.searchParams.set("backgroundColor", "transparent");
                        defaultUrl.searchParams.set("profile_border", rand);
                        nextUrl = defaultUrl.toString();
                      }
                      try {
                        await doSaveField({ data: { field: "avatar_url", value: nextUrl } });
                      } catch (e: any) {
                        return toast.error(e?.message || "Failed to randomize border");
                      }
                      await Promise.all([
                        qc.invalidateQueries({ queryKey: ["profile-full"] }),
                        qc.invalidateQueries({ queryKey: ["profile-mini"] }),
                        qc.invalidateQueries({ queryKey: ["profile"] }),
                        qc.refetchQueries({ queryKey: ["profile-full"] }),
                        qc.refetchQueries({ queryKey: ["profile-mini"] }),
                      ]);
                      toast.success("Randomized profile border!");
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Randomize Border
                  </Button>
                </div>
              </div>

              {/* Cover Image (Banner) */}
              <div className="space-y-3 border bg-card/40 p-4 rounded-xl">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Image (Banner)
                </Label>
                <div className="relative w-full h-32 rounded-xl border bg-muted overflow-hidden flex items-center justify-center group shadow-inner">
                  {bannerSignedUrl ? (
                    <img
                      src={bannerSignedUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground flex flex-col items-center gap-1.5">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/60 animate-pulse" />
                      No cover image set
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputBanner}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleBannerUpload(f);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => fileInputBanner.current?.click()}
                    disabled={uploadingBanner}
                  >
                    {uploadingBanner ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload cover
                  </Button>
                  {profileQ.data?.banner_url ? (
                    <Button size="sm" type="button" variant="outline" onClick={removeBanner}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={(profileQ.data as any)?.show_banner ?? true}
                      onCheckedChange={async (checked) => {
                        await doSaveField({ data: { field: "show_banner", value: checked } });
                        qc.invalidateQueries({ queryKey: ["profile-full"] });
                        qc.invalidateQueries({ queryKey: ["public-profile"] });
                        toast.success(`Cover image ${checked ? "shown" : "hidden"}`);
                      }}
                    />
                    <Label className="text-xs cursor-pointer">Show on profile</Label>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Recommended 3:1 ratio &lt; 5 MB
                  </span>
                </div>
              </div>

              {/* Mouse Cursor Toggle */}
              <div className="flex items-center gap-2 mt-3">
                <Switch
                  checked={(profileQ.data as any)?.mouse_cursor ?? true}
                  onCheckedChange={async (checked) => {
                    await doSaveField({ data: { field: "mouse_cursor", value: checked } });
                    localStorage.setItem("mouse_cursor", String(checked));
                    document.body.dataset.mouseCursor = String(checked);
                    window.dispatchEvent(new CustomEvent("mousecursorchange", { detail: checked }));
                    qc.invalidateQueries({ queryKey: ["profile-full"] });
                    qc.refetchQueries({ queryKey: ["profile-full"] });
                    toast.success(`Mouse cursor: ${checked ? "Animation" : "Normal"}`);
                  }}
                />
                <Label className="text-xs cursor-pointer">Mouse Cursor (Animation)</Label>
              </div>

              {/* Cartoon Character Customization Dialog */}
              <Dialog open={cartoonOpen} onOpenChange={setCartoonOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Customize
                      Your Character
                    </DialogTitle>
                    <DialogDescription>
                      Design your own custom cartoon avatar. Change styles, colors, gender,
                      expressions, and clothing!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                    {/* Left Column: Live Preview & Style Selector */}
                    <div className="md:col-span-5 flex flex-col items-center gap-4 bg-muted/30 p-4 rounded-xl border">
                      {/* Live Preview */}
                      <div className="relative h-40 w-40 rounded-full border-4 border-background bg-card shadow-lg overflow-hidden flex items-center justify-center">
                        {avatarPreviewError ? (
                          <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 grid place-items-center">
                            <span className="text-4xl font-bold text-white">
                              {(seed || "L").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <img
                            key={`avatar-${previewNonce}`}
                            src={currentCartoonUrl}
                            className="h-full w-full object-cover"
                            alt="Avatar Preview"
                            decoding="async"
                            onError={() => setAvatarPreviewError(true)}
                          />
                        )}
                      </div>

                      <div className="w-full space-y-3">
                        {/* Character Style Selection */}
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Art Style
                          </Label>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {CARTOON_STYLES.map((style) => (
                              <button
                                key={style.id}
                                type="button"
                                onClick={() => {
                                  setSelectedStyle(style.id);
                                  // Reset all options to defaults for the new style
                                  setMouthStyle("default");
                                  setEyesStyle("default");
                                  setEyebrowsStyle("default");
                                  setAccessoriesStyle("none");
                                  setClothingStyle("shirtCrewNeck");
                                  setSkinColor("ffdbb4");
                                   setHairColor("4a3728");
                                   setClothingColor("3c4f76");
                                   setAvatarBackgroundColor("transparent");
                                   setNoseStyle("default");
                                  if (style.id === "avataaars") {
                                    setHairGender("male");
                                    setHairStyle("shortFlat");
                                  } else if (style.id === "adventurer") {
                                    setHairGender("male");
                                    setHairStyle("short01");
                                  } else if (style.id === "bottts") {
                                    setHairGender("male");
                                    setHairStyle("shortFlat");
                                  } else if (style.id === "pixel-art") {
                                    setHairGender("male");
                                    setHairStyle("shortFlat");
                                  } else if (style.id === "fun-emoji") {
                                    setHairStyle("shortFlat");
                                  } else if (style.id === "lorelei") {
                                    setHairGender("female");
                                    setHairStyle("straight01");
                                  }
                                  setAvatarPreviewError(false);
                                }}
                                className={`rounded-lg border p-2 text-center text-xs font-medium transition ${
                                  selectedStyle === style.id
                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                    : "border-border hover:bg-muted"
                                }`}
                              >
                                {style.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Seed Input */}
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Base Seed
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={seed}
                              onChange={(e) => setSeed(e.target.value)}
                              placeholder="Type anything to randomize base features..."
                              className="flex-1 text-xs h-9 bg-card"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 text-xs shrink-0"
                              onClick={randomizeSeed}
                            >
                              Randomize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Customization Controls */}
                    <div className="md:col-span-7 flex flex-col">
                      <Tabs defaultValue="face" className="w-full">
                        <TabsList className="w-full grid grid-cols-4">
                          <TabsTrigger value="face" className="text-xs">
                            Face & Hair
                          </TabsTrigger>
                          <TabsTrigger value="expressions" className="text-xs">
                            Expression
                          </TabsTrigger>
                          <TabsTrigger value="clothing" className="text-xs">
                            Clothing
                          </TabsTrigger>
                          <TabsTrigger value="background" className="text-xs">
                            Background
                          </TabsTrigger>
                        </TabsList>

                        {/* Face & Hair Tab */}
                        <TabsContent value="face" className="space-y-4 pt-3">
                          {/* Skin Color Picker */}
                          {(selectedStyle === "avataaars" ||
                            selectedStyle === "adventurer" ||
                            selectedStyle === "pixel-art" ||
                            selectedStyle === "lorelei") && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                Skin Color
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "ffdbb4", color: "#ffdbb4", label: "Very Light" },
                                  { val: "edb98a", color: "#edb98a", label: "Light" },
                                  { val: "fd9841", color: "#fd9841", label: "Tan" },
                                  { val: "d08b5b", color: "#d08b5b", label: "Olive" },
                                  { val: "ae5d29", color: "#ae5d29", label: "Brown" },
                                  { val: "614335", color: "#614335", label: "Dark" },
                                ].map((skin) => (
                                  <button
                                    key={skin.val}
                                    type="button"
                                    onClick={() => setSkinColor(skin.val)}
                                    className={`w-9 h-9 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      skinColor === skin.val
                                        ? "border-primary scale-110 shadow-sm"
                                        : "border-border"
                                    }`}
                                    style={{ backgroundColor: skin.color }}
                                    title={skin.label}
                                  >
                                    {skinColor === skin.val && (
                                      <Check
                                        className={`h-3 w-3 ${skin.val === "ffdbb4" || skin.val === "f8d25c" ? "text-slate-800" : "text-white"}`}
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hair Style selection */}
                          {selectedStyle !== "fun-emoji" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                  {selectedStyle === "bottts" ? "Robot Head Style" : "Hair Style"}
                                </Label>
                                <div className="flex bg-muted rounded-lg p-0.5 text-[10px] font-medium border">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setHairGender("male");
                                      setHairStyle(
                                        selectedStyle === "adventurer" ? "short01" : "shortFlat",
                                      );
                                    }}
                                    className={`px-2 py-0.5 rounded transition ${
                                      hairGender === "male"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {selectedStyle === "bottts" ? "Antenna / Bulb" : "Male / Short"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setHairGender("female");
                                      setHairStyle(
                                        selectedStyle === "adventurer" ? "long01" : "straight01",
                                      );
                                    }}
                                    className={`px-2 py-0.5 rounded transition ${
                                      hairGender === "female"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {selectedStyle === "bottts" ? "Radar / Horn" : "Female / Long"}
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                                {(hairGender === "male"
                                  ? selectedStyle === "bottts"
                                    ? [
                                        { id: "shortFlat", label: "Antenna" },
                                        { id: "shortRound", label: "Bulb" },
                                        { id: "shortCurly", label: "Horn" },
                                        { id: "shortWaved", label: "Radar" },
                                        { id: "theCaesar", label: "Pyramid" },
                                      ]
                                    : [
                                        { id: "theCaesar", label: "Caesar Cut" },
                                        { id: "shortFlat", label: "Short Flat" },
                                        { id: "shortRound", label: "Short Round" },
                                        { id: "shortWaved", label: "Short Wavy" },
                                        { id: "shortCurly", label: "Short Curly" },
                                        { id: "shaggyMullet", label: "Mullet" },
                                        { id: "noHair", label: "Bald" },
                                      ]
                                  : selectedStyle === "bottts"
                                    ? [
                                        { id: "shortFlat", label: "Antenna" },
                                        { id: "shortRound", label: "Bulb" },
                                        { id: "shortCurly", label: "Horn" },
                                        { id: "shortWaved", label: "Radar" },
                                        { id: "theCaesar", label: "Pyramid" },
                                      ]
                                    : [
                                        { id: "straight01", label: "Long Straight" },
                                        { id: "straight02", label: "Straight Parted" },
                                        { id: "curly", label: "Long Curly" },
                                        { id: "curvy", label: "Long Curvy" },
                                        { id: "bob", label: "Bob Cut" },
                                        { id: "miaWallace", label: "Mia Cut" },
                                        { id: "bun", label: "Hair Bun" },
                                        { id: "dreads", label: "Dreads" },
                                        { id: "bigHair", label: "Big Hair" },
                                      ]
                                ).map((hair) => (
                                  <button
                                    key={hair.id}
                                    type="button"
                                    onClick={() => setHairStyle(hair.id)}
                                    className={`rounded-md border p-1 text-center text-[10px] font-medium transition leading-snug truncate ${
                                      hairStyle === hair.id
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:bg-muted"
                                    }`}
                                  >
                                    {hair.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hair Color Picker */}
                          {(selectedStyle === "avataaars" ||
                            selectedStyle === "adventurer" ||
                            selectedStyle === "pixel-art" ||
                            selectedStyle === "lorelei") && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                Hair Color
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "2c1b18", color: "#2c1b18", label: "Black" },
                                  { val: "4a3728", color: "#4a3728", label: "Dark Brown" },
                                  { val: "724124", color: "#724124", label: "Light Brown" },
                                  { val: "b58143", color: "#b58143", label: "Blonde" },
                                  { val: "c93305", color: "#c93305", label: "Auburn" },
                                  { val: "ecdcbf", color: "#ecdcbf", label: "Platinum" },
                                  { val: "f59797", color: "#f59797", label: "Pink" },
                                ].map((hair) => (
                                  <button
                                    key={hair.val}
                                    type="button"
                                    onClick={() => setHairColor(hair.val)}
                                    className={`w-9 h-9 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      hairColor === hair.val
                                        ? "border-primary scale-110 shadow-sm"
                                        : "border-border"
                                    }`}
                                    style={{ backgroundColor: hair.color }}
                                    title={hair.label}
                                  >
                                    {hairColor === hair.val && (
                                      <Check
                                        className={`h-3 w-3 ${hair.val === "ecdcbf" || hair.val === "f59797" ? "text-slate-800" : "text-white"}`}
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        {/* Expressions Tab */}
                        <TabsContent
                          value="expressions"
                          className="space-y-4 pt-3 max-h-[60vh] overflow-y-auto pr-1 pb-4"
                        >
                          {/* Eyebrows Selector */}
                          {(selectedStyle === "avataaars" ||
                            selectedStyle === "adventurer" ||
                            selectedStyle === "lorelei") && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                Eyebrows
                              </Label>
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {[
                                  { id: "default", label: "Default" },
                                  { id: "angry", label: "Angry" },
                                  { id: "flat", label: "Flat" },
                                  { id: "raised", label: "Raised" },
                                  { id: "sad", label: "Sad" },
                                  { id: "unibrow", label: "Unibrow" },
                                  { id: "up", label: "Up" },
                                ].map((eb) => (
                                  <button
                                    key={eb.id}
                                    type="button"
                                    onClick={() => setEyebrowsStyle(eb.id)}
                                    className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${eyebrowsStyle === eb.id ? "border-primary shadow-sm" : "border-border"}`}
                                    title={eb.label}
                                  >
                                    <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img
                                        src={buildCartoonUrl({
                                          eyebrowsStyle: eb.id,
                                          ...(selectedStyle === "avataaars"
                                            ? { hairStyle: "noHair" }
                                            : {}),
                                        })}
                                        className="w-full h-full object-cover scale-[2.5] translate-y-3"
                                        alt={eb.label}
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                    <span className="text-[9px] font-medium truncate w-full text-center">
                                      {eb.label}
                                    </span>
                                    {eyebrowsStyle === eb.id && (
                                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                        <Check className="h-2 w-2" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Eyes Selector */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">
                              Eyes Expression
                            </Label>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                              {[
                                { id: "default", label: "Default" },
                                { id: "happy", label: "Happy" },
                                { id: "wink", label: "Wink" },
                                { id: "surprised", label: "Surprised" },
                                { id: "squint", label: "Squint" },
                                { id: "side", label: "Side Eye" },
                                { id: "hearts", label: "Hearts" },
                                { id: "close", label: "Closed" },
                              ].map((eye) => (
                                <button
                                  key={eye.id}
                                  type="button"
                                  onClick={() => setEyesStyle(eye.id)}
                                  className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${eyesStyle === eye.id ? "border-primary shadow-sm" : "border-border"}`}
                                  title={eye.label}
                                >
                                  <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                      src={buildCartoonUrl({
                                        eyesStyle: eye.id,
                                        ...(selectedStyle === "avataaars"
                                          ? { hairStyle: "noHair" }
                                          : {}),
                                      })}
                                      className="w-full h-full object-cover scale-[2.5] translate-y-2"
                                      alt={eye.label}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>
                                  <span className="text-[9px] font-medium truncate w-full text-center">
                                    {eye.label}
                                  </span>
                                  {eyesStyle === eye.id && (
                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                      <Check className="h-2 w-2" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Nose Selector */}
                          {selectedStyle === "lorelei" && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                Nose
                              </Label>
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {[
                                  { id: "default", label: "Default" },
                                  { id: "variant02", label: "Variant 2" },
                                  { id: "variant03", label: "Variant 3" },
                                  { id: "variant04", label: "Variant 4" },
                                  { id: "variant05", label: "Variant 5" },
                                  { id: "variant06", label: "Variant 6" },
                                ].map((n) => (
                                  <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => setNoseStyle(n.id)}
                                    className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${noseStyle === n.id ? "border-primary shadow-sm" : "border-border"}`}
                                    title={n.label}
                                  >
                                    <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img
                                        src={buildCartoonUrl({ noseStyle: n.id })}
                                        className="w-full h-full object-cover scale-[3] translate-y-1"
                                        alt={n.label}
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                    <span className="text-[9px] font-medium truncate w-full text-center">
                                      {n.label}
                                    </span>
                                    {noseStyle === n.id && (
                                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                        <Check className="h-2 w-2" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mouth Selector */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">
                              Mouth Expression
                            </Label>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                              {[
                                { id: "default", label: "Default" },
                                { id: "smile", label: "Smile" },
                                { id: "sad", label: "Sad" },
                                { id: "concerned", label: "Concerned" },
                                { id: "disbelief", label: "Disbelief" },
                                { id: "grimace", label: "Grimace" },
                                { id: "scream", label: "Scream" },
                                { id: "tongue", label: "Tongue" },
                              ].map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => setMouthStyle(m.id)}
                                  className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${mouthStyle === m.id ? "border-primary shadow-sm" : "border-border"}`}
                                  title={m.label}
                                >
                                  <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                      src={buildCartoonUrl({
                                        mouthStyle: m.id,
                                        ...(selectedStyle === "avataaars"
                                          ? { hairStyle: "noHair" }
                                          : {}),
                                      })}
                                      className="w-full h-full object-cover scale-[2.5] -translate-y-2"
                                      alt={m.label}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>
                                  <span className="text-[9px] font-medium truncate w-full text-center">
                                    {m.label}
                                  </span>
                                  {mouthStyle === m.id && (
                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                      <Check className="h-2 w-2" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Accessories Selector */}
                          {(selectedStyle === "avataaars" ||
                            selectedStyle === "adventurer" ||
                            selectedStyle === "bottts" ||
                            selectedStyle === "pixel-art" ||
                            selectedStyle === "lorelei") && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                {selectedStyle === "bottts"
                                  ? "Robot Side Attachment"
                                  : "Accessories"}
                              </Label>
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {(selectedStyle === "bottts"
                                  ? [
                                      { id: "none", label: "None" },
                                      { id: "prescription01", label: "Antenna" },
                                      { id: "round", label: "Earphones" },
                                      { id: "sunglasses", label: "Cables" },
                                    ]
                                  : [
                                      { id: "none", label: "None" },
                                      { id: "prescription01", label: "Regular" },
                                      { id: "round", label: "Round" },
                                      { id: "sunglasses", label: "Sunglasses" },
                                      { id: "wayfarer", label: "Wayfarer" },
                                      { id: "kurt", label: "Kurt" },
                                    ]
                                ).map((acc) => (
                                  <button
                                    key={acc.id}
                                    type="button"
                                    onClick={() => setAccessoriesStyle(acc.id)}
                                    className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${accessoriesStyle === acc.id ? "border-primary shadow-sm" : "border-border"}`}
                                    title={acc.label}
                                  >
                                    <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img
                                        src={buildCartoonUrl({
                                          accessoriesStyle: acc.id,
                                          ...(selectedStyle === "avataaars"
                                            ? { hairStyle: "noHair" }
                                            : {}),
                                        })}
                                        className="w-full h-full object-cover scale-[2.8] translate-y-1.5"
                                        alt={acc.label}
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                    <span className="text-[9px] font-medium truncate w-full text-center">
                                      {acc.label}
                                    </span>
                                    {accessoriesStyle === acc.id && (
                                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                        <Check className="h-2 w-2" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        {/* Clothing Tab */}
                        <TabsContent
                          value="clothing"
                          className="space-y-4 pt-3 max-h-[60vh] overflow-y-auto pr-1 pb-4"
                        >
                          {/* Clothing Style */}
                          {(selectedStyle === "avataaars" || selectedStyle === "pixel-art") && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                Clothing Style
                              </Label>
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {[
                                  { id: "shirtCrewNeck", label: "Crew Neck" },
                                  { id: "shirtVNeck", label: "V-Neck" },
                                  { id: "hoodie", label: "Hoodie" },
                                  { id: "collarAndSweater", label: "Sweater" },
                                  { id: "blazerAndShirt", label: "Blazer" },
                                  { id: "overall", label: "Overalls" },
                                  { id: "graphicShirt", label: "Graphic Tee" },
                                ].map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setClothingStyle(c.id)}
                                    className={`relative rounded-xl border-2 flex flex-col items-center gap-1 p-1 transition-all overflow-hidden bg-card hover:bg-accent ${clothingStyle === c.id ? "border-primary shadow-sm" : "border-border"}`}
                                    title={c.label}
                                  >
                                    <div className="w-full aspect-square bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img
                                        src={buildCartoonUrl({ clothingStyle: c.id })}
                                        className="w-full h-full object-cover scale-[2.2] -translate-y-[28%]"
                                        alt={c.label}
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                    <span className="text-[9px] font-medium truncate w-full text-center">
                                      {c.label}
                                    </span>
                                    {clothingStyle === c.id && (
                                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                        <Check className="h-2 w-2" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Clothing Color Picker */}
                          {selectedStyle !== "adventurer" && (
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">
                                {selectedStyle === "bottts"
                                  ? "Robot Metal Color"
                                  : selectedStyle === "fun-emoji"
                                    ? "Background Color"
                                    : "Clothing Color"}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "262e3d", color: "#262e3d", label: "Navy" },
                                  { val: "3c4f76", color: "#3c4f76", label: "Blue" },
                                  { val: "a7e0e2", color: "#a7e0e2", label: "Teal" },
                                  { val: "92b558", color: "#92b558", label: "Green" },
                                  { val: "e53935", color: "#e53935", label: "Red" },
                                  { val: "ffb300", color: "#ffb300", label: "Orange" },
                                  { val: "6f2da8", color: "#6f2da8", label: "Purple" },
                                  { val: "e2b4bd", color: "#e2b4bd", label: "Pink" },
                                  { val: "5c6f68", color: "#5c6f68", label: "Gray" },
                                ].map((c) => (
                                  <button
                                    key={c.val}
                                    type="button"
                                    onClick={() => setClothingColor(c.val)}
                                    className={`w-9 h-9 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      clothingColor === c.val
                                        ? "border-primary scale-110 shadow-sm"
                                        : "border-border"
                                    }`}
                                    style={{ backgroundColor: c.color }}
                                    title={c.label}
                                  >
                                    {clothingColor === c.val && (
                                      <Check
                                        className={`h-3 w-3 ${c.val === "a7e0e2" || c.val === "ffb300" || c.val === "e2b4bd" ? "text-slate-800" : "text-white"}`}
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        {/* Background Tab */}
                        <TabsContent value="background" className="space-y-4 pt-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">
                              Character Background Color
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { val: "transparent", color: "transparent", label: "Transparent" },
                                { val: "b6e3f4", color: "#b6e3f4", label: "Sky Blue" },
                                { val: "c0aede", color: "#c0aede", label: "Lavender" },
                                { val: "d1d4f9", color: "#d1d4f9", label: "Pastel Indigo" },
                                { val: "ffd5dc", color: "#ffd5dc", label: "Pastel Pink" },
                                { val: "ffdfb4", color: "#ffdfb4", label: "Peach" },
                                { val: "c9f2c9", color: "#c9f2c9", label: "Mint Green" },
                                { val: "f3f4f6", color: "#f3f4f6", label: "Light Gray" },
                                { val: "ffd000", color: "#ffd000", label: "Yellow" },
                              ].map((bg) => (
                                <button
                                  key={bg.val}
                                  type="button"
                                  onClick={() => setAvatarBackgroundColor(bg.val)}
                                  className={`w-9 h-9 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                    avatarBackgroundColor === bg.val
                                      ? "border-primary scale-110 shadow-sm"
                                      : "border-border"
                                  }`}
                                  style={{
                                    backgroundColor:
                                      bg.color === "transparent" ? undefined : bg.color,
                                    backgroundImage:
                                      bg.color === "transparent"
                                        ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                                        : undefined,
                                    backgroundSize:
                                      bg.color === "transparent" ? "8px 8px" : undefined,
                                    backgroundPosition:
                                      bg.color === "transparent"
                                        ? "0 0, 0 4px, 4px -4px, -4px 0"
                                        : undefined,
                                  }}
                                  title={bg.label}
                                >
                                  {avatarBackgroundColor === bg.val && (
                                    <Check
                                      className={`h-3 w-3 ${bg.val === "transparent" || bg.val === "b6e3f4" || bg.val === "ffdfb4" || bg.val === "c9f2c9" || bg.val === "f3f4f6" || bg.val === "ffd000" ? "text-slate-800" : "text-white"}`}
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <DialogFooter className="border-t pt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={randomizeAllFeatures}
                      className="text-xs h-9 gap-1 mr-auto"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> Randomize
                      All
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setCartoonOpen(false)}
                        className="text-xs h-9"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveCartoonAvatar}
                        disabled={savingCartoon}
                        className="text-xs h-9"
                      >
                        {savingCartoon ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Use Character Avatar
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={120}
                  />
                </Field>
                <Field label="Username *">
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      maxLength={30}
                    />
                    {username.length >= 3 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : usernameAvailable === true ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : usernameAvailable === false ? (
                          <X className="h-4 w-4 text-destructive" />
                        ) : null}
                      </span>
                    )}
                  </div>
                  {usernameAvailable === true && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">Username is available</p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-[10px] text-destructive mt-0.5">Username taken</p>
                  )}
                </Field>
                <Field label="Email">
                  <Input value={user?.email ?? ""} disabled />
                </Field>
                <Field label="Website">
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="India"
                    autoComplete="off"
                  />
                </Field>
                <Field label="Work">
                  <Input
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    placeholder="DreamSync"
                  />
                </Field>
                <Field label="Education">
                  <Input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="BCA"
                  />
                </Field>
              </div>

              <Field label="Bio">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Frontend Developer | UI Enthusiast…"
                />
                <p className="text-[10px] text-muted-foreground">{bio.length}/500</p>
              </Field>

              <Field label="Skills">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SKILL_OPTIONS.map((s) => {
                    const active = skills.includes(s);
                    const iconInfo = SKILL_LOGOS[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setSkills(active ? skills.filter((x) => x !== s) : [...skills, s])
                        }
                        className={`px-2.5 py-1 rounded-full text-xs border transition flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}
                      >
                        {iconInfo?.devicon && (
                          <img
                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconInfo.devicon}`}
                            alt=""
                            className={`w-3.5 h-3.5 object-contain ${active ? "brightness-0 invert" : ""}`}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                        {iconInfo?.lucide && <iconInfo.lucide className="w-3.5 h-3.5" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add custom skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customSkill.trim()) {
                        e.preventDefault();
                        const trimmed = customSkill.trim();
                        if (!skills.includes(trimmed)) {
                          setSkills([...skills, trimmed]);
                        }
                        setCustomSkill("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => {
                      if (customSkill.trim()) {
                        const trimmed = customSkill.trim();
                        if (!skills.includes(trimmed)) {
                          setSkills([...skills, trimmed]);
                        }
                        setCustomSkill("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </Field>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Social media</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(
                    [
                      ["github", "GitHub", "github.com/", <Github key="g" className="h-4 w-4" />],
                      [
                        "twitter",
                        "X (Twitter)",
                        "x.com/",
                        <Twitter key="t" className="h-4 w-4 text-sky-500" />,
                      ],
                      [
                        "linkedin",
                        "LinkedIn",
                        "linkedin.com/in/",
                        <Linkedin key="l" className="h-4 w-4 text-blue-600" />,
                      ],
                      [
                        "instagram",
                        "Instagram",
                        "instagram.com/",
                        <Instagram key="i" className="h-4 w-4 text-pink-500" />,
                      ],
                      [
                        "youtube",
                        "YouTube",
                        "youtube.com/@",
                        <Youtube key="y" className="h-4 w-4 text-red-500" />,
                      ],
                      [
                        "twitch",
                        "Twitch",
                        "twitch.tv/",
                        <Gamepad2 key="tw" className="h-4 w-4 text-purple-500" />,
                      ],
                      ["tiktok", "TikTok", "tiktok.com/@", <Music2 key="tk" className="h-4 w-4" />],
                    ] as const
                  ).map(([key, label, prefix, icon]) => (
                    <Field key={key} label={label}>
                      <div className="relative flex items-center gap-2">
                        <span className="shrink-0">{icon}</span>
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                          {prefix}
                        </span>
                        <Input
                          className="pl-[calc(10ch+1.5rem)]"
                          value={(links as any)[key] ?? ""}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (!value) {
                              setLinks({ ...links, [key]: "" });
                              return;
                            }
                            if (!value.startsWith("https://")) {
                              value = "https://" + value;
                            }
                            const url = new URL(value);
                            if (!url.hostname.startsWith(prefix.replace("https://", ""))) {
                              url.hostname = prefix.replace("https://", "");
                              value = url.toString();
                            }
                            setLinks({ ...links, [key]: value });
                          }}
                          placeholder="https://example.com"
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ═══ BILLING ═══ */}
          <TabsContent value="billing" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" /> Subscription
              </h2>
              {subQ.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : subQ.data ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Plan
                    </div>
                    <div className="mt-1 font-semibold">
                      {(subQ.data as any).pricing_plans?.name ?? "Free"}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Start
                    </div>
                    <div className="mt-1 text-sm">
                      {subQ.data.current_period_start
                        ? format(new Date(subQ.data.current_period_start), "dd MMM yyyy")
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      End
                    </div>
                    <div className="mt-1 text-sm">
                      {subQ.data.current_period_end
                        ? format(new Date(subQ.data.current_period_end), "dd MMM yyyy")
                        : "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active subscription.{" "}
                  <a href="/pricing" className="text-primary hover:underline">
                    View plans
                  </a>
                </p>
              )}
            </div>

            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" /> Wallet
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Available balance
                  </div>
                  <div className="text-3xl font-display font-bold mt-1">{inr(balance)}</div>
                </div>
                <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4" /> Top up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add money to wallet</DialogTitle>
                      <DialogDescription>
                        Top up via Cashfree (card/UPI/netbanking).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5">
                      <Field label="Amount (INR)">
                        <div className="relative">
                          <IndianRupee className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            min={50}
                            max={100000}
                            className="pl-9 text-lg font-semibold h-12"
                            value={topupAmt}
                            onChange={(e) => setTopupAmt(e.target.value)}
                          />
                        </div>
                      </Field>
                      <div className="flex flex-wrap gap-1.5">
                        {topupPresets.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTopupAmt(String(p))}
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${topupAmt === String(p) ? "border-primary bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}`}
                          >
                            ₹{p.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-emerald-800 rounded-lg bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 shrink-0" />
                        Secure payment via Cashfree
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setTopupOpen(false)}
                        disabled={topupSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button onClick={submitTopup} disabled={topupSubmitting}>
                        {topupSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}{" "}
                        Proceed to pay
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">When</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Description</th>
                      <th className="text-right px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(walletQ.data ?? []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      (walletQ.data ?? []).map((t) => (
                        <tr key={t.id} className="border-t hover:bg-accent/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {format(new Date(t.created_at), "dd-MM-yyyy HH:mm")}
                          </td>
                          <td className="px-4 py-3 capitalize">{t.type}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.description ?? "—"}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${t.type === "credit" ? "text-emerald-600" : "text-destructive"}`}
                          >
                            {t.type === "credit" ? "+" : "−"}
                            {inr(Number(t.amount_inr))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {isCreator && (
              <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4 text-primary" /> Creator withdrawals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Withdraw earnings via Cashfree. Available: <b>{inr(balance)}</b>
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>
                    {(wdHistoryQ.data ?? []).filter((w) => w.status === "pending").length} pending
                  </span>
                  <span>·</span>
                  <span>{(wdHistoryQ.data ?? []).length} total</span>
                  <span>·</span>
                  <span>Wallet debited upfront via Cashfree Payouts</span>
                </div>
                <Dialog open={wdOpen} onOpenChange={setWdOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={balance < 100}>
                      <ArrowDownToLine className="h-4 w-4" /> Request withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Withdraw funds</DialogTitle>
                      <DialogDescription>Available: {inr(balance)}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Field label="Amount (INR)">
                        <Input
                          type="number"
                          min={100}
                          max={balance}
                          value={wdAmt}
                          onChange={(e) => setWdAmt(e.target.value)}
                        />
                      </Field>
                      <Field label="Method">
                        <div className="grid grid-cols-2 gap-2">
                          {(["upi", "bank"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                setWdMethod(m);
                                setWdDest(autofillWd(m));
                              }}
                              className={`rounded-xl border p-2 text-xs capitalize ${wdMethod === m ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field
                        label={
                          wdMethod === "upi" ? "UPI ID" : "Account details (name, number, IFSC)"
                        }
                      >
                        <Input
                          value={wdDest}
                          onChange={(e) => setWdDest(e.target.value)}
                          maxLength={200}
                          placeholder={autofillWd(wdMethod) || "Enter details"}
                        />
                      </Field>
                    </div>
                    <DialogFooter>
                      <Button onClick={submitWd} disabled={wdSubmitting}>
                        {wdSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
                        Withdraw
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {(wdHistoryQ.data ?? []).length > 0 && (
                  <ul className="mt-2 divide-y border-t">
                    {(wdHistoryQ.data ?? []).map((w) => (
                      <li
                        key={w.id}
                        className="py-2.5 flex items-center justify-between text-sm group"
                      >
                        <div>
                          <div className="font-medium">
                            {inr(Number(w.amount_inr))} ·{" "}
                            <span className="text-muted-foreground">{w.admin_notes ?? "—"}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {w.method} ·{" "}
                            {(w.destination as any)?.upi_id ??
                              (w.destination as any)?.account_number ??
                              JSON.stringify(w.destination)}{" "}
                            · {format(new Date(w.created_at), "dd-MM-yyyy HH:mm")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              w.status === "paid"
                                ? "default"
                                : w.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize text-[10px]"
                          >
                            {w.status}
                          </Badge>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm("Delete this withdrawal record?")) return;
                              await supabase.from("creator_withdrawals").delete().eq("id", w.id);
                              toast.success("Deleted");
                              qc.invalidateQueries({ queryKey: ["withdrawals"] });
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete withdrawal"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {(wdHistoryQ.data ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">No withdrawals yet.</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* ═══ NOTIFICATIONS ═══ */}
          <TabsContent value="notifications" className="mt-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Notification preferences
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose what notifications you receive and how.
              </p>
              <div className="space-y-3 pt-2">
                <Toggle
                  label="New subscriber"
                  checked={prefs.new_subscriber}
                  onChange={(v) => setPrefs({ ...prefs, new_subscriber: v })}
                />
                <Toggle
                  label="New comment on a lesson"
                  checked={prefs.new_comment}
                  onChange={(v) => setPrefs({ ...prefs, new_comment: v })}
                />
                <Toggle
                  label="New course sale"
                  checked={prefs.new_sale}
                  onChange={(v) => setPrefs({ ...prefs, new_sale: v })}
                />
                <div className="h-px bg-border" />
                <Toggle
                  label="Email notifications"
                  checked={prefs.email}
                  onChange={(v) => setPrefs({ ...prefs, email: v })}
                />
                <Toggle
                  label="In-app notifications"
                  checked={prefs.inapp}
                  onChange={(v) => setPrefs({ ...prefs, inapp: v })}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={saveNotifs} disabled={savingNotifs}>
                  {savingNotifs ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                  preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ═══ SETTINGS ═══ */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 max-w-md">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Change password
              </h2>
              <Field label="Current password">
                <Input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                />
              </Field>
              <Field label="New password">
                <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </Field>
              <div className="flex justify-end pt-2">
                <Button onClick={changePassword} disabled={pwdSaving}>
                  {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update password
                </Button>
              </div>
            </div>

            {isCreator && (
              <>
                <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                  <h2 className="font-display font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Payout method
                  </h2>
                  <Field label="Method">
                    <Select
                      value={payout.method ?? "bank"}
                      onValueChange={(v: "bank" | "upi") => setPayout({ ...payout, method: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {payout.method === "upi" ? (
                    <Field label="UPI ID">
                      <Input
                        value={payout.upi_id ?? ""}
                        onChange={(e) => setPayout({ ...payout, upi_id: e.target.value })}
                        placeholder="name@bank"
                      />
                    </Field>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Account holder">
                        <Input
                          value={payout.account_name ?? ""}
                          onChange={(e) => setPayout({ ...payout, account_name: e.target.value })}
                        />
                      </Field>
                      <Field label="IFSC">
                        <Input
                          value={payout.ifsc ?? ""}
                          onChange={(e) => setPayout({ ...payout, ifsc: e.target.value })}
                        />
                      </Field>
                      <Field label="Account number" className="sm:col-span-2">
                        <Input
                          value={payout.account_number ?? ""}
                          onChange={(e) => setPayout({ ...payout, account_number: e.target.value })}
                        />
                      </Field>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                  <h2 className="font-display font-semibold">New-course defaults</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Default price (₹)">
                      <Input
                        type="number"
                        min={0}
                        value={defaults.price_inr}
                        onChange={(e) =>
                          setDefaults({ ...defaults, price_inr: Number(e.target.value) || 0 })
                        }
                      />
                    </Field>
                    <Field label="Category">
                      <Select
                        value={defaults.category}
                        onValueChange={(v) => setDefaults({ ...defaults, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "General",
                            "Development",
                            "Design",
                            "Marketing",
                            "AI & Data",
                            "Business",
                            "Personal Growth",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Level">
                      <Select
                        value={defaults.level}
                        onValueChange={(v) => setDefaults({ ...defaults, level: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Beginner", "Intermediate", "Advanced"].map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveExtra} disabled={savingExtra}>
                    {savingExtra ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                    settings
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* ═══ BRANDING (Team / Admin) ═══ */}
          {isAdmin && (
            <TabsContent value="branding" className="mt-6 space-y-6">
              <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Organization Branding
                </h2>
                <p className="text-sm text-muted-foreground">
                  Customize how your certificates and invoices appear. Changes apply to all
                  certificates you issue.
                </p>

                <div className="space-y-4">
                  <Field label="Organization Name">
                    <Input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Your Company"
                    />
                  </Field>

                  <Field label="Organization Logo URL">
                    <Input
                      value={orgLogoUrl}
                      onChange={(e) => setOrgLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </Field>

                  <Field label="Brand Color">
                    <div className="relative mt-1">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div
                        className="w-full h-9 rounded-lg border flex items-center gap-2 px-2"
                        style={{ background: brandColor + "22", borderColor: brandColor }}
                      >
                        <div
                          className="h-5 w-5 rounded border"
                          style={{ background: brandColor }}
                        />
                        <span className="text-xs font-mono">{brandColor}</span>
                      </div>
                    </div>
                  </Field>
                </div>
              </div>

              {(subQ.data as any)?.pricing_plans?.name === "Team" && (
                <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
                  <h2 className="font-display font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Invoice Customization
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Custom invoice branding for your organization. These override the global invoice
                    defaults.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Invoice company name">
                      <Input
                        value={invCompanyName}
                        onChange={(e) => setInvCompanyName(e.target.value)}
                        placeholder="Your Company"
                      />
                    </Field>
                    <Field label="Invoice legal name">
                      <Input
                        value={invLegalName}
                        onChange={(e) => setInvLegalName(e.target.value)}
                        placeholder="Your Company Pvt. Ltd."
                      />
                    </Field>
                    <Field label="GSTIN">
                      <Input
                        value={invGstin}
                        onChange={(e) => setInvGstin(e.target.value)}
                        placeholder="29XXXXX1234X1Z5"
                      />
                    </Field>
                    <Field label="Invoice prefix">
                      <Input
                        value={invPrefix}
                        onChange={(e) => setInvPrefix(e.target.value)}
                        placeholder="INV"
                      />
                    </Field>
                    <Field label="Invoice logo URL">
                      <Input
                        value={invLogoUrl}
                        onChange={(e) => setInvLogoUrl(e.target.value)}
                        placeholder="https://example.com/invoice-logo.png"
                      />
                    </Field>
                    <Field label="Contact (email/phone)">
                      <Input
                        value={invContact}
                        onChange={(e) => setInvContact(e.target.value)}
                        placeholder="hello@company.com"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Invoice footer">
                        <Input
                          value={invFooter}
                          onChange={(e) => setInvFooter(e.target.value)}
                          placeholder="Thank you for your business!"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    setSavingBranding(true);
                    try {
                      const { error } = await supabase
                        .from("profiles")
                        .update({
                          org_name: orgName || null,
                          org_logo_url: orgLogoUrl || null,
                          brand_color: brandColor,
                          invoice_company_name: invCompanyName || null,
                          invoice_legal_name: invLegalName || null,
                          invoice_gstin: invGstin || null,
                          invoice_prefix: invPrefix || null,
                          invoice_footer: invFooter || null,
                          invoice_logo_url: invLogoUrl || null,
                          invoice_contact: invContact || null,
                        })
                        .eq("id", user!.id);
                      if (error) throw error;
                      toast.success("Branding saved");
                      qc.invalidateQueries({ queryKey: ["profile-full"] });
                    } catch (e: any) {
                      toast.error(e.message);
                    } finally {
                      setSavingBranding(false);
                    }
                  }}
                  disabled={savingBranding}
                >
                  {savingBranding ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                  Branding
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppShell>
  );
}

/* ── Helpers ── */
const loadCashfree = () =>
  new Promise((resolve) => {
    if ((window as any).Cashfree) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
