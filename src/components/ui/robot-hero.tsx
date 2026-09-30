"use client";

import { useMemo, useRef, useState, useEffect, type ReactNode } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type DomEvent,
  type RootState,
} from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { BootTerminal } from "@/components/ui/boot-terminal";
import {
  bootPhaseAtLeast,
  useBootSequence,
  type BootPhase,
} from "@/components/ui/use-boot-sequence";

type BootPower = { ramp: number; glow: number; rise: number };

const POWER_RAMP_SECONDS = 1.1;
const POWER_SKIP_SECONDS = 0.35;

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

const computePointerFromCanvas = (event: DomEvent, state: RootState) => {
  const rect = state.gl.domElement.getBoundingClientRect();
  state.pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
  state.raycaster.setFromCamera(state.pointer, state.camera);
};

function ResponsiveGroup({
  children,
  scale = 1,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  const { viewport } = useThree();
  const s = Math.min(1.1, viewport.width / 3.5) * scale;
  return <group scale={s}>{children}</group>;
}

function GlassCapsule({
  color,
  power,
  intensity,
  powerRef,
}: {
  color: string;
  power: number;
  intensity: number;
  powerRef: React.MutableRefObject<BootPower>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#ffffff") },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    [],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(color);
      materialRef.current.uniforms.power.value = power;
      materialRef.current.uniforms.intensity.value =
        intensity * powerRef.current.glow;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(fresnel, power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({
  color: "#2a2a34",
  roughness: 0.5,
});
const earRingMat = new THREE.MeshStandardMaterial({
  color: "#3d3d4a",
  roughness: 0.3,
});
const earCenterMat = new THREE.MeshStandardMaterial({
  color: "#1e1e28",
  roughness: 0.8,
});
const antennaBaseMat = new THREE.MeshStandardMaterial({
  color: "#2a2a34",
  roughness: 0.4,
  metalness: 0.5,
});
const antennaStickMat = new THREE.MeshStandardMaterial({
  color: "#3d3d4a",
  roughness: 0.4,
  metalness: 0.2,
});
const antennaTipOff = new THREE.Color("#1e1e28");
const antennaTipOn = new THREE.Color("#8b5cf6");
const antennaTipMat = new THREE.MeshStandardMaterial({
  color: antennaTipOff,
  roughness: 0.2,
  toneMapped: false,
});

function RobotEar({
  position,
  scale = 1,
  isLeft = false,
}: {
  position: [number, number, number];
  scale?: number;
  isLeft?: boolean;
}) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earBaseMat}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earRingMat}
      >
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earCenterMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh
          position={[0, 0.01, 0]}
          castShadow
          receiveShadow
          material={antennaBaseMat}
        >
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh
          position={[0, 0.06, 0]}
          castShadow
          receiveShadow
          material={antennaStickMat}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh
          position={[0, 0.11, 0]}
          castShadow
          receiveShadow
          material={antennaTipMat}
        >
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({
  color: "#e8e0ff",
  toneMapped: false,
  transparent: true,
});
const heartMat = new THREE.MeshBasicMaterial({
  color: "#a78bfa",
  toneMapped: false,
});

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3.0,
  isLovedRef,
  powerRef,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  isLovedRef: React.MutableRefObject<boolean>;
  powerRef: React.MutableRefObject<BootPower>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current)
      return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {
      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    targetScaleY *= Math.max(0.05, powerRef.current.rise);

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, g, 0),
        new THREE.Vector3(-w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, h - r, 0),
        new THREE.Vector3(-w, h, 0),
        new THREE.Vector3(-w + r, h, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, h, 0),
        new THREE.Vector3(w - r, h, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, h, 0),
        new THREE.Vector3(w, h, 0),
        new THREE.Vector3(w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, h - r, 0),
        new THREE.Vector3(w, g, 0),
      ),
    );

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, -g, 0),
        new THREE.Vector3(-w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, -(h - r), 0),
        new THREE.Vector3(-w, -h, 0),
        new THREE.Vector3(-w + r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, -h, 0),
        new THREE.Vector3(w - r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, -h, 0),
        new THREE.Vector3(w, -h, 0),
        new THREE.Vector3(w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, -(h - r), 0),
        new THREE.Vector3(w, -g, 0),
      ),
    );

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

function generatePbrTexturesAsync(): Promise<{
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const size = 512;
      const canvasC = document.createElement("canvas");
      const canvasB = document.createElement("canvas");
      canvasC.width = canvasB.width = size;
      canvasC.height = canvasB.height = size;
      const ctxC = canvasC.getContext("2d");
      const ctxB = canvasB.getContext("2d");

      if (ctxC && ctxB) {
        ctxC.fillStyle = "#1a1a22";
        ctxC.fillRect(0, 0, size, size);
        ctxB.fillStyle = "#2d2d38";
        ctxB.fillRect(0, 0, size, size);

        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 0.5 + Math.random() * 1.5;
          const isDark = Math.random() > 0.2;
          const isPurple = Math.random() > 0.92;

          ctxC.beginPath();
          ctxC.arc(x, y, r, 0, Math.PI * 2);
          ctxC.fillStyle = isPurple
            ? "#3b2667"
            : isDark
              ? "#0a0a0f"
              : "#2a2a34";
          ctxC.fill();

          ctxB.beginPath();
          ctxB.arc(x, y, r, 0, Math.PI * 2);
          ctxB.fillStyle = isDark ? "#000000" : "#4a4a58";
          ctxB.fill();
        }
      }

      const texC = new THREE.CanvasTexture(canvasC);
      const texB = new THREE.CanvasTexture(canvasB);
      texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
      texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

      texC.repeat.set(6, 3);
      texB.repeat.set(6, 3);
      texC.needsUpdate = true;
      texB.needsUpdate = true;

      resolve({ colorMap: texC, bumpMap: texB });
    }, 0);
  });
}

function RobotPrototype({
  neckParams = {
    baseR: 0.25,
    baseH: -0.01,
    midR: 0.23,
    midH: 0.02,
    lipBottomR: 0.27,
    lipBottomH: 0.025,
    lipTopR: 0.28,
    lipTopH: 0.05,
    innerR: 0.24,
    innerDropH: 0.03,
  },
  bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 },
  color = "#1a1a24",
  pantallaColor = "#8b5cf6",
  pantallaBrillo = 1.2,
  blinkCycle = 3.0,
  metalness = 0.0,
  bootPhase = "done",
  bootInstant = true,
}: {
  neckParams?: Record<string, number>;
  bodyParams?: Record<string, number>;
  color?: string;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  bootPhase?: BootPhase;
  bootInstant?: boolean;
}) {
  const isLovedRef = useRef(false);
  const powerRef = useRef<BootPower>({ ramp: 0, glow: 0, rise: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const [textures, setTextures] = useState<{
    colorMap: THREE.CanvasTexture | null;
    bumpMap: THREE.CanvasTexture | null;
  }>({ colorMap: null, bumpMap: null });

  const design = {
    pantallaColor: pantallaColor,
    pantallaGrosor: 3.8,
    pantallaBrillo: pantallaBrillo,
    separacionOjos: 0.07,
    tamañoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: blinkCycle,
    parpadeoDuracion: 0.45,
    colorChasis: color,
    alturaCabeza: 0.6,
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.3,
    headLookY: 1.8,
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);
    const power = powerRef.current;

    if (bootInstant) {
      power.ramp = 1;
    } else if (bootPhaseAtLeast(bootPhase, "power")) {
      const seconds =
        bootPhase === "done" ? POWER_SKIP_SECONDS : POWER_RAMP_SECONDS;
      power.ramp = Math.min(1, power.ramp + dt / seconds);
    }

    const t = state.clock.getElapsedTime();
    const eased = 1 - Math.pow(1 - power.ramp, 3);
    const flicker =
      power.ramp > 0 && power.ramp < 0.45 && Math.sin(t * 55) < -0.2 ? 0.15 : 1;
    power.glow = eased * flicker;
    power.rise = eased;

    eyeMat.opacity = power.glow;
    const tipPulse =
      power.ramp < 1 ? power.glow * (0.5 + 0.5 * Math.abs(Math.sin(t * 9))) : 1;
    antennaTipMat.color.copy(antennaTipOff).lerp(antennaTipOn, tipPulse);

    bodyRef.current.position.y = THREE.MathUtils.lerp(-0.6, -0.3, power.rise);
    bodyRef.current.scale.setScalar(0.92 + 0.08 * power.rise);

    const tx = THREE.MathUtils.clamp(state.pointer.x, -1, 1) * power.rise;
    const ty = THREE.MathUtils.clamp(state.pointer.y, -1, 1) * power.rise;

    const maxMoveX = state.viewport.width / 3.5;
    const targetPosX = tx * maxMoveX;
    bodyRef.current.position.x = THREE.MathUtils.lerp(
      bodyRef.current.position.x,
      targetPosX,
      config.moveSpeed * dt,
    );

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    const bodyTargetRotY = -relativeX * config.bodyTiltY;

    const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * 0.25;

    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      bodyTargetRotY,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(
      bodyRef.current.rotation.x,
      bodyTargetRotX,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(
      bodyRef.current.rotation.z,
      bodyTargetRotZ,
      config.bodyRotSpeed * dt,
    );

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      headTargetRotY,
      config.headRotSpeed * dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      headTargetRotX,
      config.headRotSpeed * dt,
    );
  });

  useEffect(() => {
    let mounted = true;
    let generatedMaps: {
      colorMap: THREE.CanvasTexture;
      bumpMap: THREE.CanvasTexture;
    } | null = null;

    generatePbrTexturesAsync().then((res) => {
      if (mounted) {
        generatedMaps = res;
        setTextures(res);
      } else {
        res.colorMap.dispose();
        res.bumpMap.dispose();
      }
    });

    return () => {
      mounted = false;

      if (generatedMaps) {
        generatedMaps.colorMap.dispose();
        generatedMaps.bumpMap.dispose();
      }
    };
  }, []);

  const handlePointerDown = (
    e: import("@react-three/fiber").ThreeEvent<PointerEvent>,
  ) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));

    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));

    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));

    points.push(
      new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH),
    );

    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));

    points.push(
      new THREE.Vector2(
        neckParams.innerR,
        neckParams.lipTopH - neckParams.innerDropH,
      ),
    );
    return points;
  }, [neckParams]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0a0a0f",
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  if (!textures.colorMap) return null;

  return (
    <group
      ref={bodyRef}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry
          args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]}
        />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh
          position={[0, bodyParams.bodyBevelY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry
            args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]}
          />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures.colorMap || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.005}
            roughness={1.0}
            metalness={metalness}
            envMapIntensity={0.0}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule
          color={design.pantallaColor}
          power={design.pantallaGrosor}
          intensity={design.pantallaBrillo}
          powerRef={powerRef}
        />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-design.separacionOjos, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
            powerRef={powerRef}
          />
          <RobotEye
            position={[design.separacionOjos, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
            powerRef={powerRef}
          />
        </group>

        <RobotEar
          position={[-0.29, 0, 0]}
          isLeft={true}
          scale={design.tamañoOrejas}
        />
        <RobotEar
          position={[0.29, 0, 0]}
          isLeft={false}
          scale={design.tamañoOrejas}
        />
      </group>
    </group>
  );
}

export interface RobotHeroNavItem {
  label: string;
  href: string;
  target?: string;
}

export interface RobotHeroProps {
  backdrop?: ReactNode;
  intro?: (state: { revealed: boolean; instant: boolean }) => ReactNode;
  navItemsLeft?: RobotHeroNavItem[];
  contactText?: string;
  contactHref?: string;
  contactTarget?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  navExtra?: ReactNode;
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  showNavbar?: boolean;
  bootLines?: string[];
  bootSkipHint?: string;
}

function AntennaNavbar({
  leftItems,
  contactText,
  contactHref,
  contactTarget,
  ctaText,
  onCtaClick,
  navExtra,
}: {
  leftItems: RobotHeroNavItem[];
  contactText: string;
  contactHref: string;
  contactTarget?: string;
  ctaText: string;
  onCtaClick?: () => void;
  navExtra?: ReactNode;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const lineOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  return (
    <nav className="sticky top-0 z-50 w-full pt-8 px-8 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col relative pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between relative gap-4 lg:gap-0">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 z-20">
            {leftItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-7 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-foreground transition-all overflow-hidden hover:border-accent hover:text-accent"
              >
                {item.label}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navbar-indicator-left"
                    className="absolute inset-0 border-b-[3px] border-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto cursor-pointer group z-10">
            <div className="relative flex items-center justify-center h-12 w-16">
              <div className="absolute left-2 w-1.5 h-4 rounded-l-md bg-white/20 transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute right-2 w-1.5 h-4 rounded-r-md bg-white/20 transition-transform duration-300 group-hover:translate-x-1" />

              <div className="z-10 w-10 h-10 bg-white/10 border-2 border-white/20 backdrop-blur-md rounded-[12px] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)]">
                <div className="w-[70%] h-[60%] bg-[#0a0a0a] rounded-lg flex items-center justify-center gap-1.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="w-1.5 h-3 rounded-[2px] bg-accent shadow-[0_0_8px_#8b5cf6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                  <div className="w-1.5 h-3 rounded-[2px] bg-accent shadow-[0_0_8px_#8b5cf6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2 sm:gap-3 w-full lg:w-auto mt-4 lg:mt-0 z-20">
            {navExtra}
            <a
              href={contactHref}
              target={contactTarget}
              rel={
                contactTarget === "_blank" ? "noopener noreferrer" : undefined
              }
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent sm:px-7 sm:text-sm"
            >
              {contactText}
            </a>
            <button
              type="button"
              onClick={onCtaClick}
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#7c4fe0] sm:px-7 sm:text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              {ctaText}
              <ShoppingBag size={18} aria-hidden />
            </button>
          </div>
        </div>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="mt-6 w-full border-b-2 border-dotted border-white/10"
        />
      </div>
    </nav>
  );
}

export function RobotHero({
  backdrop,
  intro,
  navItemsLeft = [
    { label: "Product", href: "#" },
    { label: "About", href: "#" },
    { label: "Specs", href: "#" },
    { label: "Reviews", href: "#" },
  ],
  contactText = "Contact",
  contactHref = "#",
  contactTarget,
  ctaText = "Buy Now",
  onCtaClick,
  navExtra,
  color = "#1a1a24",
  scale = 1,
  pantallaColor = "#8b5cf6",
  pantallaBrillo = 1.4,
  blinkCycle = 3.0,
  metalness = 0.2,
  showNavbar = false,
  bootLines = ["> initializing...", "> hello, world."],
  bootSkipHint = "click or press any key to skip",
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const boot = useBootSequence();
  const contentRevealed = bootPhaseAtLeast(boot.phase, "reveal");

  const entorno = {
    luzAmbiente: 0.55,
    luzPrincipal: 0.35,
    luzPrincipalColor: "#8b5cf6",
    luzRelleno: 0.2,
    luzRellenoColor: "#4c1d95",
    sombraOpacidad: 0.65,
    sombraBlur: 1.7,
  };

  return (
    <section
      id="topo"
      ref={containerRef}
      className={
        intro
          ? "relative min-h-dvh w-full overflow-hidden pt-16 lg:h-dvh lg:min-h-[600px] lg:pt-20"
          : "relative h-dvh min-h-[600px] w-full overflow-hidden pt-16 lg:pt-20"
      }
    >
      <div
        className={
          intro
            ? "relative mx-auto grid h-full w-full max-w-6xl gap-4 px-5 pb-10 pt-10 lg:grid-cols-2 lg:items-center lg:gap-0 lg:py-0"
            : "relative h-full w-full"
        }
      >
        {intro ? (
          <div className="relative z-20">
            {intro({ revealed: contentRevealed, instant: boot.instant })}
          </div>
        ) : null}

        <div
          className={intro ? "relative h-[55vh] lg:h-full" : "relative h-full"}
        >
          {backdrop ? (
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 opacity-30 lg:pointer-events-auto lg:opacity-60">
              <motion.div
                className={
                  intro ? "w-full max-w-xl" : "w-full max-w-xl lg:max-w-3xl"
                }
                initial={false}
                animate={
                  contentRevealed
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 0.9, filter: "blur(8px)" }
                }
                transition={
                  boot.instant
                    ? { duration: 0 }
                    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {backdrop}
              </motion.div>
            </div>
          ) : null}

          <div className="absolute inset-0 z-10">
            <Canvas
              shadows
              camera={{ position: [0, 0.2, 6], fov: 40 }}
              eventSource={containerRef}
              onCreated={(state) =>
                state.setEvents({ compute: computePointerFromCanvas })
              }
            >
              <ambientLight intensity={entorno.luzAmbiente} color="#ffffff" />

              <directionalLight
                position={[0, 6, 3]}
                intensity={entorno.luzPrincipal}
                color={entorno.luzPrincipalColor}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0005}
              >
                <orthographicCamera
                  attach="shadow-camera"
                  args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]}
                />
              </directionalLight>

              <directionalLight
                position={[-5, 2, -5]}
                intensity={entorno.luzRelleno}
                color={entorno.luzRellenoColor}
              />

              <Environment preset="studio" blur={0.5} />

              <ResponsiveGroup scale={scale}>
                <ContactShadows
                  position={[0, -0.79, 0]}
                  opacity={entorno.sombraOpacidad}
                  scale={15}
                  resolution={1024}
                  blur={entorno.sombraBlur}
                  far={2.5}
                  color="#000000"
                />
                <RobotPrototype
                  neckParams={{
                    baseR: 0.215,
                    baseH: -0.05,
                    midR: 0.28,
                    midH: 0.02,
                    lipBottomR: 0.295,
                    lipBottomH: 0.045,
                    lipTopR: 0.27,
                    lipTopH: 0.055,
                    innerR: 0.1,
                    innerDropH: 0.0,
                  }}
                  bodyParams={{
                    bodyBevelR: 0.235,
                    bodyBevelY: 0.34,
                    bodyBevelT: 0.025,
                  }}
                  color={color}
                  pantallaColor={pantallaColor}
                  pantallaBrillo={pantallaBrillo}
                  blinkCycle={blinkCycle}
                  metalness={metalness}
                  bootPhase={boot.phase}
                  bootInstant={boot.instant}
                />
              </ResponsiveGroup>
            </Canvas>
          </div>
        </div>
      </div>

      {showNavbar ? (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
          <AntennaNavbar
            leftItems={navItemsLeft}
            contactText={contactText}
            contactHref={contactHref}
            contactTarget={contactTarget}
            ctaText={ctaText}
            onCtaClick={onCtaClick}
            navExtra={navExtra}
          />

          <div className="relative w-full max-w-[1400px] mx-auto px-8 flex-1 flex flex-col">
            <div className="mt-auto flex justify-between items-end pb-12 w-full"></div>
          </div>
        </div>
      ) : null}

      <BootTerminal
        visible={boot.phase === "terminal"}
        lines={bootLines}
        skipHint={bootSkipHint}
      />
    </section>
  );
}

export default RobotHero;
