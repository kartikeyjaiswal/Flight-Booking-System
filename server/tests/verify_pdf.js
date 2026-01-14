const PDFDocument = require('pdfkit');
const fs = require('fs');

function verifyPDF() {
    console.log('--- Verifying PDF Generation ---');
    try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream('test_ticket.pdf');

        doc.pipe(stream);

        doc.fontSize(20).text('Test Ticket', { align: 'center' });
        doc.text('This is a verification of PDFKit.');

        doc.end();

        stream.on('finish', () => {
            const stats = fs.statSync('test_ticket.pdf');
            if (stats.size > 0) {
                console.log(`PASS: PDF generated successfully. Size: ${stats.size} bytes`);
                fs.unlinkSync('test_ticket.pdf'); // Cleanup
                process.exit(0);
            } else {
                console.error('FAIL: PDF file is empty.');
                process.exit(1);
            }
        });

    } catch (err) {
        console.error('Error generating PDF:', err);
        process.exit(1);
    }
}

verifyPDF();
