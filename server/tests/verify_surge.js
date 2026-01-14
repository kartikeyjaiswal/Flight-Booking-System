const axios = require('axios');
const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000/api/flights/search';

async function verifySurge() {
    console.log('--- Starting Surge Pricing Verification ---');

    try {
        // 1. Reset a specific flight for testing
        // Connecting using mongoose to reset state directly in DB
        await mongoose.connect(process.env.MONGO_URI);
        const flight = await Flight.findOne();
        if (!flight) {
            console.error('No flights found in DB. Run seed first.');
            process.exit(1);
        }

        // Reset
        flight.search_attempts = [];
        flight.surge_until = null;
        await flight.save();

        const testFrom = flight.departure_city;
        const testTo = flight.arrival_city;
        const basePrice = flight.base_price;

        console.log(`Testing Flight: ${flight.flight_id} (${testFrom} -> ${testTo}) Base Price: ${basePrice}`);

        // 2. Perform searches
        console.log(' performing 1st search...');
        let res = await axios.get(`${BASE_URL}?from=${testFrom}&to=${testTo}`);
        let targetFlight = res.data.find(f => f.flight_id === flight.flight_id);
        if (targetFlight.price !== basePrice) {
            console.error('FAIL: Price should be base price on 1st attempt');
        } else {
            console.log('PASS: Price is base price');
        }

        console.log(' performing 2nd search...');
        await axios.get(`${BASE_URL}?from=${testFrom}&to=${testTo}`);

        console.log(' performing 3rd search (Should Trigger Surge)...');
        res = await axios.get(`${BASE_URL}?from=${testFrom}&to=${testTo}`);
        targetFlight = res.data.find(f => f.flight_id === flight.flight_id);

        // Note: The logic in routes/flights.js triggers surge *after* the attempts check.
        // If Logic is: Add attempt. If attempt count >= 3, set surge.
        // Then return price.
        // So the 3rd request should see the surge.

        const expectedPrice = Math.floor(basePrice * 1.1);

        if (targetFlight.isSurge && targetFlight.price === expectedPrice) {
            console.log(`PASS: Surge Active! Price: ${targetFlight.price} (Expected: ${expectedPrice})`);
        } else {
            console.error(`FAIL: Surge mismatch. Got ${targetFlight.price}, Expected ${expectedPrice}. IsSurge: ${targetFlight.isSurge}`);
        }

        console.log('--- Verification Complete ---');
        process.exit(0);

    } catch (err) {
        console.error('Error during verification:', err.message);
        process.exit(1);
    }
}

verifySurge();
