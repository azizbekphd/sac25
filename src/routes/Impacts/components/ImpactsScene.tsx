import React, { useContext } from "react";
import { ClockContext } from "../contexts/ClockContext";
import { useFrame } from "@react-three/fiber";

export const ImpactsScene = ({children}: React.PropsWithChildren) => {
  const clock = useContext(ClockContext)

  useFrame(() => {
    clock.progress = performance.now() - clock.start
  })

  return (
    <>
      { children }
    </>
  )
}
