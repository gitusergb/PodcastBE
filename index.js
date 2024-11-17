const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');
const {connectDB} = require('./config/db');
const auth = require('./middleware/auth');

dotenv.config();
// require('dotenv').config();
const app = express()

//requireRoutes
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const podcastRoutes = require('./routes/podcastRoutes')

app.use(express.json())
app.use(cors())
//app.use
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/podcasts', podcastRoutes)

app.use(express.static('public'));

app.get('/users/protected-route', auth, (req, res) => {
    res.send('This is a protected route');
});

const PORT = process.env.PORT || 8000

async function startServer() {
    try {
      await connectDB;
      console.log("Database connection Established");
    } catch {
      console.log("Database connection Failed");
    }

    app.listen(PORT,() => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log("Server Started");
    });
  }
  
  startServer();