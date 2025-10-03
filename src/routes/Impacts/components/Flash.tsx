import * as THREE from 'three'
import { useContext, useRef } from "react"
import { ClockContext } from "../contexts/ClockContext"
import { useFrame } from "@react-three/fiber"
import { FakeGlowMaterial } from "./FakeGlowMaterial"
import { quadraticBezier } from '../ImpactsUtils'

export const Flash = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const geomRef = useRef<THREE.SphereGeometry>(null)
  const matRef = useRef<THREE.Material>(null)
  const clock = useContext(ClockContext)

  useFrame(() => {
    if (!meshRef.current || !geomRef.current || !matRef.current) return
    const factor =  clock.progress / 5000
    if (factor > 1) {
      if (meshRef.current.parent) meshRef.current.removeFromParent()
      return
    }
    const qFactor = quadraticBezier(factor, 0, 0.8, 0.8)
    const scale = qFactor * 100
    meshRef.current.scale.set(scale, scale, scale)
    console.log(qFactor)
    matRef.current.opacity = 0 // Math.sin(qFactor)
  })

  return (
    <>
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <sphereGeometry ref={geomRef} args={[0.05, 32, 32]} />
        <FakeGlowMaterial ref={matRef} glowColor={'white'} />
      </mesh>
    </>
  )
}
