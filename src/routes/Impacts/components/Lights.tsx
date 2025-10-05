import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useEffect, useMemo } from "react"
import { Color } from "three"
import { ClockContext } from "../contexts/ClockContext"
import { ImpactDataContext } from "../contexts/ImpactDataContext"

export const Lights = () => {
  const clock = useContext(ClockContext)
  const impactData = useContext(ImpactDataContext)
  const { scene, camera } = useThree()
  useEffect(() => {
    scene.background = new Color('#87CEEB')
  }, [scene])

  const minCameraDistance = useMemo(() => {
    return impactData.fireball.radius * 4
  }, [impactData.fireball.radius])

  useFrame(() => {
    if (clock.start !== -1) return
    camera.position.set(
      Math.max(impactData.asteroid.position[0] + impactData.asteroid.diameter, minCameraDistance),
      Math.max(impactData.asteroid.position[1] + impactData.asteroid.diameter, minCameraDistance),
      Math.max(impactData.asteroid.position[2] + impactData.asteroid.diameter, minCameraDistance)
    )
  })

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        position={[0, 1000, 0]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  )
}
