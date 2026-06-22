const express = require('express');
const cors = require('cors');
require('dotenv').config();


const db = require('./db');
const assetsRoutes = require('./routes/assets');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const auditRoutes = require('./routes/audit');


db.query('SELECT 1') 
.then(() => 
    console.log('Database connected successfully'))
    .catch((err) => 
        console.error('Database connection failed:', err));


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/assets', assetsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audit', auditRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
