import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/')({
  component: App,
  server: {
    middleware: [authMiddleware],
  },
})

function App() {
  return <div>Home</div>
}
