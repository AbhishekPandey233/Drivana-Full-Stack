Drivana
A full-stack car rental web app. Users browse a vehicle catalog, 
book rentals with date-based pricing, extend/decrease/cancel bookings, and pay. 
Admins manage the vehicle fleet, oversee all rentals, and manage users from a dedicated dashboard. 
Built with Next.js (frontend), Express + MongoDB/Mongoose (backend), and JWT-based auth with role-based access control.

Running it
Backend (needs a .env with MONGODB_URI and PORT):


cd backend
npm install
npm run dev       # http://localhost:5000
Frontend:


cd frontend
npm install
npm run dev        # http://localhost:3000
Run both concurrently in separate terminals — the frontend calls the backend at localhost:5000.
