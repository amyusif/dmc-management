# Hospital Management System - Setup Guide

## Database Setup

This application uses Neon PostgreSQL and Prisma ORM for data management.

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Push Database Schema

```bash
npx prisma db push
```

This will create all necessary tables in your Neon database.

### Step 4: Seed Database with Test Data

```bash
node scripts/seed-db.js
```

This will populate the database with test users, patients, medical records, and appointments.

## Test Users

After running the seed script, you can login with these credentials:

### Admin
- Email: `admin@hospital.com`
- Password: `admin123`
- Role: Admin (full system access)

### Doctors
- Email: `doctor.sarah@hospital.com` | Password: `doctor123`
- Email: `doctor.michael@hospital.com` | Password: `doctor123`
- Email: `doctor.david@hospital.com` | Password: `doctor123`

### Nurses
- Email: `nurse.emma@hospital.com` | Password: `nurse123`
- Email: `nurse.jessica@hospital.com` | Password: `nurse123`

### Receptionist
- Email: `reception@hospital.com`
- Password: `reception123`

## Running the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Database Management

### View Database
```bash
npx prisma studio
```

This opens an interactive database explorer in your browser.

### Reset Database (Careful!)
```bash
npx prisma migrate reset
```

This will delete all data and recreate the schema. Use only in development!

## Features

### Dashboard
- Overview of all system statistics
- Appointment trends chart
- Recent medical records
- Quick access to all modules

### Patient Management
- Create new patients
- Search by name, email, or phone
- View patient details
- Edit patient information
- View patient appointments and medical records

### Staff Management
- Add and manage doctors, nurses, and staff
- Assign roles and specializations
- Department assignment
- License number tracking

### Medical Records
- Create medical records for patients
- Track diagnosis and prescriptions
- Doctor and date information
- Search and filter records

### Appointments
- Schedule appointments with patients
- Assign doctors
- Set appointment status (SCHEDULED, COMPLETED, CANCELLED)
- View appointment details

### Messaging
- Send broadcast messages to patients
- Send messages to staff
- Track message read receipts

## Architecture

- **Frontend**: Next.js 16 with React 19.2
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with bcrypt password hashing
- **State Management**: React hooks with SWR for data fetching
- **UI Components**: shadcn/ui components

## Environment Variables

The `DATABASE_URL` is already configured in `.env.local`. No additional setup required.

For production deployment, ensure the `DATABASE_URL` is added to your hosting platform's environment variables.
