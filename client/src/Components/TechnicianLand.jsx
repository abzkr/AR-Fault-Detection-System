import React from "react";
import "./TechnicianLand.css"

// Technicians have the most limited access control
// They do not have role-designation permissions and also dont have access to the data dashboard as it is irrelevant to their job
// They can add faults to the log 

function TechnicianLand({onCameraOption}) {
  return (
    <div className="tech-container">
      <div className="tech-card">
        <h1>Technician Dashboard</h1>
        <p>Welcome technician. Use the option below to begin scanning faults.</p>
        <button className="tech-btn" onClick={onCameraOption}>
          Camera / Scan Faults
        </button>
      </div>
    </div>
  );
}

export default TechnicianLand;