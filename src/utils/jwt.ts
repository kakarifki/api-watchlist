import jwt from 'jsonwebtoken'
import { EnvConfig } from '../config/env'

const DEFAULT_EXPIRES_IN = '1h'

export type JwtPayload = {
  sub: string
  email: string
  role: string
}

export function signJwt(payload: JwtPayload, config: EnvConfig, expiresIn: string = DEFAULT_EXPIRES_IN): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn })
}

export function verifyJwt<T = JwtPayload>(token: string, config: EnvConfig): T {
  return jwt.verify(token, config.JWT_SECRET) as T
}


