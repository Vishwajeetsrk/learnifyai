import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

interface ThreeAvatarCanvasProps {
  modelUrl?: string;
  textureUrl?: string;
  aiSpeaking?: boolean;
  viseme?: string;
  className?: string;
}

export function ThreeAvatarCanvas({
  modelUrl = "/avatars/eric/rp_eric_rigged_001_yup_a.fbx",
  textureUrl = "/avatars/eric/tex/rp_eric_rigged_001_dif.jpg",
  aiSpeaking = false,
  viseme = "X",
  className = "w-full h-full",
}: ThreeAvatarCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const jawBoneRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 260;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.48, 1.25);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xec4899, 1.5);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    let modelMesh: THREE.Object3D | null = null;

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const diffuseMap = textureLoader.load(
      textureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
      },
      undefined,
      () => {},
    );

    // FBX Loader
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      modelUrl,
      (fbx) => {
        fbx.scale.set(0.0088, 0.0088, 0.0088);
        fbx.position.set(0, 0, 0);

        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (diffuseMap) {
              mesh.material = new THREE.MeshStandardMaterial({
                map: diffuseMap,
                roughness: 0.45,
                metalness: 0.1,
              });
            }
          }
          if (child.name.toLowerCase().includes("head")) {
            headBoneRef.current = child;
          }
          if (
            child.name.toLowerCase().includes("jaw") ||
            child.name.toLowerCase().includes("mouth")
          ) {
            jawBoneRef.current = child;
          }
        });

        scene.add(fbx);
        modelMesh = fbx;
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn("FBX Avatar load fallback:", err);
        setHasError(true);
        setLoading(false);
      },
    );

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Micro head motion & natural breathing
      if (modelMesh) {
        modelMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.04;
        modelMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.005;
      }

      // Jaw talking animation when AI is speaking
      if (jawBoneRef.current && aiSpeaking) {
        jawBoneRef.current.rotation.x = (Math.sin(elapsedTime * 18) + 1) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl, textureUrl, aiSpeaking]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 text-white rounded-xl">
          <div className="h-7 w-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs font-bold text-indigo-300">Loading 3D Eric Avatar...</span>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 z-10 p-4 text-center rounded-xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl mb-2 shadow-lg">
            EV
          </div>
          <span className="text-xs font-bold text-white">Eric Vance (RenderPeople 3D)</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Senior AI Technical Interviewer
          </span>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full min-h-[220px] rounded-xl overflow-hidden" />
    </div>
  );
}
