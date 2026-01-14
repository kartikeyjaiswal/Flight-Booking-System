import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [sortBy, setSortBy] = useState('price'); // price, airline
    const [filterAirline, setFilterAirline] = useState('All');

    const [wallet, setWallet] = useState(() => parseInt(localStorage.getItem('balance')) || 50000);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('balance', wallet);
    }, [wallet]);

    useEffect(() => {
        let result = [...flights];

        // Filter
        if (filterAirline !== 'All') {
            result = result.filter(f => f.airline === filterAirline);
        }

        // Sort
        if (sortBy === 'price') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'airline') {
            result.sort((a, b) => a.airline.localeCompare(b.airline));
        }

        setFilteredFlights(result);
    }, [flights, sortBy, filterAirline]);

    const searchFlights = async () => {
        const source = from.trim();
        const destination = to.trim();

        if (!source || !destination) {
            setMessage('Please enter both source and destination.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.get(`http://localhost:5000/api/flights/search?from=${source}&to=${destination}`);
            setFlights(res.data);
            if (res.data.length === 0) setMessage('No flights found for this route.');
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
                passenger_name: "Indigo User",
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

            alert('Booking Confirmed! Your ticket is downloading.');
            searchFlights();

        } catch (err) {
            console.error(err);
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="-mt-4">
            {/* Hero Section */}
            <div className="relative bg-[#001b94] h-[300px] flex items-center justify-center -mx-4 px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
                <div className="text-white text-center z-10 relative">
                    <h1 className="text-4xl font-bold mb-2">Hello, where to?</h1>
                    <p className="text-blue-100 text-lg">Great flights at rock bottom prices.</p>
                </div>
            </div>

            {/* Search Widget */}
            <div className="max-w-5xl mx-auto -mt-16 relative z-20 px-4">
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <span className="border-b-2 border-blue-600 pb-1 text-blue-900 font-bold cursor-pointer">One Way</span>
                            <span className="text-gray-500 cursor-pointer hover:text-blue-600">Round Trip</span>
                        </div>
                        <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            Wallet Balance: ₹{wallet.toLocaleString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label className="block text-gray-500 text-xs font-bold uppercase mb-1">From</label>
                            <input
                                className="w-full border-b-2 border-gray-300 py-2 text-xl font-bold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors uppercase placeholder-gray-300"
                                placeholder="DELHI"
                                value={from} onChange={e => setFrom(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-1 flex justify-center pb-2">
                            <span className="bg-gray-100 p-2 rounded-full text-gray-400">⇆</span>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-gray-500 text-xs font-bold uppercase mb-1">To</label>
                            <input
                                className="w-full border-b-2 border-gray-300 py-2 text-xl font-bold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors uppercase placeholder-gray-300"
                                placeholder="MUMBAI"
                                value={to} onChange={e => setTo(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button
                                className="w-full bg-[#001b94] text-white py-3 rounded-md font-bold text-lg hover:bg-blue-800 transition-transform active:scale-95 disabled:opacity-70"
                                onClick={searchFlights}
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search Flight'}
                            </button>
                        </div>
                    </div>
                    {message && <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded border border-blue-100 text-center">{message}</div>}
                </div>
            </div>

            {/* Flight Results */}
            <div className="max-w-5xl mx-auto py-10 px-4">
                {flights.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-700">Available Flights ({filteredFlights.length})</h3>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <select
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#001b94] cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="price">Sort by Price</option>
                                <option value="airline">Sort by Airline</option>
                            </select>
                            <select
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#001b94] cursor-pointer"
                                value={filterAirline}
                                onChange={(e) => setFilterAirline(e.target.value)}
                            >
                                <option value="All">All Airlines</option>
                                <option value="IndiGo">IndiGo</option>
                                <option value="Air India">Air India</option>
                                <option value="SpiceJet">SpiceJet</option>
                                <option value="Vistara">Vistara</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {filteredFlights.map(flight => (
                        <div key={flight._id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition-all group">

                            {/* Airline Info */}
                            <div className="flex items-center gap-4 w-full md:w-1/4 mb-4 md:mb-0">
                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                                    ✈️
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{flight.airline}</h4>
                                    <p className="text-xs text-gray-500 uppercase">{flight.flight_id}</p>
                                </div>
                            </div>

                            {/* Route Info */}
                            <div className="flex-1 text-center mb-4 md:mb-0 px-4">
                                <div className="flex items-center justify-center gap-4 text-gray-700">
                                    <div>
                                        <div className="text-xl font-bold">10:00</div>
                                        <div className="text-sm text-gray-400 uppercase">{flight.departure_city}</div>
                                    </div>
                                    <div className="flex flex-col items-center w-24">
                                        <div className="text-xs text-gray-400 mb-1">2h 15m</div>
                                        <div className="h-[2px] w-full bg-gray-300 relative">
                                            <div className="absolute -top-1 right-0 h-2 w-2 bg-gray-300 rounded-full"></div>
                                            <div className="absolute -top-1 left-0 h-2 w-2 bg-gray-300 rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Non-stop</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">12:15</div>
                                        <div className="text-sm text-gray-400 uppercase">{flight.arrival_city}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="w-full md:w-1/4 flex flex-col items-end pl-4 border-l border-gray-100">
                                {flight.isSurge && (
                                    <span className="text-[10px] font-bold tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 mb-1 animate-pulse">
                                        ⚡ SURGE PRICING
                                    </span>
                                )}
                                <div className="text-2xl font-bold text-[#001b94] mb-2">₹{flight.price.toLocaleString()}</div>
                                <button
                                    className="bg-[#001b94] text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 w-full transition-colors"
                                    onClick={() => handleBook(flight)}
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
