import { useQuery } from '@tanstack/react-query'
import { coingeckoApi } from '@/services/coingecko'
import { useCurrency } from '@/hooks/useCurrency'

export function useMarketChart(coinId: string | undefined, days: number = 7) {
  const { currency } = useCurrency()

  return useQuery({
    queryKey: ['marketChart', coinId, currency, days],
    queryFn: () => {
      if (!coinId) {
        throw new Error('Coin ID is required')
      }
      return coingeckoApi.getMarketChart(coinId, currency, days)
    },
    enabled: !!coinId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
