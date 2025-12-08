import { List, type RowComponentProps } from 'react-window'
import type { CryptoCurrency } from '@/types/crypto'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrency } from '@/hooks/useCurrency'
import { formatLargeNumber, formatPrice } from '@/lib/utils'

interface CryptoListProps {
  cryptos: CryptoCurrency[]
}

interface CryptoRowData {
  cryptos: CryptoCurrency[]
  currencyCode: string
}

function CryptoRow({ index, style, cryptos, currencyCode }: RowComponentProps<CryptoRowData>) {
  const crypto = cryptos[index]
  const priceChange = crypto.price_change_percentage_24h
  const isPositive = priceChange >= 0

  return (
    <div style={style}>
      <Card className="h-[90px] hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base truncate">
                      {crypto.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {crypto.symbol.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rank #{crypto.market_cap_rank}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-semibold text-lg">
                  {formatPrice(crypto.current_price, currencyCode)}
                </p>
                <Badge
                  variant={isPositive ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {isPositive ? '+' : ''}
                  {priceChange?.toFixed(2)}%
                </Badge>
              </div>

              <div className="text-right shrink-0 min-w-[150px]">
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="font-medium">
                  {formatLargeNumber(crypto.market_cap, currencyCode)}
                </p>
              </div>

              <div className="text-right shrink-0 min-w-[150px]">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="font-medium">
                  {formatLargeNumber(crypto.total_volume, currencyCode)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CryptoList({ cryptos }: CryptoListProps) {
  const { currency } = useCurrency()

  return (
    <List<CryptoRowData>
      defaultHeight={600}
      rowCount={cryptos.length}
      rowHeight={100}
      rowComponent={CryptoRow}
      rowProps={{ cryptos, currencyCode: currency }}
    />
  )
}
