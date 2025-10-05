import * as THREE from 'three'
import { useContext, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { quadraticBezier } from '../ImpactsUtils'
import { ClockContext } from '../contexts/ClockContext'
import { ImpactDataContext } from '../contexts/ImpactDataContext'

export const Flash = () => {
  const clock = useContext(ClockContext)
  const impactData = useContext(ImpactDataContext)
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useRef({
    falloffAmount: { value: 0.1 },
    glowInternalRadius: { value: 1 },
    glowColor: { value: new THREE.Color(0xffffff) },
    glowSharpness: { value: 2.0 },
    opacity: { value: 1.0 },
  })

  useFrame(() => {
    if (!meshRef.current || !meshRef.current.parent) return
    const factor = clock.progress / 2000
    if (factor >= 1) meshRef.current.removeFromParent()
    const qFactor = quadraticBezier(factor, 0, 0.7, 1)
    const scale = qFactor * 3
    meshRef.current.scale.set(scale, scale, scale)
    uniforms.current.opacity.value = Math.min(Math.sin(factor * Math.PI), 1)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={999}>
      <sphereGeometry args={[impactData.tile.size / 4, 48, 48]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec3 vPosition;
          varying vec3 vNormal;
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
            vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
            vPosition = modelPosition.xyz;
            vNormal = modelNormal.xyz;
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          uniform float falloffAmount;
          uniform float glowSharpness;
          uniform float glowInternalRadius;
          uniform float opacity;
          varying vec3 vPosition;
          varying vec3 vNormal;
          void main()
          {
            vec3 normal = normalize(vNormal);
            if (!gl_FrontFacing) normal = -normal;
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = dot(viewDirection, normal);
            fresnel = pow(fresnel, glowInternalRadius + 0.1);
            float falloff = smoothstep(0.0, falloffAmount, fresnel);
            float fakeGlow = fresnel;
            fakeGlow += fresnel * glowSharpness;
            fakeGlow *= falloff;
            gl_FragColor = vec4(clamp(glowColor * fresnel, 0.0, 1.0), clamp(fakeGlow, 0.0, 1.0) * opacity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthTest={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

