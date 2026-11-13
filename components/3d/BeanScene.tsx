"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BeanData {
  initialPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
}

function InstancedBeans({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 160;

  // Custom bean geometry: a deformed sphere with an indented longitudinal seam
  const beanGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.35, 24, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Elongate along Y axis
      y *= 1.45;
      // Flatten slightly along Z
      z *= 0.75;

      // Central coffee bean crease indent on front side
      if (z > 0 && Math.abs(x) < 0.16) {
        z -= (0.16 - Math.abs(x)) * 0.9;
      }

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const beanMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1A110D"),
      roughness: 0.55,
      metalness: 0.15,
    });
  }, []);

  // Precompute random initial distributed positions and vortex funnel positions
  const beans = useMemo<BeanData[]>(() => {
    const arr: BeanData[] = [];
    for (let i = 0; i < count; i++) {
      // Scattered floating field across viewport
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      // Z-depth spread from behind text (-3.5) to in front (+3.5)
      const z = (Math.random() - 0.5) * 7.0;

      // Vortex target position (funneling into cup center)
      const angle = (i / count) * Math.PI * 12 + Math.random() * 0.5;
      const radius = 0.5 + Math.pow(i / count, 1.5) * 3.5;
      const vy = (i / count) * 4.5 - 2.8;
      const vx = Math.cos(angle) * radius;
      const vz = Math.sin(angle) * radius;

      arr.push({
        initialPos: new THREE.Vector3(x, y, z),
        targetPos: new THREE.Vector3(vx, vy, vz),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        scale: 0.65 + Math.random() * 0.7,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    for (let i = 0; i < count; i++) {
      const b = beans[i];

      // Natural gentle wave drift
      const waveX = Math.sin(time * 0.6 + i) * 0.25;
      const waveY = Math.cos(time * 0.5 + i * 1.3) * 0.25;

      // Mouse parallax & repulsion
      const distToMouse = Math.hypot(
        b.initialPos.x - mousePos.current.x * 6,
        b.initialPos.y - mousePos.current.y * 4
      );
      const repulsion = Math.max(0, 1.5 - distToMouse) * 0.6;
      const repulseX = (b.initialPos.x - mousePos.current.x * 6) * repulsion * 0.4;
      const repulseY = (b.initialPos.y - mousePos.current.y * 4) * repulsion * 0.4;

      // Lerp from scattered position to vortex position as user scrolls
      const currentX = THREE.MathUtils.lerp(b.initialPos.x + waveX + repulseX, b.targetPos.x, p);
      const currentY = THREE.MathUtils.lerp(b.initialPos.y + waveY + repulseY, b.targetPos.y, p);
      const currentZ = THREE.MathUtils.lerp(b.initialPos.z, b.targetPos.z, p);

      // Swirl rotation in vortex
      b.rotation.x += b.rotationSpeed.x + p * 0.03;
      b.rotation.y += b.rotationSpeed.y + p * 0.05;
      b.rotation.z += b.rotationSpeed.z;

      dummy.position.set(currentX, currentY, currentZ);
      dummy.rotation.copy(b.rotation);
      // Scale down slightly at the funnel tip
      const scaleFactor = b.scale * (1 - p * 0.3 * (1 - i / count));
      dummy.scale.set(scaleFactor, scaleFactor, scaleFactor);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[beanGeometry, beanMaterial, count]}
      castShadow
      receiveShadow
    />
  );
}

export default function BeanScene({ scrollProgress = 0 }: { scrollProgress: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFE6C7" />
        <directionalLight position={[-5, -4, 3]} intensity={0.6} color="#CFE0C3" />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#E8472B" />
        <InstancedBeans scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
