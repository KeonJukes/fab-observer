import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Rotate3d, Maximize2, RefreshCw, Play, Pause, Info, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

interface AXIS_CONFIG_TYPE {
  name: string;
  min: number;
  max: number;
  axis: 'x' | 'y' | 'z';
  color: number;
}

const AXIS_CONFIG: AXIS_CONFIG_TYPE[] = [
  { name: "Base Rotation", min: -180, max: 180, axis: 'y', color: 0x334155 },
  { name: "Shoulder Pitch", min: -45, max: 90, axis: 'z', color: 0xf97316 },
  { name: "Elbow Pitch", min: -90, max: 90, axis: 'z', color: 0xf97316 },
  { name: "Wrist Roll", min: -180, max: 180, axis: 'x', color: 0x64748b },
  { name: "Wrist Pitch", min: -90, max: 90, axis: 'z', color: 0x64748b },
  { name: "Wrist Roll 2", min: -180, max: 180, axis: 'x', color: 0x94a3b8 }
];

export const RobotArm3D = ({ 
  status, 
  activeSims = new Set(),
  onFaultDetected
}: { 
  status: string, 
  activeSims?: Set<'current' | 'vibration' | 'temperature'>,
  onFaultDetected?: (jointName: string) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for joint values
  const [jointValues, setJointValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [faultyJoints, setFaultyJoints] = useState<Set<number>>(new Set());
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const jointsRef = useRef<THREE.Group[]>([]);
  const jointMeshesRef = useRef<THREE.Mesh[]>([]);
  const clockRef = useRef(new THREE.Clock());
  const requestRef = useRef<number | null>(null);

  // Interaction refs
  const interactionRef = useRef({
    isMouseDown: false,
    targetRotX: 0.5,
    targetRotY: 0.5,
    zoom: 15
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Initialization
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.Fog(0x0f172a, 10, 50);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Helper
    const grid = new THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    scene.add(grid);

    // Build Robot Arm
    const createLink = (w: number, h: number, d: number, color: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const base = new THREE.Group();
    const baseMesh = createLink(2, 0.5, 2, 0x1e293b);
    base.add(baseMesh);
    scene.add(base);

    const meshes: THREE.Mesh[] = [];

    // Axis 1: Base Rotation
    const j1 = new THREE.Group();
    j1.position.y = 0.25;
    base.add(j1);
    const j1Mesh = createLink(1.5, 1, 1.5, 0x334155);
    j1Mesh.position.y = 0.5;
    j1.add(j1Mesh);
    meshes.push(j1Mesh);

    // Axis 2: Shoulder
    const j2 = new THREE.Group();
    j2.position.y = 1;
    j1.add(j2);
    const j2Mesh = createLink(0.8, 4, 0.8, 0xf97316);
    j2Mesh.position.y = 2;
    j2.add(j2Mesh);
    meshes.push(j2Mesh);

    // Axis 3: Elbow
    const j3 = new THREE.Group();
    j3.position.y = 4;
    j2.add(j3);
    const j3Mesh = createLink(0.6, 4, 0.6, 0xf97316);
    j3Mesh.position.y = 2;
    j3.add(j3Mesh);
    meshes.push(j3Mesh);

    // Axis 4: Wrist Roll
    const j4 = new THREE.Group();
    j4.position.y = 4;
    j3.add(j4);
    const j4Mesh = createLink(0.5, 1, 0.5, 0x64748b);
    j4Mesh.position.y = 0.5;
    j4.add(j4Mesh);
    meshes.push(j4Mesh);

    // Axis 5: Wrist Pitch
    const j5 = new THREE.Group();
    j5.position.y = 1;
    j4.add(j5);
    const j5Mesh = createLink(0.4, 0.8, 0.4, 0x64748b);
    j5Mesh.position.y = 0.4;
    j5.add(j5Mesh);
    meshes.push(j5Mesh);

    // Axis 6: End Effector
    const j6 = new THREE.Group();
    j6.position.y = 0.8;
    j5.add(j6);
    const j6Mesh = createLink(0.6, 0.2, 0.6, 0x94a3b8);
    j6.add(j6Mesh);
    meshes.push(j6Mesh);
    
    // Fingertips
    const f1 = createLink(0.1, 0.4, 0.4, 0xffffff);
    f1.position.set(0.2, 0.3, 0);
    j6.add(f1);
    const f2 = createLink(0.1, 0.4, 0.4, 0xffffff);
    f2.position.set(-0.2, 0.3, 0);
    j6.add(f2);

    jointsRef.current = [j1, j2, j3, j4, j5, j6];
    jointMeshesRef.current = meshes;

    // ... (rest remains same)
    const handleResize = () => {}; // Removed in previous turn
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !cameraRef.current || !rendererRef.current) return;
      const { width: w, height: h } = entries[0].contentRect;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    const animate = () => {
      const time = clockRef.current.getElapsedTime();

      if (isAutoDemo) {
        setJointValues(prev => {
          const v1 = Math.sin(time * 0.5) * 90;
          const v2 = Math.sin(time * 0.7) * 30 + 20;
          const v3 = Math.cos(time * 0.6) * 45 - 20;
          const v4 = Math.sin(time * 1.2) * 120;
          const v5 = Math.sin(time * 0.9) * 45;
          const v6 = (time * 100) % 360 - 180;
          
          // Don't update values for faulty joints to simulate seizing
          const next = [...prev];
          if (!faultyJoints.has(0)) next[0] = v1;
          if (!faultyJoints.has(1)) next[1] = v2;
          if (!faultyJoints.has(2)) next[2] = v3;
          if (!faultyJoints.has(3)) next[3] = v4;
          if (!faultyJoints.has(4)) next[4] = v5;
          if (!faultyJoints.has(5)) next[5] = v6;
          return next;
        });
      }

      // Update Joints and Materials
      jointsRef.current.forEach((joint, i) => {
        const rad = THREE.MathUtils.degToRad(jointValues[i]);
        const axis = AXIS_CONFIG[i].axis;
        if (axis === 'x') joint.rotation.x = rad;
        if (axis === 'y') joint.rotation.y = rad;
        if (axis === 'z') joint.rotation.z = rad;

        // Visual Fault Feedback
        const mesh = jointMeshesRef.current[i];
        if (mesh) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (faultyJoints.has(i)) {
            const glow = (Math.sin(time * 10) + 1) * 0.5;
            mat.emissive.setHex(0xff0000);
            mat.emissiveIntensity = 0.2 + glow * 0.8;
          } else {
            mat.emissiveIntensity = 0;
          }
        }
      });

      // Camera Orbit
      const { targetRotX, targetRotY, zoom } = interactionRef.current;
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(targetRotY) * zoom;
        cameraRef.current.position.z = Math.cos(targetRotY) * zoom;
        cameraRef.current.position.y = Math.max(2, targetRotX * zoom);
        cameraRef.current.lookAt(0, 3, 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
    };
  }, [isAutoDemo, jointValues]);

  const handleMouseDown = () => { interactionRef.current.isMouseDown = true; };
  const handleMouseUp = () => { interactionRef.current.isMouseDown = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (interactionRef.current.isMouseDown) {
      interactionRef.current.targetRotY += e.movementX * 0.005;
      interactionRef.current.targetRotX += e.movementY * 0.005;
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    interactionRef.current.zoom += e.deltaY * 0.01;
    interactionRef.current.zoom = Math.max(5, Math.min(30, interactionRef.current.zoom));
  };

  const updateJoint = (index: number, val: number) => {
    if (faultyJoints.has(index)) return; // Seized
    if (isAutoDemo) setIsAutoDemo(false);
    setJointValues(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const toggleFault = (index: number) => {
    setFaultyJoints(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        if (onFaultDetected) onFaultDetected(AXIS_CONFIG[index].name);
      }
      return next;
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[450px] bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 shadow-2xl group select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* 3D UI Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <Rotate3d size={14} className="text-brand-primary" />
            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest">3D Real-time Simulator</h4>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-slate-400 text-[8px] font-mono">Status: {status.toUpperCase()}</p>
            {faultyJoints.size > 0 && (
              <span className="text-red-500 text-[8px] font-bold animate-pulse uppercase tracking-tighter shrink-0">
                • MECHANICAL FAULT DETECTED
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => setShowControls(!showControls)}
          className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2 rounded-lg pointer-events-auto text-slate-400 hover:text-white transition-colors flex items-center justify-center"
        >
          <Sliders size={14} />
        </button>
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="absolute top-4 right-4 bottom-4 w-56 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-lg pointer-events-auto overflow-y-auto scrollbar-none"
          >
            <div className="space-y-5">
              {AXIS_CONFIG.map((cfg, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center group/item">
                    <label className={cn(
                      "text-[8px] font-bold uppercase tracking-tight transition-colors",
                      faultyJoints.has(i) ? "text-red-500" : "text-slate-400"
                    )}>
                      {cfg.name}
                    </label>
                    <div className="flex items-center gap-2">
                       <span className="text-brand-primary font-mono text-[9px]">{jointValues[i].toFixed(0)}°</span>
                       <button 
                         onClick={() => toggleFault(i)}
                         className={cn(
                           "p-1 rounded-md transition-all",
                           faultyJoints.has(i) ? "bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-slate-800 text-slate-500 hover:text-red-400"
                         )}
                         title="Inject Fault"
                       >
                         <Info size={10} />
                       </button>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={cfg.min} 
                    max={cfg.max} 
                    value={jointValues[i]} 
                    disabled={faultyJoints.has(i)}
                    onChange={(e) => updateJoint(i, parseInt(e.target.value))}
                    className={cn(
                      "w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary disabled:opacity-30 disabled:cursor-not-allowed",
                      faultyJoints.has(i) && "bg-red-900"
                    )}
                  />
                </div>
              ))}

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => setIsAutoDemo(!isAutoDemo)}
                  className={cn(
                    "flex-1 py-1.5 rounded text-[8px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1",
                    isAutoDemo ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
                  )}
                >
                  {isAutoDemo ? <Pause size={10} /> : <Play size={10} />}
                  {isAutoDemo ? 'Stop' : 'Demo'}
                </button>
                <button 
                  onClick={() => setJointValues([0, 0, 0, 0, 0, 0])}
                  className="flex-1 py-1.5 bg-slate-700 text-white rounded text-[8px] font-bold uppercase tracking-widest hover:bg-slate-600 flex items-center justify-center gap-1"
                >
                  <RefreshCw size={10} />
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-slate-500 text-[8px] font-mono font-bold uppercase tracking-widest pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};
