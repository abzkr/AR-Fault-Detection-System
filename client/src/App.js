import { useState, useEffect } from 'react'
import FaultPanel from './Components/FaultPanel.jsx'
import "./Components/Log.css" 
import Log from './Components/Log.jsx'


function App() {
  useEffect(() => {

  }, [])

  const [LogStore, setLogStore] = useState([]) 
  const [LogStatus, setLogStatus] = useState(false)  
  const marker_fault = {"hiro": "stress fault", "zero" : "track fault"}


 

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button className="open-log-btn" onClick={() => setLogStatus(!LogStatus)}>Log</button>
      {LogStatus && <Log faultType={marker_fault.hiro} LogStore={LogStore} setLogStore={setLogStore}/>}
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