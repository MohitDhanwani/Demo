"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BagViewer3DProps {
  scrollProgress: number;
  interactive?: boolean;
}

function CoffeeBag({ scrollProgress, interactive }: BagViewer3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);
  const userRotationY = useRef(0);

  // Generate dynamic photorealistic coffee bag label canvas texture
  const labelTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background: Deep ink-green matte packaging
    ctx.fillStyle = "#0D1B16";
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm paper central typographic label panel
    ctx.fillStyle = "#EFEBE3";
    ctx.fillRect(160, 240, 704, 580);

    // Subtle paper border
    ctx.strokeStyle = "#0D1B16";
    ctx.lineWidth = 4;
    ctx.strokeRect(180, 260, 664, 540);

    // Top mono brand mark
    ctx.fillStyle = "#0D1B16";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SLOW TIDE COFFEE ROASTERS", 512, 320);

    // Small vermilion dot
    ctx.fillStyle = "#E8472B";
    ctx.beginPath();
    ctx.arc(512, 345, 6, 0, Math.PI * 2);
    ctx.fill();

    // Large serif title
    ctx.fillStyle = "#0D1B16";
    ctx.font = "italic 62px Georgia, serif";
    ctx.fillText("Halo Beriti", 512, 430);

    // Subtitle
    ctx.font = "26px monospace";
    ctx.fillText("ETHIOPIA · YIRGACHEFFE · 2,150 MASL", 512, 480);

    // Divider line
    ctx.strokeStyle = "#0D1B16";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(240, 520);
    ctx.lineTo(784, 520);
    ctx.stroke();

    // Tasting notes
    ctx.font = "24px Georgia, serif";
    ctx.fillText("Bergamot · Jasmine Bloom · White Peach · Earl Grey", 512, 570);

    // Metadata grid
    ctx.font = "18px monospace";
    ctx.textAlign = "left";
    ctx.fillText("PROCESS: Mountain Washed", 240, 640);
    ctx.fillText("HARVEST: Nov – Jan 2026", 240, 675);
    ctx.fillText("ROAST: Hand Stamped Weekly", 240, 710);

    ctx.textAlign = "right";
    ctx.fillText("NET WT: 250g / 8.8oz", 784, 640);
    ctx.fillText("CODE: ST-ETH-048", 784, 675);
    ctx.fillStyle = "#E8472B";
    ctx.fillText("100% COMPOSTABLE", 784, 710);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  const bagMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0D1B16",
      roughness: 0.65,
      metalness: 0.1,
    });
  }, []);

  const frontLabelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.6,
      metalness: 0.05,
    });
  }, [labelTexture]);

  const valveMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1A2E25",
      roughness: 0.4,
      metalness: 0.4,
    });
  }, []);

  // Multi-material box array: right, left, top, bottom, front, back
  const materials = useMemo(() => {
    return [
      bagMaterial, // right
      bagMaterial, // left
      bagMaterial, // top
      bagMaterial, // bottom
      frontLabelMaterial, // front with label
      bagMaterial, // back
    ];
  }, [bagMaterial, frontLabelMaterial]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (interactive && scrollProgress >= 0.8) {
      // Interactive mouse control at the end of the scroll
      groupRef.current.rotation.y = userRotationY.current + Math.sin(time * 0.5) * 0.1;
      groupRef.current.position.set(0, Math.sin(time * 0.8) * 0.08, 0);
      groupRef.current.scale.set(1.15, 1.15, 1.15);
      return;
    }

    // Choreographed scroll scrollytelling path
    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    if (p < 0.25) {
      // Step 1: Front elevation reveal with subtle floating wobble
      const subP = p / 0.25;
      groupRef.current.rotation.set(
        Math.sin(time * 0.6) * 0.05,
        THREE.MathUtils.lerp(-0.25, 0.1, subP),
        0
      );
      groupRef.current.position.set(0, THREE.MathUtils.lerp(-0.4, 0, subP), 0);
      groupRef.current.scale.set(1.0, 1.0, 1.0);
    } else if (p < 0.5) {
      // Step 2: Tilt and zoom toward the degassing valve
      const subP = (p - 0.25) / 0.25;
      groupRef.current.rotation.set(
        THREE.MathUtils.lerp(0, -0.35, subP),
        THREE.MathUtils.lerp(0.1, -0.4, subP),
        THREE.MathUtils.lerp(0, 0.1, subP)
      );
      groupRef.current.position.set(
        THREE.MathUtils.lerp(0, -0.3, subP),
        THREE.MathUtils.lerp(0, -0.3, subP),
        THREE.MathUtils.lerp(0, 0.9, subP)
      );
      groupRef.current.scale.set(1.2, 1.2, 1.2);
    } else if (p < 0.75) {
      // Step 3: Spin to the back seal to inspect the compostable barrier
      const subP = (p - 0.5) / 0.25;
      groupRef.current.rotation.set(
        THREE.MathUtils.lerp(-0.35, 0.05, subP),
        THREE.MathUtils.lerp(-0.4, Math.PI, subP),
        0
      );
      groupRef.current.position.set(
        THREE.MathUtils.lerp(-0.3, 0.3, subP),
        0,
        THREE.MathUtils.lerp(0.9, 0.2, subP)
      );
      groupRef.current.scale.set(1.05, 1.05, 1.05);
    } else {
      // Step 4: Return to 3/4 beauty hero pose and unlock rotation
      const subP = (p - 0.75) / 0.25;
      groupRef.current.rotation.set(
        0,
        THREE.MathUtils.lerp(Math.PI, Math.PI * 2 - 0.35, subP) + userRotationY.current,
        0
      );
      groupRef.current.position.set(
        THREE.MathUtils.lerp(0.3, 0, subP),
        0,
        THREE.MathUtils.lerp(0.2, 0, subP)
      );
      groupRef.current.scale.set(1.1, 1.1, 1.1);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        if (!interactive || scrollProgress < 0.8) return;
        isDragging.current = true;
        previousMouseX.current = e.clientX;
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !interactive) return;
        const deltaX = e.clientX - previousMouseX.current;
        userRotationY.current += deltaX * 0.01;
        previousMouseX.current = e.clientX;
      }}
    >
      {/* Main Bag Body: Gusseted pouch shape */}
      <mesh material={materials} castShadow receiveShadow>
        <boxGeometry args={[2.0, 3.1, 1.1, 4, 4, 4]} />
      </mesh>

      {/* Tapered Top Seal Gusset */}
      <mesh position={[0, 1.7, 0]} material={bagMaterial} castShadow>
        <boxGeometry args={[1.96, 0.35, 0.25]} />
      </mesh>

      {/* Folded Top Lip */}
      <mesh position={[0, 1.95, 0]} material={bagMaterial}>
        <boxGeometry args={[2.02, 0.15, 0.12]} />
      </mesh>

      {/* One-Way Degassing Valve (Realistic circular vent on front) */}
      <mesh position={[0, 0.95, 0.56]} material={valveMaterial}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
      </mesh>
      {/* Valve center pinhole */}
      <mesh position={[0, 0.95, 0.585]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export default function BagViewer3D({
  scrollProgress = 0,
  interactive = true,
}: {
  scrollProgress?: number;
  interactive?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        {/* Key studio warm light */}
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFF8F0" castShadow />
        {/* Soft cool fill light */}
        <directionalLight position={[-4, 2, -2]} intensity={0.9} color="#CFE0C3" />
        {/* Rim back light */}
        <pointLight position={[0, 3, -3]} intensity={1.4} color="#E8472B" />
        <CoffeeBag scrollProgress={scrollProgress} interactive={interactive} />
      </Canvas>
    </div>
  );
}
