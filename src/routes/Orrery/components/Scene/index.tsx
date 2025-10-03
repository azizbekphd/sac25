import "./index.css"
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { lazy, Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TrajectoriesContext, TimeControlsContext, type TrajectoriesContextType } from "../../contexts";
import { PerspectiveCamera } from "three";
import Orbit from "../Orbit";
import { CameraController, SmallBodies, Sun } from "..";
import config from "../../globals/config.json";

const Skybox = lazy(() => import("../Skybox/index.tsx"))

extend({ OrbitControls });

const normalCamera = new PerspectiveCamera(50, 1, 0.000001, 1000);

function Scene() {
    const objects = useContext<TrajectoriesContextType>(TrajectoriesContext);
    const { timeControls } = useContext(TimeControlsContext);
    const [camera, setCamera] = useState<PerspectiveCamera>(normalCamera);
    const orbitControlsRef = useRef(null!);

    useEffect(() => {
        const handleResize = () => {
            normalCamera.aspect = window.innerWidth / window.innerHeight;
            normalCamera.updateProjectionMatrix();
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        setCamera(normalCamera)
    }, [])

    useEffect(() => {
        camera.fov = 50;
        camera.position.set(20, 20, 20);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }, [camera])

    const smallBodiesChunks = useMemo(() => {
        const chunks = []
        for (let i = 0; i < objects.smallBodies.length; i += config.smallBodies.chunkSize) {
            chunks.push(objects.smallBodies.slice(i, i + config.smallBodies.chunkSize))
        }
        return chunks
    }, [objects.smallBodies])

    return (
        <>
            <Canvas
                style={{position: 'fixed', top: 0, left: 0}}
                camera={camera}
                dpr={window.devicePixelRatio}
                frameloop="demand">
                    <ambientLight intensity={0.05} />
                    <pointLight position={[0, 0, 0]} decay={0} intensity={Math.PI} />
                    {objects.planets.map(
                        (obj, i) => <Orbit
                            key={i.toString()}
                            trajectory={obj}
                            timestamp={timeControls.time} />
                    )}
                    {smallBodiesChunks.map((chunk) => <SmallBodies
                        key={chunk.map(obj => obj.id).join()}
                        trajectories={chunk}
                        timestamp={timeControls.time} />)}
                    <OrbitControls ref={orbitControlsRef} enablePan={false} maxDistance={400} camera={camera} zoomSpeed={2} />
                    <CameraController camera={camera} orbitControlsRef={orbitControlsRef} />
                    <Sun />
                    <Suspense fallback={null}>
                        <Skybox />
                    </Suspense>
            </Canvas>
        </>
    );
}

export default Scene;
