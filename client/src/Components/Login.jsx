import { useState } from 'react'
import './Login.css'

function LogIn() {

  // These store what the user types
  const [workerID, setWorkerID] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // This runs when the user clicks Sign In
  async function handleLogin() {

    // Clear any old error message
    setError("")

    // Check if fields are empty
    if (workerID === "" || password === "") {
      setError("Please enter both Worker ID and password.")
      return
    }

    // Show loading state on button
    setIsLoading(true)

    // Send worker ID and password to the server
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerID, password })
    })

    // Read the server's response
    const data = await response.json()

    // If server says wrong credentials
    if (!response.ok) {
      setError("Invalid Worker ID or password.")
      setIsLoading(false)
      return
    }

    // Send user to the right page based on their role, for it to function, we need to create these routes and components in app.js
    if (data.role === "Technician") {
      window.location.href = "/technician"
    }

    if (data.role === "Engineer") {
      window.location.href = "/engineer"
    }

    if (data.role === "DBO") {
      window.location.href = "/dbo"
    }

    setIsLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Maintenance Portal</h1>

        <label className="input-label">Worker ID</label>
        <input
          type="text"
          placeholder="Enter your Worker ID"
          value={workerID}
          onChange={(e) => setWorkerID(e.target.value)}
        />

        <label className="input-label">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Show error message if there is one */}
        {error && <p className="error-msg">{error}</p>}

        {/* Button changes text while loading */}
        <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

      </div>
    </div>
  )
}

export default LogIn