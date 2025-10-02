'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { mapboxInterceptor } from './ImpactsUtils'

export const Impacts = () => {
  const colorTexture = useLoader(THREE.TextureLoader, mapboxInterceptor('https://api.mapbox.com/v4/mapbox.satellite/11/1517/859.png'))
  const heightmapTexture = useLoader(THREE.TextureLoader, mapboxInterceptor('https://api.mapbox.com/v4/mapbox.terrain-rgb/11/1517/859.pngraw'))

  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Controls */}
        <OrbitControls enableDamping dampingFactor={0.1} />

        {/* Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5, 5, 1024, 1024]} />
          <shaderMaterial
            uniforms={{
              elevTexture: { value: heightmapTexture },
              colorTexture: { value: colorTexture },
              scale: { value: 0.0001 }, // scale elevation exaggeration
            }}
            vertexShader={`
              varying vec2 vUv;
              uniform sampler2D elevTexture;
              uniform float scale;

              float decodeElevation(vec3 rgb) {
                return -10000.0 + ((rgb.r * 256.0 * 256.0 +
                                    rgb.g * 256.0 +
                                    rgb.b) * 0.1);
              }

              void main() {
                vUv = uv;
                vec4 elevColor = texture2D(elevTexture, uv);
                vec3 rgb = elevColor.rgb * 255.0;
                float height = decodeElevation(rgb);

                vec3 displacedPosition = position;
                displacedPosition.z += height * scale; // or y if you want vertical in Y

                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
              }
            `}
            fragmentShader={`
              varying vec2 vUv;
              uniform sampler2D colorTexture;

              void main() {
                gl_FragColor = texture2D(colorTexture, vUv);
              }
            `}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Canvas>
    </div>
  )
}

