import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import flightService from '../services/flightService';
import SearchWidget from '../components/SearchWidget';
import FlightCard from '../components/FlightCard';

const Home = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [sortBy, setSortBy] = useState('price'); // price, airline
    const [filterAirline, setFilterAirline] = useState('All');

    // Advanced booking state
    const [tripType, setTripType] = useState('one-way'); // one-way, round-trip
    const [bookingStep, setBookingStep] = useState('search'); // search, outbound-selected, review
    const [outboundFlight, setOutboundFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);

    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [specialFare, setSpecialFare] = useState(''); // 'student', 'senior', 'armed-forces', 'doctors'

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Wallet Key based on user
    const walletKey = user ? `wallet_${user.email}` : 'wallet_guest';

    // Initialize wallet
    const [wallet, setWallet] = useState(() => {
        const saved = localStorage.getItem(walletKey);
        return saved ? parseInt(saved) : 50000;
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Update wallet when user changes
    useEffect(() => {
        const saved = localStorage.getItem(walletKey);
        setWallet(saved ? parseInt(saved) : 50000);
    }, [walletKey]);

    useEffect(() => {
        localStorage.setItem(walletKey, wallet);
    }, [wallet, walletKey]);

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

    const handleSearchFlights = async (customFrom, customTo) => {
        const source = (customFrom || from).trim();
        const destination = (customTo || to).trim();

        if (!source || !destination) {
            setMessage('Please enter both source and destination.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const data = await flightService.searchFlights(source, destination);
            setFlights(data);
            if (data.length === 0) setMessage('No flights found for this route.');
        } catch (err) {
            console.error(err);
            setMessage('Error fetching flights. Ensure server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        setBookingStep('search');
        setOutboundFlight(null);
        setReturnFlight(null);
        handleSearchFlights();
    };

    const selectFlight = (flight) => {
        if (!user) {
            alert('Please Login to continue!');
            navigate('/login');
            return;
        }

        if (tripType === 'one-way') {
            handleBook([flight]);
        } else {
            // Round Trip Logic
            if (!outboundFlight) {
                setOutboundFlight(flight);
                setBookingStep('outbound-selected');
                setMessage('Great! Now select your return flight.');
                // Auto search return
                handleSearchFlights(to, from);
                // Creating a visual swap effect
                setFrom(to);
                setTo(from);
            } else {
                setReturnFlight(flight);
                setBookingStep('review');
                setMessage('Review your Round Trip booking.');
            }
        }
    };

    const handleBook = async (flightsToBook) => {
        navigate('/book', {
            state: {
                outboundFlight: flightsToBook[0], // Always has outbound
                returnFlight: flightsToBook[1] || null, // Optional return
                passengers: passengers,
                tripType: tripType
            }
        });
    };

    const updatePassengers = (type, value) => {
        if (value < 0) return;
        setPassengers(prev => ({ ...prev, [type]: value }));
    };

    const totalPax = passengers.adults + passengers.children + passengers.infants;

    return (
        <div className="-mt-4">
            {/* Hero Section */}
            <div className="relative bg-[#001b94] h-[350px] flex items-center justify-center -mx-4 px-4 pb-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
                <div className="text-white text-center z-10 relative">
                    <h1 className="text-4xl font-bold mb-2">Hello, where to?</h1>
                    <p className="text-blue-100 text-lg">Great flights at rock bottom prices.</p>
                </div>
            </div>

            {/* Search Widget Component */}
            <SearchWidget
                from={from} setFrom={setFrom}
                to={to} setTo={setTo}
                tripType={tripType} setTripType={setTripType}
                setBookingStep={setBookingStep} setOutboundFlight={setOutboundFlight}
                wallet={wallet}
                totalPax={totalPax} passengers={passengers} updatePassengers={updatePassengers}
                onSearch={handleSearchClick}
                loading={loading} message={message}
                specialFare={specialFare} setSpecialFare={setSpecialFare}
            />

            {/* Flight Results or Review */}
            <div className="max-w-5xl mx-auto py-10 px-4">
                {bookingStep === 'review' ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-[#001b94]">Review Your Trip</h2>
                        <div className="space-y-4 mb-6">
                            <div className="border p-4 rounded bg-gray-50">
                                <h3 className="font-bold text-gray-700 mb-2">Outbound Flight</h3>
                                <div className="flex justify-between">
                                    <span>{outboundFlight.airline} ({outboundFlight.flight_id})</span>
                                    <span className="font-bold">₹{outboundFlight.price}</span>
                                </div>
                                <div className="text-sm text-gray-500">{outboundFlight.departure_city} ➝ {outboundFlight.arrival_city}</div>
                            </div>
                            <div className="border p-4 rounded bg-gray-50">
                                <h3 className="font-bold text-gray-700 mb-2">Return Flight</h3>
                                <div className="flex justify-between">
                                    <span>{returnFlight.airline} ({returnFlight.flight_id})</span>
                                    <span className="font-bold">₹{returnFlight.price}</span>
                                </div>
                                <div className="text-sm text-gray-500">{returnFlight.departure_city} ➝ {returnFlight.arrival_city}</div>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200">
                                <span>Total Price</span>
                                <span className="text-[#001b94]">₹{outboundFlight.price + returnFlight.price}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setBookingStep('search')} className="w-1/2 border border-gray-300 py-3 rounded font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => handleBook([outboundFlight, returnFlight])} className="w-1/2 bg-[#001b94] text-white py-3 rounded font-bold hover:bg-blue-800">Confirm Booking</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header for Round Trip Selection */}
                        {tripType === 'round-trip' && bookingStep === 'outbound-selected' && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 font-bold flex justify-between items-center">
                                <span>Step 2: Select Return Flight ({from} to {to})</span>
                                <div className="text-sm font-normal">Outbound: ₹{outboundFlight.price}</div>
                            </div>
                        )}

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
                                <FlightCard
                                    key={flight._id}
                                    flight={flight}
                                    onSelect={selectFlight}
                                    actionLabel={tripType === 'round-trip' && bookingStep === 'search' ? 'Select' : 'Book'}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
