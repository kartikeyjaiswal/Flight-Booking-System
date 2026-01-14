const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'];
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

const seedFlights = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected for Seeding');

        await Flight.deleteMany({});
        console.log('Cleared existing flights');

        const flights = [];
        for (let i = 1; i <= 20; i++) {
            const from = cities[Math.floor(Math.random() * cities.length)];
            let to = cities[Math.floor(Math.random() * cities.length)];
            while (to === from) {
                to = cities[Math.floor(Math.random() * cities.length)];
            }

            flights.push({
                flight_id: `FL-${100 + i}`,
                airline: airlines[Math.floor(Math.random() * airlines.length)],
                departure_city: from,
                arrival_city: to,
                base_price: Math.floor(Math.random() * (3000 - 2000 + 1) + 2000),
                search_attempts: [],
                surge_until: null
            });
        }

        await Flight.insertMany(flights);
        console.log(`Seeded ${flights.length} flights`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedFlights();
