import { createMiddleware } from '@tanstack/react-start'
import { nanoid } from 'nanoid'

import { logger } from '@/server/lib/logger'

let counter = 0
const baseId = nanoid(8)

export const loggerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const start = performance.now()
    const method = request.method
    const url = new URL(request.url)

    counter = (counter + 1) >>> 0
    const requestId = `${baseId}-${counter}`

    logger.info({ requestId, method, url: url.pathname }, 'ENTER')

    const result = await next()

    const duration = Math.round(performance.now() - start)
    logger.info({ requestId, method, url: url.pathname, duration }, 'EXIT')

    return result
  },
)
