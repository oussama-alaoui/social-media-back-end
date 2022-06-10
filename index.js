const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load routes from routes folder
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');



// Load env vars
dotenv.config();

//connect to mongodb
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to MongoDB');
});


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, () => {    
    console.log('Server started on ports 3000');
});