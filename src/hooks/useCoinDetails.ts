import { useQuery } from '@tanstack/react-query'
import { coingeckoApi } from '@/services/coingecko'

export function useCoinDetails(coinId: string | undefined) {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => {
      if (!coinId) {
        throw new Error('Coin ID is required')
      }
      return coingeckoApi.getCoinDetails(coinId)
    },
    enabled: !!coinId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
