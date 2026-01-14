const FareSummary = ({
    outboundFlight, returnFlight,
    totalPax, totalPrice,
    wallet, onPay
}) => {
    return (
        <div className="w-full md:w-80 h-fit bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Fare Summary</h3>

            <div className="mb-4">
                <div className="font-bold text-sm text-gray-600 mb-2">Outbound</div>
                <div className="flex justify-between text-sm">
                    <span>{outboundFlight.airline}</span>
                    <span>₹{outboundFlight.price}</span>
                </div>
                <div className="text-xs text-gray-400">{outboundFlight.departure_city} ➝ {outboundFlight.arrival_city}</div>
            </div>

            {returnFlight && (
                <div className="mb-4 border-t pt-2">
                    <div className="font-bold text-sm text-gray-600 mb-2">Return</div>
                    <div className="flex justify-between text-sm">
                        <span>{returnFlight.airline}</span>
                        <span>₹{returnFlight.price}</span>
                    </div>
                    <div className="text-xs text-gray-400">{returnFlight.departure_city} ➝ {returnFlight.arrival_city}</div>
                </div>
            )}

            <div className="mb-4 border-t pt-2">
                <div className="flex justify-between text-sm mb-1">
                    <span>Travelers</span>
                    <span>x {totalPax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#001b94] mt-2">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                </div>
            </div>

            <button
                onClick={onPay}
                className="w-full bg-[#001b94] text-white py-3 rounded font-bold hover:bg-blue-800 transition-transform active:scale-95"
            >
                Pay & Book
            </button>
            <div className="text-center mt-2 text-xs text-gray-500">
                Wallet Balance: ₹{wallet.toLocaleString()}
            </div>
        </div>
    );
};

export default FareSummary;
