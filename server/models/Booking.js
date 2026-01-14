const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    pnr: { type: String, required: true, unique: true },
    flight_id: { type: String, required: true },
    passenger_name: { type: String, required: true },
    airline: { type: String, required: true }, // Snapshot in case flight changes
    source: { type: String, required: true },
    destination: { type: String, required: true },
    price_paid: { type: Number, required: true },
    booking_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
