import { useEffect, useState } from 'react'
import "./Log.css"


export default function FaultBox ({ faultID,logEntry, onSave, onDelete, onEdit }) {
  
    
   const [location, setLocation] = useState(logEntry.location || "")
   const [severity, setSeverity] = useState(logEntry.severity || "")
   
    return (
    <div className="log_entry">
      <p>{logEntry.faultID}</p>
      <p>{logEntry.faultType}</p>
      <p>{logEntry.location || "Location TBC"}</p>
      <input type="text" placeholder='Input location' value={location} onChange={(e) => setLocation(e.target.value)}/>
      <p>{logEntry.severity || "Severity TBC"}</p>
      <input type="text" placeholder='Input location' value={severity} onChange={(e) => setSeverity(e.target.value)}/>
      <button onClick={() => onSave({...logEntry, location, severity})}>Save</button>
      <button onClick={() => onDelete(logEntry)}>Delete</button>
    </div>
    )
    

}

