const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

// Listen on our port 
app.listen(port, () => {
    console.log('Server started: http://localhost:${port}');
})

// const mysql = require('mysql2')

/* const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ar_maintenance_system'
})
*/

// Replace the db connection and queries with this mock
app.post('/api/login', (req, res) => {
  const { workerID, password } = req.body
  const users = {
    "Engineer": { pass: "pass123", role: "Maintenance Engineer" },
    "Technician": { pass: "secure456", role: "Technician" },
    "DBO": { pass: "cyber999", role: "Dashboard Operator" }
  }
  const user = users[workerID]
  if (!user || user.pass !== password) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  res.json({ role: user.role })
})

const faultStore = {}

app.post('/api/fault', (req, res) => {
  const { faultID, faultType, location, severity } = req.body
  faultStore[faultID] = { faultID, faultType, location, severity }
  res.json({ faultID })
})

app.get('/api/fault/:id', (req, res) => {
  const fault = faultStore[req.params.id]
  if (!fault) return res.status(404).json({ error: 'Not found' })
  res.json(fault)
})