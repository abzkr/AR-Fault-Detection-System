import { useState } from 'react'
import "./Log.css"


export default function FaultBox ({ faultID, logEntry, onSave, onDelete, onEdit }) {
  
    
   const [location, setLocation] = useState(logEntry.location || "")
   const [severity, setSeverity] = useState(logEntry.severity || "")
   const [saved, setSaved] = useState(false)

   if(saved){
    return(
      <div className="log_entry" style={{justifyContent:"center", alignItems:"center"}}>
      <h4 style={{color:"#4CAF50"}}>✓ Saved</h4>
      </div>
    )
   }
   
    return (
    <div className="log_entry">
      <h4>Fault ID: {logEntry.faultID} </h4>

      <h4>Fault Type: {logEntry.faultType}</h4>

      <h4>Location</h4>
      <input type="text" placeholder='Input location' value={location} onChange={(e) => setLocation(e.target.value)}/>

      <h4>Severity</h4>
      <input type="text" placeholder='Input severity' value={severity} onChange={(e) => setSeverity(e.target.value)}/>

      {/* Clicking save, calls our save function from ARinterface
          Upon saving, a message indicating that message has been saved will appear, 
          the entry will then be deleted from the log after timeout time 3s. 
      */}

      <button onClick={() => {
        onSave({...logEntry, location, severity})
        setSaved(true)
        setTimeout(() => {
           onDelete(logEntry)}, 3000)
      }}>Save</button>
        
        {/* Upon clicking, */}

      <button onClick={() => 
        onDelete(logEntry)}
        >Delete</button>
    </div>
    )
    

}

