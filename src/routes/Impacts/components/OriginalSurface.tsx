import * as THREE from 'three'
import type { SurfaceTextures } from '../ImpactsTypes'
import { DEM_SCALE } from '../ImpactsConfig'

interface OriginalSurfaceProps {
  textures: SurfaceTextures
  lowestPoint: number
}

export const OriginalSurface = ({ textures, lowestPoint }: OriginalSurfaceProps) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -lowestPoint, 0]} receiveShadow>
      <planeGeometry args={[5, 5, 1024, 1024]} />
      <shaderMaterial
        uniforms={{
          elevTexture: { value: textures.heightMap },
          colorTexture: { value: textures.colorMap },
          scale: { value: DEM_SCALE },
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
  )
}
