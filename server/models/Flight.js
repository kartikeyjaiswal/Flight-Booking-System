const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
    flight_id: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    departure_city: { type: String, required: true },
    arrival_city: { type: String, required: true },
    base_price: { type: Number, required: true },
    // Tracks search attempts for dynamic pricing
    search_attempts: [{ type: Date }],
    // If set, price is +10% until this time
    surge_until: { type: Date, default: null }
});

module.exports = mongoose.model('Flight', FlightSchema);
