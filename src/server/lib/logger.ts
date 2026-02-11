import pino from 'pino'

import { env, isDevelopment } from '@/server/lib/config/env'

export const logger = pino(
  { level: env.LOG_LEVEL },
  isDevelopment
    ? pino.transport({ target: 'pino-pretty' })
    : pino.destination({ sync: false }),
)
