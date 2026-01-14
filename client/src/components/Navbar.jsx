import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">FlightBooker</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-blue-200">Search Flights</Link>
                    <Link to="/history" className="hover:text-blue-200">My Bookings</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
