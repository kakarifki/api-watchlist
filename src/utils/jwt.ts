import jwt from 'jsonwebtoken'

const DEFAULT_EXPIRES_IN = '1h'

export type JwtPayload = {
  sub: string
  email: string
  role: string
}

export function signJwt(payload: JwtPayload, expiresIn: string = DEFAULT_EXPIRES_IN): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return jwt.verify(token, secret) as T
}


