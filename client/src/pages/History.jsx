import { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bookings');
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const downloadTicket = (booking) => {
        const url = `http://localhost:5000/api/bookings/${booking._id}/pdf`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ticket-${booking.pnr}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Booking History</h2>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PNR</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{booking.pnr}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{booking.airline} ({booking.flight_id})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{booking.source} ➝ {booking.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(booking.booking_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{booking.price_paid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => downloadTicket(booking)}
                                            className="text-blue-600 hover:text-blue-900 font-semibold"
                                        >
                                            Download Ticket
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
