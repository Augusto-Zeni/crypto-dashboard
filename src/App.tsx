import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <div className="container mx-auto p-8 space-y-6">
        <h1 className="text-4xl font-bold text-primary">Crypto Dashboard</h1>
      </div>
    </div>
  )
}

export default App
