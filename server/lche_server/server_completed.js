require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 5000

// db pool so we dont open a new connection every request
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'ar_maintenance_system',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
})

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production'

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// check token is valid before letting through
function authenticate(req, res, next) {
  const header = req.headers['authorization']
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' })
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role_name)) {
      return res.status(403).json({ error: 'You dont have permission for this' })
    }
    next()
  }
}

// login - kept same as before but now hits the db and returns a token
app.post('/api/login', async (req, res) => {
  const { workerID, password } = req.body
  if (!workerID || !password) {
    return res.status(400).json({ error: 'workerID and password are required' })
  }
  try {
    const [rows] = await pool.query(
      `SELECT w.worker_id, w.worker_pass, w.role_id, r.role_name
       FROM worker w JOIN role r ON w.role_id = r.role_id
       WHERE w.worker_id = ?`,
      [workerID]
    )
    const worker = rows[0]
    if (!worker || worker.worker_pass !== password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { worker_id: worker.worker_id, role_id: worker.role_id, role_name: worker.role_name },
      JWT_SECRET,
      { expiresIn: '8h' }
    )
    res.json({ role: worker.role_name, token, worker_id: worker.worker_id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// get all faults
app.get('/api/faults', authenticate, async (req, res) => {
  try {
    const conditions = []
    const params = []
    if (req.query.severity) { conditions.push('f.severity = ?'); params.push(req.query.severity) }
    if (req.query.location_id) { conditions.push('f.location_id = ?'); params.push(req.query.location_id) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const [faults] = await pool.query(
      `SELECT f.fault_id, f.description, f.severity, l.name_area, m.fault_type
       FROM fault f
       JOIN location l ON f.location_id = l.location_id
       JOIN marker m ON f.marker_id = m.marker_id
       ${where}
       ORDER BY f.fault_id DESC`,
      params
    )
    res.json({ faults, total: faults.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not get faults' })
  }
})

// get one fault with its assignments
app.get('/api/faults/:id', authenticate, async (req, res) => {
  try {
    const [[fault]] = await pool.query(
      `SELECT f.*, l.name_area, m.fault_type
       FROM fault f
       JOIN location l ON f.location_id = l.location_id
       JOIN marker m ON f.marker_id = m.marker_id
       WHERE f.fault_id = ?`,
      [req.params.id]
    )
    if (!fault) return res.status(404).json({ error: 'Fault not found' })

    const [assignments] = await pool.query(
      `SELECT a.*, r.role_name
       FROM assignment a
       JOIN worker w ON a.worker_id = w.worker_id
       JOIN role r ON w.role_id = r.role_id
       WHERE a.fault_id = ?`,
      [req.params.id]
    )
    res.json({ fault, assignments })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/faults', authenticate, async (req, res) => {
  const { location_id, marker_id, description, severity } = req.body
  if (!location_id || !marker_id) {
    return res.status(400).json({ error: 'location_id and marker_id needed' })
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO fault (location_id, marker_id, description, severity) VALUES (?, ?, ?, ?)`,
      [location_id, marker_id, description, severity]
    )
    const [[created]] = await pool.query(
      `SELECT f.*, l.name_area, m.fault_type
       FROM fault f
       JOIN location l ON f.location_id = l.location_id
       JOIN marker m ON f.marker_id = m.marker_id
       WHERE f.fault_id = ?`,
      [result.insertId]
    )
    res.status(201).json({ fault: created })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create fault' })
  }
})

app.patch('/api/faults/:id', authenticate, async (req, res) => {
  const { description, severity } = req.body
  const fields = []
  const params = []
  if (description !== undefined) { fields.push('description = ?'); params.push(description) }
  if (severity !== undefined) { fields.push('severity = ?'); params.push(severity) }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' })

  try {
    params.push(req.params.id)
    const [result] = await pool.query(`UPDATE fault SET ${fields.join(', ')} WHERE fault_id = ?`, params)
    if (!result.affectedRows) return res.status(404).json({ error: 'Fault not found' })
    const [[updated]] = await pool.query(
      `SELECT f.*, l.name_area, m.fault_type
       FROM fault f
       JOIN location l ON f.location_id = l.location_id
       JOIN marker m ON f.marker_id = m.marker_id
       WHERE f.fault_id = ?`,
      [req.params.id]
    )
    res.json({ fault: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Update failed' })
  }
})

// only supervisors/security can delete
app.delete('/api/faults/:id', authenticate, authorize('Supervisor', 'Security Analyst'), async (req, res) => {
  try {
    await pool.query(`DELETE FROM assignment WHERE fault_id = ?`, [req.params.id])
    const [result] = await pool.query(`DELETE FROM fault WHERE fault_id = ?`, [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ error: 'Fault not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Delete failed' })
  }
})

app.post('/api/faults/:id/assign', authenticate, authorize('Supervisor', 'Maintenance Engineer'), async (req, res) => {
  const { worker_id, status, assigned_date } = req.body
  if (!worker_id) return res.status(400).json({ error: 'worker_id is required' })
  try {
    const [result] = await pool.query(
      `INSERT INTO assignment (fault_id, worker_id, status, assigned_date) VALUES (?, ?, ?, ?)`,
      [req.params.id, worker_id, status || 'Pending', assigned_date || new Date().toISOString().split('T')[0]]
    )
    res.status(201).json({ message: 'Assigned', assignment_id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Assignment failed' })
  }
})

app.patch('/api/assignments/:id', authenticate, async (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status required' })
  try {
    const [result] = await pool.query(
      `UPDATE assignment SET status = ? WHERE assignment_id = ?`,
      [status, req.params.id]
    )
    if (!result.affectedRows) return res.status(404).json({ error: 'Assignment not found' })
    res.json({ message: 'Updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Update failed' })
  }
})

app.get('/api/workers', authenticate, async (_req, res) => {
  try {
    const [workers] = await pool.query(
      `SELECT w.worker_id, r.role_name
       FROM worker w JOIN role r ON w.role_id = r.role_id
       ORDER BY w.worker_id`
    )
    res.json({ workers })
  } catch (err) {
    res.status(500).json({ error: 'Could not get workers' })
  }
})

app.get('/api/locations', authenticate, async (_req, res) => {
  try {
    const [locations] = await pool.query(`SELECT location_id, name_area FROM location ORDER BY location_id`)
    res.json({ locations })
  } catch (err) {
    res.status(500).json({ error: 'Could not get locations' })
  }
})

app.get('/api/markers', authenticate, async (_req, res) => {
  try {
    const [markers] = await pool.query(`SELECT marker_id, fault_type FROM marker ORDER BY marker_id`)
    res.json({ markers })
  } catch (err) {
    res.status(500).json({ error: 'Could not get markers' })
  }
})

app.get('/api/analytics/summary', authenticate, authorize('Supervisor', 'Security Analyst', 'Maintenance Engineer'), async (_req, res) => {
  try {
    const [[{ total_faults }]] = await pool.query(`SELECT COUNT(*) AS total_faults FROM fault`)
    const [[{ high_severity }]] = await pool.query(`SELECT COUNT(*) AS high_severity FROM fault WHERE severity = 'High'`)
    const [[{ pending }]] = await pool.query(`SELECT COUNT(*) AS pending FROM assignment WHERE status = 'Pending'`)
    const [[{ in_progress }]] = await pool.query(`SELECT COUNT(*) AS in_progress FROM assignment WHERE status = 'In Progress'`)
    const [[{ completed }]] = await pool.query(`SELECT COUNT(*) AS completed FROM assignment WHERE status = 'Completed'`)
    res.json({ total_faults, high_severity, pending, in_progress, completed })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Analytics failed' })
  }
})

app.get('/api/analytics/by-type', authenticate, authorize('Supervisor', 'Security Analyst', 'Maintenance Engineer'), async (_req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT m.fault_type, COUNT(f.fault_id) AS count
       FROM fault f JOIN marker m ON f.marker_id = m.marker_id
       GROUP BY m.fault_type ORDER BY count DESC`
    )
    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

app.get('/api/analytics/workload', authenticate, authorize('Supervisor', 'Security Analyst'), async (_req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT w.worker_id, r.role_name, COUNT(a.assignment_id) AS assignment_count
       FROM assignment a
       JOIN worker w ON a.worker_id = w.worker_id
       JOIN role r ON w.role_id = r.role_id
       GROUP BY w.worker_id, r.role_name
       ORDER BY assignment_count DESC`
    )
    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

// keeping the old routes so nothing breaks on the frontend
app.post('/api/fault', async (req, res) => {
  const { faultID, faultType, location, severity } = req.body
  if (!faultType) return res.status(400).json({ error: 'faultType is required' })
  try {
    let [[loc]] = await pool.query(`SELECT location_id FROM location WHERE name_area = ?`, [location || 'Unknown'])
    if (!loc) {
      const [r] = await pool.query(`INSERT INTO location (name_area) VALUES (?)`, [location || 'Unknown'])
      loc = { location_id: r.insertId }
    }
    let [[mrk]] = await pool.query(`SELECT marker_id FROM marker WHERE fault_type = ?`, [faultType])
    if (!mrk) {
      const [r] = await pool.query(`INSERT INTO marker (fault_type) VALUES (?)`, [faultType])
      mrk = { marker_id: r.insertId }
    }
    if (faultID) {
      const [[existing]] = await pool.query(`SELECT fault_id FROM fault WHERE fault_id = ?`, [faultID])
      if (existing) {
        await pool.query(
          `UPDATE fault SET location_id = ?, marker_id = ?, severity = ? WHERE fault_id = ?`,
          [loc.location_id, mrk.marker_id, severity, faultID]
        )
        return res.json({ faultID })
      }
    }
    const [result] = await pool.query(
      `INSERT INTO fault (location_id, marker_id, severity) VALUES (?, ?, ?)`,
      [loc.location_id, mrk.marker_id, severity]
    )
    res.json({ faultID: faultID || result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save fault' })
  }
})

app.get('/api/fault/:id', async (req, res) => {
  try {
    const [[fault]] = await pool.query(
      `SELECT f.fault_id, m.fault_type, l.name_area AS location, f.severity
       FROM fault f
       JOIN location l ON f.location_id = l.location_id
       JOIN marker m ON f.marker_id = m.marker_id
       WHERE f.fault_id = ?`,
      [req.params.id]
    )
    if (!fault) return res.status(404).json({ error: 'Not found' })
    res.json({ faultID: fault.fault_id, faultType: fault.fault_type, location: fault.location, severity: fault.severity })
  } catch (err) {
    res.status(500).json({ error: 'Could not get fault' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
