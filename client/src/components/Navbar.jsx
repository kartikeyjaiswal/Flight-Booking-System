import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav className="bg-[#001b94] text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    ✈️ IndigoClone
                </Link>
                <div className="space-x-8 font-medium">
                    <Link to="/" className="hover:text-blue-200 transition-colors">Book Flight</Link>
                    {user ? (
                        <>
                            <Link to="/history" className="hover:text-blue-200 transition-colors">My Bookings</Link>
                            <Link to="/history" className="hover:text-blue-200 cursor-pointer">Check-in</Link>
                            <Link to="/contact" className="hover:text-blue-200 transition-colors">Contact</Link>
                            <span onClick={logout} className="hover:text-red-300 cursor-pointer text-blue-100">Logout ({user.name.split(' ')[0]})</span>
                        </>
                    ) : (
                        <>
                            <Link to="/contact" className="hover:text-blue-200 transition-colors">Contact</Link>
                            <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                            <Link to="/register" className="bg-white text-[#001b94] px-4 py-1 rounded-full hover:bg-blue-50 transition-colors">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
