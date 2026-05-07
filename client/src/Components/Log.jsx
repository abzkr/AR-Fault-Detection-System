import { useEffect, useState } from 'react'
import Fault from './Fault.js'
import FaultBox from './FaultLogEntry.jsx'
import "./Log.css" 

// Manages rendering and interactions with faults

export default function Log({faultType, LogStore, setLogStore}) { 

   
    // If log entry  field "added" = true, then skip and return as its already been added
    const addFault = (faulType) => {
        const newFault = new Fault(Date.now(), "Type", "Location", "Severity") 
        setLogStore([...LogStore, newFault])
    }
     
    const removeFault = (index) => {
        setLogStore(LogStore.filter((_, i) => i !== index))
    }
    
    async function handleSave (faultObjSelected) {
        console.log("Saving fault:", faultObjSelected)
        try {
            const response = await fetch ("Post-route ", {
                method: "POST",
                data: JSON.stringify({
                    faultID: faultObjSelected.faultID,
                    faultLocation: faultObjSelected.FaultLocation,
                    faultSeverity: faultObjSelected.severity
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
        try{
            const response = await fetch ("Get-route", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!response.ok){
                console.log("Request failed")
            }
            const fault_json = await response.json() 
            // Note -> check if these indexes work
            // they need to line up with key-value pair defs
            const new_fault = new Fault(
                fault_json.faultID, 
                fault_json.faultType,
                fault_json.FaultLocation

         )
            
            setLogStore([...LogStore, new_fault])
        }
        catch(error){
            console.log("There is no fault that exists with ID: ", faultID)
        }

    }


    return (
        // By end of session have basic container, have very general architecture, understand needed react logic
        <div>
            <div className='log_container'>
                <div className='log_header'></div>
                <button onClick={() => addFault("stress fault")}>Test Add Fault</button>
                <button onClick={() => loadEntry()}>Load Fault</button>   
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

