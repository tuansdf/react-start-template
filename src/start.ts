import { createStart } from '@tanstack/react-start'

import { loggerMiddleware } from '@/middleware/logger'

export const startInstance = createStart(() => ({
  requestMiddleware: [loggerMiddleware],
}))
