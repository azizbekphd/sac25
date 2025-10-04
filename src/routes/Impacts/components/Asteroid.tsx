import * as THREE from'three'
import { useFrame } from '@react-three/fiber'
import { useContext, useRef } from 'react'
import UnwrappedModel from './UnwrappedModel'
import { ClockContext } from '../contexts/ClockContext'

export const Asteroid = () => {
  const clock = useContext(ClockContext)
  const asteroidRef = useRef<THREE.Group>(null)
  const speed = useRef<number>(0)

  useFrame((_, delta) => {
    if (!asteroidRef.current || !asteroidRef.current.parent) return
    const velocity = 0.01
    speed.current += delta * velocity
    asteroidRef.current.position.y -= speed.current
    if (asteroidRef.current.position.y <= 0 && performance.now() >= 3000) {
      asteroidRef.current.removeFromParent()
      if (clock.start === -1) clock.start = performance.now()
    }
  })

  return (
    <group
      ref={asteroidRef}
      position={new THREE.Vector3(0, 3, 0)}
    >
      <UnwrappedModel
        source={'/sac25/models/asteroid.glb'}
        position={new THREE.Vector3(0, 0, 0)}
        scale={0.0003}
        color={'grey'}
      />
      <mesh
        position={new THREE.Vector3(0, 0, 0)}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[3, 100]} />
        <shaderMaterial
          vertexShader={`
            varying float d;

            void main() {
              d = distance(uv, vec2(0.5, 0.5)) * 3.14159265359;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0.0, 0.0, -0.2 + d), 1.0);
            }
            `}
          fragmentShader={`
            varying float d;

            void main() {
              gl_FragColor = vec4(0.96, 0.58, 0.17, smoothstep(0.2, 0.0, d));
            }
            `}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
