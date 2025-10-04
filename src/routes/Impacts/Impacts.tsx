'use client'

import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { getMinElevationFromTexture } from './ImpactsUtils'
import { mapboxInterceptor } from '../../utils/mapbox'
import { useEffect, useState } from 'react'
import { DamagedSurface } from './components/DamagedSurface'
import { DEM_SCALE } from './ImpactsConfig'
import { OriginalSurface } from './components/OriginalSurface'
import { SplitViewer } from './components/SplitViewer'
import { ClockContext } from './contexts/ClockContext'
import { ImpactsScene } from './components/ImpactsScene'
import { Flash } from './components/Flash'

export const Impacts = () => {
  const colorMap = useLoader(THREE.TextureLoader, mapboxInterceptor('/sac25/colorMap.jpeg'))
  const heightMap = useLoader(THREE.TextureLoader, mapboxInterceptor('/sac25/heightMap.png'))
  const [lowestPoint, setLowestPoint] = useState(0)
  useEffect(() => {
    getMinElevationFromTexture(heightMap, DEM_SCALE).then(value => setLowestPoint(value))
  }, [heightMap])

  return (
    <ClockContext.Provider value={{ start: performance.now(), progress: 0 }}>
      <div style={{ height: '100vh' }}>
        <SplitViewer
          before={<OriginalSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} />}
          after={
            <ImpactsScene>
              <DamagedSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} />
              <Flash />
            </ImpactsScene>
          }
        />
      </div>
    </ClockContext.Provider>
  )
}

