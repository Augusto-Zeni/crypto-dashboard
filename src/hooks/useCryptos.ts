import { useQuery } from '@tanstack/react-query'
import { coingeckoApi } from '@/services/coingecko'

export function useCryptos() {
  return useQuery({
    queryKey: ['cryptos'],
    queryFn: coingeckoApi.getAllCoins,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: false, // Desabilita refetch automático para evitar loops
    retry: false, // Não tenta novamente em caso de erro
  })
}
