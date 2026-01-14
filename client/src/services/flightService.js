import api from './api';

const searchFlights = async (from, to) => {
    const res = await api.get(`/flights/search?from=${from}&to=${to}`);
    return res.data;
};

const flightService = {
    searchFlights
};

export default flightService;
