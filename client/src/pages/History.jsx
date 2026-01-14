import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import bookingService from '../services/bookingService';

const History = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const data = await bookingService.getUserBookings(user.email);
                setBookings(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, [user]);

    const downloadTicket = (booking) => {
        const url = bookingService.getTicketPdfUrl(booking._id);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ticket-${booking.pnr}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCheckIn = async (id) => {
        try {
            await bookingService.checkIn(id);
            // Update local state
            setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Checked-in' } : b));
            alert('Web Check-in Successful!');
        } catch (err) {
            console.error(err);
            alert('Check-in failed');
        }
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => {
                                // Formatting Passenger Display
                                let paxDisplay = "Unknown";
                                if (booking.passengers && booking.passengers.length > 0) {
                                    paxDisplay = booking.passengers[0].name;
                                    if (booking.passengers.length > 1) {
                                        paxDisplay += ` + ${booking.passengers.length - 1} others`;
                                    }
                                } else if (booking.passenger_name) {
                                    paxDisplay = booking.passenger_name; // Legacy support
                                }

                                return (
                                    <tr key={booking._id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{booking.pnr}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{booking.airline} ({booking.flight_id})</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{booking.source} ➝ {booking.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(booking.booking_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            ₹{booking.total_price || booking.price_paid}
                                            <div className="text-xs text-gray-400">{paxDisplay}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Checked-in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {booking.status || 'Confirmed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <button
                                                onClick={() => downloadTicket(booking)}
                                                className="text-blue-600 hover:text-blue-900 font-semibold"
                                            >
                                                Download
                                            </button>
                                            {booking.status !== 'Checked-in' && (
                                                <button
                                                    onClick={() => handleCheckIn(booking._id)}
                                                    className="text-[#001b94] hover:text-blue-800 font-bold border border-[#001b94] px-3 py-1 rounded"
                                                >
                                                    Web Check-in
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
