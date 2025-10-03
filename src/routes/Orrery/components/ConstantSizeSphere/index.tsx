import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';


type ConstantSizeSphereProps = {
    size: number;
    color: string;
}


function ConstantSizeSphere({ size, color }: ConstantSizeSphereProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  useFrame(() => {
    if (ref.current) {
      const distance = ref.current.position.distanceTo(camera.position);
      const scaleFactor = distance * 0.01;
      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, size, size]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default ConstantSizeSphere;
