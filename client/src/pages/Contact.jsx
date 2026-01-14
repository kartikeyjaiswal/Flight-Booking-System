const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto py-10 bg-white p-8 rounded shadow-lg mt-8">
            <h2 className="text-3xl font-bold text-[#001b94] mb-6">Contact Us</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                    <p className="text-gray-600 mb-4">
                        Have questions about your flight? Our support team is here to help you 24/7.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📞</span>
                            <span className="text-gray-700 font-medium">+91 1800 123 4567</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            <span className="text-gray-700 font-medium">support@indigoclone.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🏢</span>
                            <span className="text-gray-700 font-medium">Level 1, Tower C, Global Business Park, Gurgaon, India</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4">Send us a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]" type="text" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]" type="email" placeholder="Your Email" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                            <textarea className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-[#001b94]" rows="4" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="bg-[#001b94] text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition-colors">
                            SendMessage
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
