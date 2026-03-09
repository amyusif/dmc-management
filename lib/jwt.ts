import * as crypto from 'crypto'

interface JWTPayload {
  userId?: string
  [key: string]: any
}

interface JWTOptions {
  expiresIn?: string | number
}

const SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function parseExpiresIn(expiresIn?: string | number): number {
  if (!expiresIn) return Infinity
  
  if (typeof expiresIn === 'number') return expiresIn * 1000 // Convert seconds to ms
  
  const match = String(expiresIn).match(/^(\d+)(ms|s|m|h|d)$/)
  if (!match) throw new Error(`Invalid expiresIn: ${expiresIn}`)
  
  const [, amount, unit] = match
  const num = parseInt(amount, 10)
  
  const multipliers: { [key: string]: number } = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  }
  
  return num * multipliers[unit]
}

function base64Encode(data: string): string {
  return Buffer.from(data).toString('base64url')
}

function base64Decode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8')
}

export async function jwtSign(payload: JWTPayload, options?: JWTOptions): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const expiresInMs = parseExpiresIn(options?.expiresIn)
  
  const now = Math.floor(Date.now() / 1000)
  const claims = {
    ...payload,
    iat: now,
    ...(expiresInMs !== Infinity && { exp: now + Math.floor(expiresInMs / 1000) }),
  }
  
  const headerEncoded = base64Encode(JSON.stringify(header))
  const payloadEncoded = base64Encode(JSON.stringify(claims))
  const message = `${headerEncoded}.${payloadEncoded}`
  
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(message)
    .digest('base64url')
  
  return `${message}.${signature}`
}

export async function jwtVerify(token: string): Promise<JWTPayload | null> {
  try {
    const [headerEncoded, payloadEncoded, signatureProvided] = token.split('.')
    
    if (!headerEncoded || !payloadEncoded || !signatureProvided) {
      return null
    }
    
    const message = `${headerEncoded}.${payloadEncoded}`
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(message)
      .digest('base64url')
    
    if (expectedSignature !== signatureProvided) {
      return null
    }
    
    const payload = JSON.parse(base64Decode(payloadEncoded))
    
    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      if (now > payload.exp) {
        return null
      }
    }
    
    return payload
  } catch {
    return null
  }
}
