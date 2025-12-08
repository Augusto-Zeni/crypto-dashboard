import { useState, useMemo } from 'react'
import type { CryptoCurrency } from '@/types/crypto'
import { useDebounce } from '@/hooks/useDebounce'
import { useCurrency } from '@/hooks/useCurrency'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatPrice } from '@/lib/utils'

interface CryptoSearchProps {
  cryptos: CryptoCurrency[]
  onSelect: (crypto: CryptoCurrency | null) => void
  placeholder?: string
  selectedCrypto?: CryptoCurrency | null
  excludeId?: string
}

export function CryptoSearch({
  cryptos,
  onSelect,
  placeholder = 'Pesquisar criptomoeda...',
  selectedCrypto = null,
  excludeId,
}: CryptoSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const { currency } = useCurrency()

  const filteredCryptos = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return cryptos.slice(0, 10)
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    return cryptos
      .filter(
        (crypto) =>
          crypto.id !== excludeId &&
          (crypto.name.toLowerCase().includes(query) ||
            crypto.symbol.toLowerCase().includes(query)),
      )
      .slice(0, 10)
  }, [cryptos, debouncedSearchQuery, excludeId])

  const handleSelect = (crypto: CryptoCurrency) => {
    onSelect(crypto)
    setSearchQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div className="space-y-2">
        {selectedCrypto ? (
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCrypto.image}
                    alt={selectedCrypto.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{selectedCrypto.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {selectedCrypto.symbol.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(selectedCrypto.current_price, currency)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full"
            />

            {isOpen && filteredCryptos.length > 0 && (
              <Card className="absolute z-50 w-full max-h-[400px] overflow-y-auto">
                <CardContent className="p-0">
                  {filteredCryptos.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => handleSelect(crypto)}
                      className={cn(
                        'w-full p-3 flex items-center gap-3 hover:bg-accent transition-colors border-b last:border-b-0',
                        'text-left',
                      )}
                    >
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{crypto.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {crypto.symbol.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(crypto.current_price, currency)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          crypto.price_change_percentage_24h >= 0
                            ? 'default'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {isOpen && !selectedCrypto && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
