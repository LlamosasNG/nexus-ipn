import type { Request } from 'express'
import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

const standardHeaders = true
const legacyHeaders = false

const keyGenerator = (req: Request): string => {
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || 'unknown')
}

const messageGeneric = {
  error: 'Has excedido el límite de peticiones. Intenta más tarde.',
}

const messageAuth = {
  error: 'Demasiados intentos de autenticación. Intenta más tarde.',
}

const messageStrict = {
  error:
    'Haz alcanzado el límite de peticiones posibles. Intenta en 15 minutos.',
}

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageGeneric,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageAuth,
  skipSuccessfulRequests: true,
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageAuth,
  skipSuccessfulRequests: false,
})

export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: {
    error: 'Has creado demasiadas cuentas. Intenta más tarde.',
  },
  skipSuccessfulRequests: true,
})

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: {
    error:
      'Has solicitado demasiados códigos de recuperación. Intenta más tarde.',
  },
  skipSuccessfulRequests: true,
})

export const confirmAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageAuth,
  skipSuccessfulRequests: true,
})

export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageGeneric,
})

export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: {
    error:
      'Has excedido el límite de peticiones de escritura. Intenta más tarde.',
  },
})

export const planningWriteLimiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 10,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: {
    error: 'Guardando demasiado rápido. Espera un momento.',
  },
})

export const sensitiveDataLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageStrict,
})

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  message: messageStrict,
})
