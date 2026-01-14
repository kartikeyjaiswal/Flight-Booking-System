const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const PDFDocument = require('pdfkit');

// Create Booking
router.post('/', async (req, res) => {
    try {
        const { flight_id, passenger_name, airline, source, destination, price_paid, pnr } = req.body;

        const booking = new Booking({
            flight_id,
            passenger_name,
            airline,
            source,
            destination,
            price_paid,
            pnr: pnr || ('PNR' + Math.floor(100000 + Math.random() * 900000))
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Bookings (History)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ booking_date: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Download PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).send('Booking not found');

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.pnr}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text('Flight Booking Ticket', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`PNR: ${booking.pnr}`);
        doc.moveDown();
        doc.text(`Passenger: ${booking.passenger_name}`);
        doc.text(`Airline: ${booking.airline}`);
        doc.text(`Flight ID: ${booking.flight_id}`);
        doc.text(`Route: ${booking.source} -> ${booking.destination}`);
        doc.text(`Price Paid: \u20B9${booking.price_paid}`); // Rupee Symbol
        doc.text(`Date: ${new Date(booking.booking_date).toLocaleString()}`);

        doc.end();

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Web Check-in
router.put('/:id/checkin', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = 'Checked-in';
        await booking.save();

        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
