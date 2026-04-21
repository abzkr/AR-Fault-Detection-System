import { useEffect, useState } from 'react'

// A lot of changes to be made, this is just a very basic skeleton

function App() {
  useEffect(() => {
    // AR.js works better with a direct script approach
  }, [])
  
  const [activeFault, SetActiveFault] = useState(null)
  
  // Mimicks our database - we will be querying DB isntead
  const faultData = {
    "hiro" : {type: "Stress Zone", severity: "High", location: "Platform 2"}
  }

  // Upon clicking the "Check fault button"
  const handleFaultClick = (faultId) => {
    const fault = faultData[faultId] 
    SetActiveFault(fault)
  }

 

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene embedded arjs>
        <a-marker preset="hiro">
          <a-text value="Fault Detected" position="0 0.5 0" align="center" color="red"></a-text>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  )
}

export default App