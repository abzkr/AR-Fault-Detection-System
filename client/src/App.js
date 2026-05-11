import { useState } from 'react'
import ARinterface from './Components/ARinterface.jsx'
import LogIn from './Components/Login.jsx'
import TechnicianLand from './Components/TechnicianLand.jsx'
import "./Components/Log.css" 



function App() {

  const [loggedIn, SetLoggedIn] = useState(false)
  const [role, SetRole] = useState("")
  const [showAR, SetShowAR] = useState(false)
  // if auth = true, SetLoggedIn(true), logout button onClick={setLoggedIn(false)}, while loggedIn != True, only render the login page

  // debugging
  console.log("Role:", role, "LoggedIn:", loggedIn)


  if (!loggedIn) return <LogIn onLoginAuthenticated={(r) => {SetLoggedIn(true); SetRole(r)}} />
  
  if (showAR) return <ARinterface />

  if (role === "Technician") return <TechnicianLand onCameraOption={() => SetShowAR(true)}/>
}

export default App




