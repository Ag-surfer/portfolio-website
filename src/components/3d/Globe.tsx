'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GLOBE_RADIUS = 1.8;

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

/** Convert lat/lng (degrees) to 3D position on sphere */
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

export function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const countryPositions = useCountryLines();

  const dayMap = useTexture('/textures/earth-day.jpg');
  const bumpMap = useTexture('/textures/earth-topology.png');
  const specMap = useTexture('/textures/earth-water.png');

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
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

      {/* Atmosphere glow (slightly larger translucent sphere) */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.015, 64, 64]} />
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
    </group>
  );
}
