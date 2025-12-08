import type { CryptoCurrency } from '@/types/crypto'

const BASE_URL = 'https://api.coingecko.com/api/v3'
const PER_PAGE = 250

export const coingeckoApi = {
  async getAllCoins(): Promise<CryptoCurrency[]> {
    const allCoins: CryptoCurrency[] = []
    let page = 1
    let hasMore = true
    let callCount = 0
    const maxCalls = 30

    while (hasMore && callCount < maxCalls) {
      try {
        const response = await fetch(
          `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false&locale=en`,
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
}
