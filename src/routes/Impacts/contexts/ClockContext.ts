import { createContext } from "react"

export const ClockContext = createContext({
  start: -1,
  progress: 0
})
