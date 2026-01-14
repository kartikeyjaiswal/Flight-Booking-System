import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [flights, setFlights] = useState([]);
    const [wallet, setWallet] = useState(() => parseInt(localStorage.getItem('balance')) || 50000);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('balance', wallet);
    }, [wallet]);

    const searchFlights = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/flights/search?from=${from}&to=${to}`);
            setFlights(res.data);
            setMessage(res.data.length === 0 ? 'No flights found.' : '');
        } catch (err) {
            console.error(err);
            setMessage('Error fetching flights. Ensure server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (flight) => {
        if (wallet < flight.price) {
            alert(`Insufficient Wallet Balance! Need \u20B9${flight.price - wallet} more.`);
            return;
        }

        const confirm = window.confirm(`Confirm booking for ${flight.airline} to ${flight.arrival_city} for \u20B9${flight.price}?`);
        if (!confirm) return;

        try {
            const bookingData = {
                flight_id: flight.flight_id,
                passenger_name: "test user",
                airline: flight.airline,
                source: flight.departure_city,
                destination: flight.arrival_city,
                price_paid: flight.price
            };

            const res = await axios.post('http://localhost:5000/api/bookings', bookingData);

            setWallet(prev => prev - flight.price);

            const pdfUrl = `http://localhost:5000/api/bookings/${res.data._id}/pdf`;

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Ticket-${res.data.pnr}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Booking Successful! Ticket downloading...');
            searchFlights();

        } catch (err) {
            console.error(err);
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Search Flights</h2>
                    <div className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full border border-green-200">
                        Wallet: ₹{wallet.toLocaleString()}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="From (e.g. Delhi)"
                        value={from} onChange={e => setFrom(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="To (e.g. Mumbai)"
                        value={to} onChange={e => setTo(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
                        onClick={searchFlights}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {message && <p className="text-gray-600 mt-4 text-center">{message}</p>}
            </div>

            <div className="grid gap-4">
                {flights.map(flight => (
                    <div key={flight._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-xl text-gray-800">{flight.airline}</h3>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{flight.flight_id}</span>
                            </div>
                            <div className="mt-2 text-gray-600 text-lg">
                                {flight.departure_city} <span className="mx-2 text-gray-400">➝</span> {flight.arrival_city}
                            </div>
                            {flight.isSurge && (
                                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    High Demand - Surge Pricing Active
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</div>
                            {flight.isSurge && (
                                <div className="text-sm text-gray-400 line-through">₹{flight.original_price.toLocaleString()}</div>
                            )}
                            <button
                                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-sm"
                                onClick={() => handleBook(flight)}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
