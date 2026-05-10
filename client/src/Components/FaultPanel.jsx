// renders 3D panel that includes a breakdown of the fault 

import React from "react";

function FaultPanel({ fault, onFaultStored, onFaultDismissed }) {
  if (!fault) return null;

  return (
    <div style={styles.panel}>
      <h2>Fault Detected</h2>
      <p><strong>Type:</strong> {fault.type}</p>
     

      <div style={styles.buttons}>
        <button onClick={() => onFaultStored(fault)}>Store</button>
        <button onClick={onFaultDismissed}>Dismiss</button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    zIndex: 1000,
    minWidth: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  buttons: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },
};

export default FaultPanel;