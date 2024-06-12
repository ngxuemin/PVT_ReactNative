// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/register-click', (req, res) => {
    const clickTime = req.body.timestamp;
    // Respond to the client with a message and the current timestamp
    res.send({ message: 'Click registered', timestamp: Date.now() });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
