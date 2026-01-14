# Flight Booking System (Indigo Clone)

A full-stack Flight Booking System inspired by the GoIndigo experience, featuring Dynamic Pricing, Wallet Simulation, PDF Ticket Generation, and now **User Authentication** and **Web Check-in**.

## 🚀 Tech Stack
- **Frontend**: React (Vite) + TailwindCSS (Indigo-themed)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **PDF Generation**: PDFKit
- **Auth**: JWT (JSON Web Tokens) + Bcrypt

## ✨ Key Features
- **Authentication**:
    - Secure Register/Login system.
    - Protected routes for Booking History.
- **Flight Search**: Database-driven flight search with Guaranteed routes (Delhi ⇄ Mumbai).
- **Advanced UI/UX**: 
    - "GoIndigo" inspired aesthetics (Deep Blue theme).
    - Responsive Hero Banner and Floating Search Widget.
    - Sorting (Price/Airline) and Filtering (Airline) capabilities.
- **Dynamic Pricing Engine**: 
    - Price increases by **10%** if a flight is searched >3 times in 5 minutes.
- **Booking Flow**: 
    - Seamless booking with wallet deduction.
    - Auto-generated **PDF Ticket** download.
- **Web Check-in**:
    - Update booking status to "Checked-in" directly from the History page.
- **Contact Us**: Dedicated support page.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Connection string

### 1. Backend Setup
```bash
cd server
npm install
npm run seed  # Seeds DB with 20 flights (Includes Guaranteed DEL-MUM routes)
npm run dev   # Starts server on port 5000
```
*Note: Make sure to add `JWT_SECRET` to your `.env` file.*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev   # Starts client on port 5173
```

### 3. Verification Scripts
We have included automated scripts to verify core logic:
```bash
cd server
node tests/verify_surge.js # Validates the Dynamic Pricing logic
node tests/verify_pdf.js   # Validates PDF Generation
```

## 📖 Usage Guide
1. **Auth**: Sign Up or Login to access advanced features like History and Check-in.
2. **Search**: Enter "Delhi" to "Mumbai". Sort/Filter results.
3. **Book**: Confirm booking. PDF downloads automatically.
4. **Check-in**: Go to "My Bookings" and click "Web Check-in" to confirm your status.
