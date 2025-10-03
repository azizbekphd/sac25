import * as THREE from "three";
import { dispose } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SUN_MODEL_HEIGHT } from "../../globals/constants";
import config from "../../globals/config.json";
import { type Coords } from "../../OrreryTypes";
import { useGLTF } from '@react-three/drei';


// const extensionLoaderMap = {
//     glb: GLTFLoader,
//     obj: OBJLoader,
// };

type ModelProps = {
    source: string;
    position: THREE.Vector3;
    scale?: number;
    color?: string | null;
    rotation?: Coords;
};


const UnwrappedModel = ({ 
  source, 
  position, 
  scale = 1, 
  color, 
  rotation = [0, 0, 0] 
}: ModelProps) => {
  const modelRef = useRef<THREE.Group>(null!);
  
  // useGLTF automatically handles caching - same source will be loaded from cache
  const { scene } = useGLTF(source);
  
  // Clone the model to avoid sharing material/geometry instances between components
  const modelInstance = useMemo(() => {
    return scene.clone();
  }, [scene]);

  // Calculate model size compensation factor
  const modelSizeCompensationFactor = useMemo(() => {
    const box = new THREE.Box3().setFromObject(modelInstance);
    const size = new THREE.Vector3();
    box.getSize(size);
    return SUN_MODEL_HEIGHT / size.y;
  }, [modelInstance]);

  // Calculate final scale
  const finalScale = useMemo(() => {
    const _scale = scale * config.camera.scale;
    return _scale * modelSizeCompensationFactor;
  }, [scale, modelSizeCompensationFactor]);

  // Handle rotation
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, [rotation]);

  // Handle position
  useEffect(() => {
    if (modelRef.current) {
      const pos = Array.isArray(position) 
        ? new THREE.Vector3(...position) 
        : position;
      modelRef.current.position.copy(pos);
    }
  }, [position]);

  // Handle scale
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  }, [finalScale]);

  // Handle color changes
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

  // Cleanup when component unmounts or source changes
  useEffect(() => {
    return () => {
      if (modelInstance) {
        dispose(modelInstance);
      }
    };
  }, [modelInstance]);

  return <primitive ref={modelRef} object={modelInstance} />;
};

// Optional: Preload models if you know which ones will be used
// export const preloadModels = (sources: string[]) => {
//   sources.forEach(source => useGLTF.preload(source));
// };

// const UnwrappedModel = ({ source, position, scale = 1, color, rotation = [0, 0, 0] }: ModelProps) => {
//     const modelRef = useRef<THREE.Group>(null!);

//     const extension = useMemo(() => {
//         return source.split(".").pop()?.toLowerCase() as keyof typeof extensionLoaderMap
//     }, [source]);

//     const Loader = useMemo(() => {
//         const _Loader = extensionLoaderMap[extension];

//         if (!_Loader) {
//             throw new Error(`Unsupported file extension: ${extension}`);
//         }

//         return _Loader;
//     }, [extension]);

//     const loader = useLoader<any, any>(Loader, source);

//     const model = useMemo(() => {
//         if (loader.scene) {
//             return loader.scene;
//         }
//         return loader;
//     }, [loader]);

//     useEffect(() => {
//         return () => {
//             if (model && modelRef.current) {
//                 dispose(model);
//             }
//         };
//     }, [model]);

//     const modelSizeCompensationFactor = useMemo(() => {
//         if (!model) return;
//         const box = new THREE.Box3().setFromObject(model.scene ?? model);
//         const size = new THREE.Vector3();
//         box.getSize(size);
//         return SUN_MODEL_HEIGHT / size.y;
//     }, [model]);

//     const finalScale = useMemo(() => {
//         const _scale = scale * config.camera.scale;
//         return _scale * modelSizeCompensationFactor!;
//     }, [scale, modelSizeCompensationFactor]);

//     useEffect(() => {
//         if (modelRef.current) {
//             modelRef.current.rotation.set(...rotation);
//         }
//     }, [rotation]);

//     useEffect(() => {
//         if (modelRef.current) {
//             modelRef.current.position.copy(position);
//         }
//     }, [position]);

//     useEffect(() => {
//         if (modelRef.current) {
//             modelRef.current.scale.set(finalScale, finalScale, finalScale);
//         }
//     }, [finalScale]);

//     useLayoutEffect(() => {
//         if (!model || !color || !model.traverse) return;

//         model.traverse((child: THREE.Mesh) => {
//             if (child.isMesh) {
//                 (child.material as THREE.MeshStandardMaterial).color.set(color);
//             }
//         });
//     }, [color, model]);

//     return <primitive ref={modelRef} object={model} />;
// };
export {type ModelProps};
export default UnwrappedModel;
