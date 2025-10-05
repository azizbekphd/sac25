import * as THREE from 'three'
// import * as cover from '../../utils/tile-cover'
import { EQUATOR } from './ImpactsConfig'
import type { ImpactDataContextType } from './contexts/ImpactDataContext'

function decodeElevation(R: number, G: number, B: number): number {
  return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
}

export async function getMinElevationFromTexture(
  texture: THREE.Texture,
): Promise<number> {
  await new Promise<void>((resolve) => {
    if (texture.image) resolve()
    else texture.onUpdate = () => resolve()
  })

  const image = texture.image as HTMLImageElement
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = image.width
  canvas.height = image.height

  ctx.drawImage(image, 0, 0)
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const start = Math.floor(data.length / 4 / 2) * 4
  return decodeElevation(data[start], data[start + 1], data[start + 2])
}

export function quadraticBezier(t: number, p0: number, p1: number, p2: number) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export function tileSizeAtZoomLevel(level: number) {
  return EQUATOR / Math.pow(2, level)
}

const g022 = Math.pow(9.81, -0.22)
const densTarg = 2.835
export function calculateImpactData({
  // lat, lng,
  densImp, dImp, vImp, angle
}: {
  lat: number,
  lng: number,
  densImp: number,
  dImp: number,
  vImp: number,
  angle: number
}): ImpactDataContextType {
  const theta = Math.PI * angle / 180
  const Dtc = 1.161 * Math.pow(densImp / densTarg, 1 / 3) * Math.pow(dImp, 0.78) * Math.pow(vImp, 0.44) * g022 * Math.pow(theta, 1 / 3) * 1000
  const htr = Dtc / 14.1
  const dtc = Dtc / (2 * Math.sqrt(2))
  const Dtr = Dtc * Math.sqrt((dtc + htr) / dtc)

  const E = (Math.PI / densImp) * Math.pow(dImp, 3) * Math.pow(vImp * 1000, 2)
  const Rfx = 0.002 * Math.pow(E, 1 / 3) * 1000
  const asteroidDistance = dImp * 1000 * 100

  const cosO = Math.cos(theta)
  const sinO = Math.sin(theta)

  const spaceNeeded = Dtr * 10
  let zoom = 11
  let tileSize = 0
  do {
    zoom--
    tileSize = tileSizeAtZoomLevel(zoom)
  } while (spaceNeeded >= tileSize)

  // const tile = cover.tiles({ type: "Point", coordinates: [lat, lng] }, { max_zoom: zoom })[0]

  return {
    timing: {
      asteroidFall: 3000,
      craterFormation: 5000,
      fireball: 4000,
      airBlast: 2000
    },
    tile: {
      zoom: zoom,
      size: tileSize,
      x: 380, //tile[0],
      y: 214 // tile[1]
    },
    asteroid: {
      diameter: dImp * 1000,
      position: [cosO * asteroidDistance, sinO * asteroidDistance, cosO * asteroidDistance],
      velocity: [cosO * vImp * 20, sinO * vImp * 20, cosO * vImp * 20]
    },
    crater: {
      diameter: Dtr,
      depth: dtc,
      rimHeight: htr,
      rimWidth: htr * 3,
    },
    fireball: {
      radius: Rfx
    }
  }
}
