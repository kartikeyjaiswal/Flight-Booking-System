import { useState } from 'react';

const SearchWidget = ({
    from, setFrom,
    to, setTo,
    tripType, setTripType, setBookingStep, setOutboundFlight,
    wallet,
    totalPax, passengers, updatePassengers,
    onSearch, loading, message,
    specialFare, setSpecialFare
}) => {
    const [showPaxModal, setShowPaxModal] = useState(false);

    return (
        <div className="max-w-5xl mx-auto -mt-32 relative z-20 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                {/* Top Row: Trip Type & Wallet */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div className="flex gap-6">
                        <span
                            onClick={() => { setTripType('one-way'); setBookingStep('search'); setOutboundFlight(null); }}
                            className={`cursor-pointer pb-1 font-bold transition-all ${tripType === 'one-way' ? 'border-b-2 border-blue-600 text-blue-900' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            One Way
                        </span>
                        <span
                            onClick={() => { setTripType('round-trip'); setBookingStep('search'); setOutboundFlight(null); }}
                            className={`cursor-pointer pb-1 font-bold transition-all ${tripType === 'round-trip' ? 'border-b-2 border-blue-600 text-blue-900' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            Round Trip
                        </span>
                    </div>
                    <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        Wallet: ₹{wallet.toLocaleString()}
                    </div>
                </div>

                {/* Inputs Row 1: From/To/Date/Pax */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-6">
                    <div className="md:col-span-3">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">From</label>
                        <input
                            className="w-full border-b-2 border-gray-300 py-2 text-xl font-bold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors uppercase placeholder-gray-300"
                            placeholder="DELHI"
                            value={from} onChange={e => setFrom(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-1 flex justify-center pb-2">
                        <button onClick={() => { const temp = from; setFrom(to); setTo(temp); }} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition-colors">⇆</button>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">To</label>
                        <input
                            className="w-full border-b-2 border-gray-300 py-2 text-xl font-bold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors uppercase placeholder-gray-300"
                            placeholder="MUMBAI"
                            value={to} onChange={e => setTo(e.target.value)}
                        />
                    </div>

                    {tripType === 'round-trip' && (
                        <div className="md:col-span-2">
                            <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Return Date</label>
                            <input type="date" className="w-full border-b-2 border-gray-300 py-2 text-lg font-bold text-gray-800 focus:outline-none focus:border-blue-600" />
                        </div>
                    )}

                    <div className="md:col-span-3 relative">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Travelers</label>
                        <div
                            className="w-full border-b-2 border-gray-300 py-2 text-xl font-bold text-gray-800 cursor-pointer flex justify-between items-center"
                            onClick={() => setShowPaxModal(!showPaxModal)}
                        >
                            <span>{totalPax} Traveler(s)</span>
                            <span className="text-sm">▼</span>
                        </div>

                        {/* Passenger Modal */}
                        {showPaxModal && (
                            <div className="absolute top-full left-0 z-50 bg-white shadow-2xl rounded-lg p-4 w-72 border border-gray-200 mt-2">
                                {[
                                    { label: 'Adults', sub: '(12+ yrs)', key: 'adults' },
                                    { label: 'Children', sub: '(2-12 yrs)', key: 'children' },
                                    { label: 'Infants', sub: '(0-2 yrs)', key: 'infants' }
                                ].map(type => (
                                    <div key={type.key} className="flex justify-between items-center mb-4 last:mb-0">
                                        <div>
                                            <div className="font-bold text-gray-800">{type.label}</div>
                                            <div className="text-xs text-gray-500">{type.sub}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updatePassengers(type.key, passengers[type.key] - 1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">-</button>
                                            <span className="font-bold w-4 text-center">{passengers[type.key]}</span>
                                            <button onClick={() => updatePassengers(type.key, passengers[type.key] + 1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">+</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                                    <button onClick={() => setShowPaxModal(false)} className="text-[#001b94] font-bold text-sm">Done</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Fares */}
                <div className="mb-6">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Special Fares</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: 'Regular', id: '' },
                            { label: 'Student', id: 'student' },
                            { label: 'Senior Citizen', id: 'senior' },
                            { label: 'Armed Forces', id: 'armed-forces' },
                            { label: 'Doctors & Nurses', id: 'doctors' }
                        ].map(fare => (
                            <button
                                key={fare.id}
                                onClick={() => setSpecialFare(fare.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${specialFare === fare.id ? 'bg-[#001b94] text-white border-[#001b94]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'}`}
                            >
                                {fare.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Button */}
                <div>
                    <button
                        className="w-full bg-[#001b94] text-white py-3 rounded-md font-bold text-lg hover:bg-blue-800 transition-transform active:scale-95 disabled:opacity-70"
                        onClick={onSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search Flight'}
                    </button>
                </div>

                {message && <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded border border-blue-100 text-center">{message}</div>}
            </div>
        </div>
    );
};

export default SearchWidget;
