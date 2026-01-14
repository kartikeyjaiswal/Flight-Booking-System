const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true, // Deprecated in newer mongoose but often used
    // useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes Placeholders
app.get('/', (req, res) => {
    res.send('Flight Booking System API');
});

const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');

app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
