import { useContext } from 'react'
import {
  CurrencyContext,
  CurrencyProvider,
  CURRENCIES,
  type Currency,
  type CurrencyContextType,
  type CurrencyInfo,
} from '@/contexts/CurrencyContext'

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export { CurrencyProvider, CURRENCIES }
export type { Currency, CurrencyInfo, CurrencyContextType }
