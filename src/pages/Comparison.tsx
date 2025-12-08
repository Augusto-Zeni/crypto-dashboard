import { useState } from 'react'
import { useCryptos } from '@/hooks/useCryptos'
import { useCurrency } from '@/hooks/useCurrency'
import type { CryptoCurrency } from '@/types/crypto'
import { CryptoSearch } from '@/components/CryptoSearch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { formatLargeNumber, formatPrice } from '@/lib/utils'

export function Comparison() {
  const { data: cryptos, isLoading } = useCryptos()
  const { currency } = useCurrency()
  const [crypto1, setCrypto1] = useState<CryptoCurrency | null>(null)
  const [crypto2, setCrypto2] = useState<CryptoCurrency | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const showComparison = crypto1 && crypto2

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Criptomoedas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione duas criptomoedas para comparar suas métricas
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Primeira Moeda
              </label>
              <CryptoSearch
                cryptos={cryptos || []}
                onSelect={setCrypto1}
                placeholder="Pesquisar primeira moeda..."
                selectedCrypto={crypto1}
                excludeId={crypto2?.id}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Segunda Moeda
              </label>
              <CryptoSearch
                cryptos={cryptos || []}
                onSelect={setCrypto2}
                placeholder="Pesquisar segunda moeda..."
                selectedCrypto={crypto2}
                excludeId={crypto1?.id}
              />
            </div>
          </div>

          {showComparison && (
            <div className="space-y-6">
              <Separator />

              {/* Preço Atual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Preço Atual"
                  crypto={crypto1}
                  value={formatPrice(crypto1.current_price, currency)}
                  isWinner={crypto1.current_price > crypto2.current_price}
                />
                <ComparisonCard
                  title="Preço Atual"
                  crypto={crypto2}
                  value={formatPrice(crypto2.current_price, currency)}
                  isWinner={crypto2.current_price > crypto1.current_price}
                />
              </div>

              {/* Variação 24h */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Variação 24h"
                  crypto={crypto1}
                  value={
                    <Badge
                      variant={
                        crypto1.price_change_percentage_24h >= 0
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {crypto1.price_change_percentage_24h >= 0 ? '+' : ''}
                      {crypto1.price_change_percentage_24h?.toFixed(2)}%
                    </Badge>
                  }
                  isWinner={
                    crypto1.price_change_percentage_24h >
                    crypto2.price_change_percentage_24h
                  }
                />
                <ComparisonCard
                  title="Variação 24h"
                  crypto={crypto2}
                  value={
                    <Badge
                      variant={
                        crypto2.price_change_percentage_24h >= 0
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {crypto2.price_change_percentage_24h >= 0 ? '+' : ''}
                      {crypto2.price_change_percentage_24h?.toFixed(2)}%
                    </Badge>
                  }
                  isWinner={
                    crypto2.price_change_percentage_24h >
                    crypto1.price_change_percentage_24h
                  }
                />
              </div>

              {/* Market Cap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Market Cap"
                  crypto={crypto1}
                  value={formatLargeNumber(crypto1.market_cap, currency)}
                  subtitle={`Rank #${crypto1.market_cap_rank}`}
                  isWinner={crypto1.market_cap > crypto2.market_cap}
                />
                <ComparisonCard
                  title="Market Cap"
                  crypto={crypto2}
                  value={formatLargeNumber(crypto2.market_cap, currency)}
                  subtitle={`Rank #${crypto2.market_cap_rank}`}
                  isWinner={crypto2.market_cap > crypto1.market_cap}
                />
              </div>

              {/* Volume 24h */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Volume 24h"
                  crypto={crypto1}
                  value={formatLargeNumber(crypto1.total_volume, currency)}
                  isWinner={crypto1.total_volume > crypto2.total_volume}
                />
                <ComparisonCard
                  title="Volume 24h"
                  crypto={crypto2}
                  value={formatLargeNumber(crypto2.total_volume, currency)}
                  isWinner={crypto2.total_volume > crypto1.total_volume}
                />
              </div>

              {/* Circulating Supply */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Circulating Supply"
                  crypto={crypto1}
                  value={`${crypto1.circulating_supply.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })} ${crypto1.symbol.toUpperCase()}`}
                  subtitle={
                    crypto1.max_supply
                      ? `Max: ${crypto1.max_supply.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}`
                      : 'Max: ∞'
                  }
                  isWinner={crypto1.circulating_supply > crypto2.circulating_supply}
                />
                <ComparisonCard
                  title="Circulating Supply"
                  crypto={crypto2}
                  value={`${crypto2.circulating_supply.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })} ${crypto2.symbol.toUpperCase()}`}
                  subtitle={
                    crypto2.max_supply
                      ? `Max: ${crypto2.max_supply.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}`
                      : 'Max: ∞'
                  }
                  isWinner={crypto2.circulating_supply > crypto1.circulating_supply}
                />
              </div>

              {/* All-Time High */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="All-Time High"
                  crypto={crypto1}
                  value={formatPrice(crypto1.ath, currency)}
                  subtitle={`${crypto1.ath_change_percentage.toFixed(2)}% do ATH`}
                  isWinner={crypto1.ath > crypto2.ath}
                />
                <ComparisonCard
                  title="All-Time High"
                  crypto={crypto2}
                  value={formatPrice(crypto2.ath, currency)}
                  subtitle={`${crypto2.ath_change_percentage.toFixed(2)}% do ATH`}
                  isWinner={crypto2.ath > crypto1.ath}
                />
              </div>

              {/* All-Time Low */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComparisonCard
                  title="All-Time Low"
                  crypto={crypto1}
                  value={formatPrice(crypto1.atl, currency, { maximumFractionDigits: 8 })}
                  subtitle={`+${crypto1.atl_change_percentage.toFixed(2)}% do ATL`}
                  isWinner={crypto1.atl < crypto2.atl}
                />
                <ComparisonCard
                  title="All-Time Low"
                  crypto={crypto2}
                  value={formatPrice(crypto2.atl, currency, { maximumFractionDigits: 8 })}
                  subtitle={`+${crypto2.atl_change_percentage.toFixed(2)}% do ATL`}
                  isWinner={crypto2.atl < crypto1.atl}
                />
              </div>
            </div>
          )}

          {!showComparison && (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground text-center">
                Selecione duas criptomoedas acima para começar a comparação
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ComparisonCardProps {
  title: string
  crypto: CryptoCurrency
  value: React.ReactNode
  subtitle?: string
  isWinner: boolean
}

function ComparisonCard({
  title,
  crypto,
  value,
  subtitle,
  isWinner,
}: ComparisonCardProps) {
  return (
    <Card className={isWinner ? 'border-primary bg-primary/5' : ''}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">{crypto.symbol.toUpperCase()}</span>
            </div>
            {isWinner && (
              <Badge variant="default" className="text-xs">
                Maior
              </Badge>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <div className="text-lg font-semibold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
