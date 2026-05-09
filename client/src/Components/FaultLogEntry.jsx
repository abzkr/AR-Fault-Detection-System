import { useEffect, useState } from 'react'
import "./Log.css"


export default function FaultBox ({ faultID, logEntry, onSave, onDelete, onEdit }) {
  
    
   const [location, setLocation] = useState(logEntry.location || "")
   const [severity, setSeverity] = useState(logEntry.severity || "")
   
    return (
    <div className="log_entry">
      <h4>Fault ID: {logEntry.faultId} </h4>

      <h4>Fault Type: {logEntry.faultType}</h4>

      <h4>Location</h4>
      <input type="text" placeholder='Input location' value={location} onChange={(e) => setLocation(e.target.value)}/>

      <h4>Severity</h4>
      <input type="text" placeholder='Input severity' value={severity} onChange={(e) => setSeverity(e.target.value)}/>

      <button onClick={() => onSave({...logEntry, location, severity})}>Save</button>
      <button onClick={() => onDelete(logEntry)}>Delete</button>
    </div>
    )
    

}

