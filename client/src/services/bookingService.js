import api from './api';

const createBooking = async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
};

const getUserBookings = async (email) => {
    const res = await api.get(`/bookings?email=${email}`);
    return res.data;
};

const checkIn = async (id) => {
    const res = await api.put(`/bookings/${id}/checkin`);
    return res.data;
};

const getTicketPdfUrl = (id) => {
    return `${api.defaults.baseURL}/bookings/${id}/pdf`;
};

const bookingService = {
    createBooking,
    getUserBookings,
    checkIn,
    getTicketPdfUrl
};

export default bookingService;
