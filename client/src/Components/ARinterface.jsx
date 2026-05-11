import { useState, useEffect } from 'react'
import Fault from './Fault.js'
import FaultPanel from './FaultPanel.jsx'
import Log from './Log.jsx'
import "./Log.css" 


function ARinterface() {
    
  const [activeFault, SetActiveFault] = useState(null)
  const [LogStore, setLogStore] = useState([])
  const [LogStatus, setLogStatus] = useState(false)  

  
  // Mimicks our database - we will be querying DB isntead
  const faultData = {
    "hiro" : {
      type: "Stress Zone"},
    
    "kanji" : {
      type: "Track Fault"},
    
    "marker2" : {
      type: "type"},   // need to add these last 2 markers as well
    
    "marker3" : {
      type: "type"}
  }

  /* Uses our constructor to intialise a new fault object, 
     leaves location and severity attributes to be initalised later.
  */   
  const handleStoreFault = (fault) => {

    const newFault = new Fault(Date.now(), fault.type, " ", " ")

    setLogStore((prev) => [...prev, newFault])

    SetActiveFault(null)
    console.log("Stored fault: ", fault)

  }

  const handleDismissFault = () => {
    console.log("Fault dismissed")
    SetActiveFault(null)
  }


 /* Functionally a side effect that refreshes the system when a marker is detected, 
    it's corresponding fault type is used to initalise a fault object which is 
    displayed in fault panel.
 */   
 useEffect(() => {

  const markers = document.querySelectorAll('a-marker')

  markers.forEach((marker) => {

    const id = marker.getAttribute('id')

    const onFound = () => {
      const fault = faultData[id]
      if (fault) {
        SetActiveFault(fault)
      }
    }

    const onLost = () => {
      SetActiveFault((prev) => {
        if (prev?.type === faultData[id]?.type) {
          return null
        }
        return prev
      })
    }

    marker.addEventListener('markerFound', onFound)
    marker.addEventListener('markerLost', onLost)

    marker._onFound = onFound
    marker._onLost = onLost

  })

  return () => {
    document.querySelectorAll('a-marker').forEach((marker) => {
      marker.removeEventListener('markerFound', marker._onFound)
      marker.removeEventListener('markerLost', marker._onLost)
    })
  }

  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button className="open-log-btn" onClick={() => setLogStatus(!LogStatus)}>Log</button>
      {LogStatus && <Log LogStore={LogStore} setLogStore={setLogStore}/>}
      
      <a-scene embedded arjs>
        <a-marker id="hiro" preset="hiro">
        </a-marker>

        <a-marker id="kanji" preset="kanji">
        </a-marker>
        
        <a-marker id="marker2" type="pattern" url="/patterns/pattern-marker2.patt">
        </a-marker>
        
        <a-marker id="marker3" type="pattern" url="/patterns/pattern-marker3.patt">
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

export default ARinterface;



