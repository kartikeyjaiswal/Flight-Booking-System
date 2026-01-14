const PassengerForm = ({ form, idx, onChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 capitalize">{form.type} {form.index}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                    <input
                        className="w-full border p-2 rounded focus:outline-none focus:border-[#001b94]"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => onChange(idx, 'name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Age</label>
                    <input
                        className="w-full border p-2 rounded focus:outline-none focus:border-[#001b94]"
                        placeholder="Age"
                        type="number"
                        value={form.age}
                        onChange={(e) => onChange(idx, 'age', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Gender</label>
                    <select
                        className="w-full border p-2 rounded focus:outline-none focus:border-[#001b94]"
                        value={form.gender}
                        onChange={(e) => onChange(idx, 'gender', e.target.value)}
                    >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PassengerForm;
