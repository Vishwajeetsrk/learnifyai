import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { cn } from "@/lib/utils";
import { Hand, Loader2, RefreshCw } from "lucide-react";

interface ThreeAvatarCanvasProps {
  modelUrl?: string;
  textureUrl?: string;
  aiSpeaking?: boolean;
  viseme?: string;
  avatarName?: string;
  avatarTitle?: string;
  className?: string;
}

const VISEME_OPENNESS: Record<string, number> = {
  X: 0,
  A: 0.25,
  B: 0.5,
  C: 0.85,
  D: 1,
  E: 0.35,
  O: 0.45,
};

const FALLBACK_VISEMES: Record<string, string> = {
  X: "M45 56 Q50 59 55 56",
  A: "M44 56 Q50 61 56 56 Q50 58 44 56 Z",
  B: "M43 56 Q50 63 57 56 Q50 57 43 56 Z",
  C: "M44 56 Q50 65 56 56 Q50 59 44 56 Z",
  D: "M42 56 Q50 68 58 56 Q50 58 42 56 Z",
  E: "M45 55 Q50 58 55 55 Q50 61 45 55 Z",
  O: "M46 56 Q50 62 54 56 Q50 51 46 56 Z",
};

function EricFallbackAvatar({ aiSpeaking, viseme }: { aiSpeaking: boolean; viseme: string }) {
  const [isWaving, setIsWaving] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsWaving(false), 3500);
    return () => clearTimeout(t);
  }, []);
  const mouth = FALLBACK_VISEMES[viseme] || FALLBACK_VISEMES.X;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Glow ring */}
        <div
          className="absolute rounded-full w-44 h-44"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 55%, transparent 70%)",
          }}
        />
        <svg
          className="w-36 h-36 drop-shadow-2xl"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "50% 50%", animation: "eric-idle 4.5s ease-in-out infinite" }}
        >
          <defs>
            <linearGradient id="eric-fallback-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#eric-fallback-grad)" />
          <rect x="46" y="64" width="8" height="13" fill="#FDBA74" rx="2" />
          <path
            d="M50 24 C36 24 33 35 33 47 C33 59 38 69 50 69 C62 69 67 59 67 47 C67 35 64 24 50 24 Z"
            fill="#FDBA74"
          />
          <path
            d="M50 21 C36 21 34 26 34 32 C38 32 44 26 50 28 C56 26 62 32 66 32 C66 26 64 21 50 21 Z"
            fill="#1e293b"
          />
          {/* Waving hand */}
          <g style={isWaving ? { transformOrigin: "68px 66px", animation: "eric-wave 0.5s ease-in-out infinite alternate" } : undefined}>
            <rect x="66" y="62" width="6" height="10" fill="#FDBA74" rx="2" />
            <circle cx="69" cy="60" r="4.5" fill="#FDBA74" />
          </g>
          <ellipse cx="43" cy="45" rx="3" ry="3" fill="#1E293B" style={{ transformOrigin: "43px 45px", animation: "eric-blink 4.2s infinite" }} />
          <ellipse cx="57" cy="45" rx="3" ry="3" fill="#1E293B" style={{ transformOrigin: "57px 45px", animation: "eric-blink 4.2s infinite" }} />
          <path d="M39 40 C41 39 44 40 45 41" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M61 40 C59 39 56 40 55 41" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          {aiSpeaking && viseme === "X" ? (
            <path d={mouth} stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d={mouth} fill="#be123c" />
          )}
        </svg>
        {/* Equalizer */}
        {aiSpeaking && (
          <div className="absolute -bottom-4 inset-x-0 flex items-end justify-center gap-[3px] pointer-events-none h-6">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-indigo-400/80"
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
      <style>{`
        @keyframes eric-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes eric-wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes eric-blink {
          0%, 94%, 100% { transform: scaleY(0.08); opacity: 0.9; }
          96% { transform: scaleY(1); opacity: 0.95; }
        }
        @keyframes eq-bounce {
          0% { height: 3px; }
          100% { height: 18px; }
        }
      `}</style>
    </div>
  );
}

export function ThreeAvatarCanvas({
  modelUrl = "/avatars/eric/rp_eric_rigged_001_yup_a.fbx",
  textureUrl = "/avatars/eric/tex/rp_eric_rigged_001_dif.jpg",
  aiSpeaking = false,
  viseme = "X",
  avatarName = "Eric Vance",
  avatarTitle = "3D Technical Lead",
  className = "w-full h-full",
}: ThreeAvatarCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [isWaving, setIsWaving] = useState(true);

  const waveStartRef = useRef(performance.now());

  useEffect(() => {
    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement("canvas");
    canvas.className = "w-full h-full block";
    mount.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let clock = new THREE.Clock();
    let avatar: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationId: number;
    let rafRunning = true;
    let resizeObserver: ResizeObserver;

    // Identified rig bones (populated after load)
    let headBone: THREE.Bone | null = null;
    let jawBone: THREE.Bone | null = null;
    let waveBone: THREE.Bone | null = null;
    let eyeLeft: THREE.Bone | null = null;
    let eyeRight: THREE.Bone | null = null;
    let restJaw = 0;
    let headRest = new THREE.Quaternion();
    let waveRest = new THREE.Quaternion();

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 1000);
      camera.position.set(0, 1.55, 2.6);
      camera.lookAt(0, 1.35, 0);

      // ── Studio Lighting ──
      const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x241b2e, 0.7);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(1.5, 3, 2.2);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0x818cf8, 2.2);
      rim.position.set(-2.2, 2, -1.5);
      scene.add(rim);

      const fill = new THREE.DirectionalLight(0xffb3d9, 0.8);
      fill.position.set(0, 1, -2.5);
      scene.add(fill);

      const spot = new THREE.SpotLight(0xffffff, 30, 8, Math.PI / 4, 0.4, 1.4);
      spot.position.set(0, 4, 1);
      scene.add(spot);

      // Ground shadow catcher
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.ShadowMaterial({ opacity: 0.32 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      scene.add(ground);
    } catch {
      setStatus("error");
      mount.removeChild(canvas);
      return;
    }

    const findBone = (root: THREE.Object3D, keywords: string[]): THREE.Bone | null => {
      let found: THREE.Bone | null = null;
      root.traverse((obj) => {
        if (found) return;
        if ((obj as THREE.Bone).isBone) {
          const name = obj.name.toLowerCase();
          if (keywords.some((k) => name.includes(k))) {
            found = obj as THREE.Bone;
          }
        }
      });
      return found;
    };

    const loadModel = () => {
      const manager = new THREE.LoadingManager();
      const loader = new FBXLoader(manager);
      loader.setPath(modelUrl.substring(0, modelUrl.lastIndexOf("/") + 1));

      loader.load(
        modelUrl,
        (object) => {
          avatar = object;
          scene.add(avatar);

          // ── Fit camera to model bounds ──
          const box = new THREE.Box3().setFromObject(avatar);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const fitDistance = (size.y * 1.25) / Math.tan((camera.fov * Math.PI) / 360) + 0.8;
          camera.position.set(center.x, center.y + size.y * 0.18, center.z + fitDistance);
          camera.lookAt(center.x, center.y + size.y * 0.42, center.z);

          // ── Apply diffuse + normal textures ──
          try {
            const texLoader = new THREE.TextureLoader();
            const dif = texLoader.load(textureUrl);
            dif.colorSpace = THREE.SRGBColorSpace;
            avatar.traverse((obj) => {
              const mesh = obj as THREE.Mesh;
              if ((mesh as any).isMesh) {
                const mat = (mesh.material as THREE.Material | THREE.Material[]) || new THREE.MeshStandardMaterial();
                const materials = Array.isArray(mat) ? mat : [mat];
                for (const m of materials) {
                  const std = m as THREE.MeshStandardMaterial;
                  if (std && !std.map) std.map = dif;
                  if (std) std.needsUpdate = true;
                }
              }
            });
          } catch {}

          // ── Enable shadows on skinned meshes ──
          avatar.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if ((mesh as any).isMesh) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          // ── Identify rig bones for animation ──
          headBone = findBone(avatar, ["headnub", "head", "neck"]);
          jawBone = findBone(avatar, ["jaw", "mandible", "chin"]);
          waveBone = findBone(avatar, ["rightarm", "arm.r", "arm_r", "upper_arm_r", "upperarm.r"]);
          eyeLeft = findBone(avatar, ["lefteye", "eye.l", "eye_l", "eyeleft"]);
          eyeRight = findBone(avatar, ["righteye", "eye.r", "eye_r", "eyeright"]);

          if (headBone) headRest.copy(headBone.quaternion);
          if (waveBone) waveRest.copy(waveBone.quaternion);

          // ── Play embedded idle animation if present ──
          if (avatar.animations && avatar.animations.length > 0) {
            mixer = new THREE.AnimationMixer(avatar);
            const action = mixer.clipAction(avatar.animations[0]);
            action.play();
          }

          setStatus("ready");
        },
        undefined,
        () => {
          setStatus("error");
        },
      );
    };

    const render = () => {
      if (!rafRunning) return;
      animationId = requestAnimationFrame(render);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (mixer) mixer.update(dt);

      if (avatar) {
        // ── Subtle idle head sway (life) ──
        if (headBone) {
          headBone.quaternion.copy(headRest);
          headBone.rotateX(Math.sin(t * 0.7) * 0.035);
          headBone.rotateY(Math.cos(t * 0.5) * 0.03);
        }

        // ── Lip sync: jaw opens with viseme ──
        if (jawBone) {
          const openness = VISEME_OPENNESS[viseme] ?? 0;
          const target = aiSpeaking ? openness : 0;
          restJaw += (target - restJaw) * 0.35;
          jawBone.rotation.x = restJaw * 0.35;
        }

        // ── Blink ──
        const blinkAmount = Math.sin(t * 1.4) > 0.985 ? 0.15 : 1;
        if (eyeLeft) eyeLeft.scale.y = blinkAmount;
        if (eyeRight) eyeRight.scale.y = blinkAmount;

        // ── Wave animation (friendly hello) ──
        if (waveBone) {
          const elapsed = (performance.now() - waveStartRef.current) / 1000;
          if (elapsed < 3.5 && isWaving) {
            const angle = Math.sin(elapsed * 7) * 0.5 + 0.4;
            waveBone.quaternion.copy(waveRest);
            waveBone.rotateZ(angle);
          } else if (elapsed >= 3.5 && isWaving) {
            setIsWaving(false);
          }
        }
      }

      renderer.render(scene, camera);
    };

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    onResize();

    loadModel();
    render();

    return () => {
      rafRunning = false;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (mixer) mixer.stopAllAction();
      avatar?.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if ((mesh as any).isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950 flex items-center justify-center">
        <div ref={mountRef} className="absolute inset-0" />

        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
            <span className="text-[10px] font-bold text-indigo-300">Loading 3D Avatar...</span>
          </div>
        )}

        {status === "error" && (
          <EricFallbackAvatar aiSpeaking={aiSpeaking} viseme={viseme} />
        )}

        {/* Live Speaking / Waving Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white shadow-md z-10">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              aiSpeaking ? "bg-emerald-400 animate-ping" : "bg-indigo-400",
            )}
          />
          <span>{aiSpeaking ? "Speaking & Explaining..." : isWaving ? "Waving Hello!" : "Listening & Observing"}</span>
        </div>

        {/* Interactive Wave Trigger Button */}
        {status !== "error" && (
          <button
            onClick={() => {
              setIsWaving(true);
              waveStartRef.current = performance.now();
            }}
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-bold transition backdrop-blur-sm shadow cursor-pointer"
            title="Trigger Friendly Wave"
          >
            <Hand className="h-3 w-3" /> Wave
          </button>
        )}

        {status === "error" && (
          <button
            onClick={() => setAttempt((a) => a + 1)}
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-bold transition backdrop-blur-sm shadow cursor-pointer"
            title="Retry loading 3D avatar"
          >
            <RefreshCw className="h-3 w-3" /> Retry 3D
          </button>
        )}
      </div>

      {/* Avatar Identity Footer */}
      <div className="mt-2.5 text-center space-y-0.5">
        <div className="text-xs font-black text-foreground flex items-center justify-center gap-1.5">
          <span>{avatarName}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[9px] font-extrabold border border-indigo-200 dark:border-indigo-800">
            3D AI Lead
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-semibold">{avatarTitle}</p>
      </div>
    </div>
  );
}
