# Flight Booking System

A full-stack Flight Booking System with Dynamic Pricing, Wallet Simulation, and PDF Ticket Generation.

## Tech Stack
- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **PDF Generation**: PDFKit

## Features
- **Flight Search**: Database-driven flight search.
- **Dynamic Pricing**: Price increases by 10% if a flight is searched >3 times in 5 minutes. Resets after 10 minutes.
- **Wallet System**: Simulated wallet (defaults to ₹50,000) stored in local storage.
- **Booking**: Deducts amount and generates a confirmed booking.
- **Ticket PDF**: Auto-generated PDF ticket upon booking.
- **History**: View past bookings and download tickets.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Connection string ready (Default provided in `.env`)

### 1. Backend Setup
```bash
cd server
npm install
npm run seed  # Seeds the database with 20 random flights
npm run dev   # Starts the server on port 5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev   # Starts the client on port 5173
```

## Usage
1. Open the Client URL (usually `http://localhost:5173`).
2. Search for flights (e.g., From "Delhi" to "Mumbai").
3. View results. Repeat search 3+ times to see Dynamic Pricing (Surge).
4. Click "Book Now". Confirm transaction.
5. Wallet balance updates and Ticket PDF downloads automatically.
6. Visit "My Bookings" to see history.
