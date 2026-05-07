import { useEffect, useState } from 'react'
import FaultPanel from './Components/FaultPanel'

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

  const handleStoreFault = (fault) => {
    console.log("Stored fault:", fault)
    SetActiveFault(null)
  }

  const handleDismissFault = () => {
    console.log("Fault dismissed")
    SetActiveFault(null)
  }
 

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={() => handleFaultClick('hiro')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 16px'
        }}
      >
        Check Fault  
      </button>

      <a-scene embedded arjs>
        <a-marker preset="hiro">
          <a-text 
            value="Fault Detected" 
            position="0 0.5 0" 
            align="center" 
            color="red"
          ></a-text>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>

      <FaultPanel
        fault={activeFault}
        onFaultStored={handleStoreFault}
        onFaultDismissed={handleDismissFault}
      />  
    </div>
  )
}

export default App