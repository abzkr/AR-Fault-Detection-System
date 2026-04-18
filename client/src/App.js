import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'

const store = createXRStore()

function App() {
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <ambientLight />
          <mesh position={[0, 0, -1]}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </XR>
      </Canvas>
    </>
  )
}

export default App