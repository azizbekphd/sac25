import { useMemo, forwardRef, useImperativeHandle, useRef } from "react"
import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import type { Side } from "three"
import { AdditiveBlending, Color, FrontSide } from "three"
import type { ColorRepresentation } from "three"

type Props = {
  falloff?: number
  glowInternalRadius?: number
  glowColor?: ColorRepresentation
  glowSharpness?: number
  side?: Side
  depthTest?: boolean
  depthWrite?: boolean
}

/**
 * FakeGlow material component with a forwardRef so you can access the material.
 */
declare module "@react-three/fiber" {
  interface ThreeElements {
    fakeGlowMaterial: ThreeElements['shaderMaterial'] & Props
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _FakeGlowMaterial = forwardRef<any, Props>(function FakeGlowMaterial(
  {
    falloff = 0.1,
    glowInternalRadius = 6,
    glowColor = "#00ff00",
    glowSharpness = 1,
    side = FrontSide,
    depthTest = true,
    depthWrite = false,
    ...restProps
  },
  ref
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)

  useImperativeHandle(ref, () => materialRef.current)

  const Material = useMemo(() => {
    const mat = shaderMaterial(
      {
        falloffAmount: falloff,
        glowInternalRadius,
        glowColor: new Color(glowColor),
        glowSharpness,
        depthTest,
        depthWrite,
      },
      // vertex shader
      `
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz;
      }
      `,
      // fragment shader
      `
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;
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
        gl_FragColor = vec4(clamp(glowColor * fresnel, 0.0, 1.0), clamp(fakeGlow, 0.0, 1.0));
      }
      `
    )
    return mat
  }, [falloff, glowInternalRadius, glowColor, glowSharpness, depthTest, depthWrite])

  // Ensure the custom material is registered with JSX
  extend({ FakeGlowMaterial: Material })

  return (
    <fakeGlowMaterial
      ref={materialRef}
      side={side}
      transparent={true}
      blending={AdditiveBlending}
      {...restProps}
    />
  )
})

export const FakeGlowMaterial = _FakeGlowMaterial

