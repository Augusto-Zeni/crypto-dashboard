/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Currency = 'usd' | 'brl' | 'eur'

export interface CurrencyInfo {
  code: Currency
  symbol: string
  label: string
}

export interface CurrencyContextType {
  currency: Currency
  changeCurrency: (newCurrency: Currency) => void
  currencyInfo: CurrencyInfo
  currencies: CurrencyInfo[]
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  usd: { code: 'usd', symbol: '$', label: 'Dólar (USD)' },
  brl: { code: 'brl', symbol: 'R$', label: 'Real (BRL)' },
  eur: { code: 'eur', symbol: '€', label: 'Euro (EUR)' },
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem('crypto-dashboard-currency') as Currency | null
    if (stored && CURRENCIES[stored]) return stored
    return 'usd'
  })

  useEffect(() => {
    localStorage.setItem('crypto-dashboard-currency', currency)
  }, [currency])

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        currencyInfo: CURRENCIES[currency],
        currencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}
