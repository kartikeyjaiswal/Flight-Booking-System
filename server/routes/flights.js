const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Search Flights
router.get('/search', async (req, res) => {
    try {
        const { from, to } = req.query;

        let query = {};
        if (from) query.departure_city = { $regex: new RegExp(from, 'i') };
        if (to) query.arrival_city = { $regex: new RegExp(to, 'i') };

        // Fetch flights (limit 10 per requirements)
        // Note: The requirement says "Every search must return 10 flights". 
        // If query narrows it down, it returns matches. If no query, maybe random 10?
        // I'll assume matches.
        const flights = await Flight.find(query).limit(10);

        const results = [];

        for (let flight of flights) {
            const now = new Date();
            const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

            // Filter old attempts
            flight.search_attempts = flight.search_attempts.filter(t => t > fiveMinutesAgo);

            // Record this search attempt
            flight.search_attempts.push(now);

            // Check Surge
            // Rule: 3 attempts in 5 mins -> +10%
            let isSurge = false;

            // Check if existing surge applies
            if (flight.surge_until && flight.surge_until > now) {
                isSurge = true;
            } else {
                // Check if we should trigger new surge
                // We just added an attempt. If count >= 3, trigger.
                if (flight.search_attempts.length >= 3) {
                    flight.surge_until = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins
                    isSurge = true;
                } else {
                    flight.surge_until = null;
                }
            }

            // Save updates to DB
            await flight.save();

            // Calculate Display Price
            const price = isSurge ? Math.floor(flight.base_price * 1.1) : flight.base_price;

            results.push({
                ...flight.toObject(),
                price,
                isSurge
            });
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
