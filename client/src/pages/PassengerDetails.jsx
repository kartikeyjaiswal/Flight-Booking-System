import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import bookingService from '../services/bookingService';
import PassengerForm from '../components/PassengerForm';
import FareSummary from '../components/FareSummary';

const PassengerDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // State derived from navigation
    const { outboundFlight, returnFlight, passengers, tripType } = location.state || {};

    // Redirect if no state (direct access)
    useEffect(() => {
        if (!outboundFlight) {
            navigate('/');
        }
    }, [outboundFlight, navigate]);

    // Wallet Key based on user
    const walletKey = user ? `wallet_${user.email}` : 'wallet_guest';
    const [wallet, setWallet] = useState(() => {
        const saved = localStorage.getItem(walletKey);
        return saved ? parseInt(saved) : 50000;
    });

    // Form State
    const [forms, setForms] = useState([]);

    // Initialize forms based on passengers count
    useEffect(() => {
        if (!passengers) return;

        const newForms = [];
        ['adults', 'children', 'infants'].forEach(type => {
            for (let i = 0; i < passengers[type]; i++) {
                newForms.push({
                    type: type.slice(0, -1), // remove 's'
                    index: i + 1,
                    name: '',
                    age: '',
                    gender: 'Male'
                });
            }
        });
        setForms(newForms);
    }, [passengers]);

    const handleInputChange = (index, field, value) => {
        const updatedForms = [...forms];
        updatedForms[index][field] = value;
        setForms(updatedForms);
    };

    // Calculate Totals
    const totalPax = forms.length;
    const basePrice = (outboundFlight?.price || 0) + (returnFlight?.price || 0);
    const totalPrice = basePrice * totalPax;

    const handlePayment = async () => {
        if (wallet < totalPrice) {
            alert(`Insufficient Wallet Balance! Need \u20B9${totalPrice - wallet} more.`);
            return;
        }

        // Validate Inputs
        for (const form of forms) {
            if (!form.name || !form.age) {
                alert(`Please fill all details for ${form.type} ${form.index}`);
                return;
            }
        }

        const confirm = window.confirm(`Confirm payment of \u20B9${totalPrice.toLocaleString()} for ${totalPax} passengers?`);
        if (!confirm) return;

        try {
            const flightsToBook = [outboundFlight];
            if (returnFlight) flightsToBook.push(returnFlight);

            const tickets = [];

            // Create ONE booking per flight (Group Booking)
            for (const flight of flightsToBook) {
                const bookingData = {
                    flight_id: flight.flight_id,
                    passengers: forms.map(f => ({
                        name: f.name,
                        age: f.age,
                        gender: f.gender,
                        type: f.type
                    })),
                    airline: flight.airline,
                    source: flight.departure_city,
                    destination: flight.arrival_city,
                    total_price: flight.price * totalPax, // Total for this flight
                    user_email: user.email
                };

                const data = await bookingService.createBooking(bookingData);
                tickets.push(data);
            }

            // Deduct Wallet
            setWallet(prev => {
                const newVal = prev - totalPrice;
                localStorage.setItem(walletKey, newVal);
                return newVal;
            });

            // Download Tickets (Group PNR PDF)
            for (const ticket of tickets) {
                const pdfUrl = bookingService.getTicketPdfUrl(ticket._id);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `Ticket-${ticket.pnr}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                await new Promise(r => setTimeout(r, 500));
            }

            alert('Booking Successful! Your group tickets are downloading.');
            navigate('/');

        } catch (err) {
            console.error(err);
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (!outboundFlight) return null;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-[#001b94] mb-8">Passenger Details</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Forms */}
                <div className="flex-1 space-y-6">
                    {forms.map((form, idx) => (
                        <PassengerForm
                            key={idx}
                            form={form}
                            idx={idx}
                            onChange={handleInputChange}
                        />
                    ))}
                </div>

                {/* Right: Summary */}
                <FareSummary
                    outboundFlight={outboundFlight}
                    returnFlight={returnFlight}
                    totalPax={totalPax}
                    totalPrice={totalPrice}
                    wallet={wallet}
                    onPay={handlePayment}
                />
            </div>
        </div>
    );
};

export default PassengerDetails;
