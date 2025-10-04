import * as THREE from 'three'

function decodeElevation(R: number, G: number, B: number): number {
  return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
}

export async function getMinElevationFromTexture(
  texture: THREE.Texture,
  scale: number = 1
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

  let min = Infinity
  for (let i = 0; i < data.length; i += 4) {
    const R = data[i]
    const G = data[i + 1]
    const B = data[i + 2]
    const elev = decodeElevation(R, G, B)
    if (elev < min) min = elev
  }

  return min * scale
}

export function quadraticBezier(t: number, p0: number, p1: number, p2: number) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}
