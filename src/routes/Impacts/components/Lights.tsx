import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { Color } from "three"

export const Lights = () => {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new Color('#87CEEB')
  }, [scene])

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
