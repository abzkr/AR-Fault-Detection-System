const express = require('express')
const app = express()

const port = process.env.PORT || 3000


app.get("/api", (req, res) =>{
    res.send("Server is working...");
})

// Listen on our port 
app.listen(port, () => {
    console.log('Server started: http://localhost:${port}');
})

