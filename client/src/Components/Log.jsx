import {useState} from 'react'
import Fault from './Fault.js'
import FaultBox from './FaultLogEntry.jsx'
import "./Log.css" 

// Manages rendering and interactions with faults

export default function Log({LogStore, setLogStore}) { 


    const [searchId, setSearchId] = useState("")


    // To remove a fault from the log
    const removeFault = (index) => {
        setLogStore(LogStore.filter((_, i) => i !== index))
    }
    
    async function handleSave (faultObjSelected) {
        console.log("Saving fault:", faultObjSelected)
        try {
            const response = await fetch ('http://localhost:5000/api/fault', {
                method: "POST",
                body: JSON.stringify({
                    faultID: faultObjSelected.faultID,
                    faultType: faultObjSelected.faultType,
                    location: faultObjSelected.location,
                    severity: faultObjSelected.severity
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!response.ok){
                console.log("Something went wrong...")
            }
        } // Go over this later -> what should catch be if it fails to save
        catch (error) {
            console.log("Failed to save entry...", error)
        }

    }

    async function loadEntry(faultID){
        try { 
            const response = await fetch (`http://localhost:5000/api/fault/${faultID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!response.ok) {
                console.log("Request failed")
            }
            const fault_json = await response.json() 
           
            const new_fault = new Fault(
                fault_json.faultID, 
                fault_json.faultType,
                fault_json.location,
                fault_json.severity

         )
            
            setLogStore([...LogStore, new_fault])
        }
        catch(error) {
            console.log("There is no fault that exists with ID: ", faultID)
        }

    }

    return (
        // By end of session have basic container, have very general architecture, understand needed react logic
        <div>
            <div className='log_container'>
                <div className='log_header'></div>

                <input 
                type="text" 
                placeholder='Enter Fault ID'
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                />

                <button className='load-btn' onClick={() => loadEntry(searchId)}>Load</button>

                

                {LogStore.map((faultObj, index) => 
                <FaultBox 
                key={index}
                logEntry={faultObj}
                onSave={(f) => handleSave(f)}
                onDelete={() => removeFault(index)}
                />

            )}
            </div>
        
        </div>
    )

}

