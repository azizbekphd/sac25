import * as THREE from 'three'
import type { SurfaceTextures } from '../ImpactsTypes'
import { useFrame } from '@react-three/fiber'
import { useContext, useRef } from 'react'
import { quadraticBezier } from '../ImpactsUtils'
import { ClockContext } from '../contexts/ClockContext'
import { ImpactDataContext } from '../contexts/ImpactDataContext'

interface DamagedSurfaceProps {
  textures: SurfaceTextures
  lowestPoint: number
}

export const DamagedSurface = ({ textures, lowestPoint }: DamagedSurfaceProps) => {
  const clock = useContext(ClockContext)
  const impactData = useContext(ImpactDataContext)

  const uniforms = useRef({
    elevTexture: { value: textures.heightMap },
    colorTexture: { value: textures.colorMap },
    craterRadius: { value: impactData.crater.diameter / 2 },
    craterCenter: { value: new THREE.Vector3(0, 0, 0) },
    craterDepth: { value: impactData.crater.depth },
    rimWidth: { value: impactData.crater.rimWidth },
    rimHeight: { value: impactData.crater.rimHeight }
  })
  useFrame(() => {
    const factor = quadraticBezier(Math.min(1, clock.progress / 5000), 0, 0.7, 0.7)
    const { crater: c } = impactData
    uniforms.current.craterRadius.value = (c.diameter / 2) * factor
    uniforms.current.craterDepth.value = c.depth * factor
    uniforms.current.rimWidth.value = c.rimWidth * factor
    uniforms.current.rimHeight.value = c.rimHeight * factor
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -lowestPoint, 0]} receiveShadow>
      <planeGeometry args={[impactData.tile.size, impactData.tile.size, 1024, 1024]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          varying float vD;
          uniform sampler2D elevTexture;
          uniform float craterRadius;
          uniform vec3 craterCenter;
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

            float d = distance(position, craterCenter);
            vD = 0.0;
            if (d <= craterRadius) {
              float dUv = sqrt(craterRadius * craterRadius - d * d) / craterRadius;
              height -= dUv * craterDepth - rimHeight;
              vD = max(dUv, 1.0);
            } else if (d <= craterRadius + rimWidth) {
              float x = d - craterRadius;
              float rimProfile = smoothstep(rimWidth, 0.0, x);
              height += rimProfile * rimHeight;
              vD = 1.0 - x / rimWidth;
            }

            vec3 displacedPosition = position;
            displacedPosition.z += height;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vD;
          uniform sampler2D colorTexture;

          void main() {
            gl_FragColor = mix(texture2D(colorTexture, vUv), vec4(0.16, 0.078, 0.016, 1.0), vD < 0.001 ? 0.0 : min(vD, 0.8));
          }
        `}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
