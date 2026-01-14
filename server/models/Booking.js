const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    type: { type: String, required: true } // Adult, Child, Infant
});

const BookingSchema = new mongoose.Schema({
    flight_id: { type: String, required: true },
    passengers: [PassengerSchema], // Array of passengers
    total_price: { type: Number, required: true },
    airline: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    pnr: { type: String, unique: true }, // Generated PNR
    user_email: { type: String, required: true },
    status: { type: String, default: 'Confirmed' }, // Confirmed, Checked-in
    booking_date: { type: Date, default: Date.now }
});

// Generate PNR before saving
BookingSchema.pre('save', async function () {
    if (!this.pnr) {
        this.pnr = 'PNR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
