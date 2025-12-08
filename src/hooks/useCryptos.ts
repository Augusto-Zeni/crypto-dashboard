import { useQuery } from '@tanstack/react-query'
import { coingeckoApi } from '@/services/coingecko'
import { useCurrency } from '@/hooks/useCurrency'

export function useCryptos() {
  const { currency } = useCurrency()

  return useQuery({
    queryKey: ['cryptos', currency],
    queryFn: () => coingeckoApi.getAllCoins(currency),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
