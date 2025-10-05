'use client'

import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { calculateImpactData, getMinElevationFromTexture } from './ImpactsUtils'
import { mapboxInterceptor } from '../../utils/mapbox'
import { useEffect, useMemo, useState } from 'react'
import { DamagedSurface } from './components/DamagedSurface'
import { OriginalSurface } from './components/OriginalSurface'
import { SplitViewer } from './components/SplitViewer'
import { ClockContext } from './contexts/ClockContext'
import { ImpactsScene } from './components/ImpactsScene'
import { Flash } from './components/Flash'
import { Explosion } from './components/Explosion'
import { Asteroid } from './components/Asteroid'
import MultipleContextProvider from '../Orrery/MultipleContextProvider'
import { ImpactDataContext, type ImpactDataContextType } from './contexts/ImpactDataContext'
import { useSearchParams } from 'react-router-dom'
import ImpactInfoPanel from './components/ImpactInfo'

export const Impacts = () => {
  const [searchParams] = useSearchParams()
  const impactData = useMemo<ImpactDataContextType>(() => calculateImpactData({
    lat: parseFloat(searchParams.get('lat') ?? '0'),
    lng: parseFloat(searchParams.get('lng') ?? '0'),
    densImp: parseFloat(searchParams.get('densImp') ?? '3'),
    dImp: parseFloat(searchParams.get('diameter') ?? '1'),
    vImp: parseFloat(searchParams.get('speed') ?? '16.98752'),
    angle: parseFloat(searchParams.get('angle') ?? '45')
  }), [searchParams])
  const tileParams = useMemo(() => {
    // return `${impactData.tile.zoom}/${impactData.tile.x}/${impactData.tile.y}`
    return "9/380/214"
  }, [impactData.tile])
  const colorMap = useLoader(THREE.TextureLoader, mapboxInterceptor(`https://api.mapbox.com/v4/mapbox.satellite/${tileParams}@2x.png`))
  const heightMap = useLoader(THREE.TextureLoader, mapboxInterceptor(`https://api.mapbox.com/v4/mapbox.terrain-rgb/${tileParams}@2x.pngraw`))
  const [lowestPoint, setLowestPoint] = useState(0)
  useEffect(() => {
    getMinElevationFromTexture(heightMap).then(value => setLowestPoint(value))
  }, [heightMap])

  return (
    <MultipleContextProvider contexts={[
       { context: ClockContext, value: { start: -1, progress: 0 } },
       { context: ImpactDataContext, value: impactData }
     ]}>
      <div style={{ height: '100vh', position: "relative" }}>
        <SplitViewer
          before={<OriginalSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} />}
          after={
            <ImpactsScene>
              <DamagedSurface textures={{ colorMap, heightMap }} lowestPoint={lowestPoint} />
              <Flash />
              <Explosion />
              <Asteroid />
            </ImpactsScene>
          }
        />
        <ImpactInfoPanel />
      </div>
    </MultipleContextProvider>
  )
}

