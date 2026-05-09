import react from "react";
// Technicians have the most limited access control
// They do not have role-designation permissions and also dont have access to the data dashboard as it is irrelevant to their job
// They can add faults to the log 

function TechnicianLand() {
    const handleScanFaults = () => {
        alert("Opening AR Fault Scanner...");
      };
    
      return (
        <div style={styles.container}>
          <div style={styles.card}>
    
            <h1>Technician Dashboard</h1>
    
            <p>
              Welcome technician. Use the option below to begin scanning faults.
            </p>
    
            <button
              style={styles.button}
              onClick={handleScanFaults}
            >
              Camera / Scan Faults
            </button>
    
          </div>
        </div>
      );
    }
    
    const styles = {
      container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
      },
    
      card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        textAlign: "center",
        minWidth: "350px",
      },
    
      button: {
        marginTop: "20px",
        padding: "12px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "white",
      },
    };
    

export default TechnicianLand;