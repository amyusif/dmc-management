import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('[v0] Starting database seed...')

  // Clear existing data
  console.log('[v0] Clearing existing data...')
  await prisma.messageReceipt.deleteMany()
  await prisma.message.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.nurse.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()

  console.log('[v0] Creating test users...')

  // Hash passwords
  const adminPassword = await bcryptjs.hash('password', 10)
  const doctorPassword = await bcryptjs.hash('doctor123', 10)
  const nursePassword = await bcryptjs.hash('nurse123', 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      name: 'Admin User',
      email: 'admin@hospital.com',
      role: 'ADMIN',
      active: true,
    },
  })
  console.log('[v0] Created admin user:', admin.username)

  // Create doctor users
  const doctor1 = await prisma.user.create({
    data: {
      username: 'doctor_sarah',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      email: 'doctor.sarah@hospital.com',
      role: 'DOCTOR',
      active: true,
    },
  })

  const doctor2 = await prisma.user.create({
    data: {
      username: 'doctor_michael',
      password: doctorPassword,
      name: 'Dr. Michael Chen',
      email: 'doctor.michael@hospital.com',
      role: 'DOCTOR',
      active: true,
    },
  })

  const doctor3 = await prisma.user.create({
    data: {
      username: 'doctor_david',
      password: doctorPassword,
      name: 'Dr. David Patel',
      email: 'doctor.david@hospital.com',
      role: 'DOCTOR',
      active: true,
    },
  })

  console.log('[v0] Created doctor users')

  // Create nurse users
  const nurse1 = await prisma.user.create({
    data: {
      username: 'nurse_emma',
      password: nursePassword,
      name: 'Emma Wilson',
      email: 'nurse.emma@hospital.com',
      role: 'NURSE',
      active: true,
    },
  })

  const nurse2 = await prisma.user.create({
    data: {
      username: 'nurse_jessica',
      password: nursePassword,
      name: 'Jessica Martinez',
      email: 'nurse.jessica@hospital.com',
      role: 'NURSE',
      active: true,
    },
  })

  console.log('[v0] Created nurse users')

  // Create receptionist
  const receptionist = await prisma.user.create({
    data: {
      username: 'receptionist',
      password: await bcryptjs.hash('reception123', 10),
      name: 'Alex Thompson',
      email: 'reception@hospital.com',
      role: 'RECEPTIONIST',
      active: true,
    },
  })

  console.log('[v0] Created receptionist user')

  // Create doctor profiles
  const doctorProfile1 = await prisma.doctor.create({
    data: {
      userId: doctor1.id,
      specialization: 'Cardiology',
      licenseNumber: 'MD-001-2024',
      department: 'Cardiology Department',
    },
  })

  const doctorProfile2 = await prisma.doctor.create({
    data: {
      userId: doctor2.id,
      specialization: 'Neurology',
      licenseNumber: 'MD-002-2024',
      department: 'Neurology Department',
    },
  })

  const doctorProfile3 = await prisma.doctor.create({
    data: {
      userId: doctor3.id,
      specialization: 'Orthopedics',
      licenseNumber: 'MD-003-2024',
      department: 'Orthopedics Department',
    },
  })

  console.log('[v0] Created doctor profiles')

  // Create nurse profiles
  await prisma.nurse.create({
    data: {
      userId: nurse1.id,
      licenseNumber: 'RN-001-2024',
      department: 'Cardiology Department',
    },
  })

  await prisma.nurse.create({
    data: {
      userId: nurse2.id,
      licenseNumber: 'RN-002-2024',
      department: 'General Ward',
    },
  })

  console.log('[v0] Created nurse profiles')

  // Create staff profile
  await prisma.staff.create({
    data: {
      userId: receptionist.id,
      position: 'Receptionist',
      department: 'Administration',
    },
  })

  console.log('[v0] Created staff profile')

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 0101',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'MALE',
      bloodType: 'O+',
      address: '123 Main St, New York, NY 10001',
    },
  })

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 0102',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'FEMALE',
      bloodType: 'A-',
      address: '456 Oak Ave, New York, NY 10002',
    },
  })

  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@email.com',
      phone: '+1 (555) 0103',
      dateOfBirth: new Date('1975-11-08'),
      gender: 'MALE',
      bloodType: 'B+',
      address: '789 Pine Rd, New York, NY 10003',
    },
  })

  const patient4 = await prisma.patient.create({
    data: {
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.w@email.com',
      phone: '+1 (555) 0104',
      dateOfBirth: new Date('1992-05-30'),
      gender: 'FEMALE',
      bloodType: 'AB+',
      address: '321 Elm St, New York, NY 10004',
    },
  })

  const patient5 = await prisma.patient.create({
    data: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 0105',
      dateOfBirth: new Date('1988-09-12'),
      gender: 'MALE',
      bloodType: 'O-',
      address: '654 Maple Ln, New York, NY 10005',
    },
  })

  console.log('[v0] Created 5 test patients')

  // Create medical records
  await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      doctorId: doctorProfile1.id,
      diagnosis: 'Hypertension - Initial assessment and treatment plan discussed',
      prescription: 'Lisinopril 10mg daily, Aspirin 81mg daily',
      notes: 'Patient to return for follow-up in 4 weeks. Monitor blood pressure at home.',
      recordDate: new Date('2024-03-05'),
    },
  })

  await prisma.medicalRecord.create({
    data: {
      patientId: patient2.id,
      doctorId: doctorProfile2.id,
      diagnosis: 'Migraine disorder - Chronic migraine pattern',
      prescription: 'Sumatriptan 50mg as needed, Topiramate 50mg daily',
      notes: 'Discussed lifestyle modifications and stress management.',
      recordDate: new Date('2024-03-04'),
    },
  })

  await prisma.medicalRecord.create({
    data: {
      patientId: patient3.id,
      doctorId: doctorProfile3.id,
      diagnosis: 'Osteoarthritis - Right knee',
      prescription: 'Ibuprofen 400mg as needed, Physical therapy recommended',
      notes: 'Patient to undergo 6 weeks of physical therapy.',
      recordDate: new Date('2024-03-03'),
    },
  })

  console.log('[v0] Created medical records')

  // Create appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctorProfile1.id,
      appointmentDate: tomorrow,
      reason: 'Follow-up blood pressure check',
      status: 'SCHEDULED',
    },
  })

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctorProfile2.id,
      appointmentDate: tomorrow,
      reason: 'Migraine management consultation',
      status: 'SCHEDULED',
    },
  })

  await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      doctorId: doctorProfile3.id,
      appointmentDate: new Date(tomorrow.getTime() + 86400000),
      reason: 'Initial consultation',
      status: 'SCHEDULED',
    },
  })

  console.log('[v0] Created appointments')

  console.log('[v0] Database seed completed successfully!')
  console.log('[v0]')
  console.log('[v0] Test Users Created:')
  console.log('[v0] Admin: admin / password')
  console.log('[v0] Doctor: doctor_sarah / doctor123')
  console.log('[v0] Doctor: doctor_michael / doctor123')
  console.log('[v0] Doctor: doctor_david / doctor123')
  console.log('[v0] Nurse: nurse_emma / nurse123')
  console.log('[v0] Nurse: nurse_jessica / nurse123')
  console.log('[v0] Receptionist: receptionist / reception123')
}

main()
  .catch((e) => {
    console.error('[v0] Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
