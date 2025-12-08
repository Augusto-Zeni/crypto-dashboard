import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from '@/routes'
import { CurrencyProvider } from '@/hooks/useCurrency'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CurrencyProvider>
    </QueryClientProvider>
  )
}

export default App
