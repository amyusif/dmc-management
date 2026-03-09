import { z } from 'zod'

// Auth schemas
export const LoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').transform((s) => s.trim()),
  password: z.string().min(1, 'Password is required').transform((s) => s.trim()),
})

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'STAFF']).default('STAFF'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Patient schemas
export const PatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
})

export const PatientUpdateSchema = PatientSchema.partial()

// Doctor schemas
export const DoctorSchema = z.object({
  userId: z.string(),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().optional(),
})

// Appointment schemas
export const AppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  reason: z.string().optional(),
  notes: z.string().optional(),
})

export const AppointmentUpdateSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
})

// Medical Record schemas
export const MedicalRecordSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  recordDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
})

// Message schemas
export const MessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  recipientType: z.enum(['ALL', 'PATIENTS', 'STAFF', 'SPECIFIC']).default('ALL'),
  recipientRole: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'STAFF']).optional(),
})

// Personal data schemas
export const PersonalDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  dateOfBirth: z.string().refine((d) => !d || !isNaN(Date.parse(d)), 'Invalid date').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const PersonalDataUpdateSchema = PersonalDataSchema.partial()

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type PatientInput = z.infer<typeof PatientSchema>
export type PatientUpdateInput = z.infer<typeof PatientUpdateSchema>
export type DoctorInput = z.infer<typeof DoctorSchema>
export type AppointmentInput = z.infer<typeof AppointmentSchema>
export type AppointmentUpdateInput = z.infer<typeof AppointmentUpdateSchema>
export type MedicalRecordInput = z.infer<typeof MedicalRecordSchema>
export type MessageInput = z.infer<typeof MessageSchema>
export type PersonalDataInput = z.infer<typeof PersonalDataSchema>
export type PersonalDataUpdateInput = z.infer<typeof PersonalDataUpdateSchema>
