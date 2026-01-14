const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const PDFDocument = require('pdfkit');

// Create Booking (Group)
router.post('/', async (req, res) => {
    try {
        const { flight_id, passengers, airline, source, destination, total_price, user_email } = req.body;

        const booking = new Booking({
            flight_id,
            passengers, // Array of { name, age, gender, type }
            airline,
            source,
            destination,
            total_price,
            user_email
            // PNR generated in pre-save
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Get All Bookings (History)
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        let query = {};
        if (email) {
            query.user_email = email;
        }
        const bookings = await Booking.find(query).sort({ booking_date: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Download Professional Ticket PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).send('Booking not found');

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.pnr}.pdf`);

        doc.pipe(res);

        // --- HEADER ---
        // Blue Header Bar
        doc.rect(0, 0, 612, 100).fill('#001b94');

        // Logo / Airline Name
        doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text(booking.airline, 50, 40);
        doc.fontSize(10).font('Helvetica').text('E-TICKET / RECEIPT', 450, 40);
        doc.fontSize(14).text(`PNR: ${booking.pnr}`, 450, 55);

        doc.moveDown(4);

        // --- FLIGHT DETAILS ---
        doc.fillColor('#333333');
        doc.fontSize(12).font('Helvetica-Bold').text('FLIGHT INFORMATION', 50, 130);
        doc.rect(50, 145, 512, 0.5).fill('#cccccc'); // Separator

        doc.fontSize(10).font('Helvetica');
        let y = 160;

        // Flight ID
        doc.font('Helvetica-Bold').text('Flight ID:', 50, y);
        doc.font('Helvetica').text(booking.flight_id, 120, y);

        // Date
        doc.font('Helvetica-Bold').text('Date:', 250, y);
        doc.font('Helvetica').text(new Date(booking.booking_date).toLocaleDateString(), 300, y);

        // Status
        doc.font('Helvetica-Bold').text('Status:', 450, y);
        doc.font('Helvetica').text(booking.status, 500, y, {
            color: booking.status === 'Confirmed' ? '#008000' : '#000000'
        });
        doc.fillColor('#333333'); // Reset color

        y += 20;
        // Route
        doc.font('Helvetica-Bold').text('From:', 50, y);
        doc.font('Helvetica').text(booking.source, 120, y);

        doc.font('Helvetica-Bold').text('To:', 250, y);
        doc.font('Helvetica').text(booking.destination, 300, y);

        y += 40;

        // --- PASSENGER TABLE ---
        doc.fontSize(12).font('Helvetica-Bold').text('PASSENGER DETAILS', 50, y);
        y += 15;

        // Table Header
        const tableTop = y;
        doc.rect(50, tableTop, 512, 20).fill('#f0f0f0');
        doc.fillColor('#333333');
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('#', 60, tableTop + 5);
        doc.text('Passenger Name', 100, tableTop + 5);
        doc.text('Type', 350, tableTop + 5);
        doc.text('Age/Gender', 450, tableTop + 5);

        y = tableTop + 25;
        doc.font('Helvetica');

        // Passengers Logic
        let paxList = booking.passengers || [];
        // Fallback for old bookings
        if (paxList.length === 0 && booking.passenger_name) {
            paxList = [{
                name: booking.passenger_name,
                type: 'Adult', // Default
                age: 'N/A',
                gender: 'N/A'
            }];
        }

        paxList.forEach((pax, i) => {
            doc.text(i + 1, 60, y);
            doc.text(pax.name, 100, y);
            doc.text(pax.type, 350, y);
            doc.text(`${pax.age} / ${pax.gender}`, 450, y);

            // Row Line
            doc.rect(50, y + 15, 512, 0.5).fill('#eeeeee');
            doc.fillColor('#333333');
            y += 25;
        });

        y += 20;

        // --- PAYMENT ---
        doc.rect(350, y, 212, 40).fill('#f9f9f9');
        doc.fillColor('#333333');
        doc.fontSize(14).font('Helvetica-Bold').text(`Total Paid: \u20B9${booking.total_price || booking.price_paid}`, 370, y + 12);

        // --- FOOTER ---
        doc.fontSize(8).font('Helvetica').text('Thank you for choosing us. This is a computer-generated receipt.', 50, 700, { align: 'center', width: 512 });

        doc.end();

    } catch (err) {
        console.error(err);
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
