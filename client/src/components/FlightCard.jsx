const FlightCard = ({ flight, onSelect, actionLabel }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition-all group">

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
                    onClick={() => onSelect(flight)}
                >
                    {actionLabel || 'Book'}
                </button>
            </div>
        </div>
    );
};

export default FlightCard;
