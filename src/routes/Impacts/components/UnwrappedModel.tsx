import * as THREE from "three";
import { dispose } from "@react-three/fiber";
import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from '@react-three/drei';
import { SUN_MODEL_HEIGHT } from '../../Orrery/globals/constants'


type ModelProps = {
    source: string;
    position: THREE.Vector3;
    scale?: number;
    color?: string | null;
};

const UnwrappedModel = React.forwardRef<THREE.Group, ModelProps>(
  ({ 
    source, 
    position, 
    scale = 1, 
    color, 
  }, ref) => {
    const internalModelRef = useRef<THREE.Group>(null!);
    
    const modelRef = useMemo(() => {
        return (instance: THREE.Group | null) => {
            internalModelRef.current = instance!;
            if (typeof ref === 'function') {
                ref(instance);
            } else if (ref) {
                ref.current = instance;
            }
        };
    }, [ref]);
    
    const { scene } = useGLTF(source);
    
    const modelInstance = useMemo(() => {
      return scene.clone();
    }, [scene]);

    const modelSizeCompensationFactor = useMemo(() => {
      const box = new THREE.Box3().setFromObject(modelInstance);
      const size = new THREE.Vector3();
      box.getSize(size);
      return SUN_MODEL_HEIGHT / size.y;
    }, [modelInstance]);

    const finalScale = useMemo(() => {
      return scale * modelSizeCompensationFactor;
    }, [scale, modelSizeCompensationFactor]);

    useEffect(() => {
      if (internalModelRef.current) {
        const pos = Array.isArray(position) 
          ? new THREE.Vector3(...position) 
          : position;
        internalModelRef.current.position.copy(pos);
      }
    }, [position]);

    useEffect(() => {
      if (internalModelRef.current) {
        internalModelRef.current.scale.set(finalScale, finalScale, finalScale);
      }
    }, [finalScale]);

    useLayoutEffect(() => {
      if (!modelInstance || !color) return;

      modelInstance.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.color.set(color);
          }
        }
      });
    }, [color, modelInstance]);

    useEffect(() => {
      return () => {
        if (modelInstance) {
          dispose(modelInstance);
        }
      };
    }, [modelInstance]);

    return <primitive ref={modelRef} object={modelInstance} />;
  }
);

export {type ModelProps};
export default UnwrappedModel;
