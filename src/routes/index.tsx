import { authMiddleware } from '@/middleware/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  server: {
    middleware: [authMiddleware],
  },
})

function App() {
  return <div>Home</div>
}
