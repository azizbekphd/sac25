export const Lights = () => {
  return (
    <>
      <ambientLight intensity={0} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  )
}
