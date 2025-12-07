import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { CoinDetails } from '@/pages/CoinDetails'
import { Portfolio } from '@/pages/Portfolio'
import { Comparison } from '@/pages/Comparison'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout title="Dashboard" />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/detalhes-moeda" element={<Layout title="Detalhes da Moeda" />}>
        <Route index element={<CoinDetails />} />
      </Route>
      <Route path="/portfolio" element={<Layout title="Portfólio" />}>
        <Route index element={<Portfolio />} />
      </Route>
      <Route path="/comparacao" element={<Layout title="Comparação" />}>
        <Route index element={<Comparison />} />
      </Route>
    </Routes>
  )
}
