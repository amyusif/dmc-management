'use server'

import bcryptjs from 'bcryptjs'
import { cookies } from 'next/headers'
import { jwtSign, jwtVerify } from './jwt'
import { prisma } from './db'

const SALT_ROUNDS = 10
const SESSION_COOKIE_NAME = 'auth_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const token = await jwtSign({ userId }, { expiresIn: '24h' })
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
  
  return token
}

export async function getSession(): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    if (!token) {
      return null
    }
    
    const payload = await jwtVerify(token)
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return null
    }
    
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) {
    return null
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })
    
    if (!user || !user.active) {
      return null
    }
    
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error logging in user:', error)
    return null
  }
}

export async function registerUser(
  username: string,
  password: string,
  name: string,
  email?: string,
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'STAFF' = 'STAFF'
) {
  try {
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role,
        active: true,
      },
    })
    
    return user
  } catch (error) {
    console.error('Error registering user:', error)
    return null
  }
}
