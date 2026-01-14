import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(name, email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-gray-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-[#001b94] text-center">Create an Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#001b94] text-white py-2 rounded font-bold hover:bg-blue-800 transition-colors"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-[#001b94] font-bold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
