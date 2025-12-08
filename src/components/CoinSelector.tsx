import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCryptos } from '@/hooks/useCryptos'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export function CoinSelector() {
  const navigate = useNavigate()
  const { data: cryptos, isLoading } = useCryptos()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredCryptos = useMemo(() => {
    if (!cryptos || !debouncedSearchQuery.trim()) {
      return cryptos?.slice(0, 50) ?? []
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    return cryptos
      .filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(query) ||
          crypto.symbol.toLowerCase().includes(query),
      )
      .slice(0, 50)
  }, [cryptos, debouncedSearchQuery])

  const handleCoinClick = (coinId: string) => {
    navigate(`/moeda/${coinId}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Selecione uma Moeda</CardTitle>
          <CardDescription>
            Pesquise e selecione uma criptomoeda para ver seus detalhes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar por nome ou símbolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredCryptos && filteredCryptos.length > 0 ? (
            <div className="grid gap-2 max-h-[600px] overflow-y-auto">
              {filteredCryptos.map((crypto) => (
                <Card
                  key={crypto.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleCoinClick(crypto.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{crypto.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {crypto.symbol.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Rank #{crypto.market_cap_rank}
                        </p>
                      </div>
                      <Badge
                        variant={
                          crypto.price_change_percentage_24h >= 0
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">
                {debouncedSearchQuery.trim()
                  ? 'Nenhuma criptomoeda encontrada com esse termo.'
                  : 'Nenhuma criptomoeda disponível no momento.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
