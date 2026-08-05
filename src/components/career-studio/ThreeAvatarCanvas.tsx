import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { cn } from "@/lib/utils";
import { Hand, Loader2, AlertTriangle } from "lucide-react";

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
  }, []);

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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/80">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-300">Avatar unavailable</span>
          </div>
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
        <button
          onClick={() => {
            setIsWaving(true);
            waveStartRef.current = performance.now();
          }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-bold transition backdrop-blur-sm cursor-pointer shadow"
          title="Trigger Friendly Wave"
        >
          <Hand className="h-3 w-3" /> Wave
        </button>
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
