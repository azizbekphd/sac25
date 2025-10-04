import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Lights } from './Lights'

type SplitViewerProps = {
  before: React.JSX.Element
  after: React.JSX.Element
}

export const SplitViewer = ({ before, after }: SplitViewerProps) => {
  const leftRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(0.05)
  const dragging = useRef(false)

  const onMouseDown = () => (dragging.current = true)
  const onMouseUp = () => (dragging.current = false)
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return
    if (!leftRef.current?.parentElement) return
    const rect = leftRef.current.parentElement.getBoundingClientRect()
    const ratio = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width))
    setSplit(ratio)
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const camera = useMemo(() => {
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(-6, 6, 6)
    camera.fov = 60
    return camera
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Split container refs */}
      <div
        ref={leftRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: `inset(0 ${100 - split * 100}% 0 0)`,
          overflow: 'hidden',
        }}
      >
        <Canvas camera={camera}>
          <Lights />
          <OrbitControls makeDefault />

          { before }
        </Canvas>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: `inset(0 0 0 ${split * 100}%)`,
          overflow: 'hidden',
        }}
      >
        <Canvas camera={camera}>
          <Lights />
          <OrbitControls makeDefault />

          { after }
        </Canvas>
      </div>

      {/* Divider */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          left: `${split * 100}%`,
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'rgba(255,255,255,0.8)',
          cursor: 'ew-resize',
          zIndex: 10,
        }}
      />
    </div>
  )
}
