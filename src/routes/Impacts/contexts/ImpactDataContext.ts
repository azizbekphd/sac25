import { createContext } from "react"

export interface ImpactDataContextType {
  timing: {
    asteroidFall: number
    craterFormation: number
    fireball: number
    airBlast: number
  },
  tile: {
    zoom: number
    size: number
    x: number
    y: number
  },
  asteroid: {
    diameter: number
    position: [number, number, number]
    velocity: [number, number, number]
  },
  crater: {
    diameter: number
    depth: number
    rimHeight: number
    rimWidth: number
  },
  fireball: {
    radius: number
  }
}

export const ImpactDataContext = createContext<ImpactDataContextType>({
  timing: {
    asteroidFall: 0,
    craterFormation: 0,
    fireball: 0,
    airBlast: 0
  },
  tile: {
    zoom: 0,
    size: 0,
    x: 0,
    y: 0
  },
  asteroid: {
    diameter: 0,
    position: [0, 0, 0],
    velocity: [0, 0, 0]
  },
  crater: {
    diameter: 0,
    depth: 0,
    rimHeight: 0,
    rimWidth: 0
  },
  fireball: {
    radius: 0
  }
})
