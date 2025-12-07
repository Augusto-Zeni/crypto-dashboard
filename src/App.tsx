import { ThemeToggle } from '@/components/ThemeToggle'
import { MainMenu } from '@/components/MainMenu'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <MainMenu />
          <ThemeToggle />
        </div>
      </header>
    </div>
  )
}

export default App
