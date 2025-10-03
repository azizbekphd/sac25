'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { getMinElevationFromTexture, mapboxInterceptor } from './ImpactsUtils'
import { useEffect, useState } from 'react'
import { DamagedSurface } from './components/DamagedSurface'
import { DEM_SCALE } from './ImpactsConfig'

export const Impacts = () => {
  const colorMap = useLoader(THREE.TextureLoader, mapboxInterceptor('/sac25/colorMap.jpeg'))
  const heightMap = useLoader(THREE.TextureLoader, mapboxInterceptor('/sac25/heightMap.png'))
  const [lowestPoint, setLowestPoint] = useState(0)
  useEffect(() => {
    getMinElevationFromTexture(heightMap, DEM_SCALE).then(value => setLowestPoint(value))
  }, [heightMap])

  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ position: [1, 1, 1], fov: 60 }}>
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
        {/* <OriginalSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} /> */}
        <DamagedSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} />
      </Canvas>
    </div>
  )
}

