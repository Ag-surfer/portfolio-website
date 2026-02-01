'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GLOBE_RADIUS = 1.8;

// Notable cities: [lat, lng, label]
const CITIES: [number, number, string][] = [
  [37.77, -122.42, 'San Francisco'],
  [40.71, -74.01, 'New York'],
  [51.51, -0.13, 'London'],
  [48.86, 2.35, 'Paris'],
  [35.68, 139.69, 'Tokyo'],
  [22.32, 114.17, 'Hong Kong'],
  [-33.87, 151.21, 'Sydney'],
  [1.35, 103.82, 'Singapore'],
  [55.76, 37.62, 'Moscow'],
  [19.43, -99.13, 'Mexico City'],
  [-23.55, -46.63, 'São Paulo'],
  [28.61, 77.21, 'Delhi'],
  [31.23, 121.47, 'Shanghai'],
  [25.20, 55.27, 'Dubai'],
  [-1.29, 36.82, 'Nairobi'],
];

// Connections between cities (index pairs)
const ARCS: [number, number][] = [
  [0, 4],  // SF → Tokyo
  [0, 1],  // SF → NYC
  [1, 2],  // NYC → London
  [2, 3],  // London → Paris
  [3, 8],  // Paris → Moscow
  [4, 5],  // Tokyo → Hong Kong
  [5, 7],  // Hong Kong → Singapore
  [7, 6],  // Singapore → Sydney
  [1, 10], // NYC → São Paulo
  [2, 14], // London → Nairobi
  [11, 13], // Delhi → Dubai
  [12, 4], // Shanghai → Tokyo
  [9, 10], // Mexico City → São Paulo
];

function useTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    return () => {
      texture?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return texture;
}

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function coordsToPoints(coords: number[][], radius: number): THREE.Vector3[] {
  return coords.map(([lng, lat]) => latLngToVec3(lat, lng, radius));
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

interface GeoJSONFeature {
  type: string;
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

function useCountryLines() {
  const [geojson, setGeojson] = useState<GeoJSONData | null>(null);

  useEffect(() => {
    fetch('/data/world-110m.geojson')
      .then((r) => r.json())
      .then(setGeojson)
      .catch(() => {});
  }, []);

  return useMemo(() => {
    if (!geojson) return null;

    const positions: number[] = [];

    for (const feature of geojson.features) {
      const { type, coordinates } = feature.geometry;

      const rings: number[][][] =
        type === 'Polygon'
          ? (coordinates as number[][][])
          : type === 'MultiPolygon'
            ? (coordinates as number[][][][]).flat()
            : [];

      for (const ring of rings) {
        const pts = coordsToPoints(ring, GLOBE_RADIUS + 0.002);
        for (let i = 0; i < pts.length - 1; i++) {
          positions.push(pts[i].x, pts[i].y, pts[i].z);
          positions.push(pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        }
      }
    }

    return new Float32Array(positions);
  }, [geojson]);
}

/** Build a curved arc between two points on the globe */
function buildArcCurve(
  from: THREE.Vector3,
  to: THREE.Vector3,
  segments: number = 48
): Float32Array {
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  // Push midpoint outward for arc height
  const dist = from.distanceTo(to);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.35);

  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  const points = curve.getPoints(segments);
  const arr = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = p.z;
  });
  return arr;
}

/** Animated arc that draws itself and pulses */
function AnimatedArc({
  from,
  to,
  delay,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  delay: number;
}) {
  const lineObj = useMemo(() => {
    const positions = buildArcCurve(from, to, 48);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#4a90d9',
      transparent: true,
      opacity: 0,
    });
    return new THREE.Line(geom, mat);
  }, [from, to]);

  const totalPoints = useMemo(() => {
    const attr = lineObj.geometry.getAttribute('position');
    return attr.count;
  }, [lineObj]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mat = lineObj.material as THREE.LineBasicMaterial;

    // Cycle: draw in, hold, fade out
    const cycle = ((t + delay) % 6) / 6;
    if (cycle < 0.4) {
      const drawProgress = cycle / 0.4;
      lineObj.geometry.setDrawRange(0, Math.floor(drawProgress * totalPoints));
      mat.opacity = 0.6;
    } else if (cycle < 0.7) {
      lineObj.geometry.setDrawRange(0, totalPoints);
      mat.opacity = 0.6;
    } else {
      const fadeProgress = (cycle - 0.7) / 0.3;
      lineObj.geometry.setDrawRange(0, totalPoints);
      mat.opacity = 0.6 * (1 - fadeProgress);
    }
  });

  return <primitive object={lineObj} />;
}

/** Glowing dot at a city location */
function CityDot({ position }: { position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseScale = useRef(0.8 + Math.random() * 0.4);
  const phaseOffset = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + 0.3 * Math.sin(t * 2 + phaseOffset.current);
    meshRef.current.scale.setScalar(baseScale.current * pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color="#4a90d9" transparent opacity={0.9} />
    </mesh>
  );
}

/** Ring pulse that radiates outward from a city dot */
function PulseRing({ position }: { position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phaseOffset = useRef(Math.random() * Math.PI * 2);

  // Orient the ring to face outward from globe center
  const quaternion = useMemo(() => {
    const dir = position.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    return new THREE.Euler().setFromQuaternion(q);
  }, [position]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() + phaseOffset.current) % 3) / 3;
    const scale = 1 + t * 3;
    meshRef.current.scale.setScalar(scale);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.4 * (1 - t);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={quaternion}>
      <ringGeometry args={[0.02, 0.03, 16]} />
      <meshBasicMaterial
        color="#4a90d9"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const countryPositions = useCountryLines();

  const dayMap = useTexture('/textures/earth-day.jpg');
  const bumpMap = useTexture('/textures/earth-topology.png');
  const specMap = useTexture('/textures/earth-water.png');

  // Pre-compute city positions and arc data
  const cityPositions = useMemo(
    () => CITIES.map(([lat, lng]) => latLngToVec3(lat, lng, GLOBE_RADIUS + 0.005)),
    []
  );

  const arcData = useMemo(
    () =>
      ARCS.map(([fromIdx, toIdx], i) => ({
        from: cityPositions[fromIdx],
        to: cityPositions[toIdx],
        delay: i * 0.7, // stagger each arc
      })),
    [cityPositions]
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Continuous rotation
    groupRef.current.rotation.y += 0.0015;

    // Gentle floating bob
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.06;

    // Pulsing atmosphere glow
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + 0.04 * Math.sin(t * 0.8);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0.05]}>
      {/* Textured earth sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        {dayMap ? (
          <meshPhongMaterial
            map={dayMap}
            bumpMap={bumpMap ?? undefined}
            bumpScale={0.03}
            specularMap={specMap ?? undefined}
            specular={new THREE.Color(0x333333)}
            shininess={15}
          />
        ) : (
          <meshBasicMaterial transparent opacity={0.05} color="#888" />
        )}
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.02, 64, 64]} />
        <meshBasicMaterial
          color="#4a90d9"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Country border outlines */}
      {countryPositions && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[countryPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </lineSegments>
      )}

      {/* City dots with pulse rings */}
      {cityPositions.map((pos, i) => (
        <group key={`city-${i}`}>
          <CityDot position={pos} />
          <PulseRing position={pos} />
        </group>
      ))}

      {/* Animated connection arcs */}
      {arcData.map((arc, i) => (
        <AnimatedArc key={`arc-${i}`} from={arc.from} to={arc.to} delay={arc.delay} />
      ))}
    </group>
  );
}
