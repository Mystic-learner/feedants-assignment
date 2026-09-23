# Feedants Full-Stack Technical Assignment - Competition Details Module

A functional full-stack implementation of the **Feedants Competition Details screen** built with **React Native (Expo)**, **Node.js + Express**, and **MongoDB**.

---

## 🏗️ Tech Stack

- **Frontend**: React Native (Expo SDK 57), Axios, Flexbox Mobile Layout
- **Backend**: Node.js, Express.js, RESTful API
- **Database**: MongoDB (Mongoose ODM) with In-Memory MongoDB support

---

## 💡 Technical Decisions & Trade-Offs

1. **Atomic Capacity Reservation**:
   - Uses atomic `$inc` operations with query guards (`bookedSpots < totalSpots`) to prevent double-booking under high concurrent user loads.
2. **Dynamic Time & Lifecycle State Machine**:
   - The UI dynamically computes countdown metrics and switches between "Pay & Register" and "Upload Submission" based on MongoDB backend lifecycle fields (`registrationDeadline`, `submissionEndDate`).
3. **In-Memory MongoDB Integration**:
   - Integrated `mongodb-memory-server` in `server.js` for instant local setup without external database credentials.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm / npx

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
