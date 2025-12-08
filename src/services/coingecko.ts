import type { CryptoCurrency, CoinDetails, MarketChartData } from '@/types/crypto'
import type { Currency } from '@/hooks/useCurrency'

const BASE_URL = 'https://api.coingecko.com/api/v3'
const PER_PAGE = 250

export const coingeckoApi = {
  async getAllCoins(currency: Currency = 'usd'): Promise<CryptoCurrency[]> {
    const allCoins: CryptoCurrency[] = []
    let page = 1
    let hasMore = true
    let callCount = 0
    const maxCalls = 30

    while (hasMore && callCount < maxCalls) {
      try {
        const response = await fetch(
          `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false&locale=en`,
        )

        callCount++

        // Se erro 429 ou qualquer outro erro, retorna o que já tem
        if (response.status === 429) {
          console.warn(`Rate limit atingido na página ${page}. Retornando ${allCoins.length} moedas já carregadas.`)
          break
        }

        if (!response.ok) {
          console.warn(`Erro ${response.status} na página ${page}. Retornando ${allCoins.length} moedas já carregadas.`)
          break
        }

        const coins: CryptoCurrency[] = await response.json()

        if (coins.length === 0) {
          console.log(`Busca completa! Total: ${allCoins.length} moedas.`)
          hasMore = false
        } else {
          allCoins.push(...coins)
          console.log(`Página ${page}: +${coins.length} moedas. Total: ${allCoins.length}`)

          if (coins.length < PER_PAGE) {
            console.log(`Última página! Total final: ${allCoins.length} moedas.`)
            hasMore = false
          } else {
            page++
          }
        }

      } catch (error) {
        console.warn(`Erro ao buscar página ${page}:`, error)
        // Em caso de erro, retorna o que já tem ao invés de lançar exceção
        console.log(`Retornando ${allCoins.length} moedas já carregadas.`)
        break
      }

      if (callCount >= maxCalls) {
        console.warn(`Limite de ${maxCalls} chamadas atingido. Total: ${allCoins.length} moedas.`)
        break
      }
    }

    // Sempre retorna algo, mesmo que vazio
    return allCoins
  },

  async getCoinDetails(coinId: string): Promise<CoinDetails> {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    )

    if (!response.ok) {
      throw new Error(`Erro ao buscar detalhes da moeda: ${response.status}`)
    }

    return response.json()
  },

  async getMarketChart(
    coinId: string,
    currency: Currency = 'usd',
    days: number = 7,
  ): Promise<MarketChartData> {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
    )

    if (!response.ok) {
      throw new Error(`Erro ao buscar histórico de preços: ${response.status}`)
    }

    return response.json()
  },
}
