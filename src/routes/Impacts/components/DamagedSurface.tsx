import * as THREE from 'three'
import type { SurfaceTextures } from '../ImpactsTypes'
import { useFrame } from '@react-three/fiber'
import { useContext, useRef } from 'react'
import { DEM_SCALE } from '../ImpactsConfig'
import { quadraticBezier } from '../ImpactsUtils'
import { ClockContext } from '../contexts/ClockContext'

interface DamagedSurfaceProps {
  textures: SurfaceTextures
  lowestPoint: number
}

export const DamagedSurface = ({ textures, lowestPoint }: DamagedSurfaceProps) => {
  const clock = useContext(ClockContext)
  const uniforms = useRef({
    elevTexture: { value: textures.heightMap },
    colorTexture: { value: textures.colorMap },
    scale: { value: DEM_SCALE },
    craterRadius: { value: 0.25 },
    craterCenter: { value: new THREE.Vector2(0.5, 0.5) },
    craterDepth: { value: 3000 },
    rimWidth: { value: 0.1 },
    rimHeight: { value: 1000 }
  })
  useFrame(() => {
    const factor = quadraticBezier(Math.min(1, clock.progress / 5000), 0, 0.7, 0.7)
    uniforms.current.craterRadius.value = 0.25 * factor
    uniforms.current.craterDepth.value = 300 * factor
    uniforms.current.rimWidth.value = 0.05 * factor
    uniforms.current.rimHeight.value = 1000 * factor
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -lowestPoint, 0]} receiveShadow>
      <planeGeometry args={[5, 5, 1024, 1024]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          varying float vD;
          uniform sampler2D elevTexture;
          uniform float scale;
          uniform float craterRadius;
          uniform vec2 craterCenter;
          uniform float craterDepth;
          uniform float rimWidth;
          uniform float rimHeight;

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

            float d = distance(uv, craterCenter);
            vD = 0.0;
            if (d <= craterRadius) {
              float dUv = (1.0 - d / craterRadius) * 11.0;
              height -= dUv * craterDepth - rimHeight;
              vD = max(dUv, 1.0);
            } else if (d <= craterRadius + rimWidth) {
              float x = d - craterRadius;
              float rimProfile = smoothstep(rimWidth, 0.0, x);
              height += rimProfile * rimHeight;
              vD = 1.0 - x / rimWidth;
            }

            vec3 displacedPosition = position;
            displacedPosition.z += height * scale;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vD;
          uniform sampler2D colorTexture;

          void main() {
            gl_FragColor = mix(texture2D(colorTexture, vUv), vec4(0.16, 0.078, 0.016, 1.0), vD < 0.001 ? 0.0 : vD + 0.5);
          }
        `}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
