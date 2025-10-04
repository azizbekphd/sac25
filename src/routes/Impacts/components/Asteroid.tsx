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
    const velocity = 1
    speed.current += delta * velocity
    asteroidRef.current.position.y -= speed.current
    if (asteroidRef.current.position.y <= 0 && performance.now() >= 3000) {
      asteroidRef.current.removeFromParent()
      if (clock.start === -1) clock.start = performance.now()
    }
  })

  return (
    <>
      <UnwrappedModel
        ref={asteroidRef}
        source={'/sac25/models/asteroid.glb'}
        position={new THREE.Vector3(0, 100, 0)}
        scale={0.0003}
        color={'grey'}
      />
    </>
  )
}
