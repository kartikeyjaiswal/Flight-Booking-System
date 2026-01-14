const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listFlights() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const flights = await Flight.find({});
        console.log('--- Current Flights in DB ---');
        flights.forEach(f => {
            console.log(`${f.flight_id}: ${f.departure_city} -> ${f.arrival_city} (₹${f.base_price})`);
        });
        console.log(`Total: ${flights.length}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listFlights();
